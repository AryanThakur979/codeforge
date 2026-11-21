import { CodeRunner, RunnerResponse, TestCaseInput } from "./types";

export class Judge0Runner implements CodeRunner {
  private language: "cpp" | "java" | "c" | "typescript";

  constructor(language: "cpp" | "java" | "c" | "typescript") {
    this.language = language;
  }

  setLanguage(lang: "cpp" | "java" | "c" | "typescript") {
    this.language = lang;
  }

  async run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 15000
  ): Promise<RunnerResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: this.language,
          code,
          functionName,
          testCases,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        return {
          results: [],
          status: "error",
          totalRuntime: 0,
          allPassed: false,
          logs: [],
          errorSummary: `Server error (${res.status}): ${errorText}`,
        };
      }

      const data: RunnerResponse = await res.json();
      return data;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        return {
          results: [],
          status: "tle",
          totalRuntime: timeoutMs,
          allPassed: false,
          logs: [],
          errorSummary: "Request timed out: Server or compiler did not respond within 15 seconds.",
        };
      }

      return {
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: `Network/Client Error: ${err.message || String(err)}`,
      };
    }
  }
}

export const judge0Runner = new Judge0Runner("cpp");
