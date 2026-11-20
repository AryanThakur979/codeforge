import { Problem } from "@/types/problem";

export interface AIHintResponse {
  hint: string;
  index: number;
  totalHints: number;
  source: "static" | "ai";
}

/**
 * Placeholder AI Hint system.
 * Returns handcrafted progressive hints for the given problem.
 * Ready for future extension via serverless AI API endpoint.
 */
export async function getHint(
  problem: Problem,
  hintIndex = 0
): Promise<AIHintResponse> {
  const hints = problem.hints || [];
  const safeIndex = Math.min(hintIndex, hints.length - 1);

  if (hints.length === 0 || safeIndex < 0) {
    return {
      hint: "Think about the problem constraints and edge cases. What data structure allows fastest lookups?",
      index: 0,
      totalHints: 1,
      source: "static",
    };
  }

  return {
    hint: hints[safeIndex],
    index: safeIndex,
    totalHints: hints.length,
    source: "static",
  };
}
