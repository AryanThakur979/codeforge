"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { problems } from "@/data/problems";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";
import { CircularProgressRing } from "@/components/dashboard/CircularProgressRing";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { SubmissionsTable } from "@/components/dashboard/SubmissionsTable";

export default function DashboardPage() {
  const {
    solvedProblems,
    submissions,
    exportData,
    importData,
    resetAllData,
    isHydrated,
    setHydrated,
  } = useCodeForgeStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Difficulty counts breakdown
  const stats = useMemo(() => {
    const total = problems.length;
    let easyTotal = 0;
    let medTotal = 0;
    let hardTotal = 0;

    let easySolved = 0;
    let medSolved = 0;
    let hardSolved = 0;

    problems.forEach((p) => {
      if (p.difficulty === "Easy") easyTotal++;
      if (p.difficulty === "Medium") medTotal++;
      if (p.difficulty === "Hard") hardTotal++;

      if (solvedProblems[p.slug]) {
        if (p.difficulty === "Easy") easySolved++;
        if (p.difficulty === "Medium") medSolved++;
        if (p.difficulty === "Hard") hardSolved++;
      }
    });

    const totalSolved = Object.keys(solvedProblems).length;

    return {
      total,
      totalSolved,
      easyTotal,
      easySolved,
      medTotal,
      medSolved,
      hardTotal,
      hardSolved,
    };
  }, [solvedProblems]);

  // Compute active consecutive day streak
  const streak = useMemo(() => {
    if (submissions.length === 0) return 0;
    const days = new Set<string>();
    submissions.forEach((s) => {
      if (s.timestamp) days.add(s.timestamp.slice(0, 10));
    });

    const sortedDays = Array.from(days).sort().reverse();
    if (sortedDays.length === 0) return 0;

    let currentStreak = 0;
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // If latest submission was today or yesterday, streak is active
    let checkDate = sortedDays.includes(today) ? today : sortedDays.includes(yesterday) ? yesterday : null;
    if (!checkDate) return 0;

    let target = new Date(checkDate);
    while (true) {
      const dateStr = target.toISOString().slice(0, 10);
      if (days.has(dateStr)) {
        currentStreak++;
        target.setDate(target.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [submissions]);

  // Handle Export JSON
  const handleExport = () => {
    const jsonString = exportData();
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codeforge-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus("Progress restored successfully!");
      } else {
        setImportStatus("Failed to parse JSON backup file.");
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your solved problems and submissions?")) {
      resetAllData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner */}
      <div className="relative rounded-3xl border border-surface-border bg-gradient-to-r from-surface via-surface-secondary to-surface p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-glow-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-forge-purple/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-purple/10 border border-forge-purple/30 text-forge-purple text-xs font-mono uppercase tracking-wider">
              Local Browser Profile • No Login Required
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Progress &amp; Performance
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 max-w-xl">
              All your coding submissions, streaks, and solved challenges are securely stored directly in your browser.
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-surface/80 border border-surface-border backdrop-blur-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase">Day Streak</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {streak} {streak === 1 ? "Day" : "Days"}
                </div>
              </div>
            </div>

            {/* Solved Metric */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-surface/80 border border-surface-border backdrop-blur-md">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forge-cyan/15 border border-forge-cyan/30 text-forge-cyan">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase">Total Solved</div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {stats.totalSolved} / {stats.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Circular Rings by Difficulty */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CircularProgressRing
          label="Overall Progress"
          solved={stats.totalSolved}
          total={stats.total}
          color="cyan"
          size={130}
        />
        <CircularProgressRing
          label="Easy Challenges"
          solved={stats.easySolved}
          total={stats.easyTotal}
          color="emerald"
          size={130}
        />
        <CircularProgressRing
          label="Medium Challenges"
          solved={stats.medSolved}
          total={stats.medTotal}
          color="amber"
          size={130}
        />
        <CircularProgressRing
          label="Hard Challenges"
          solved={stats.hardSolved}
          total={stats.hardTotal}
          color="rose"
          size={130}
        />
      </div>

      {/* Activity Heatmap Calendar */}
      <ActivityHeatmap submissions={submissions} />

      {/* Recent Submissions Log */}
      <SubmissionsTable submissions={submissions} />

      {/* Data Management Section (Export / Import / Reset) */}
      <div className="rounded-2xl border border-surface-border bg-surface/30 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forge-cyan" />
              <span>Data Portability &amp; Backup</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              Export your solved challenges and code drafts as a portable JSON file, or restore progress to another machine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-secondary border border-surface-border text-slate-700 dark:text-gray-300 hover:border-forge-cyan/40 hover:text-forge-cyan transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-surface-secondary border border-surface-border text-slate-700 dark:text-gray-300 hover:border-forge-purple/40 hover:text-forge-purple transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-forge-cyan/10 border border-forge-cyan/30 text-xs font-mono text-forge-cyan">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
}
