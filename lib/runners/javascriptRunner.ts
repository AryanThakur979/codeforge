import { CodeRunner, RunnerResponse, ExecutionResult, TestCaseInput } from "./types";

const WORKER_SCRIPT = `
function compareTokens(actual, expected) {
  const actualStr = typeof actual === "object" ? JSON.stringify(actual) : String(actual ?? "");
  const expectedStr = typeof expected === "object" ? JSON.stringify(expected) : String(expected ?? "");

  const aTokens = actualStr.trim().split(/\\s+/).filter(Boolean);
  const eTokens = expectedStr.trim().split(/\\s+/).filter(Boolean);

  if (aTokens.length !== eTokens.length) return false;

  for (let i = 0; i < aTokens.length; i++) {
    const a = aTokens[i];
    const e = eTokens[i];
    if (a === e) continue;

    const numA = Number(a);
    const numE = Number(e);
    if (!isNaN(numA) && !isNaN(numE) && Math.abs(numA - numE) <= 1e-5) {
      continue;
    }

    if (
      (a.toLowerCase() === "true" || a.toLowerCase() === "false") &&
      a.toLowerCase() === e.toLowerCase()
    ) {
      continue;
    }

    return false;
  }
  return true;
}

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
    const results = [];
    let allPassed = true;
    let totalRuntime = 0;

    for (const tc of testCases) {
      capturedLogs.length = 0; // reset logs per test case

      // Determine stdin string
      let stdinStr = "";
      if (typeof tc.input === "string") {
        stdinStr = tc.input;
      } else if (Array.isArray(tc.input) && tc.input.length === 1 && typeof tc.input[0] === "string") {
        stdinStr = tc.input[0];
      } else if (Array.isArray(tc.input)) {
        stdinStr = tc.input.map((x) => (typeof x === "object" ? JSON.stringify(x) : String(x))).join("\\n");
      } else {
        stdinStr = String(tc.input || "");
      }

      // Prepare environment
      let userFn = null;
      let actual = null;
      let passed = false;
      let error = undefined;
      const start = performance.now();

      try {
        // Execute with sandboxed environment providing fake require('fs')
        const fakeFs = {
          readFileSync: function (fd, enc) {
            return stdinStr;
          },
        };

        const runnerFn = new Function(
          "require",
          "process",
          code +
            "; return { " +
            "fn: typeof " + (functionName || "null") + " === 'function' ? " + (functionName || "null") + " : null, " +
            "solve: typeof solve === 'function' ? solve : null " +
            "};"
        );

        const scope = runnerFn(
          function (mod) {
            if (mod === "fs") return fakeFs;
            return {};
          },
          {
            stdin: {
              read: () => stdinStr,
            },
          }
        );

        if (scope.fn && Array.isArray(tc.input) && typeof tc.input !== "string") {
          // Classic function execution
          let clonedInput;
          try {
            clonedInput = JSON.parse(JSON.stringify(tc.input));
          } catch {
            clonedInput = tc.input;
          }
          actual = scope.fn(...clonedInput);
          passed = deepEqual(actual, tc.expected) || compareTokens(actual, tc.expected);
        } else {
          // Stdin/Stdout execution
          if (scope.solve) {
            scope.solve();
          }
          const stdoutStr = capturedLogs.join("\\n");
          actual = stdoutStr;
          passed = compareTokens(stdoutStr, tc.expected);
        }
      } catch (runErr) {
        passed = false;
        error = runErr.message || String(runErr);
      }

      const end = performance.now();
      const duration = end - start;
      totalRuntime += duration;

      if (!passed) allPassed = false;

      results.push({
        testCaseId: tc.id,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual,
        runtime: duration,
        logs: [...capturedLogs],
        error,
      });
    }

    self.postMessage({
      type: "success",
      results,
      allPassed,
      totalRuntime,
      logs: [...capturedLogs],
    });
  } catch (err) {
    self.postMessage({
      type: "error",
      error: err.message || String(err),
      logs: capturedLogs,
    });
  }
};
`;

export class JavaScriptRunner implements CodeRunner {
  private worker: Worker | null = null;

  private getOrCreateWorker(): Worker {
    if (!this.worker) {
      const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      this.worker = new Worker(blobUrl);
    }
    return this.worker;
  }

  public run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs = 8000
  ): Promise<RunnerResponse> {
    return new Promise((resolve) => {
      const worker = this.getOrCreateWorker();
      let timer: ReturnType<typeof setTimeout> | null = null;
      let isResolved = false;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
      };

      timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          try {
            worker.terminate();
            this.worker = null;
          } catch {}

          resolve({
            results: [],
            status: "tle",
            totalRuntime: timeoutMs,
            allPassed: false,
            logs: [],
            errorSummary: `Time Limit Exceeded: JavaScript code execution timed out after ${timeoutMs / 1000}s. Check for infinite loops.`,
          });
        }
      }, timeoutMs);

      const messageHandler = (e: MessageEvent) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          worker.removeEventListener("message", messageHandler);

          const { type, results, allPassed, totalRuntime, logs, error } = e.data;

          if (type === "error") {
            resolve({
              results: [],
              status: "error",
              totalRuntime: 0,
              allPassed: false,
              logs: logs || [],
              errorSummary: error || "JavaScript runtime evaluation error.",
            });
          } else {
            resolve({
              results: results || [],
              status: allPassed ? "success" : "failed",
              totalRuntime: Math.round(totalRuntime),
              allPassed: !!allPassed,
              logs: logs || [],
            });
          }
        }
      };

      worker.addEventListener("message", messageHandler);
      worker.postMessage({
        code,
        functionName,
        testCases,
      });
    });
  }
}

export const jsRunner = new JavaScriptRunner();
