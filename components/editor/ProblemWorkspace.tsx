"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Play,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Check,
  Cpu,
  Loader2,
  Code2,
} from "lucide-react";
import { getProblemBySlug, problems } from "@/data/problems";
import { DifficultyBadge } from "@/components/problems/DifficultyBadge";
import { CodeEditor, CodeEditorHandle } from "@/components/editor/CodeEditor";
import { TestResultsPanel } from "@/components/editor/TestResultsPanel";
import { MobileToolbar } from "@/components/editor/MobileToolbar";
import { CelebrationOverlay } from "@/components/editor/CelebrationOverlay";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";
import { jsRunner } from "@/lib/runners/javascriptRunner";
import { tsRunner } from "@/lib/runners/typescriptRunner";
import { pythonRunner, PyodideStatus } from "@/lib/runners/pythonRunner";
import { judge0Runner } from "@/lib/runners/judge0Runner";
import { RunnerResponse } from "@/lib/runners/types";
import { LEETCODE_LANGUAGES, SupportedLanguage } from "@/types/problem";
import { getStarterCode } from "@/lib/codeTemplates";

interface ProblemWorkspaceProps {
  slug: string;
}

export function ProblemWorkspace({ slug }: ProblemWorkspaceProps) {
  const problem = useMemo(() => getProblemBySlug(slug), [slug]);

  // Global store
  const {
    solvedProblems,
    markProblemSolved,
    recordSubmission,
    userCodeDrafts,
    saveCodeDraft,
    isHydrated,
    setHydrated,
  } = useCodeForgeStore();

  // Local component states
  const [language, setLanguage] = useState<SupportedLanguage>("cpp");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [code, setCode] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<"description" | "editor" | "results">("description");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<RunnerResponse | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [lastPassedRuntime, setLastPassedRuntime] = useState(0);
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>("idle");

  const editorRef = useRef<CodeEditorHandle>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Pyodide status listener
  useEffect(() => {
    const unsubscribe = pythonRunner.subscribeStatus((status) => {
      setPyodideStatus(status);
    });
    return unsubscribe;
  }, []);

  // When switching to Python3, preload Pyodide lazily
  useEffect(() => {
    if (language === "python3") {
      pythonRunner.preload();
    }
  }, [language]);

  // Load code drafts or starter code
  useEffect(() => {
    if (!problem) return;
    const savedDraft = userCodeDrafts[problem.slug]?.[language];
    if (savedDraft) {
      setCode(savedDraft);
    } else {
      setCode(getStarterCode(problem, language));
    }
    setResults(null);
  }, [problem, language, userCodeDrafts]);

  const nextSlug = useMemo(() => {
    if (!problem) return undefined;
    const currentIndex = problems.findIndex((p) => p.slug === problem.slug);
    if (currentIndex >= 0 && currentIndex < problems.length - 1) {
      return problems[currentIndex + 1].slug;
    }
    return undefined;
  }, [problem]);

  const prevSlug = useMemo(() => {
    if (!problem) return undefined;
    const currentIndex = problems.findIndex((p) => p.slug === problem.slug);
    if (currentIndex > 0) {
      return problems[currentIndex - 1].slug;
    }
    return undefined;
  }, [problem]);

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Problem Not Found</h1>
        <p className="text-sm text-gray-400">The requested problem could not be found.</p>
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forge-cyan text-background font-semibold text-sm"
        >
          Return to Problems Directory
        </Link>
      </div>
    );
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    saveCodeDraft(problem.slug, language, newCode);
  };

  const handleResetCode = () => {
    if (window.confirm("Reset your solution to the original starter template?")) {
      const initialCode = getStarterCode(problem, language);
      setCode(initialCode);
      saveCodeDraft(problem.slug, language, initialCode);
      setResults(null);
    }
  };

  const runWithLanguage = async (testCasesToRun: typeof problem.testCases): Promise<RunnerResponse> => {
    if (language === "javascript") {
      return await jsRunner.run(code, problem.functionName, testCasesToRun);
    } else if (language === "typescript") {
      return await tsRunner.run(code, problem.functionName, testCasesToRun);
    } else if (language === "python3") {
      return await pythonRunner.run(code, problem.functionName, testCasesToRun);
    } else {
      judge0Runner.setLanguage(language);
      return await judge0Runner.run(code, problem.functionName, testCasesToRun);
    }
  };

  const handleRunSampleTests = async () => {
    setIsRunning(true);
    setMobileTab("results");

    const sampleCases = problem.testCases.filter((tc) => !tc.isHidden);

    try {
      const res = await runWithLanguage(sampleCases);
      setResults(res);
    } catch (e: any) {
      setResults({
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: e?.message || "Execution failed",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setMobileTab("results");

    try {
      const res = await runWithLanguage(problem.testCases);
      setResults(res);

      recordSubmission(
        problem.slug,
        problem.title,
        language,
        res.status === "success" ? "passed" : res.status === "tle" ? "tle" : "failed",
        res.totalRuntime,
        code
      );

      if (res.allPassed) {
        markProblemSolved(problem.slug, problem.title, language, res.totalRuntime, code);
        setLastPassedRuntime(res.totalRuntime);
        setCelebrationOpen(true);
      }
    } catch (e: any) {
      setResults({
        results: [],
        status: "error",
        totalRuntime: 0,
        allPassed: false,
        logs: [],
        errorSummary: e?.message || "Submit failed",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const isSolved = Boolean(solvedProblems[problem.slug]);
  const currentLangMeta = LEETCODE_LANGUAGES.find((l) => l.id === language);

  const col1 = LEETCODE_LANGUAGES.filter((l) => l.column === 1);
  const col2 = LEETCODE_LANGUAGES.filter((l) => l.column === 2);
  const col3 = LEETCODE_LANGUAGES.filter((l) => l.column === 3);

  return (
    <div
      className={`flex flex-col w-full ${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : "min-h-[calc(100vh-4rem)]"
      }`}
    >
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-surface-border bg-surface/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Problems</span>
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 font-semibold">#{problem.id}</span>
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {problem.title}
          </span>
          <DifficultyBadge difficulty={problem.difficulty} />
          {isSolved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Solved</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {prevSlug && (
            <Link
              href={`/problems/${prevSlug}`}
              title="Previous Problem"
              className="p-1.5 rounded-lg border border-surface-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          {nextSlug && (
            <Link
              href={`/problems/${nextSlug}`}
              title="Next Problem"
              className="p-1.5 rounded-lg border border-surface-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-surface-border bg-surface/90 text-xs font-mono">
        <button
          onClick={() => setMobileTab("description")}
          className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
            mobileTab === "description"
              ? "border-forge-cyan text-forge-cyan bg-surface-secondary/50"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
            mobileTab === "editor"
              ? "border-forge-cyan text-forge-cyan bg-surface-secondary/50"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setMobileTab("results")}
          className={`flex-1 py-2.5 text-center font-medium border-b-2 transition-colors ${
            mobileTab === "results"
              ? "border-forge-cyan text-forge-cyan bg-surface-secondary/50"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Results {results ? `(${results.allPassed ? "Pass" : "Fail"})` : ""}
        </button>
      </div>

      {/* Main Split Grid Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Problem Description, Examples, Hints */}
        <div
          className={`lg:col-span-5 border-r border-surface-border p-4 sm:p-6 overflow-y-auto space-y-6 ${
            mobileTab === "description" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-surface-secondary border border-surface-border text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
          </div>

          {/* Examples */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Examples
            </h3>
            {problem.examples.map((ex, i) => (
              <div
                key={ex.id || i}
                className="p-3.5 rounded-xl border border-surface-border bg-surface-secondary/40 font-mono text-xs space-y-1.5"
              >
                <div className="text-gray-400 font-semibold">Example {i + 1}:</div>
                <div>
                  <span className="text-gray-500">Input: </span>
                  <span className="text-gray-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-gray-500">Output: </span>
                  <span className="text-emerald-400">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="pt-1 text-gray-400 text-[11px] leading-relaxed">
                    <span className="text-gray-500">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Constraints
            </h3>
            <ul className="list-disc list-inside space-y-1 font-mono text-xs text-gray-400">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Collapsible Hints */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-surface-border">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-forge-amber" />
                <span>Hints ({problem.hints.length})</span>
              </h3>
              <div className="space-y-2">
                {problem.hints.map((hint, idx) => {
                  const isOpen = openHints[idx];
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-surface-border bg-surface-secondary/30 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenHints((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        <span>Hint {idx + 1}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3 pt-1 text-xs text-gray-300 font-sans leading-relaxed border-t border-surface-border/50">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Results */}
        <div
          className={`lg:col-span-7 flex flex-col bg-surface/30 overflow-hidden ${
            mobileTab === "description" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Editor Header Bar */}
          <div className="border-b border-surface-border bg-surface/90 px-4 py-2 flex flex-wrap items-center justify-between gap-3 relative z-30">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono uppercase text-gray-500 hidden sm:inline flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-forge-cyan" />
                <span>Code</span>
              </span>

              {/* LeetCode-style 3-Column Language Selector Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-surface-border hover:border-forge-cyan/50 text-xs font-mono font-semibold text-white hover:text-forge-cyan transition-all shadow-sm"
                >
                  <span>{currentLangMeta?.name || "C++"}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                      langDropdownOpen ? "rotate-180 text-forge-cyan" : ""
                    }`}
                  />
                </button>

                {/* Floating LeetCode-style 3-Column Menu */}
                {langDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-50 w-[280px] sm:w-[460px] p-2.5 rounded-2xl bg-[#090e1c] border border-surface-border shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-1.5 max-h-[420px] overflow-y-auto">
                    {/* Column 1 */}
                    <div className="space-y-0.5 sm:border-r border-surface-border/50 sm:pr-1.5">
                      {col1.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setLanguage(l.id);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                            language === l.id
                              ? "bg-forge-cyan/15 text-forge-cyan font-bold"
                              : "text-gray-300 hover:text-white hover:bg-surface-secondary/70"
                          }`}
                        >
                          <span>{l.name}</span>
                          {language === l.id && (
                            <Check className="w-3.5 h-3.5 text-forge-cyan shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-0.5 sm:border-r border-surface-border/50 sm:pr-1.5">
                      {col2.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setLanguage(l.id);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                            language === l.id
                              ? "bg-forge-cyan/15 text-forge-cyan font-bold"
                              : "text-gray-300 hover:text-white hover:bg-surface-secondary/70"
                          }`}
                        >
                          <span>{l.name}</span>
                          {language === l.id && (
                            <Check className="w-3.5 h-3.5 text-forge-cyan shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-0.5">
                      {col3.map((l) => (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => {
                            setLanguage(l.id);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                            language === l.id
                              ? "bg-forge-cyan/15 text-forge-cyan font-bold"
                              : "text-gray-300 hover:text-white hover:bg-surface-secondary/70"
                          }`}
                        >
                          <span>{l.name}</span>
                          {language === l.id && (
                            <Check className="w-3.5 h-3.5 text-forge-cyan shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status / Runtime Badge */}
              {language === "python3" ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-secondary border border-surface-border text-[11px] font-mono">
                  {pyodideStatus === "loading" ? (
                    <>
                      <Loader2 className="w-3 h-3 text-forge-amber animate-spin" />
                      <span className="text-forge-amber hidden sm:inline">Loading WASM...</span>
                    </>
                  ) : pyodideStatus === "ready" ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-forge-green" />
                      <span className="text-gray-300 hidden sm:inline">Pyodide 3.12 Ready</span>
                    </>
                  ) : pyodideStatus === "error" ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-rose-400 hidden sm:inline">Pyodide Error</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-400 hidden sm:inline">Pyodide Standby</span>
                    </>
                  )}
                </div>
              ) : language === "javascript" || language === "typescript" ? (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>0ms Sandbox Ready</span>
                </div>
              ) : (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Compiler Ready</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCode}
                title="Reset Code Template"
                className="flex items-center gap-1 text-xs font-mono text-gray-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-surface-secondary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Editor"}
                className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-surface-secondary transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Keys Mobile Toolbar */}
          <MobileToolbar
            onInsertSymbol={(symbol) => {
              editorRef.current?.insertText(symbol);
            }}
          />

          {/* CodeMirror 6 Editor Container */}
          <div
            className={`flex-1 overflow-auto bg-surface/20 ${
              mobileTab === "results" ? "hidden lg:block" : "block"
            }`}
          >
            <CodeEditor
              ref={editorRef}
              value={code}
              onChange={handleCodeChange}
              language={language}
              height={isFullscreen ? "calc(100vh - 280px)" : "420px"}
            />
          </div>

          {/* Action Execution Bar */}
          <div className="border-t border-b border-surface-border bg-surface/90 px-4 py-2.5 flex items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
              Runtime: {currentLangMeta?.runtimeLabel || "Sandboxed Web Worker"}
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleRunSampleTests}
                disabled={isRunning}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-mono text-gray-200 bg-surface-secondary border border-surface-border hover:border-forge-cyan/40 hover:text-forge-cyan active:scale-95 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-forge-cyan" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run Tests</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold font-mono text-background bg-forge-cyan shadow-neon-cyan hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-background" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Test Results & Console Panel */}
          <div
            className={`flex-1 min-h-[220px] max-h-[340px] border-t border-surface-border ${
              mobileTab === "editor" ? "hidden lg:block" : "block"
            }`}
          >
            <TestResultsPanel
              response={results}
              isRunning={isRunning}
              sampleTestCases={problem.testCases.filter((tc) => !tc.isHidden)}
            />
          </div>
        </div>
      </div>

      {/* Celebration Confetti & Dialog on Accepted Solution */}
      <CelebrationOverlay
        isOpen={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        problemTitle={problem.title}
        runtime={lastPassedRuntime}
        nextSlug={nextSlug}
      />
    </div>
  );
}
