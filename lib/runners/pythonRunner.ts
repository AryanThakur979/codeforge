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
      py.globals.set("_FUNCTION_NAME", functionName || "solve");
      py.globals.set("_TEST_CASES_JSON", JSON.stringify(testCases || []));

      const pythonRunnerCode = \`
import json
import sys
import io
import time

def _compare_tokens(act, exp):
    act_tokens = str(act).strip().split()
    exp_tokens = str(exp).strip().split()
    if len(act_tokens) != len(exp_tokens):
        return False
    for a, e in zip(act_tokens, exp_tokens):
        if a == e:
            continue
        try:
            if abs(float(a) - float(e)) <= 1e-5:
                continue
        except Exception:
            pass
        if a.lower() in ("true", "false") and a.lower() == e.lower():
            continue
        return False
    return True

_orig_stdout = sys.stdout
_orig_stdin = sys.stdin
_captured_stdout = io.StringIO()
sys.stdout = _captured_stdout

_ns = {
    "__name__": "__main__",
    "__doc__": None,
}

try:
    exec(_USER_CODE, _ns)
except Exception as _compile_err:
    sys.stdout = _orig_stdout
    sys.stdin = _orig_stdin
    _result_payload = json.dumps({
        "type": "error",
        "error": f"Python Syntax/Runtime Error: {str(_compile_err)}",
        "logs": _captured_stdout.getvalue().splitlines()
    })
else:
    try:
        _raw_cases = json.loads(_TEST_CASES_JSON)
        _results = []
        _all_passed = True
        _total_runtime = 0.0

        _fn = _ns.get(_FUNCTION_NAME) or globals().get(_FUNCTION_NAME)
        if not _fn and "Solution" in _ns:
            try:
                _sol_inst = _ns["Solution"]()
                _fn = getattr(_sol_inst, _FUNCTION_NAME, None)
            except Exception:
                pass

        for _tc in _raw_cases:
            _t_id = _tc["id"]
            _inputs = _tc.get("input")
            _expected = _tc.get("expected")

            if isinstance(_inputs, str):
                _stdin_str = _inputs
            elif isinstance(_inputs, list) and len(_inputs) == 1 and isinstance(_inputs[0], str):
                _stdin_str = _inputs[0]
            elif isinstance(_inputs, list):
                _stdin_str = "\\n".join(str(x) for x in _inputs)
            else:
                _stdin_str = str(_inputs)

            _tc_stdout = io.StringIO()
            sys.stdout = _tc_stdout
            sys.stdin = io.StringIO(_stdin_str)

            _t_start = time.perf_counter()
            _passed = False
            _actual = None
            _error_str = None

            try:
                if _fn and callable(_fn) and isinstance(_inputs, list) and not isinstance(_inputs, str):
                    # Classic function signature
                    _actual_res = _fn(*_inputs)
                    _t_end = time.perf_counter()
                    _duration = (_t_end - _t_start) * 1000.0
                    _total_runtime += _duration

                    _norm_actual = list(_actual_res) if isinstance(_actual_res, tuple) else _actual_res
                    _norm_expected = list(_expected) if isinstance(_expected, tuple) else _expected
                    if _norm_actual == _norm_expected:
                        _passed = True
                    elif _compare_tokens(str(_actual_res), str(_expected)):
                        _passed = True
                    else:
                        _passed = False
                    _actual = _actual_res
                else:
                    # Stdin/Stdout competitive programming script
                    _run_ns = {
                        "__name__": "__main__",
                        "__doc__": None,
                    }
                    exec(_USER_CODE, _run_ns)
                    if "solve" in _run_ns and callable(_run_ns["solve"]):
                        _run_ns["solve"]()
                    elif "main" in _run_ns and callable(_run_ns["main"]):
                        _run_ns["main"]()

                    _t_end = time.perf_counter()
                    _duration = (_t_end - _t_start) * 1000.0
                    _total_runtime += _duration

                    _out_str = _tc_stdout.getvalue().strip()
                    _passed = _compare_tokens(_out_str, str(_expected).strip())
                    _actual = _out_str
            except Exception as _test_err:
                _t_end = time.perf_counter()
                _duration = (_t_end - _t_start) * 1000.0
                _total_runtime += _duration
                _passed = False
                _error_str = str(_test_err)

            if not _passed:
                _all_passed = False

            _results.append({
                "testCaseId": _t_id,
                "passed": _passed,
                "input": _inputs,
                "expected": _expected,
                "actual": _actual,
                "runtime": round(_duration, 2),
                "error": _error_str,
                "logs": _tc_stdout.getvalue().splitlines()
            })

        sys.stdout = _orig_stdout
        sys.stdin = _orig_stdin
        _result_payload = json.dumps({
            "type": "success",
            "results": _results,
            "allPassed": _all_passed,
            "totalRuntime": round(_total_runtime, 2),
            "logs": _captured_stdout.getvalue().splitlines()
        })
    except Exception as _run_err:
        sys.stdout = _orig_stdout
        sys.stdin = _orig_stdin
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

  constructor() {}

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
    timeoutMs = 12000
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
            this.notifyStatus("idle");
          } catch {}

          resolve({
            results: [],
            status: "tle",
            totalRuntime: timeoutMs,
            allPassed: false,
            logs: [],
            errorSummary: `Time Limit Exceeded: Execution took longer than ${timeoutMs / 1000}s. Check for infinite loops.`,
          });
        }
      }, timeoutMs);

      const messageHandler = (e: MessageEvent) => {
        const msg = e.data;
        if (msg.type === "status") {
          return;
        }

        if (!isResolved) {
          isResolved = true;
          cleanup();
          worker.removeEventListener("message", messageHandler);

          if (msg.type === "error") {
            resolve({
              results: [],
              status: "error",
              totalRuntime: 0,
              allPassed: false,
              logs: msg.logs || [],
              errorSummary: msg.error || "An unknown Python execution error occurred.",
            });
          } else if (msg.type === "success") {
            resolve({
              results: msg.results || [],
              status: msg.allPassed ? "success" : "failed",
              totalRuntime: msg.totalRuntime || 0,
              allPassed: msg.allPassed ?? false,
              logs: msg.logs || [],
            });
          }
        }
      };

      worker.addEventListener("message", messageHandler);
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
