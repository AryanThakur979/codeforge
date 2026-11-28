"use client";

import { useState } from "react";
import { RunnerResponse } from "@/lib/runners/types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Terminal,
  Code2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { formatTime } from "@/lib/utils";

interface TestResultsPanelProps {
  response: RunnerResponse | null;
  isRunning: boolean;
  sampleTestCases: Array<{ id: number; input: any[]; expected: any; isHidden?: boolean }>;
  onGoToLine?: (line: number, column?: number) => void;
  onExplainError?: (errorMessage: string) => void;
}

export function TestResultsPanel({
  response,
  isRunning,
  onGoToLine,
  onExplainError,
}: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<"tests" | "console">("tests");
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  if (isRunning) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-3 text-center min-h-[180px]">
        <div className="w-8 h-8 rounded-full border-2 border-forge-cyan border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-forge-cyan animate-pulse">
          Evaluating solution against test harness & isolated judge...
        </p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-gray-400 space-y-2 min-h-[180px] flex flex-col justify-center items-center">
        <Code2 className="w-8 h-8 text-slate-400 dark:text-gray-600 mb-1" />
        <p className="text-xs font-mono text-slate-500 dark:text-gray-400">
          Run sample tests or submit solution to execute against the multi-language judge.
        </p>
      </div>
    );
  }

  const results = response.results || [];
  const currentResult = results[selectedCaseIndex];
  const logs = response.logs || [];
  const judgeRes = response.judgeResponse;

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
            {logs.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan" />}
          </button>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-2">
          {judgeRes?.verdict ? (
            <span
              className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                judgeRes.verdict === "Accepted"
                  ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                  : judgeRes.verdict === "Time Limit Exceeded"
                  ? "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
                  : "text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30"
              }`}
            >
              {judgeRes.verdict === "Accepted" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : judgeRes.verdict === "Time Limit Exceeded" ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>
                {judgeRes.verdict}
                {judgeRes.totalRuntimeMs > 0 ? ` (${formatTime(judgeRes.totalRuntimeMs)})` : ""}
              </span>
            </span>
          ) : response.status === "tle" ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Limit Exceeded</span>
            </span>
          ) : response.status === "error" ? (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Execution Error</span>
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
      <div className="flex-1 p-4 overflow-y-auto max-h-[360px]">
        {/* Compilation Error Block with line jumping and Code Doctor explain */}
        {judgeRes?.compilationError && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-700 dark:text-rose-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Compilation Error</span>
              </div>
              {onExplainError && (
                <button
                  onClick={() =>
                    onExplainError(
                      judgeRes.compilationError?.rawMessage || "Compilation error"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forge-cyan/20 border border-forge-cyan/40 text-forge-cyan hover:bg-forge-cyan/30 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain with AI</span>
                </button>
              )}
            </div>

            {/* Parsed Error Locations */}
            {judgeRes.compilationError.errors.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  Detected Compiler Issues:
                </span>
                <div className="space-y-1">
                  {judgeRes.compilationError.errors.map((err, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface/70 border border-rose-500/30"
                    >
                      <span className="text-rose-700 dark:text-rose-300">
                        Line {err.line}
                        {err.column ? `:${err.column}` : ""}: {err.message}
                      </span>
                      {onGoToLine && (
                        <button
                          onClick={() => onGoToLine(err.line, err.column)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface-secondary border border-surface-border text-xs text-forge-cyan hover:underline ml-2 shrink-0 font-sans"
                        >
                          <span>Go to line {err.line}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed text-rose-800 dark:text-rose-200 bg-black/20 p-3 rounded-lg border border-rose-500/20">
              {judgeRes.compilationError.rawMessage}
            </pre>
          </div>
        )}

        {/* Runtime Error Block */}
        {judgeRes?.runtimeError && (
          <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-700 dark:text-rose-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{judgeRes.runtimeError.type}</span>
              </div>
              {onExplainError && (
                <button
                  onClick={() =>
                    onExplainError(
                      `${judgeRes.runtimeError?.type}: ${judgeRes.runtimeError?.explanation}\n\n${judgeRes.runtimeError?.cleanTraceback}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forge-cyan/20 border border-forge-cyan/40 text-forge-cyan hover:bg-forge-cyan/30 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain with AI</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-700 dark:text-gray-300 font-sans">
              {judgeRes.runtimeError.explanation}
            </p>

            <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed text-rose-800 dark:text-rose-200 bg-black/20 p-3 rounded-lg border border-rose-500/20">
              {judgeRes.runtimeError.cleanTraceback}
            </pre>
          </div>
        )}

        {/* Generic Error Summary (if not covered by compilationError or runtimeError) */}
        {response.errorSummary && !judgeRes?.compilationError && !judgeRes?.runtimeError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-600 dark:text-rose-300 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Diagnostic Report:</span>
              </div>
              {onExplainError && (
                <button
                  onClick={() => onExplainError(response.errorSummary || "Error report")}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-forge-cyan/20 text-forge-cyan text-xs font-sans hover:bg-forge-cyan/30 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Explain Error</span>
                </button>
              )}
            </div>
            <pre className="whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed text-rose-800 dark:text-rose-200 bg-black/20 p-2.5 rounded-lg border border-rose-500/20">
              {response.errorSummary}
            </pre>
          </div>
        )}

        {activeTab === "tests" ? (
          <div className="space-y-4">
            {/* Case Selectors */}
            {results.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {results.map((res, idx) => {
                  const isHidden = res.input?.[0] === "[Hidden Test]";
                  return (
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
                      <span>
                        {isHidden ? `Hidden ${idx + 1}` : `Case ${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Test Case Detail */}
            {currentResult && (
              <div className="space-y-3 font-mono text-xs">
                {currentResult.error ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300">
                    <span className="font-bold">Failure Verdict:</span> {currentResult.error}
                  </div>
                ) : null}

                {/* If Hidden Test Case */}
                {currentResult.input?.[0] === "[Hidden Test]" ? (
                  <div className="p-4 rounded-xl bg-surface-secondary/70 border border-surface-border space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300 font-semibold">
                      <Lock className="w-4 h-4 text-forge-cyan" />
                      <span>Server Hidden Edge Test</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-400 font-sans">
                      Test inputs, constraints, and target outputs for this case are evaluated
                      server-side to protect benchmark accuracy and prevent hardcoded lookup tables.
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <span className="flex items-center gap-1.5">
                        Verdict:{" "}
                        <strong
                          className={
                            currentResult.passed
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }
                        >
                          {currentResult.passed ? "Passed" : "Failed"}
                        </strong>
                      </span>
                      {currentResult.runtime > 0 && (
                        <span className="text-slate-500 dark:text-gray-400">
                          Runtime: {formatTime(currentResult.runtime)}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Input */}
                    <div className="space-y-1">
                      <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">
                        Standard Input (stdin)
                      </div>
                      <pre className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-slate-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap">
                        {typeof currentResult.input === "string"
                          ? currentResult.input
                          : Array.isArray(currentResult.input) &&
                            currentResult.input.length === 1 &&
                            typeof currentResult.input[0] === "string"
                          ? currentResult.input[0]
                          : JSON.stringify(currentResult.input)}
                      </pre>
                    </div>

                    {/* Expected vs Actual */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">
                          Expected Output
                        </div>
                        <pre className="p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border text-emerald-700 dark:text-emerald-400 overflow-x-auto font-semibold whitespace-pre-wrap">
                          {typeof currentResult.expected === "object"
                            ? JSON.stringify(currentResult.expected)
                            : String(currentResult.expected ?? "")}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <div className="text-slate-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">
                          Your Output
                        </div>
                        <pre
                          className={`p-2.5 rounded-lg bg-surface-secondary/70 border border-surface-border overflow-x-auto font-semibold whitespace-pre-wrap ${
                            currentResult.passed
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          {currentResult.actual !== undefined
                            ? typeof currentResult.actual === "object"
                              ? JSON.stringify(currentResult.actual)
                              : String(currentResult.actual)
                            : "No output produced"}
                        </pre>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500 dark:text-gray-500">
                      Runtime: {formatTime(currentResult.runtime)}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Console Tab */
          <div className="font-mono text-xs space-y-2">
            {logs.length === 0 ? (
              <p className="text-slate-500 dark:text-gray-500 italic p-4 text-center">
                No logs recorded. Use standard logging or printing to debug your algorithm.
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
