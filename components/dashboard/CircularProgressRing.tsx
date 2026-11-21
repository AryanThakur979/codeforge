"use client";

import { motion } from "framer-motion";

interface CircularProgressRingProps {
  label: string;
  solved: number;
  total: number;
  color: "cyan" | "emerald" | "amber" | "rose";
  size?: number;
}

export function CircularProgressRing({
  label,
  solved,
  total,
  color,
  size = 120,
}: CircularProgressRingProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min(Math.round((solved / total) * 100), 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;

  const colorStyles = {
    cyan: {
      stroke: "var(--accent-cyan)",
      glow: "rgba(2, 132, 199, 0.35)",
      text: "text-forge-cyan",
      bg: "bg-forge-cyan/10",
      border: "border-forge-cyan/30",
    },
    emerald: {
      stroke: "#10B981",
      glow: "rgba(16, 185, 129, 0.35)",
      text: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    amber: {
      stroke: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.35)",
      text: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    rose: {
      stroke: "#F43F5E",
      glow: "rgba(244, 63, 94, 0.35)",
      text: "text-rose-700 dark:text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
    },
  };

  const style = colorStyles[color];

  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-surface/50 border border-surface-border">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-200 dark:text-white/10"
            strokeWidth={strokeWidth}
          />
          {/* Animated active progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={style.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${style.glow})` }}
          />
        </svg>

        {/* Center Text Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">{solved}</span>
          <span className="text-[10px] text-slate-500 dark:text-gray-400 -mt-0.5">/ {total}</span>
        </div>
      </div>

      <div className="mt-3 space-y-0.5">
        <div className={`text-xs font-bold uppercase tracking-wider ${style.text}`}>
          {label}
        </div>
        <div className="text-[11px] font-mono text-slate-600 dark:text-gray-400">{percentage}% Solved</div>
      </div>
    </div>
  );
}
