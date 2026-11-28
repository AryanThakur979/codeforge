"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Trophy,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { problems } from "@/data/problems";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";
import { SUPPORTED_LANGUAGES_COUNT } from "@/lib/runners/languages.config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const router = useRouter();
  const { solvedProblems, isHydrated, setHydrated } = useCodeForgeStore();
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Solved" | "Unsolved">("All");
  const [sortBy, setSortBy] = useState<"id" | "title" | "difficulty">("id");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDifficulty, selectedTag, statusFilter, sortBy]);

  // Extract unique tags (top 40 most frequent)
  const allTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    problems.forEach((p) => {
      p.tags.forEach((t) => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 35)
      .map(([tag]) => tag);
  }, []);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        const query = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.slug.toLowerCase().includes(query) ||
          p.id.includes(query);

        if (!matchesSearch) return false;

        if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) {
          return false;
        }

        if (selectedTag !== "All" && !p.tags.includes(selectedTag)) {
          return false;
        }

        const isSolved = Boolean(solvedProblems[p.slug]);
        if (statusFilter === "Solved" && !isSolved) return false;
        if (statusFilter === "Unsolved" && isSolved) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "id") return Number(a.id) - Number(b.id);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "difficulty") {
          const rank: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return (rank[a.difficulty] || 2) - (rank[b.difficulty] || 2);
        }
        return 0;
      });
  }, [search, selectedDifficulty, selectedTag, statusFilter, sortBy, solvedProblems]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / pageSize));

  // Current page slice
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  const solvedCount = Object.keys(solvedProblems).length;
  const totalCount = problems.length;
  const progressPercent = Math.min(100, Math.round((solvedCount / totalCount) * 100));

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    router.push(`/problems/${problems[randomIndex].slug}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-surface-border bg-gradient-to-r from-surface via-surface-secondary to-surface p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-glow-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-forge-cyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider">
              Problem Directory • {totalCount.toLocaleString()} Coding Challenges
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Algorithmic Problem Archive
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 max-w-xl">
              Sharpen your intuition across 3,000+ data structure &amp; algorithm patterns with multi-language execution in {SUPPORTED_LANGUAGES_COUNT}+ verified programming languages including Python 3, JavaScript, TypeScript, C++, Java, Go, Rust, and more.
            </p>
          </div>

          {/* Quick Solved Stats Bar & Random Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface/80 border border-surface-border p-4 rounded-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-forge-amber" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {solvedCount} / {totalCount.toLocaleString()} Solved
                </span>
                <span className="text-xs text-forge-cyan font-mono">({progressPercent}%)</span>
              </div>
              <div className="w-44 h-2 bg-surface-secondary rounded-full overflow-hidden border border-surface-border">
                <div
                  className="h-full bg-gradient-to-r from-forge-cyan to-forge-purple rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handlePickRandom}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary border border-surface-border text-slate-700 dark:text-gray-300 hover:border-forge-cyan/40 hover:text-forge-cyan transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Pick Random</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 3,000+ problems, topics, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-surface-border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-forge-cyan/60 focus:ring-1 focus:ring-forge-cyan/60 transition-all shadow-sm"
            />
          </div>

          {/* Difficulty Segmented Filter */}
          <div className="lg:col-span-3 flex items-center p-1 rounded-xl bg-surface/60 border border-surface-border">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedDifficulty === diff
                    ? "bg-surface-secondary text-forge-cyan font-semibold shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2 flex items-center p-1 rounded-xl bg-surface/60 border border-surface-border">
            {(["All", "Solved", "Unsolved"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  statusFilter === status
                    ? "bg-surface-secondary text-slate-900 dark:text-white font-semibold shadow-sm"
                    : "text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              aria-label="Sort problems by"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-surface border border-surface-border text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-forge-cyan/50 focus:ring-1 focus:ring-forge-cyan/50 cursor-pointer shadow-sm"
            >
              <option value="id" className="bg-surface text-slate-900 dark:text-white py-1">Sort by: Problem #</option>
              <option value="title" className="bg-surface text-slate-900 dark:text-white py-1">Sort by: Title</option>
              <option value="difficulty" className="bg-surface text-slate-900 dark:text-white py-1">Sort by: Difficulty</option>
            </select>
          </div>
        </div>

        {/* Topic Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 dark:text-gray-400 font-mono text-[11px] uppercase mr-1 shrink-0">Popular Topics:</span>
          <button
            onClick={() => setSelectedTag("All")}
            className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all shrink-0 ${
              selectedTag === "All"
                ? "bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30 font-semibold"
                : "bg-surface/60 text-slate-600 hover:text-slate-950 dark:text-gray-400 border border-surface-border dark:hover:text-white"
            }`}
          >
            All Topics ({totalCount})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "All" : tag)}
              className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all shrink-0 ${
                selectedTag === tag
                  ? "bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30 font-semibold"
                  : "bg-surface/60 text-slate-600 hover:text-slate-950 dark:text-gray-400 border border-surface-border dark:hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Counter Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-gray-400 px-1">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredProblems.length)} of {filteredProblems.length.toLocaleString()} problems
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Problems List / Cards */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-surface-border bg-surface/30 backdrop-blur-md space-y-3">
            <Filter className="w-8 h-8 text-slate-400 dark:text-gray-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">No matching problems found</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              Try adjusting your search query, difficulty filters, or topic tags.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedDifficulty("All");
                setSelectedTag("All");
                setStatusFilter("All");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-secondary text-forge-cyan border border-forge-cyan/30 hover:bg-forge-cyan/10 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {paginatedProblems.map((prob, idx) => (
              <ProblemCard
                key={prob.id}
                problem={prob}
                isSolved={Boolean(solvedProblems[prob.slug])}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProblems.length)} of {filteredProblems.length.toLocaleString()} problems
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First Page"
              className="p-2 rounded-lg bg-surface/60 border border-surface-border text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous Page"
              className="p-2 rounded-lg bg-surface/60 border border-surface-border text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {pageNumbers.map((p, i) =>
                typeof p === "number" ? (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`min-w-[36px] h-9 px-2.5 rounded-lg font-medium transition-all ${
                      currentPage === p
                        ? "bg-forge-cyan text-white dark:text-background font-bold shadow-neon-cyan"
                        : "bg-surface/60 border border-surface-border text-slate-700 hover:text-slate-950 dark:text-gray-300 dark:hover:text-white hover:bg-surface-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={`dots-${i}`} className="px-2 text-slate-400 dark:text-gray-500">
                    ...
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next Page"
              className="p-2 rounded-lg bg-surface/60 border border-surface-border text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
              className="p-2 rounded-lg bg-surface/60 border border-surface-border text-slate-600 hover:text-slate-950 dark:text-gray-400 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
