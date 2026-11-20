"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  Circle,
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
  Terminal,
} from "lucide-react";
import { roadmapTopics } from "@/data/roadmap";
import { problems } from "@/data/problems";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";

export default function RoadmapPage() {
  const { solvedProblems, isHydrated, setHydrated } = useCodeForgeStore();

  useEffect(() => {
    setHydrated();
  }, [setHydrated]);

  // Compute solved metrics per roadmap topic
  const topicStats = useMemo(() => {
    const stats: Record<string, { total: number; solved: number; problems: typeof problems }> = {};

    roadmapTopics.forEach((topic) => {
      const matchingProblems = problems.filter((p) =>
        topic.problemTags.some((tag) => p.tags.includes(tag))
      );

      const solvedCount = matchingProblems.filter((p) =>
        Boolean(solvedProblems[p.slug])
      ).length;

      stats[topic.id] = {
        total: matchingProblems.length,
        solved: solvedCount,
        problems: matchingProblems,
      };
    });

    return stats;
  }, [solvedProblems]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-surface-border bg-gradient-to-r from-surface via-surface-secondary to-surface p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-glow-card text-center sm:text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-forge-purple/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-purple/10 border border-forge-purple/30 text-forge-purple text-xs font-mono uppercase tracking-wider">
              Algorithmic Skill Tree • 9 Curated Stages
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Algorithmic Learning Path
            </h1>
            <p className="text-sm text-gray-400 max-w-xl">
              A structured roadmap guiding you from fundamental data structures to advanced dynamic programming patterns.
            </p>
          </div>

          <Link
            href="/problems"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-background bg-forge-cyan shadow-neon-cyan hover:scale-[1.02] active:scale-95 transition-all text-xs font-mono shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice All Topics</span>
          </Link>
        </div>
      </div>

      {/* Visual Node & Line Timeline */}
      <div className="relative space-y-8">
        {/* Central connecting neon line */}
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-0.5 bg-gradient-to-b from-forge-cyan via-forge-purple to-forge-pink opacity-40 pointer-events-none" />

        {roadmapTopics.map((topic, index) => {
          const stats = topicStats[topic.id] || { total: 0, solved: 0, problems: [] };
          const isCompleted = stats.total > 0 && stats.solved === stats.total;
          const isLeft = index % 2 === 0;

          const difficultyBadgeColor =
            topic.difficulty === "Beginner"
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
              : topic.difficulty === "Intermediate"
              ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
              : "text-rose-400 bg-rose-500/10 border-rose-500/30";

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 ${
                isLeft ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content Card */}
              <div className="w-full md:w-[calc(50%-2rem)]">
                <div
                  className={`relative rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-500/40 bg-surface/80 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "border-surface-border bg-surface/50 hover:border-forge-cyan/40 hover:bg-surface-secondary/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Step 0{topic.step} • {topic.category}
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-forge-cyan transition-colors">
                        {topic.title}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${difficultyBadgeColor}`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {topic.description}
                  </p>

                  {/* Problem Pills & Solved Metric */}
                  <div className="space-y-3 pt-3 border-t border-surface-border">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">Mastery Progress</span>
                      <span
                        className={`font-semibold ${
                          isCompleted ? "text-emerald-400" : "text-forge-cyan"
                        }`}
                      >
                        {stats.solved} / {stats.total} Solved
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {stats.problems.map((prob) => {
                        const solved = Boolean(solvedProblems[prob.slug]);
                        return (
                          <Link
                            key={prob.id}
                            href={`/problems/${prob.slug}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                              solved
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                : "bg-surface-secondary border-surface-border text-gray-300 hover:text-white hover:border-forge-cyan/40"
                            }`}
                          >
                            {solved ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3 h-3 text-gray-500 shrink-0" />
                            )}
                            <span className="truncate max-w-[140px]">{prob.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Node Marker */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl bg-surface border-2 border-surface-border shadow-neon-cyan shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-pulse" />
                ) : (
                  <span className="font-mono text-sm font-black text-forge-cyan">
                    0{topic.step}
                  </span>
                )}
              </div>

              {/* Spacer on opposite column */}
              <div className="hidden md:block w-[calc(50%-2rem)]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
