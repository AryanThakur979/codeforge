import { CodeRunner, RunnerResponse, TestCaseInput } from "./types";
import { SupportedLanguage } from "@/types/problem";

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
        let friendlySummary = `Server error (${res.status}): ${errorText}`;
        if (res.status === 429) {
          friendlySummary =
            "Cloud compiler rate limit reached. The public execution server is currently receiving high traffic. Please wait a few moments and try again, or use in-browser Python 3 / JavaScript for instant execution.";
        } else if (res.status >= 500) {
          friendlySummary =
            "Cloud compiler service is temporarily unavailable. Please retry in a moment or use in-browser Python 3 / JavaScript.";
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
          errorSummary: "Request timed out: Cloud compiler did not respond within 15 seconds. Please check for infinite loops or try in-browser Python 3 / JavaScript.",
        };
      }

      return {
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: `Connection Error: Could not reach execution server. Please check your internet connection or use in-browser Python 3 / JavaScript.`,
      };
    }
  }
}

export const judge0Runner = new Judge0Runner("cpp");
