"use client";

import { useState } from "react";
import { RunnerResponse, ExecutionResult } from "@/lib/runners/types";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal, Code2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface TestResultsPanelProps {
  response: RunnerResponse | null;
  isRunning: boolean;
  sampleTestCases: Array<{ id: number; input: any[]; expected: any; isHidden?: boolean }>;
}

export function TestResultsPanel({ response, isRunning, sampleTestCases }: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "console">("tests");
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  if (isRunning) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-3 text-center min-h-[160px]">
        <div className="w-8 h-8 rounded-full border-2 border-forge-cyan border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-forge-cyan animate-pulse">
          Evaluating solution in isolated runtime / cloud compiler...
        </p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-gray-400 space-y-2 min-h-[160px] flex flex-col justify-center items-center">
        <Code2 className="w-8 h-8 text-slate-400 dark:text-gray-600 mb-1" />
        <p className="text-xs font-mono text-slate-500 dark:text-gray-400">
          Run sample tests or submit your code to view execution results.
        </p>
      </div>
    );
  }

  const results = response.results || [];
  const currentResult: ExecutionResult | undefined = results[selectedCaseIndex];
  const logs = response.logs || [];

  return (
    <div className="flex flex-col h-full bg-surface/40 backdrop-blur-md">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-2 bg-surface/70">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("tests")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === "tests"
                ? "bg-surface-secondary text-forge-cyan border border-forge-cyan/30"
                : "text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Test Cases ({results.filter((r) => r.passed).length}/{results.length})
          </button>

          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
              activeTab === "console"
                ? "bg-surface-secondary text-forge-cyan border border-forge-cyan/30"
                : "text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
            {logs.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan" />
            )}
          </button>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {response.status === "tle" ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Limit Exceeded (3s)</span>
            </span>
          ) : response.status === "error" ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Compiler / Runtime Error</span>
            </span>
          ) : response.allPassed ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accepted ({formatTime(response.totalRuntime)})</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5" />
              <span>Wrong Answer</span>
            </span>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-4 overflow-y-auto max-h-[320px]">
        {/* Compiler / Global Error Display */}
        {response.errorSummary && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-600 dark:text-rose-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Diagnostic Report:</span>
            </div>
            <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed text-rose-800 dark:text-rose-200 bg-rose-500/5 dark:bg-black/30 p-2.5 rounded-lg border border-rose-500/20">
              {response.errorSummary}
            </pre>
          </div>
        )}

        {activeTab === "tests" ? (
          <div className="space-y-4">
            {/* Case Selectors */}
            {results.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {results.map((res, idx) => (
                  <button
                    key={res.testCaseId || idx}
                    onClick={() => setSelectedCaseIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      selectedCaseIndex === idx
                        ? "bg-surface-secondary border border-forge-cyan/50 text-slate-900 dark:text-white"
                        : "bg-surface/60 border border-surface-border text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
                    }`}
                  >
                    {res.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>Case {idx + 1}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Active Test Case Detail */}
            {currentResult && (
              <div className="space-y-3 font-mono text-xs">
                {currentResult.error ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                    <span className="font-bold">Error:</span> {currentResult.error}
                  </div>
                ) : null}

                {/* Input */}
                <div className="space-y-1">
                  <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">Input</div>
                  <pre className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-slate-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(currentResult.input)}
                  </pre>
                </div>

                {/* Expected vs Actual */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">Expected Output</div>
                    <pre className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-emerald-700 dark:text-emerald-400 overflow-x-auto font-semibold">
                      {JSON.stringify(currentResult.expected)}
                    </pre>
                  </div>

                  <div className="space-y-1">
                    <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">Your Output</div>
                    <pre
                      className={`p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border overflow-x-auto font-semibold ${
                        currentResult.passed ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {currentResult.actual !== undefined
                        ? JSON.stringify(currentResult.actual)
                        : "undefined"}
                    </pre>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500 dark:text-gray-500">
                  Runtime: {formatTime(currentResult.runtime)}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Console Tab */
          <div className="font-mono text-xs space-y-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 dark:text-gray-500 italic p-4 text-center">
                No logs recorded. Use console.log() (JS/TS), print() (Python), cout (C++), or System.out.println() (Java) to debug.
              </p>
            ) : (
              <div className="space-y-1 p-3 rounded-xl bg-surface-secondary/60 border border-surface-border">
                {logs.map((log, index) => (
                  <div key={index} className="text-slate-800 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-forge-cyan/50 select-none">&gt;</span>
                    <span className="whitespace-pre-wrap">{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
