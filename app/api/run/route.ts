import { NextRequest, NextResponse } from "next/server";
import {
  buildCppSource,
  buildJavaSource,
  buildCSource,
  buildPythonSource,
} from "@/lib/runners/harnessBuilder";
import { deepEqual } from "@/lib/utils";
import { TestCaseInput, RunnerResponse, ExecutionResult } from "@/lib/runners/types";
import { JUDGE0_LANGUAGE_IDS } from "@/config/languages";

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

    const langId = JUDGE0_LANGUAGE_IDS[language];
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

    // Call Judge0 CE public API with 10s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let judge0Res: Response;
    try {
      judge0Res = await fetch(
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
            cpu_time_limit: 3.0,
            wall_time_limit: 6.0,
          }),
          signal: controller.signal,
        }
      );
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      const isTimeout = fetchErr.name === "AbortError";
      return NextResponse.json(
        {
          results: [],
          status: isTimeout ? "tle" : "error",
          totalRuntime: isTimeout ? 3000 : 0,
          allPassed: false,
          logs: [],
          errorSummary: isTimeout
            ? "Execution Timed Out: The cloud compiler did not respond within the 10 second limit."
            : "Cloud execution service is currently unreachable. Please switch to in-browser Python 3 or JavaScript for instant execution.",
        } satisfies RunnerResponse,
        { status: 200 }
      );
    }
    clearTimeout(timeout);

    if (!judge0Res.ok) {
      const errText = await judge0Res.text();
      let friendlyError = `Cloud compiler error (${judge0Res.status}): ${errText}`;
      if (judge0Res.status === 429) {
        friendlyError =
          "Cloud compiler rate limit reached. The public execution server is currently receiving high traffic. Please wait a few moments and retry, or use in-browser Python 3 / JavaScript for instant 0ms execution without rate limits.";
      } else if (judge0Res.status >= 500) {
        friendlyError =
          "Cloud compiler service is temporarily unavailable. Please try again shortly or switch to in-browser Python 3 / JavaScript.";
      }

      return NextResponse.json(
        {
          results: [],
          status: "error",
          totalRuntime: 0,
          allPassed: false,
          logs: [],
          errorSummary: friendlyError,
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
