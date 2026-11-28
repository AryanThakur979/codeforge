"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Check, Sparkles, Terminal, Cpu, Layers } from "lucide-react";
import {
  LanguageConfig,
  ENABLED_LANGUAGES,
  TIER1_LANGUAGES,
  TIER2_LANGUAGES,
  TIER3_LANGUAGES,
} from "@/lib/runners/languages.config";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (langKey: string) => void;
  hasIoSpec?: boolean;
}

export function LanguageSelectorModal({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  hasIoSpec = true,
}: LanguageSelectorModalProps) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const query = search.trim().toLowerCase();

  const filteredTier1 = useMemo(
    () =>
      TIER1_LANGUAGES.filter(
        (l) =>
          l.label.toLowerCase().includes(query) ||
          l.key.toLowerCase().includes(query) ||
          l.version.toLowerCase().includes(query)
      ),
    [query]
  );

  const filteredTier2 = useMemo(
    () =>
      TIER2_LANGUAGES.filter(
        (l) =>
          l.label.toLowerCase().includes(query) ||
          l.key.toLowerCase().includes(query) ||
          l.version.toLowerCase().includes(query)
      ),
    [query]
  );

  const filteredTier3 = useMemo(
    () =>
      TIER3_LANGUAGES.filter(
        (l) =>
          l.label.toLowerCase().includes(query) ||
          l.key.toLowerCase().includes(query) ||
          l.version.toLowerCase().includes(query)
      ),
    [query]
  );

  const totalFiltered =
    filteredTier1.length + filteredTier2.length + filteredTier3.length;

  if (!isOpen) return null;

  const renderLanguageItem = (lang: LanguageConfig) => {
    const isSelected =
      selectedLanguage === lang.key ||
      (selectedLanguage === "python" && lang.key === "python3") ||
      (selectedLanguage === "js" && lang.key === "javascript") ||
      (selectedLanguage === "ts" && lang.key === "typescript");

    const isLockedWithoutIo = !hasIoSpec && !lang.isBrowserExecution;

    return (
      <button
        key={lang.key}
        type="button"
        disabled={isLockedWithoutIo}
        onClick={() => {
          if (isLockedWithoutIo) return;
          onSelectLanguage(lang.key);
          onClose();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono text-left transition-all ${
          isLockedWithoutIo
            ? "opacity-40 cursor-not-allowed bg-surface-secondary/20 border border-transparent"
            : isSelected
            ? "bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/40 font-bold"
            : "text-slate-800 dark:text-gray-200 hover:bg-surface-secondary/80 border border-transparent hover:border-surface-border"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] text-slate-900 dark:text-white truncate">
              {lang.label}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
              {isLockedWithoutIo ? "Standard IO spec needed" : lang.version}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLockedWithoutIo ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-500/10 text-slate-500 border border-slate-500/20">
              JS / Py Only
            </span>
          ) : lang.isBrowserExecution ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30">
              {lang.badge}
            </span>
          ) : lang.tier === 3 ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Experimental
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {lang.badge}
            </span>
          )}

          {isSelected && <Check className="w-4 h-4 text-forge-cyan shrink-0" />}
        </div>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full sm:max-w-xl max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-surface border border-surface-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search */}
        <div className="p-4 border-b border-surface-border bg-surface/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-forge-cyan" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                Select Execution Runtime
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-slate-500 dark:text-gray-400 border border-surface-border">
                {ENABLED_LANGUAGES.length} Verified
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by language name (e.g. Python, Rust, Go, Swift)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-secondary border border-surface-border text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-forge-cyan"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Language List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {totalFiltered === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-xs font-mono space-y-1">
              <p>No verified language found matching &quot;{search}&quot;.</p>
              <p className="text-[11px] text-slate-400 dark:text-gray-500">
                Only languages verified against real provider compilers are displayed.
              </p>
            </div>
          ) : (
            <>
              {/* Group 1: Popular (Tier 1) */}
              {filteredTier1.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-forge-cyan px-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Popular (Tier 1)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredTier1.map(renderLanguageItem)}
                  </div>
                </div>
              )}

              {/* Group 2: More Languages (Tier 2) */}
              {filteredTier2.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-2">
                    <Cpu className="w-3 h-3" />
                    <span>More Languages (Tier 2)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredTier2.map(renderLanguageItem)}
                  </div>
                </div>
              )}

              {/* Group 3: Experimental / Niche (Tier 3) */}
              {filteredTier3.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-2">
                    <Terminal className="w-3 h-3" />
                    <span>Experimental & Classic (Tier 3)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredTier3.map(renderLanguageItem)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-surface-border bg-surface/80 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-gray-400">
          <span>Client runtimes execute in-browser (0ms latency)</span>
          <span>Cloud powered by GCC, JDK 17, Mono & LLVM</span>
        </div>
      </div>
    </div>
  );
}
