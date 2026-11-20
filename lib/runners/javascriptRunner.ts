import { CodeRunner, RunnerResponse, ExecutionResult, TestCaseInput } from "./types";
import { deepEqual } from "@/lib/utils";

const WORKER_SCRIPT = `
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}

self.onmessage = function (e) {
  const { code, functionName, testCases } = e.data;
  const capturedLogs = [];

  // Capture console.log
  const originalLog = console.log;
  console.log = function (...args) {
    try {
      capturedLogs.push(
        args
          .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
          .join(" ")
      );
    } catch {
      capturedLogs.push(String(args));
    }
  };

  try {
    // Instantiate user function
    const wrappedCode = code + "\\n; return (typeof " + functionName + " !== 'undefined' ? " + functionName + " : null);";
    const userFn = new Function(wrappedCode)();

    if (typeof userFn !== "function") {
      self.postMessage({
        type: "error",
        error: "Function '" + functionName + "' is not defined or not a function.",
        logs: capturedLogs,
      });
      return;
    }

    const results = [];
    let allPassed = true;
    let totalRuntime = 0;

    for (const tc of testCases) {
      // Deep clone inputs to prevent test case mutation side-effects
      let clonedInput;
      try {
        clonedInput = JSON.parse(JSON.stringify(tc.input));
      } catch {
        clonedInput = tc.input;
      }

      const start = performance.now();
      let actual;
      let error;
      let passed = false;

      try {
        actual = userFn(...clonedInput);
        const end = performance.now();
        const duration = end - start;
        totalRuntime += duration;

        passed = deepEqual(actual, tc.expected);
        if (!passed) allPassed = false;

        results.push({
          testCaseId: tc.id,
          passed,
          input: tc.input,
          expected: tc.expected,
          actual,
          runtime: duration,
          logs: [...capturedLogs],
        });
      } catch (err) {
        allPassed = false;
        results.push({
          testCaseId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: null,
          runtime: performance.now() - start,
          error: err instanceof Error ? err.message : String(err),
          logs: [...capturedLogs],
        });
      }
    }

    self.postMessage({
      type: "success",
      results,
      allPassed,
      totalRuntime,
      logs: capturedLogs,
    });
  } catch (outerErr) {
    self.postMessage({
      type: "error",
      error: outerErr instanceof Error ? outerErr.message : String(outerErr),
      logs: capturedLogs,
    });
  } finally {
    console.log = originalLog;
  }
};
`;

export class JavaScriptRunner implements CodeRunner {
  run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs = 3000
  ): Promise<RunnerResponse> {
    return new Promise((resolve) => {
      let worker: Worker | null = null;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let isResolved = false;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
        if (worker) {
          worker.terminate();
          worker = null;
        }
      };

      try {
        const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
        const blobUrl = URL.createObjectURL(blob);
        worker = new Worker(blobUrl);

        // Timeout guard (3 seconds hard limit)
        timer = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            resolve({
              results: testCases.map((tc) => ({
                testCaseId: tc.id,
                passed: false,
                input: tc.input,
                expected: tc.expected,
                actual: "Time Limit Exceeded",
                runtime: timeoutMs,
                logs: [],
                isTimeout: true,
                error: `Time Limit Exceeded (${timeoutMs}ms). Possible infinite loop detected.`,
              })),
              status: "tle",
              totalRuntime: timeoutMs,
              allPassed: false,
              logs: ["Execution terminated: exceeded 3000ms timeout."],
              errorSummary: "Time Limit Exceeded: Your code took too long to execute or contains an infinite loop.",
            });
          }
        }, timeoutMs);

        worker.onmessage = (event: MessageEvent) => {
          if (isResolved) return;
          isResolved = true;
          const data = event.data;
          cleanup();

          if (data.type === "error") {
            resolve({
              results: testCases.map((tc) => ({
                testCaseId: tc.id,
                passed: false,
                input: tc.input,
                expected: tc.expected,
                actual: null,
                runtime: 0,
                logs: data.logs || [],
                error: data.error,
              })),
              status: "error",
              totalRuntime: 0,
              allPassed: false,
              logs: data.logs || [],
              errorSummary: data.error,
            });
          } else {
            resolve({
              results: data.results,
              status: data.allPassed ? "success" : "failed",
              totalRuntime: Math.round(data.totalRuntime * 100) / 100,
              allPassed: data.allPassed,
              logs: data.logs || [],
            });
          }
        };

        worker.onerror = (err: ErrorEvent) => {
          if (isResolved) return;
          isResolved = true;
          cleanup();
          resolve({
            results: testCases.map((tc) => ({
              testCaseId: tc.id,
              passed: false,
              input: tc.input,
              expected: tc.expected,
              actual: null,
              runtime: 0,
              logs: [],
              error: err.message || "Worker error",
            })),
            status: "error",
            totalRuntime: 0,
            allPassed: false,
            logs: [],
            errorSummary: err.message || "Worker syntax or runtime error",
          });
        };

        // Post work to isolated thread
        worker.postMessage({ code, functionName, testCases });
      } catch (e: any) {
        cleanup();
        resolve({
          results: [],
          status: "error",
          totalRuntime: 0,
          allPassed: false,
          logs: [],
          errorSummary: e?.message || "Failed to initialize Web Worker",
        });
      }
    });
  }
}

export const jsRunner = new JavaScriptRunner();
