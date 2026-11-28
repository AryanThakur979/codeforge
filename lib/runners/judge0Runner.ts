import { CodeRunner, RunnerResponse, TestCaseInput, JudgeResponse, ExecutionResult } from "./types";
import { SupportedLanguage } from "@/types/problem";

export interface Judge0RunOptions {
  slug?: string;
  mode?: "run" | "submit";
  customInput?: string;
  timeoutMs?: number;
}

export class Judge0Runner implements CodeRunner {
  private language: SupportedLanguage;

  constructor(language: SupportedLanguage = "cpp") {
    this.language = language;
  }

  setLanguage(lang: SupportedLanguage) {
    this.language = lang;
  }

  async run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 20000
  ): Promise<RunnerResponse> {
    return this.executeJudge({
      code,
      functionName,
      testCases,
      timeoutMs,
      mode: "run",
    });
  }

  async executeJudge({
    code,
    slug,
    mode = "run",
    customInput,
    functionName,
    testCases,
    timeoutMs = 25000,
  }: {
    code: string;
    slug?: string;
    mode?: "run" | "submit";
    customInput?: string;
    functionName?: string;
    testCases?: TestCaseInput[];
    timeoutMs?: number;
  }): Promise<RunnerResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          language: this.language,
          code,
          mode,
          customInput,
          functionName,
          testCases,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        let friendlySummary = `Server error (${res.status}): ${errorText.slice(0, 200)}`;
        if (res.status === 429) {
          friendlySummary =
            "Execution rate limit reached. Please wait a few moments or use in-browser Python 3 / JavaScript for unlimited instant runs.";
        } else if (res.status >= 500) {
          friendlySummary =
            "Cloud compiler service is temporarily unavailable. Please retry in a moment or switch to in-browser Python 3 / JavaScript.";
        }

        return {
          results: [],
          status: "error",
          totalRuntime: 0,
          allPassed: false,
          logs: [],
          errorSummary: friendlySummary,
        };
      }

      const data = await res.json();

      // If response is already formatted as JudgeResponse
      if (data.verdict !== undefined) {
        const judgeRes = data as JudgeResponse;
        const legacyResults: ExecutionResult[] = judgeRes.results.map((r) => ({
          testCaseId: r.testId,
          passed: r.passed,
          input: r.input !== undefined ? [r.input] : ["[Hidden Test]"],
          expected: r.expectedOutput !== undefined ? r.expectedOutput : "[Hidden Expected]",
          actual: r.actualOutput !== undefined ? r.actualOutput : r.verdict,
          runtime: r.runtimeMs,
          logs: r.stdout ? r.stdout.split("\n") : [],
          error: r.error || (r.passed ? undefined : r.verdict),
        }));

        let runnerStatus: "success" | "failed" | "error" | "tle" = "success";
        if (judgeRes.verdict === "Time Limit Exceeded") runnerStatus = "tle";
        else if (judgeRes.verdict === "Compilation Error" || judgeRes.verdict === "Internal Error" || judgeRes.verdict === "Provider Unavailable / Rate Limited") runnerStatus = "error";
        else if (!judgeRes.allPassed) runnerStatus = "failed";

        let errorSummary = judgeRes.errorSummary;
        if (!errorSummary && judgeRes.compilationError) {
          errorSummary = `Compilation Error:\n${judgeRes.compilationError.rawMessage}`;
        } else if (!errorSummary && judgeRes.runtimeError) {
          errorSummary = `${judgeRes.runtimeError.type}: ${judgeRes.runtimeError.explanation}\n\n${judgeRes.runtimeError.cleanTraceback}`;
        }

        return {
          results: legacyResults,
          status: runnerStatus,
          totalRuntime: judgeRes.totalRuntimeMs,
          allPassed: judgeRes.allPassed,
          logs: judgeRes.results.flatMap((r) => (r.stdout ? r.stdout.split("\n") : [])),
          errorSummary,
          judgeResponse: judgeRes,
        };
      }

      return data as RunnerResponse;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        return {
          results: [],
          status: "tle",
          totalRuntime: timeoutMs,
          allPassed: false,
          logs: [],
          errorSummary:
            "Request timed out: Cloud compiler did not respond within time limit. Check for infinite loops or use in-browser Python 3 / JavaScript.",
        };
      }

      return {
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary:
          "Could not reach execution server. Please check your internet connection or use in-browser Python 3 / JavaScript.",
      };
    }
  }
}

export const judge0Runner = new Judge0Runner("cpp");
