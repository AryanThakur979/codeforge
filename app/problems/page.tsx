"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Trophy, CheckCircle2, Circle, Flame, Sparkles, Shuffle } from "lucide-react";
import { problems } from "@/data/problems";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";
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

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    problems.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, []);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        // Search query
        const query = search.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.slug.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Difficulty filter
        if (selectedDifficulty !== "All" && p.difficulty !== selectedDifficulty) {
          return false;
        }

        // Tag filter
        if (selectedTag !== "All" && !p.tags.includes(selectedTag)) {
          return false;
        }

        // Solved status filter
        const isSolved = Boolean(solvedProblems[p.slug]);
        if (statusFilter === "Solved" && !isSolved) return false;
        if (statusFilter === "Unsolved" && isSolved) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "id") return Number(a.id) - Number(b.id);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "difficulty") {
          const rank = { Easy: 1, Medium: 2, Hard: 3 };
          return rank[a.difficulty] - rank[b.difficulty];
        }
        return 0;
      });
  }, [search, selectedDifficulty, selectedTag, statusFilter, sortBy, solvedProblems]);

  const solvedCount = Object.keys(solvedProblems).length;
  const totalCount = problems.length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  const handlePickRandom = () => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    router.push(`/problems/${problems[randomIndex].slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-surface-border bg-gradient-to-r from-surface via-surface-secondary to-surface p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-glow-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-forge-cyan/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider">
              Problem Directory • {totalCount} Handcrafted Challenges
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Algorithmic Problem Archive
            </h1>
            <p className="text-sm text-gray-400 max-w-xl">
              Sharpen your intuition across foundational data structures and patterns. Instant in-browser testing, 0ms backend latency.
            </p>
          </div>

          {/* Quick Solved Stats Bar & Random Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface/80 border border-surface-border p-4 rounded-2xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-forge-amber" />
                <span className="text-sm font-semibold text-white">
                  {solvedCount} / {totalCount} Solved
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-surface-secondary border border-surface-border hover:border-forge-cyan/40 hover:text-forge-cyan transition-all"
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
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems, topics, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface/60 border border-surface-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-cyan/50 focus:ring-1 focus:ring-forge-cyan/50 transition-all"
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
                    : "text-gray-400 hover:text-white"
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
                    ? "bg-surface-secondary text-white font-semibold shadow-sm"
                    : "text-gray-400 hover:text-white"
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
              className="w-full py-2.5 px-3 rounded-xl bg-surface/60 border border-surface-border text-xs text-gray-300 focus:outline-none focus:border-forge-cyan/50"
            >
              <option value="id">Sort by: Problem #</option>
              <option value="title">Sort by: Title</option>
              <option value="difficulty">Sort by: Difficulty</option>
            </select>
          </div>
        </div>

        {/* Topic Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-gray-500 font-mono text-[11px] uppercase mr-1">Topics:</span>
          <button
            onClick={() => setSelectedTag("All")}
            className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
              selectedTag === "All"
                ? "bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30 font-semibold"
                : "bg-surface/60 text-gray-400 border border-surface-border hover:text-white"
            }`}
          >
            All Topics
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "All" : tag)}
              className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? "bg-forge-cyan/15 text-forge-cyan border border-forge-cyan/30 font-semibold"
                  : "bg-surface/60 text-gray-400 border border-surface-border hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List / Cards */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-surface-border bg-surface/30 backdrop-blur-md space-y-3">
            <Filter className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No matching problems found</h3>
            <p className="text-xs text-gray-400">
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
            {filteredProblems.map((prob, idx) => (
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
    </div>
  );
}
