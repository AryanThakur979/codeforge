import { CodeRunner, RunnerResponse, TestCaseInput } from "./types";

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

const PYODIDE_WORKER_SCRIPT = `
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");

let pyodideInstance = null;
let isInitializing = false;

async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return pyodideInstance;
  }

  isInitializing = true;
  try {
    self.postMessage({ type: "status", status: "loading" });
    pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    });
    self.postMessage({ type: "status", status: "ready" });
    return pyodideInstance;
  } catch (err) {
    self.postMessage({ type: "status", status: "error", error: err.message });
    throw err;
  } finally {
    isInitializing = false;
  }
}

self.onmessage = async function (e) {
  const { type, code, functionName, testCases } = e.data;

  if (type === "init") {
    try {
      await initPyodide();
    } catch (e) {}
    return;
  }

  if (type === "run") {
    try {
      const py = await initPyodide();

      py.globals.set("_USER_CODE", code);
      py.globals.set("_FUNCTION_NAME", functionName);
      py.globals.set("_TEST_CASES_JSON", JSON.stringify(testCases));

      const pythonRunnerCode = \`
import json
import sys
import io
import time

_captured_stdout = io.StringIO()
_orig_stdout = sys.stdout
sys.stdout = _captured_stdout

_ns = {
    "__name__": "__main__",
    "__doc__": None,
}

try:
    exec(_USER_CODE, _ns)
except Exception as _compile_err:
    sys.stdout = _orig_stdout
    _result_payload = json.dumps({
        "type": "error",
        "error": f"Python Syntax/Runtime Error: {str(_compile_err)}",
        "logs": _captured_stdout.getvalue().splitlines()
    })
else:
    try:
        _fn = _ns.get(_FUNCTION_NAME) or globals().get(_FUNCTION_NAME)
        if not _fn and "Solution" in _ns:
            try:
                _sol_inst = _ns["Solution"]()
                _fn = getattr(_sol_inst, _FUNCTION_NAME, None)
            except Exception:
                pass

        if not _fn or not callable(_fn):
            sys.stdout = _orig_stdout
            _result_payload = json.dumps({
                "type": "error",
                "error": f"Function '{_FUNCTION_NAME}' is not defined or not callable.",
                "logs": _captured_stdout.getvalue().splitlines()
            })
        else:
            _raw_cases = json.loads(_TEST_CASES_JSON)
            _results = []
            _all_passed = True
            _total_runtime = 0.0

            for _tc in _raw_cases:
                _t_id = _tc["id"]
                _inputs = _tc["input"]
                _expected = _tc["expected"]

                _t_start = time.perf_counter()
                try:
                    _actual = _fn(*_inputs)
                    _t_end = time.perf_counter()
                    _duration = (_t_end - _t_start) * 1000.0
                    _total_runtime += _duration

                    # Deep equality normalization (tuples -> lists)
                    _norm_actual = list(_actual) if isinstance(_actual, tuple) else _actual
                    _norm_expected = list(_expected) if isinstance(_expected, tuple) else _expected
                    _passed = (_norm_actual == _norm_expected)
                    if not _passed:
                        _all_passed = False

                    _results.append({
                        "testCaseId": _t_id,
                        "passed": _passed,
                        "input": _inputs,
                        "expected": _expected,
                        "actual": _actual,
                        "runtime": round(_duration, 2),
                        "logs": _captured_stdout.getvalue().splitlines()
                    })
                except Exception as _test_err:
                    _all_passed = False
                    _results.append({
                        "testCaseId": _t_id,
                        "passed": False,
                        "input": _inputs,
                        "expected": _expected,
                        "actual": None,
                        "runtime": round((time.perf_counter() - _t_start) * 1000.0, 2),
                        "error": str(_test_err),
                        "logs": _captured_stdout.getvalue().splitlines()
                    })

            sys.stdout = _orig_stdout
            _result_payload = json.dumps({
                "type": "success",
                "results": _results,
                "allPassed": _all_passed,
                "totalRuntime": round(_total_runtime, 2),
                "logs": _captured_stdout.getvalue().splitlines()
            })
    except Exception as _run_err:
        sys.stdout = _orig_stdout
        _result_payload = json.dumps({
            "type": "error",
            "error": f"Execution error: {str(_run_err)}",
            "logs": _captured_stdout.getvalue().splitlines()
        })

_result_payload
\`;

      const rawJson = await py.runPythonAsync(pythonRunnerCode);
      const parsed = JSON.parse(rawJson);

      self.postMessage(parsed);
    } catch (outerErr) {
      self.postMessage({
        type: "error",
        error: outerErr.message || String(outerErr),
        logs: [],
      });
    }
  }
};
`;

export class PythonRunner implements CodeRunner {
  private worker: Worker | null = null;
  private status: PyodideStatus = "idle";
  private statusListeners: Array<(status: PyodideStatus) => void> = [];

  constructor() {
    // Lazy initialized on first interaction
  }

  public getStatus(): PyodideStatus {
    return this.status;
  }

  public subscribeStatus(listener: (status: PyodideStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(status: PyodideStatus) {
    this.status = status;
    this.statusListeners.forEach((l) => l(status));
  }

  private getOrCreateWorker(): Worker {
    if (!this.worker) {
      const blob = new Blob([PYODIDE_WORKER_SCRIPT], {
        type: "application/javascript",
      });
      const blobUrl = URL.createObjectURL(blob);
      this.worker = new Worker(blobUrl);

      this.worker.addEventListener("message", (e) => {
        if (e.data?.type === "status") {
          this.notifyStatus(e.data.status);
        }
      });
    }
    return this.worker;
  }

  public preload(): void {
    if (this.status === "ready" || this.status === "loading") return;
    try {
      const worker = this.getOrCreateWorker();
      this.notifyStatus("loading");
      worker.postMessage({ type: "init" });
    } catch (e) {
      this.notifyStatus("error");
    }
  }

  public run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs = 3000
  ): Promise<RunnerResponse> {
    return new Promise((resolve) => {
      const worker = this.getOrCreateWorker();
      let timer: ReturnType<typeof setTimeout> | null = null;
      let isResolved = false;

      const cleanup = () => {
        if (timer) clearTimeout(timer);
      };

      // Hard timeout guard (e.g. infinite loops in Python)
      timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          // Terminate unresponsive worker to free memory
          if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.notifyStatus("idle");
          }

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
              error: `Time Limit Exceeded (${timeoutMs}ms). Possible infinite loop in Python code.`,
            })),
            status: "tle",
            totalRuntime: timeoutMs,
            allPassed: false,
            logs: ["Python execution terminated: exceeded 3000ms."],
            errorSummary: "Time Limit Exceeded: Your Python code took longer than 3.0 seconds to run.",
          });
        }
      }, timeoutMs);

      const handleMessage = (event: MessageEvent) => {
        const data = event.data;
        if (data?.type === "status") return; // Handled by global listener

        if (isResolved) return;
        isResolved = true;
        cleanup();
        worker.removeEventListener("message", handleMessage);

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
            results: data.results || [],
            status: data.allPassed ? "success" : "failed",
            totalRuntime: data.totalRuntime || 0,
            allPassed: data.allPassed,
            logs: data.logs || [],
          });
        }
      };

      worker.addEventListener("message", handleMessage);

      // Post execution request
      worker.postMessage({
        type: "run",
        code,
        functionName,
        testCases,
      });
    });
  }
}

export const pythonRunner = new PythonRunner();
