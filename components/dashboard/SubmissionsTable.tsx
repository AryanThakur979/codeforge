"use client";

import { useState } from "react";
import Link from "next/link";
import { SubmissionRecord } from "@/store/useCodeForgeStore";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye, X, Terminal } from "lucide-react";
import { formatTime } from "@/lib/utils";

import { LEETCODE_LANGUAGES } from "@/types/problem";

interface SubmissionsTableProps {
  submissions: SubmissionRecord[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [inspectSubmission, setInspectSubmission] = useState<SubmissionRecord | null>(null);

  if (submissions.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-surface-border bg-surface/30 backdrop-blur-md space-y-2">
        <Terminal className="w-6 h-6 text-slate-400 dark:text-gray-500 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">No submissions recorded yet</h4>
        <p className="text-xs text-slate-600 dark:text-gray-400">
          Solve a problem and click &quot;Submit Solution&quot; to build your submission track record.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-border flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Submissions</h3>
        <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
          Total Recorded: {submissions.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-surface-secondary/50 border-b border-surface-border text-slate-600 dark:text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Problem</th>
              <th className="py-3 px-4">Language</th>
              <th className="py-3 px-4">Runtime</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {submissions.slice(0, 15).map((sub) => {
              const isPassed = sub.status === "passed";
              const isTle = sub.status === "tle";

              return (
                <tr key={sub.id} className="hover:bg-surface-secondary/40 transition-colors">
                  <td className="py-3 px-4">
                    {isPassed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted</span>
                      </span>
                    ) : isTle ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Time Limit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-500/15 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Wrong Answer</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    <Link
                      href={`/problems/${sub.problemSlug}`}
                      className="hover:text-forge-cyan transition-colors"
                    >
                      {sub.problemTitle}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-md bg-surface-secondary border border-surface-border text-[11px] font-mono font-medium text-forge-cyan">
                      {LEETCODE_LANGUAGES.find((l) => l.id === sub.language)?.name || sub.language}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-gray-300">{formatTime(sub.runtime)}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-gray-400 text-[11px]">
                    {new Date(sub.timestamp).toLocaleDateString()}{" "}
                    {new Date(sub.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setInspectSubmission(sub)}
                      className="p-1.5 rounded-lg border border-surface-border text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-secondary transition-colors"
                      title="View submitted code"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Code Inspection Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-surface-border bg-surface/95 p-6 shadow-neon-cyan backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{inspectSubmission.problemTitle}</h4>
                <div className="text-xs text-slate-600 dark:text-gray-400 font-mono capitalize">
                  Language: {inspectSubmission.language} • Runtime: {formatTime(inspectSubmission.runtime)}
                </div>
              </div>
              <button
                onClick={() => setInspectSubmission(null)}
                className="p-1.5 rounded-lg border border-surface-border text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-surface-secondary/80 border border-surface-border text-xs font-mono text-slate-800 dark:text-gray-200 overflow-x-auto max-h-[400px]">
              {inspectSubmission.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
