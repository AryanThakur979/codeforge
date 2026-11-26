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
  Loader2,
  AlertCircle,
  HelpCircle,
  Compass,
  Trophy,
  Send,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import {
  Problem,
  MentorMode,
  HintLanguage,
  AIHintFailureReason,
  VisibleTestResultSummary,
  FollowUpMessage,
} from "@/types/problem";
import { getHint, AIHintResponse } from "@/lib/ai";

interface AIHintPanelProps {
  problem: Problem;
  currentCode: string;
  codeLanguage?: string;
  visibleTests?: VisibleTestResultSummary[];
  isProblemSolved?: boolean;
}

interface UnlockedHint {
  level: 1 | 2 | 3 | 4;
  content: string;
  followUpQuestion?: string;
  source: "static" | "ai";
  mode: MentorMode;
  language: HintLanguage;
  isFallback?: boolean;
  fallbackReason?: string;
  reason?: AIHintFailureReason;
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

export function AIHintPanel({
  problem,
  currentCode,
  codeLanguage = "javascript",
  visibleTests,
  isProblemSolved = false,
}: AIHintPanelProps) {
  const [unlockedHints, setUnlockedHints] = useState<UnlockedHint[]>([]);
  const [mode, setMode] = useState<MentorMode>("mentor_bhaiya");
  const [language, setLanguage] = useState<HintLanguage>("hinglish");
  const [lookAtCode, setLookAtCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);
  const [activeDebugReason, setActiveDebugReason] = useState<string | null>(null);
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Follow-up chat state
  const [followUpInput, setFollowUpInput] = useState("");
  const [followUpsRemaining, setFollowUpsRemaining] = useState(3);
  const [chatHistory, setChatHistory] = useState<FollowUpMessage[]>([]);
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);

  const storageKey = `codeforge_ai_hints_v2_${problem.slug}`;

  // Check for ?debug=1
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        setIsDebugMode(params.get("debug") === "1");
      } catch {}
    }
  }, []);

  // Restore unlocked hints and chat from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.hints)) {
          setUnlockedHints(parsed.hints);
        }
        if (Array.isArray(parsed?.history)) {
          setChatHistory(parsed.history);
        }
        if (typeof parsed?.remaining === "number") {
          setFollowUpsRemaining(parsed.remaining);
        }
      }
    } catch {}
  }, [storageKey]);

  // Persist hints and chat
  const saveState = (hints: UnlockedHint[], history: FollowUpMessage[], remaining: number) => {
    setUnlockedHints(hints);
    setChatHistory(history);
    setFollowUpsRemaining(remaining);
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ hints, history, remaining })
      );
      const countKey = `codeforge_hint_count_${problem.slug}`;
      localStorage.setItem(countKey, String(hints.length));
    } catch {}
  };

  const highestLevelUnlocked = unlockedHints.length;
  const nextLevelToUnlock = Math.min(highestLevelUnlocked + 1, 4) as 1 | 2 | 3 | 4;
  const allUnlocked = highestLevelUnlocked >= 4;

  const handleUnlockNextLevel = async () => {
    if (allUnlocked || isLoading) return;

    setIsLoading(true);
    setActiveNotice(null);
    setActiveDebugReason(null);

    try {
      const result: AIHintResponse = await getHint(problem, {
        level: nextLevelToUnlock,
        mode,
        language,
        code: currentCode,
        codeLanguage,
        visibleTests,
        lookAtCode,
        history: chatHistory,
      });

      const newHintEntry: UnlockedHint = {
        level: nextLevelToUnlock,
        content: result.hint,
        followUpQuestion: result.followUpQuestion,
        source: result.source,
        mode,
        language,
        isFallback: result.isFallback,
        fallbackReason: result.fallbackReason,
        reason: result.reason,
      };

      if (result.isFallback) {
        setActiveNotice("Built-in hint (AI unavailable right now)");
        if (result.reason) {
          setActiveDebugReason(result.reason);
        }
      }

      const nextRemaining =
        typeof result.followUpsRemaining === "number" ? result.followUpsRemaining : followUpsRemaining;

      saveState([...unlockedHints, newHintEntry], chatHistory, nextRemaining);
    } catch {
      const hintsArr =
        language === "hinglish" && Array.isArray(problem.hintsHinglish) && problem.hintsHinglish.length > 0
          ? problem.hintsHinglish
          : problem.hints || [];

      const fallbackEntry: UnlockedHint = {
        level: nextLevelToUnlock,
        content: hintsArr[nextLevelToUnlock - 1] || "Think about the problem constraints and edge cases.",
        source: "static",
        mode,
        language,
        isFallback: true,
        fallbackReason: "Built-in hint (AI unavailable right now)",
        reason: "provider_error",
      };

      setActiveNotice("Built-in hint (AI unavailable right now)");
      setActiveDebugReason("provider_error");
      saveState([...unlockedHints, fallbackEntry], chatHistory, followUpsRemaining);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = followUpInput.trim();
    if (!query || isSendingFollowUp || followUpsRemaining <= 0) return;

    setIsSendingFollowUp(true);
    setActiveNotice(null);
    setActiveDebugReason(null);

    const updatedHistory: FollowUpMessage[] = [
      ...chatHistory,
      { role: "user", content: query },
    ];
    setChatHistory(updatedHistory);
    setFollowUpInput("");

    try {
      const result = await getHint(problem, {
        level: (highestLevelUnlocked || 1) as 1 | 2 | 3 | 4,
        mode,
        language,
        code: currentCode,
        codeLanguage,
        visibleTests,
        lookAtCode,
        followUpText: query,
        history: updatedHistory,
      });

      const assistantReply: FollowUpMessage = {
        role: "assistant",
        content: result.hint,
      };

      const finalHistory = [...updatedHistory, assistantReply];
      const remaining =
        typeof result.followUpsRemaining === "number"
          ? result.followUpsRemaining
          : Math.max(0, followUpsRemaining - 1);

      if (result.isFallback) {
        setActiveNotice("Built-in hint (AI unavailable right now)");
        if (result.reason) setActiveDebugReason(result.reason);
      }

      saveState(unlockedHints, finalHistory, remaining);
    } catch {
      setActiveNotice("Built-in hint (AI unavailable right now)");
      setActiveDebugReason("provider_error");
    } finally {
      setIsSendingFollowUp(false);
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
                <span>AI Hint Agent</span>
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
          {/* Persona Selector (responsive, non-truncating) */}
          <div>
            <label className="block text-[11px] font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Mentor Persona
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "mentor_bhaiya", label: "Mentor Bhaiya", short: "Bhaiya" },
                { id: "detective", label: "Detective", short: "Detective" },
                { id: "cricket_commentary", label: "Commentary", short: "Cricket" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setMode(p.id as MentorMode)}
                  className={`py-1.5 px-2 rounded-lg font-mono text-[11px] transition-all text-center ${
                    mode === p.id
                      ? "bg-forge-cyan text-white dark:text-background font-bold shadow-sm"
                      : "bg-surface hover:bg-surface-secondary text-slate-600 dark:text-gray-400 border border-surface-border"
                  }`}
                >
                  <span className="sm:hidden">{p.short}</span>
                  <span className="hidden sm:inline">{p.label}</span>
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
                { id: "hinglish", label: "Hinglish" },
                { id: "english", label: "English" },
              ].map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLanguage(l.id as HintLanguage)}
                  className={`py-1.5 px-2.5 rounded-lg font-mono text-[11px] transition-all text-center ${
                    language === l.id
                      ? "bg-forge-cyan text-white dark:text-background font-bold shadow-sm"
                      : "bg-surface hover:bg-surface-secondary text-slate-600 dark:text-gray-400 border border-surface-border"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Doctor 2.0 Toggle */}
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
              ? "Mentor inspects editor code & visible tests for targeted pointers"
              : "General algorithmic guidance without sending code"}
          </span>
        </div>
      </div>

      {/* Active Notice / Fallback Message */}
      {activeNotice && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <span>{activeNotice}</span>
          </div>
          {isDebugMode && activeDebugReason && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500 shrink-0">
              debug: {activeDebugReason}
            </span>
          )}
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
                    {!hint.isFallback && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-gray-400 hidden sm:inline">
                        • {hint.mode.replace("_", " ")} ({hint.language})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isDebugMode && hint.reason && (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-gray-500">
                        debug: {hint.reason}
                      </span>
                    )}
                    {hint.isFallback && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary text-slate-500 dark:text-gray-400 border border-surface-border">
                        Built-in hint (AI unavailable right now)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-800 dark:text-gray-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {hint.content}
                </div>

                {/* Socratic "Think about this" callout */}
                {hint.followUpQuestion && (
                  <div className="mt-2 pt-2 border-t border-surface-border/50 text-[11px] font-sans text-forge-cyan dark:text-cyan-400 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>
                      <strong className="font-semibold">Think about this:</strong> {hint.followUpQuestion}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Follow-Up Chat History */}
      {chatHistory.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-surface-border/60">
          <div className="text-[11px] font-mono font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Follow-up Discussion</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs ${
                  msg.role === "user"
                    ? "bg-forge-cyan/10 border border-forge-cyan/30 text-slate-900 dark:text-white ml-6"
                    : "bg-surface/80 border border-surface-border text-slate-800 dark:text-gray-200 mr-6"
                }`}
              >
                <div className="font-mono text-[10px] text-slate-500 dark:text-gray-400 mb-1">
                  {msg.role === "user" ? "You asked:" : "Mentor reply:"}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-Up Question Input */}
      {highestLevelUnlocked > 0 && (
        <form onSubmit={handleSendFollowUp} className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-gray-400">
            <span>Ask a quick follow-up:</span>
            <span>{followUpsRemaining}/3 remaining</span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={followUpInput}
              onChange={(e) => setFollowUpInput(e.target.value)}
              disabled={isSendingFollowUp || followUpsRemaining <= 0}
              placeholder={
                followUpsRemaining > 0
                  ? "e.g. 'why does the map help here?'"
                  : "No follow-ups remaining for this problem"
              }
              maxLength={300}
              className="flex-1 px-3 py-2 rounded-xl bg-surface border border-surface-border text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-forge-cyan transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!followUpInput.trim() || isSendingFollowUp || followUpsRemaining <= 0}
              className="px-3 py-2 rounded-xl bg-forge-cyan text-white dark:text-background font-mono text-xs font-bold hover:opacity-90 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1 shrink-0"
              aria-label="Send follow-up question"
            >
              {isSendingFollowUp ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
      )}

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
