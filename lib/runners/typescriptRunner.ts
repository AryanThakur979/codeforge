import { CodeRunner, RunnerResponse, TestCaseInput } from "./types";
import { jsRunner } from "./javascriptRunner";
import { judge0Runner } from "./judge0Runner";

function stripTypeScriptTypes(tsCode: string): string {
  let js = tsCode;

  // 1. Remove interfaces and type aliases
  js = js.replace(/\b(?:interface|type)\s+[A-Za-z0-9_]+(?:\s*<[^>]+>)?\s*=?\s*\{[^}]*\};?/g, "");
  js = js.replace(/\btype\s+[A-Za-z0-9_]+\s*=\s*[^;]+;/g, "");

  // 2. Remove function return type annotations, e.g. "): number[] {" or "): boolean =>"
  js = js.replace(/\)\s*:\s*[A-Za-z0-9_<>[\]|, ]+(?=\s*\{|\s*=>)/g, ")");

  // 3. Remove parameter type annotations, e.g. "(nums: number[], target: number)"
  // Replaces `: Type` in parameter lists
  js = js.replace(/(\w+)\s*:\s*[A-Za-z0-9_<>[\]|, ]+(?=[,)])/g, "$1");

  // 4. Remove variable type annotations, e.g. "let x: number = 5;" or "const map: Map<string, int> = new Map();"
  js = js.replace(/(\b(?:let|const|var)\s+\w+)\s*:\s*[A-Za-z0-9_<>[\]|, ]+(?=\s*=|\s*;)/g, "$1");

  // 5. Remove "as Type" type assertions
  js = js.replace(/\s+as\s+[A-Za-z0-9_<>[\]|]+/g, "");

  // 6. Remove non-null assertion operator "!" before dot or comma/bracket
  js = js.replace(/!(\s*[.,)\];])/g, "$1");

  return js;
}

export class TypeScriptRunner implements CodeRunner {
  async run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs: number = 3000
  ): Promise<RunnerResponse> {
    try {
      // Attempt fast client-side execution via type stripping
      const strippedJs = stripTypeScriptTypes(code);
      const res = await jsRunner.run(strippedJs, functionName, testCases, timeoutMs);

      // If execution succeeded or gave normal test results, return it
      if (res.status === "success" || res.status === "failed") {
        return res;
      }

      // If error might be due to complex TS syntax (like enum, decorators), fall back to remote
      if (res.status === "error") {
        judge0Runner.setLanguage("typescript");
        return await judge0Runner.run(code, functionName, testCases, 10000);
      }

      return res;
    } catch {
      // Fallback to Judge0
      judge0Runner.setLanguage("typescript");
      return await judge0Runner.run(code, functionName, testCases, 10000);
    }
  }
}

export const tsRunner = new TypeScriptRunner();
