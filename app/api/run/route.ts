import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PROBLEM_IO_SPECS, compareTokens, IOTestCase } from "@/data/problems/ioSpecs";
import { getServerIOTests } from "@/data/problems/serverTests";
import { LANGUAGES_MAP, SupportedLanguageKey } from "@/lib/runners/languages.config";
import {
  JudgeResponse,
  JudgeVerdict,
  IOExecutionResult,
  CompilationDetails,
  RuntimeErrorDetails,
  ErrorLocation,
  RunnerResponse,
} from "@/lib/runners/types";
import {
  buildCppSource,
  buildJavaSource,
  buildCSource,
  buildPythonSource,
} from "@/lib/runners/harnessBuilder";

// Rate limiting & Quotas
const RATE_LIMIT_SALT = process.env.RATE_LIMIT_SALT || "codeforge_judge_salt_2026";
const GLOBAL_DAILY_LIMIT = parseInt(process.env.CODE_DAILY_LIMIT || "1500", 10);
const PER_IP_MIN_LIMIT_TIER1_2 = 15;
const PER_IP_DAY_LIMIT_TIER1_2 = 120;
const PER_IP_MIN_LIMIT_TIER3 = 5;
const PER_IP_DAY_LIMIT_TIER3 = 25;

interface RateCounter {
  minCount: number;
  minResetAt: number;
  dayCount: number;
  dayResetAt: number;
}

const ipRateLimits = new Map<string, RateCounter>();
let globalDailyCount = 0;
let globalDayResetAt = Date.now() + 24 * 60 * 60 * 1000;

// In-memory 60s cache
interface CachedRun {
  response: JudgeResponse;
  expiresAt: number;
}
const runCache = new Map<string, CachedRun>();

function checkRateLimit(ip: string, tier: number = 1): { allowed: boolean; reason?: string } {
  const now = Date.now();

  // Reset global count if day expired
  if (now > globalDayResetAt) {
    globalDailyCount = 0;
    globalDayResetAt = now + 24 * 60 * 60 * 1000;
  }

  if (globalDailyCount >= GLOBAL_DAILY_LIMIT) {
    return {
      allowed: false,
      reason:
        "Daily community cloud execution limit reached. Please switch to in-browser Python 3 or JavaScript for unlimited instant runs.",
    };
  }

  const hash = crypto.createHash("sha256").update(ip + RATE_LIMIT_SALT).digest("hex");
  let record = ipRateLimits.get(hash);

  if (!record) {
    record = {
      minCount: 0,
      minResetAt: now + 60 * 1000,
      dayCount: 0,
      dayResetAt: now + 24 * 60 * 60 * 1000,
    };
    ipRateLimits.set(hash, record);
  }

  // Reset minute window
  if (now > record.minResetAt) {
    record.minCount = 0;
    record.minResetAt = now + 60 * 1000;
  }

  // Reset day window
  if (now > record.dayResetAt) {
    record.dayCount = 0;
    record.dayResetAt = now + 24 * 60 * 60 * 1000;
  }

  const minLimit = tier === 3 ? PER_IP_MIN_LIMIT_TIER3 : PER_IP_MIN_LIMIT_TIER1_2;
  const dayLimit = tier === 3 ? PER_IP_DAY_LIMIT_TIER3 : PER_IP_DAY_LIMIT_TIER1_2;

  if (record.minCount >= minLimit) {
    return {
      allowed: false,
      reason:
        `Rate limit exceeded (${minLimit} executions per minute for Tier ${tier} languages). Please wait a few seconds before retrying.`,
    };
  }

  if (record.dayCount >= dayLimit) {
    return {
      allowed: false,
      reason:
        `Daily limit reached (${dayLimit} executions per day for Tier ${tier} languages). Please switch to in-browser Python 3 or JavaScript for unlimited zero-cost runs.`,
    };
  }

  record.minCount++;
  record.dayCount++;
  globalDailyCount++;

  return { allowed: true };
}

function parseCompilationError(rawMessage: string, lang: string): CompilationDetails {
  const errors: ErrorLocation[] = [];

  if (lang === "cpp" || lang === "c") {
    // solution.cpp:12:5: error: 'x' was not declared in this scope
    const gccRegex = /(?:solution\.[a-z]+|input_file\.[a-z]+):(\d+):(?:(\d+):)?\s*(error:[^\n]+)/gi;
    let match;
    while ((match = gccRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: match[2] ? parseInt(match[2], 10) : undefined,
        message: match[3].trim(),
      });
    }
  } else if (lang === "java") {
    // Main.java:8: error: cannot find symbol
    const javaRegex = /(?:Main\.java|Solution\.java):(\d+):\s*(error:[^\n]+)/gi;
    let match;
    while ((match = javaRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        message: match[2].trim(),
      });
    }
  } else if (lang === "python" || lang === "python3") {
    // File "script.py", line 5\n ...\nSyntaxError: invalid syntax
    const pyRegex = /File "[^"]+", line (\d+)[^\n]*\n(?:[^\n]*\n)?([A-Za-z]+Error:[^\n]+)/gi;
    let match;
    while ((match = pyRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        message: match[2].trim(),
      });
    }
  } else if (lang === "rust") {
    // --> solution.rs:12:5 or solution.rs:12:5: error: ...
    const rustRegex = /(?:-->\s*)?(?:[./\w-]+\.rs):(\d+):(\d+)(?:[^\n]*\n\s*\|)?\s*(?:error(?:\[[^\]]+\])?:?\s*([^\n]+))?/gi;
    let match;
    while ((match = rustRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        message: (match[3] || "Compile error").trim(),
      });
    }
  } else if (lang === "go") {
    // ./solution.go:12:5: undefined: x
    const goRegex = /(?:[./\w-]+\.go):(\d+):(?:(\d+):)?\s*([^\n]+)/gi;
    let match;
    while ((match = goRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: match[2] ? parseInt(match[2], 10) : undefined,
        message: match[3].trim(),
      });
    }
  } else if (lang === "csharp" || lang === "vb") {
    // Solution.cs(12,5): error CS...: ...
    const csRegex = /(?:[./\w-]+\.(?:cs|vb))\s*\((\d+),(\d+)\):\s*(error[^\n]+)/gi;
    let match;
    while ((match = csRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        message: match[3].trim(),
      });
    }
  } else if (lang === "kotlin") {
    // Solution.kt:12:5: error: unresolved reference: x
    const ktRegex = /(?:[./\w-]+\.kt):(\d+):(?:(\d+):)?\s*(error:[^\n]+)/gi;
    let match;
    while ((match = ktRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: match[2] ? parseInt(match[2], 10) : undefined,
        message: match[3].trim(),
      });
    }
  } else if (lang === "swift") {
    // solution.swift:12:5: error: ...
    const swiftRegex = /(?:[./\w-]+\.swift):(\d+):(?:(\d+):)?\s*(error:[^\n]+)/gi;
    let match;
    while ((match = swiftRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: match[2] ? parseInt(match[2], 10) : undefined,
        message: match[3].trim(),
      });
    }
  } else if (lang === "typescript") {
    // solution.ts:12:5 - error TS...: ...
    const tsRegex = /(?:[./\w-]+\.ts):(\d+):(\d+)\s*-\s*(error\s+TS[^\n]+)/gi;
    let match;
    while ((match = tsRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: parseInt(match[2], 10),
        message: match[3].trim(),
      });
    }
  } else if (lang === "php") {
    // Parse error: syntax error, unexpected ... in solution.php on line 12
    const phpRegex = /(?:syntax error[^\n]+)in\s+[^\n]+\.php\s+on\s+line\s+(\d+)/gi;
    let match;
    while ((match = phpRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        message: "Syntax error on line " + match[1],
      });
    }
  } else if (lang === "ruby") {
    // solution.rb:12: syntax error, ...
    const rubyRegex = /(?:[./\w-]+\.rb):(\d+):\s*([^\n]+)/gi;
    let match;
    while ((match = rubyRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        message: match[2].trim(),
      });
    }
  }

  // Fallback generic error location finder
  if (errors.length === 0) {
    const genericRegex = /(?:line|Line)\s+(\d+)(?:[:,\s]+(?:col|column)\s+(\d+))?[:\s]+([^\n]+)/gi;
    let match;
    while ((match = genericRegex.exec(rawMessage)) !== null) {
      errors.push({
        line: parseInt(match[1], 10),
        column: match[2] ? parseInt(match[2], 10) : undefined,
        message: match[3].trim(),
      });
    }
  }

  return {
    rawMessage,
    errors,
  };
}

function parseRuntimeError(stderr: string, statusDesc: string): RuntimeErrorDetails {
  let type = statusDesc || "Runtime Error";
  let explanation = "The program terminated unexpectedly during execution.";

  if (stderr.includes("SIGSEGV") || statusDesc.includes("SIGSEGV")) {
    type = "Segmentation Fault (SIGSEGV)";
    explanation =
      "Memory violation: Attempted to read or write to unallocated or restricted memory. Check for out-of-bounds array indexing, null pointer dereference, or infinite recursion stack overflow.";
  } else if (stderr.includes("SIGFPE") || statusDesc.includes("SIGFPE")) {
    type = "Floating Point Exception (SIGFPE)";
    explanation =
      "Arithmetic violation: Attempted an illegal arithmetic operation, such as division by zero or modulo by zero.";
  } else if (stderr.includes("SIGABRT") || statusDesc.includes("SIGABRT")) {
    type = "Aborted (SIGABRT)";
    explanation =
      "The program aborted, often caused by an assertion failure, unhandled exception, or double free.";
  } else if (stderr.includes("java.lang.ArrayIndexOutOfBoundsException")) {
    type = "ArrayIndexOutOfBoundsException";
    explanation = "Java accessed an array index that is negative or greater than or equal to the array size.";
  } else if (stderr.includes("java.lang.NullPointerException")) {
    type = "NullPointerException";
    explanation = "Java attempted to dereference a null object reference.";
  } else if (stderr.includes("IndexError:")) {
    type = "IndexError";
    explanation = "Python list index out of range.";
  } else if (stderr.includes("ZeroDivisionError:")) {
    type = "ZeroDivisionError";
    explanation = "Python integer division or modulo by zero.";
  } else if (stderr.includes("panic: runtime error:") || stderr.includes("panic:")) {
    type = "Go Panic (Runtime Error)";
    explanation = "Go encountered an unhandled panic, such as index out of range or nil pointer dereference.";
  } else if (stderr.includes("panicked at")) {
    type = "Rust Panic (Runtime Error)";
    explanation = "Rust panicked, likely due to an unwrap() on None/Err or an out-of-bounds array access.";
  } else if (stderr.includes("Unhandled exception. System.") || stderr.includes("System.IndexOutOfRangeException")) {
    type = "Unhandled Exception (.NET)";
    explanation = ".NET runtime exception, such as IndexOutOfRangeException or NullReferenceException.";
  } else if (stderr.includes("Fatal error:") || stderr.includes("Swift runtime failure:")) {
    type = "Swift Fatal Error";
    explanation = "Swift runtime failure, such as force-unwrapping a nil optional or out-of-bounds indexing.";
  }

  // Clean traceback by removing internal runner paths
  const cleanTraceback = stderr
    .split("\n")
    .filter((line) => !line.includes("/tmp/") && !line.includes("judge0"))
    .join("\n")
    .trim();

  return {
    type,
    explanation,
    cleanTraceback: cleanTraceback || stderr || statusDesc,
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const body = await req.json();
    const {
      slug,
      language: rawLang,
      code,
      mode = "run",
      customInput,
      functionName,
      testCases,
    } = body as {
      slug?: string;
      language: string;
      code: string;
      mode?: "run" | "submit";
      customInput?: string;
      functionName?: string;
      testCases?: any[];
    };

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (code.length > 20480) {
      return NextResponse.json(
        { error: "Source code exceeds maximum allowed size of 20 KB." },
        { status: 400 }
      );
    }

    if (customInput && customInput.length > 10240) {
      return NextResponse.json(
        { error: "Custom input exceeds maximum allowed size of 10 KB." },
        { status: 400 }
      );
    }

    // Resolve language
    const langKey = (rawLang === "python" ? "python3" : rawLang) as SupportedLanguageKey;
    const langConfig = LANGUAGES_MAP[langKey];
    if (!langConfig || !langConfig.enabled) {
      return NextResponse.json(
        { error: `Unsupported or disabled language: ${rawLang}` },
        { status: 400 }
      );
    }

    // Tier-aware rate limiting check
    const rateCheck = checkRateLimit(ip, langConfig.tier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          verdict: "Provider Unavailable / Rate Limited" as JudgeVerdict,
          allPassed: false,
          totalRuntimeMs: 0,
          results: [],
          errorSummary: rateCheck.reason,
          mode: "run",
        } satisfies JudgeResponse,
        { status: 429 }
      );
    }

    // Cache lookup
    const cacheKey = crypto
      .createHash("sha256")
      .update(`${langKey}:${slug || "custom"}:${mode}:${code}:${customInput || ""}`)
      .digest("hex");

    const cached = runCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({ ...cached.response, cached: true });
    }

    // Execution provider configurations
    const apiUrl = process.env.CODE_API_URL || "https://ce.judge0.com";
    const apiKey = process.env.CODE_API_KEY || "";
    const apiHost = process.env.CODE_API_HOST || "";
    const authHeader =
      process.env.CODE_API_AUTH_HEADER || (apiHost ? "X-RapidAPI-Key" : "X-Auth-Token");

    // Gather test cases
    let testsToRun: IOTestCase[] = [];
    let numericTolerance: number | undefined = undefined;

    if (customInput !== undefined) {
      testsToRun = [
        {
          id: 1,
          input: customInput,
          expectedOutput: "",
          hidden: false,
          description: "Custom Stdin Test",
        },
      ];
    } else if (slug && PROBLEM_IO_SPECS[slug]) {
      const spec = PROBLEM_IO_SPECS[slug];
      numericTolerance = spec.numericTolerance;
      const visibleTests = spec.tests || [];
      if (mode === "submit") {
        const hiddenTests = getServerIOTests(slug);
        testsToRun = [...visibleTests, ...hiddenTests];
      } else {
        testsToRun = visibleTests;
      }
    } else if (testCases && Array.isArray(testCases)) {
      // Legacy backwards-compatibility harness mode
      return handleLegacyHarness({
        language: langKey,
        code,
        functionName: functionName || "solution",
        testCases,
        apiUrl,
        apiKey,
        apiHost,
        authHeader,
      });
    } else {
      return NextResponse.json(
        { error: "No test cases or problem slug provided." },
        { status: 400 }
      );
    }

    // Prepare headers (Key NEVER logged)
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (apiKey) {
      requestHeaders[authHeader] = apiKey;
      if (apiHost) requestHeaders["X-RapidAPI-Host"] = apiHost;
    }

    // Execute tests against Judge0 with language-specific resource allocation
    const baseCpu = 2.0;
    const cpuLimit = Math.max(2.0, Number((baseCpu * (langConfig.timeMultiplier || 1.0)).toFixed(1)));
    const memoryLimitKb = langConfig.memoryLimit || 256000;
    const wallTimeLimit = Math.max(15.0, Math.round(cpuLimit * 3.5));

    const results: IOExecutionResult[] = [];
    let allPassed = true;
    let totalRuntimeMs = 0;
    let maxMemoryKb = 0;
    let compilationError: CompilationDetails | undefined;
    let runtimeError: RuntimeErrorDetails | undefined;
    let overallVerdict: JudgeVerdict = "Accepted";

    for (const test of testsToRun) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), Math.round(wallTimeLimit * 1000));

      let judgeRes: Response;
      try {
        judgeRes = await fetch(
          `${apiUrl.replace(/\/+$/, "")}/submissions?base64_encoded=false&wait=true`,
          {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify({
              source_code: code,
              language_id: langConfig.providerLanguageId,
              stdin: test.input,
              cpu_time_limit: cpuLimit,
              wall_time_limit: wallTimeLimit,
              memory_limit: memoryLimitKb,
            }),
            signal: controller.signal,
          }
        );
      } catch (err: any) {
        clearTimeout(timeout);
        const isAbort = err.name === "AbortError";
        overallVerdict = isAbort ? "Time Limit Exceeded" : "Provider Unavailable / Rate Limited";
        return NextResponse.json({
          verdict: overallVerdict,
          allPassed: false,
          totalRuntimeMs: isAbort ? 15000 : 0,
          results: [],
          errorSummary: isAbort
            ? "Execution Timed Out: The cloud compiler did not respond within 15 seconds."
            : "Cloud execution service is currently unreachable or network is restricted. Please switch to in-browser Python 3 or JavaScript for instant zero-latency runs.",
          mode,
        } satisfies JudgeResponse);
      }
      clearTimeout(timeout);

      if (!judgeRes.ok) {
        if (judgeRes.status === 429) {
          return NextResponse.json(
            {
              verdict: "Provider Unavailable / Rate Limited",
              allPassed: false,
              totalRuntimeMs: 0,
              results: [],
              errorSummary:
                "Cloud compiler rate limit reached. The public judge instance is under heavy load. Please retry in a moment, or switch to in-browser Python 3 or JavaScript for instant 0ms runs.",
              mode,
            } satisfies JudgeResponse,
            { status: 429 }
          );
        }

        if (judgeRes.status === 401 || judgeRes.status === 403) {
          return NextResponse.json(
            {
              verdict: "Provider Unavailable / Rate Limited",
              allPassed: false,
              totalRuntimeMs: 0,
              results: [],
              errorSummary:
                "Temporarily unavailable: Server execution requires CODE_API_KEY configuration. Please switch to in-browser Python 3 or JavaScript.",
              mode,
            } satisfies JudgeResponse,
            { status: 200 }
          );
        }

        const errText = await judgeRes.text();
        return NextResponse.json(
          {
            verdict: "Internal Error",
            allPassed: false,
            totalRuntimeMs: 0,
            results: [],
            errorSummary: `Judge service returned error (${judgeRes.status}): ${errText.slice(0, 200)}`,
            mode,
          } satisfies JudgeResponse,
          { status: 200 }
        );
      }

      const data = await judgeRes.json();
      const statusId = data.status?.id;
      const statusDesc = data.status?.description || "";
      const compileOutput = data.compile_output || "";
      const stderr = data.stderr || "";
      const stdout = data.stdout || "";
      const timeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
      const memKb = data.memory || 0;

      totalRuntimeMs += timeMs;
      if (memKb > maxMemoryKb) maxMemoryKb = memKb;

      // 1. Compilation Error (Status 6 or compile_output)
      if (statusId === 6 || (compileOutput && compileOutput.trim().length > 0)) {
        compilationError = parseCompilationError(compileOutput, langKey);
        overallVerdict = "Compilation Error";
        allPassed = false;
        results.push({
          testId: test.id,
          passed: false,
          verdict: "Compilation Error",
          input: test.hidden ? undefined : test.input,
          expectedOutput: test.hidden ? undefined : test.expectedOutput,
          actualOutput: stdout,
          runtimeMs: timeMs,
          memoryKb: memKb,
          stderr: compileOutput,
          isHidden: test.hidden,
          error: "Compilation failed.",
        });
        break; // Compilation error terminates further tests
      }

      // 2. Time Limit Exceeded (Status 5)
      if (statusId === 5) {
        allPassed = false;
        if (overallVerdict === "Accepted") overallVerdict = "Time Limit Exceeded";
        results.push({
          testId: test.id,
          passed: false,
          verdict: "Time Limit Exceeded",
          input: test.hidden ? undefined : test.input,
          expectedOutput: test.hidden ? undefined : test.expectedOutput,
          actualOutput: stdout,
          runtimeMs: Math.max(timeMs, Math.round(cpuLimit * 1000)),
          memoryKb: memKb,
          stderr: "Time Limit Exceeded",
          isHidden: test.hidden,
          error: `Execution exceeded the ${cpuLimit}s CPU time limit.`,
        });
        continue;
      }

      // 3. Memory Limit Exceeded (Status 12)
      if (statusId === 12) {
        allPassed = false;
        if (overallVerdict === "Accepted") overallVerdict = "Memory Limit Exceeded";
        results.push({
          testId: test.id,
          passed: false,
          verdict: "Memory Limit Exceeded",
          input: test.hidden ? undefined : test.input,
          expectedOutput: test.hidden ? undefined : test.expectedOutput,
          actualOutput: stdout,
          runtimeMs: timeMs,
          memoryKb: memKb,
          stderr: "Memory Limit Exceeded",
          isHidden: test.hidden,
          error: "Process exceeded memory allocation ceiling (256 MB).",
        });
        continue;
      }

      // 4. Runtime Error (Status 7-11 or NZEC)
      if (statusId >= 7 && statusId <= 11) {
        allPassed = false;
        if (overallVerdict === "Accepted") overallVerdict = "Runtime Error";
        if (!runtimeError) {
          runtimeError = parseRuntimeError(stderr, statusDesc);
        }
        results.push({
          testId: test.id,
          passed: false,
          verdict: "Runtime Error",
          input: test.hidden ? undefined : test.input,
          expectedOutput: test.hidden ? undefined : test.expectedOutput,
          actualOutput: stdout,
          runtimeMs: timeMs,
          memoryKb: memKb,
          stderr: stderr || statusDesc,
          isHidden: test.hidden,
          error: runtimeError.explanation,
        });
        continue;
      }

      // 5. Output Verification
      if (customInput !== undefined) {
        results.push({
          testId: test.id,
          passed: true,
          verdict: "Accepted",
          input: test.input,
          expectedOutput: "",
          actualOutput: stdout,
          runtimeMs: timeMs,
          memoryKb: memKb,
          stdout,
          stderr,
          isHidden: false,
        });
      } else {
        const matches = compareTokens(stdout, test.expectedOutput, numericTolerance);
        if (!matches) {
          allPassed = false;
          if (overallVerdict === "Accepted") overallVerdict = "Wrong Answer";
        }
        results.push({
          testId: test.id,
          passed: matches,
          verdict: matches ? "Accepted" : "Wrong Answer",
          input: test.hidden ? undefined : test.input,
          expectedOutput: test.hidden ? undefined : test.expectedOutput,
          actualOutput: test.hidden && !matches ? undefined : stdout,
          runtimeMs: timeMs,
          memoryKb: memKb,
          stdout,
          stderr,
          isHidden: test.hidden,
        });
      }
    }

    const responsePayload: JudgeResponse = {
      verdict: overallVerdict,
      allPassed,
      totalRuntimeMs,
      maxMemoryKb,
      results,
      compilationError,
      runtimeError,
      mode,
    };

    // Cache successful execution for 60 seconds
    if (overallVerdict === "Accepted" || overallVerdict === "Wrong Answer") {
      runCache.set(cacheKey, {
        response: responsePayload,
        expiresAt: Date.now() + 60 * 1000,
      });
    }

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      {
        verdict: "Internal Error" as JudgeVerdict,
        allPassed: false,
        totalRuntimeMs: 0,
        results: [],
        errorSummary: err?.message || "Internal server error occurred during judge execution.",
        mode: "run",
      } satisfies JudgeResponse,
      { status: 500 }
    );
  }
}

// Backwards-compatible legacy harness execution
async function handleLegacyHarness({
  language,
  code,
  functionName,
  testCases,
  apiUrl,
  apiKey,
  apiHost,
  authHeader,
}: {
  language: string;
  code: string;
  functionName: string;
  testCases: any[];
  apiUrl: string;
  apiKey: string;
  apiHost: string;
  authHeader: string;
}) {
  const langConfig = LANGUAGES_MAP[language === "python" ? "python3" : (language as SupportedLanguageKey)];
  let sourceCode = code;
  if (language === "cpp") {
    sourceCode = buildCppSource(code, functionName, testCases);
  } else if (language === "java") {
    sourceCode = buildJavaSource(code, functionName, testCases);
  } else if (language === "c") {
    sourceCode = buildCSource(code, functionName, testCases);
  } else if (language === "python3" || language === "python") {
    sourceCode = buildPythonSource(code, functionName, testCases);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (apiKey) {
    headers[authHeader] = apiKey;
    if (apiHost) headers["X-RapidAPI-Host"] = apiHost;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(
      `${apiUrl.replace(/\/+$/, "")}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: langConfig.providerLanguageId,
          stdin: "",
          cpu_time_limit: 3.0,
          wall_time_limit: 10.0,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: `Judge service unavailable (${res.status}). Switch to in-browser Python 3 or JavaScript.`,
      } satisfies RunnerResponse);
    }

    const data = await res.json();
    if (data.compile_output) {
      return NextResponse.json({
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: `Compilation Error:\n${data.compile_output}`,
      } satisfies RunnerResponse);
    }

    const stdout = data.stdout || "";
    const parsedResults: any[] = [];
    let allPassed = true;

    testCases.forEach((tc) => {
      const tcMarker = `__TC_${tc.id}__`;
      const line = stdout
        .split("\n")
        .find((l: string) => l.startsWith(tcMarker));
      if (!line) {
        allPassed = false;
        parsedResults.push({
          testCaseId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: "No output produced",
          runtime: 0,
          logs: [],
        });
      } else {
        const valStr = line.slice(tcMarker.length).trim();
        const passed = valStr.includes("EXCEPTION") ? false : valStr === JSON.stringify(tc.expected) || valStr === String(tc.expected);
        if (!passed) allPassed = false;
        parsedResults.push({
          testCaseId: tc.id,
          passed,
          input: tc.input,
          expected: tc.expected,
          actual: valStr,
          runtime: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
          logs: [],
        });
      }
    });

    return NextResponse.json({
      results: parsedResults,
      status: allPassed ? "success" : "failed",
      totalRuntime: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
      allPassed,
      logs: stdout.split("\n"),
    } satisfies RunnerResponse);
  } catch (err: any) {
    clearTimeout(timeout);
    return NextResponse.json({
      results: [],
      status: "error",
      totalRuntime: 0,
      allPassed: false,
      logs: [],
      errorSummary: "Execution failed or service timed out.",
    } satisfies RunnerResponse);
  }
}
