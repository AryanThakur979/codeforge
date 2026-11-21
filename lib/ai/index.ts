import { Problem, MentorMode, HintLanguage } from "@/types/problem";

export interface AIHintResponse {
  hint: string;
  level: 1 | 2 | 3 | 4;
  index: number; // 0 to 3 for backward compatibility
  totalHints: number;
  source: "static" | "ai";
  mode?: MentorMode;
  language?: HintLanguage;
  isFallback?: boolean;
  fallbackReason?: string;
  isCached?: boolean;
}

export interface GetHintOptions {
  level?: 1 | 2 | 3 | 4;
  mode?: MentorMode;
  language?: HintLanguage;
  code?: string;
  lookAtCode?: boolean;
}

/**
 * AI Hint System with Handcrafted Fallback.
 * Connects to the serverless /api/hint endpoint, with automatic
 * graceful degradation to handcrafted 4-level hint ladders.
 */
export async function getHint(
  problem: Problem,
  hintIndexOrOptions: number | GetHintOptions = 0,
  maybeOptions?: GetHintOptions
): Promise<AIHintResponse> {
  let level: 1 | 2 | 3 | 4 = 1;
  let mode: MentorMode = "mentor_bhaiya";
  let language: HintLanguage = "hinglish";
  let code = "";
  let lookAtCode = false;

  if (typeof hintIndexOrOptions === "number") {
    level = Math.min(Math.max(hintIndexOrOptions + 1, 1), 4) as 1 | 2 | 3 | 4;
    if (maybeOptions) {
      if (maybeOptions.mode) mode = maybeOptions.mode;
      if (maybeOptions.language) language = maybeOptions.language;
      if (maybeOptions.code) code = maybeOptions.code;
      if (maybeOptions.lookAtCode) lookAtCode = maybeOptions.lookAtCode;
    }
  } else if (typeof hintIndexOrOptions === "object" && hintIndexOrOptions !== null) {
    if (hintIndexOrOptions.level) level = hintIndexOrOptions.level;
    if (hintIndexOrOptions.mode) mode = hintIndexOrOptions.mode;
    if (hintIndexOrOptions.language) language = hintIndexOrOptions.language;
    if (hintIndexOrOptions.code) code = hintIndexOrOptions.code;
    if (hintIndexOrOptions.lookAtCode) lookAtCode = hintIndexOrOptions.lookAtCode;
  }

  const staticHints = problem.hints || [];
  const staticFallbackHint =
    staticHints[level - 1] ||
    staticHints[0] ||
    "Think about the problem constraints and edge cases. What data structure allows fastest lookups?";

  // If in browser, attempt fetching from /api/hint
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemSlug: problem.slug,
          level,
          mode,
          language,
          code: lookAtCode ? code : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          hint: data.hint || staticFallbackHint,
          level,
          index: level - 1,
          totalHints: 4,
          source: data.source || "ai",
          mode,
          language,
          isFallback: Boolean(data.isFallback),
          fallbackReason: data.fallbackReason,
          isCached: Boolean(data.isCached),
        };
      }

      // Handle 429 rate limits or other server errors
      if (response.status === 429) {
        const errData = await response.json().catch(() => ({}));
        return {
          hint: errData.hint || staticFallbackHint,
          level,
          index: level - 1,
          totalHints: 4,
          source: "static",
          isFallback: true,
          fallbackReason: errData.fallbackReason || "AI hints are resting for today, here is a built-in hint.",
        };
      }
    } catch {
      // Network error or offline fallback
    }
  }

  // Static Fallback
  return {
    hint: staticFallbackHint,
    level,
    index: level - 1,
    totalHints: Math.max(staticHints.length, 4),
    source: "static",
    mode,
    language,
    isFallback: true,
    fallbackReason: "AI hints are resting for today, here is a built-in hint.",
  };
}
