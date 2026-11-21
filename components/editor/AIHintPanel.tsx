"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lightbulb,
  Layers,
  MapPin,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Compass,
  Trophy,
  Volume2,
} from "lucide-react";
import { Problem, MentorMode, HintLanguage } from "@/types/problem";
import { getHint, AIHintResponse } from "@/lib/ai";

interface AIHintPanelProps {
  problem: Problem;
  currentCode: string;
  isProblemSolved?: boolean;
}

interface UnlockedHint {
  level: 1 | 2 | 3 | 4;
  content: string;
  source: "static" | "ai";
  mode: MentorMode;
  language: HintLanguage;
  isFallback?: boolean;
  fallbackReason?: string;
}

const LADDER_META = [
  {
    level: 1,
    title: "Nudge",
    subtitle: "A guiding question to spark intuition",
    icon: Lightbulb,
    badgeColor: "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    level: 2,
    title: "Analogy",
    subtitle: "Real-world metaphor (cricket, chai, train)",
    icon: Compass,
    badgeColor: "text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  {
    level: 3,
    title: "Approach",
    subtitle: "Plain-English algorithm step recipe",
    icon: MapPin,
    badgeColor: "text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  },
  {
    level: 4,
    title: "Skeleton",
    subtitle: "Pseudocode with blanks (____) to fill in",
    icon: Layers,
    badgeColor: "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
];

export function AIHintPanel({ problem, currentCode, isProblemSolved = false }: AIHintPanelProps) {
  const [unlockedHints, setUnlockedHints] = useState<UnlockedHint[]>([]);
  const [mode, setMode] = useState<MentorMode>("mentor_bhaiya");
  const [language, setLanguage] = useState<HintLanguage>("hinglish");
  const [lookAtCode, setLookAtCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const storageKey = `codeforge_ai_hints_${problem.slug}`;

  // Restore unlocked hints from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setUnlockedHints(parsed);
        }
      }
    } catch {
      // Ignore localStorage read failures
    }
  }, [storageKey]);

  // Persist hints when updated
  const saveHints = (hints: UnlockedHint[]) => {
    setUnlockedHints(hints);
    try {
      localStorage.setItem(storageKey, JSON.stringify(hints));
      // Track total hints count for "Solved with 0 hints" badge
      const countKey = `codeforge_hint_count_${problem.slug}`;
      localStorage.setItem(countKey, String(hints.length));
    } catch {
      // Ignore localStorage write failures
    }
  };

  const highestLevelUnlocked = unlockedHints.length;
  const nextLevelToUnlock = Math.min(highestLevelUnlocked + 1, 4) as 1 | 2 | 3 | 4;
  const allUnlocked = highestLevelUnlocked >= 4;

  const handleUnlockNextLevel = async () => {
    if (allUnlocked || isLoading) return;

    setIsLoading(true);
    setActiveNotice(null);

    try {
      const result: AIHintResponse = await getHint(problem, {
        level: nextLevelToUnlock,
        mode,
        language,
        code: currentCode,
        lookAtCode,
      });

      const newHintEntry: UnlockedHint = {
        level: nextLevelToUnlock,
        content: result.hint,
        source: result.source,
        mode,
        language,
        isFallback: result.isFallback,
        fallbackReason: result.fallbackReason,
      };

      if (result.isFallback && result.fallbackReason) {
        setActiveNotice(result.fallbackReason);
      }

      saveHints([...unlockedHints, newHintEntry]);
    } catch {
      // Fallback to static hint from problem data
      const staticHints = problem.hints || [];
      const fallbackText =
        staticHints[nextLevelToUnlock - 1] ||
        "Think about the problem constraints and edge cases. What data structure allows fastest lookups?";

      const fallbackEntry: UnlockedHint = {
        level: nextLevelToUnlock,
        content: fallbackText,
        source: "static",
        mode,
        language,
        isFallback: true,
        fallbackReason: "AI hints are resting for today, here is a built-in hint.",
      };

      setActiveNotice("AI hints are resting for today, here is a built-in hint.");
      saveHints([...unlockedHints, fallbackEntry]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 p-4 sm:p-5 rounded-2xl bg-surface/60 border border-surface-border backdrop-blur-md">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-forge-cyan/15 border border-forge-cyan/30 text-forge-cyan">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Hint Ladder</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30">
                  Level {highestLevelUnlocked} of 4
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                Socratic step-by-step guidance. Never reveals full working code.
              </p>
            </div>
          </div>
        </div>

        {/* Hints used pill & Solved Badge */}
        <div className="flex items-center gap-2">
          {isProblemSolved && highestLevelUnlocked === 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Solved with 0 hints!</span>
            </span>
          )}
          <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
            {highestLevelUnlocked === 0 ? "0 hints used" : `${highestLevelUnlocked}/4 hints unlocked`}
          </span>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {LADDER_META.map((step) => {
          const isUnlocked = step.level <= highestLevelUnlocked;
          const isCurrent = step.level === nextLevelToUnlock && !allUnlocked;
          const Icon = step.icon;

          return (
            <div
              key={step.level}
              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                isUnlocked
                  ? "bg-surface-secondary/80 border-forge-cyan/40 shadow-sm"
                  : isCurrent
                  ? "bg-surface-secondary/40 border-surface-border animate-pulse"
                  : "bg-surface/30 border-surface-border opacity-50"
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {isUnlocked ? (
                  <Unlock className="w-3.5 h-3.5 text-forge-cyan" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500" />
                )}
                <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-white">
                  L{step.level}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-gray-300 truncate">
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mentor Controls & Preferences */}
      <div className="p-3.5 rounded-xl bg-surface-secondary/50 border border-surface-border space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Persona Selector */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Mentor Persona
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "mentor_bhaiya", label: "Mentor Bhaiya", emoji: "👨‍🏫" },
                { id: "detective", label: "Detective", emoji: "🕵️" },
                { id: "cricket_commentary", label: "Cricket", emoji: "🏏" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id as MentorMode)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-medium transition-all text-center truncate ${
                    mode === item.id
                      ? "bg-forge-cyan text-white dark:text-background font-bold shadow-sm"
                      : "bg-surface/70 border border-surface-border text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white"
                  }`}
                  title={item.label}
                >
                  <span className="mr-1">{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Hint Language
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "hinglish", label: "Hinglish (Hindi + Eng)" },
                { id: "english", label: "English Only" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLanguage(item.id as HintLanguage)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-medium transition-all text-center truncate ${
                    language === item.id
                      ? "bg-forge-purple/20 border border-forge-purple/40 text-forge-purple font-bold shadow-sm"
                      : "bg-surface/70 border border-surface-border text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Doctor Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-surface-border/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLookAtCode((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                lookAtCode ? "bg-forge-cyan" : "bg-slate-300 dark:bg-gray-700"
              }`}
              role="switch"
              aria-checked={lookAtCode}
              aria-label="Look at my code toggle"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  lookAtCode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="font-semibold text-slate-800 dark:text-gray-200">
              Look at my code (Code Doctor)
            </span>
          </div>

          <span className="text-[11px] text-slate-500 dark:text-gray-400">
            {lookAtCode
              ? "Mentor will inspect your editor code for targeted line pointers"
              : "General algorithmic guidance without sending code"}
          </span>
        </div>
      </div>

      {/* Active Notice / Fallback Message */}
      {activeNotice && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <span>{activeNotice}</span>
        </div>
      )}

      {/* Unlocked Hint Cards Stack */}
      <div className="space-y-3">
        {unlockedHints.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-surface-border bg-surface/30 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 dark:text-gray-500 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              No hints unlocked yet
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 max-w-sm mx-auto">
              Stuck on this problem? Unlock Level 1 (Nudge) to get a light thought-provoking question without spoiling the challenge.
            </p>
          </div>
        ) : (
          unlockedHints.map((hint) => {
            const meta = LADDER_META.find((m) => m.level === hint.level) || LADDER_META[0];
            const Icon = meta.icon;

            return (
              <motion.div
                key={hint.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-surface-border bg-surface/80 p-4 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-surface-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${meta.badgeColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>Level {hint.level}: {meta.title}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 hidden sm:inline">
                      • {hint.mode.replace("_", " ")} ({hint.language})
                    </span>
                  </div>

                  {hint.isFallback && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-slate-500 dark:text-gray-400 border border-surface-border">
                      Built-in
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {hint.content}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Unlock Next Level CTA */}
      {!allUnlocked ? (
        <button
          type="button"
          onClick={handleUnlockNextLevel}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs font-mono text-white dark:text-background bg-forge-cyan shadow-neon-cyan hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-background" />
              <span>Consulting {mode === "detective" ? "The Detective" : mode === "cricket_commentary" ? "Cricket Commentator" : "Mentor Bhaiya"}...</span>
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4" />
              <span>
                Unlock Level {nextLevelToUnlock}: {LADDER_META[nextLevelToUnlock - 1].title} (
                {LADDER_META[nextLevelToUnlock - 1].subtitle})
              </span>
            </>
          )}
        </button>
      ) : (
        <div className="p-3.5 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
          🎉 All 4 hint levels unlocked! You have all the pieces—now forge the code!
        </div>
      )}

      {/* Tasteful Disclaimer Note */}
      <div className="pt-2 text-[11px] text-slate-500 dark:text-gray-400 text-center flex items-center justify-center gap-1">
        <span>💡</span>
        <span>
          Hints use AI and may be wrong. Your code is sent to an AI provider only when &quot;Look at my code&quot; is on.
        </span>
      </div>
    </div>
  );
}
