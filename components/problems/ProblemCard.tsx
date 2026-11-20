"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Code } from "lucide-react";
import { Problem } from "@/types/problem";
import { DifficultyBadge } from "./DifficultyBadge";

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
  index: number;
}

export function ProblemCard({ problem, isSolved, index }: ProblemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={`group relative rounded-xl border p-5 transition-all duration-200 ${
        isSolved
          ? "border-emerald-500/40 bg-surface/80 shadow-[0_0_15px_rgba(16,185,129,0.12)]"
          : "border-surface-border bg-surface/40 hover:bg-surface-secondary/70 hover:border-forge-cyan/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Solved Icon or Problem Number */}
          <div className="mt-0.5 shrink-0">
            {isSolved ? (
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-secondary border border-surface-border text-gray-400 font-mono text-xs font-semibold group-hover:border-forge-cyan/40 group-hover:text-forge-cyan transition-colors">
                #{problem.id}
              </div>
            )}
          </div>

          {/* Title & Tags */}
          <div className="min-w-0 space-y-1.5">
            <Link
              href={`/problems/${problem.slug}`}
              className="text-base font-bold text-white group-hover:text-forge-cyan transition-colors block truncate"
            >
              {problem.title}
            </Link>

            <div className="flex flex-wrap items-center gap-1.5">
              {problem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-surface-secondary/80 border border-surface-border text-[11px] font-mono text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Difficulty Badge & CTA Arrow */}
        <div className="flex items-center gap-3 shrink-0">
          <DifficultyBadge difficulty={problem.difficulty} />
          <Link
            href={`/problems/${problem.slug}`}
            aria-label={`Solve ${problem.title}`}
            className="p-2 rounded-lg bg-surface-secondary/60 border border-surface-border text-gray-400 group-hover:text-forge-cyan group-hover:border-forge-cyan/30 group-hover:bg-forge-cyan/10 transition-all"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
