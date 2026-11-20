import { Difficulty } from "@/types/problem";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles = {
    Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]",
    Medium: "text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    Hard: "text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
