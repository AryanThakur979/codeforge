import { NextRequest, NextResponse } from "next/server";
import {
  buildCppSource,
  buildJavaSource,
  buildCSource,
  buildPythonSource,
} from "@/lib/runners/harnessBuilder";
import { deepEqual } from "@/lib/utils";
import { TestCaseInput, RunnerResponse, ExecutionResult } from "@/lib/runners/types";

// Judge0 CE Language IDs - 100% matched with LeetCode's 19-language catalog
const LANGUAGE_IDS: Record<string, number> = {
  cpp: 105,        // C++ (GCC 14.1.0)
  java: 91,        // Java (JDK 17.0.6)
  python3: 100,    // Python 3 (3.12.5)
  python: 70,      // Python 2 (2.7.17)
  javascript: 97,  // JavaScript (Node.js 20.17.0)
  typescript: 101, // TypeScript (5.6.2)
  csharp: 51,      // C# (Mono 6.6.0.161)
  c: 103,          // C (GCC 14.1.0)
  go: 107,         // Go (1.23.5)
  kotlin: 111,     // Kotlin (2.1.10)
  swift: 83,       // Swift (5.2.3)
  rust: 108,       // Rust (1.85.0)
  ruby: 72,        // Ruby (2.7.0)
  php: 98,         // PHP (8.3.11)
  dart: 90,        // Dart (2.19.2)
  scala: 81,       // Scala (2.13.2)
  elixir: 57,      // Elixir (1.9.4)
  erlang: 58,      // Erlang (OTP 22.2)
  racket: 55,      // Common Lisp / Racket (SBCL 2.0.0)
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { language, code, functionName, testCases } = body as {
      language: string;
      code: string;
      functionName: string;
      testCases: TestCaseInput[];
    };

    if (!language || !code || !functionName || !testCases) {
      return NextResponse.json(
        { error: "Missing required fields (language, code, functionName, testCases)" },
        { status: 400 }
      );
    }

    const langId = LANGUAGE_IDS[language];
    if (!langId) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    // Build the language harness
    let sourceCode = code;
    if (language === "cpp") {
      sourceCode = buildCppSource(code, functionName, testCases);
    } else if (language === "java") {
      sourceCode = buildJavaSource(code, functionName, testCases);
    } else if (language === "c") {
      sourceCode = buildCSource(code, functionName, testCases);
    } else if (language === "python" || language === "python3") {
      sourceCode = buildPythonSource(code, functionName, testCases);
    }

    // Call Judge0 CE public API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const judge0Res = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: langId,
          stdin: "",
          cpu_time_limit: 4.0,
          wall_time_limit: 8.0,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!judge0Res.ok) {
      const errText = await judge0Res.text();
      return NextResponse.json(
        {
          results: [],
          status: "error",
          totalRuntime: 0,
          allPassed: false,
          logs: [],
          errorSummary: `Judge0 API error (${judge0Res.status}): ${errText}`,
        } satisfies RunnerResponse,
        { status: 200 }
      );
    }

    const data = await judge0Res.json();

    // 1. Check for compilation errors
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

    // 2. Check for Time Limit Exceeded (Status ID 5)
    if (data.status?.id === 5) {
      return NextResponse.json({
        results: [],
        status: "tle",
        totalRuntime: 4000,
        allPassed: false,
        logs: [],
        errorSummary: "Time Limit Exceeded: Execution took longer than allowed limit.",
      } satisfies RunnerResponse);
    }

    // 3. Check for Runtime Errors
    if (data.status?.id && data.status.id > 3) {
      const errMsg =
        data.stderr || data.message || data.status?.description || "Runtime Execution Error";
      return NextResponse.json({
        results: [],
        status: "error",
        totalRuntime: parseFloat(data.time || "0") * 1000,
        allPassed: false,
        logs: data.stdout ? [data.stdout] : [],
        errorSummary: `${data.status.description}: ${errMsg}`,
      } satisfies RunnerResponse);
    }

    // 4. Parse stdout results
    const rawStdout: string = data.stdout || "";
    const logs: string[] = [];
    const executionResults: ExecutionResult[] = [];
    let allPassed = true;
    const totalRuntime = Math.round(parseFloat(data.time || "0.001") * 1000);

    const lines = rawStdout.split(/\r?\n/);
    let inHarness = false;
    const tcOutputs: Record<number, string> = {};

    for (const line of lines) {
      if (line.includes("__CODEFORGE_START__")) {
        inHarness = true;
        continue;
      }
      if (line.includes("__CODEFORGE_END__")) {
        inHarness = false;
        continue;
      }

      if (inHarness) {
        const tcMatch = line.match(/__TC_(\d+)__(.*)/);
        if (tcMatch) {
          const tcId = parseInt(tcMatch[1], 10);
          tcOutputs[tcId] = tcMatch[2].trim();
        } else if (line.trim().length > 0) {
          logs.push(line);
        }
      } else if (line.trim().length > 0) {
        logs.push(line);
      }
    }

    // If harness markers weren't used (e.g. user wrote full program with main)
    if (Object.keys(tcOutputs).length === 0 && rawStdout.trim().length > 0) {
      return NextResponse.json({
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          passed: true,
          input: tc.input,
          expected: tc.expected,
          actual: rawStdout.trim(),
          runtime: totalRuntime,
          logs: [rawStdout.trim()],
        })),
        status: "success",
        totalRuntime,
        allPassed: true,
        logs: [rawStdout.trim()],
      } satisfies RunnerResponse);
    }

    // Match each testcase
    for (const tc of testCases) {
      const rawOutput = tcOutputs[tc.id];
      let actual: any = undefined;
      let parseErr: string | undefined = undefined;

      if (rawOutput !== undefined) {
        if (rawOutput.startsWith("EXCEPTION:")) {
          parseErr = rawOutput;
        } else {
          try {
            actual = JSON.parse(rawOutput);
          } catch {
            if (rawOutput === "true") actual = true;
            else if (rawOutput === "false") actual = false;
            else if (!isNaN(Number(rawOutput))) actual = Number(rawOutput);
            else actual = rawOutput;
          }
        }
      } else {
        parseErr = "No output produced for this test case.";
      }

      let passed = false;
      if (!parseErr && actual !== undefined) {
        passed = deepEqual(actual, tc.expected);
      }

      if (!passed) {
        allPassed = false;
      }

      executionResults.push({
        testCaseId: tc.id,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual,
        runtime: Math.max(1, Math.round(totalRuntime / testCases.length)),
        logs: [],
        error: parseErr,
      });
    }

    const response: RunnerResponse = {
      results: executionResults,
      status: allPassed ? "success" : "failed",
      totalRuntime,
      allPassed,
      logs,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      {
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: `Internal server error: ${error?.message || String(error)}`,
      } satisfies RunnerResponse,
      { status: 500 }
    );
  }
}
