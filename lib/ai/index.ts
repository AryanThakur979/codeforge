import {
  Problem,
  MentorMode,
  HintLanguage,
  AIHintFailureReason,
  AIHintResponse,
  VisibleTestResultSummary,
  FollowUpMessage,
} from "@/types/problem";

export type { AIHintResponse };

export interface GetHintOptions {
  level?: 1 | 2 | 3 | 4;
  mode?: MentorMode;
  language?: HintLanguage;
  code?: string;
  codeLanguage?: string;
  visibleTests?: VisibleTestResultSummary[];
  lookAtCode?: boolean;
  followUpText?: string;
  history?: FollowUpMessage[];
}

/**
 * Helper to select the accurate static hint matching the student's language.
 */
export function getStaticHintForProblem(
  problem: Problem,
  level: 1 | 2 | 3 | 4,
  language: HintLanguage
): string {
  const hintsArray =
    language === "hinglish" && Array.isArray(problem.hintsHinglish) && problem.hintsHinglish.length > 0
      ? problem.hintsHinglish
      : problem.hints || [];

  return (
    hintsArray[level - 1] ||
    hintsArray[0] ||
    "Think about the problem constraints and edge cases. What data structure allows fastest lookups?"
  );
}

/**
 * AI Hint System with Handcrafted Fallback.
 * Connects to the serverless /api/hint endpoint with two-pass generation,
 * structured JSON output, Code Doctor 2.0, follow-up chat, and safe Hinglish fallbacks.
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
  let codeLanguage = "javascript";
  let visibleTests: VisibleTestResultSummary[] | undefined;
  let lookAtCode = false;
  let followUpText: string | undefined;
  let history: FollowUpMessage[] | undefined;

  if (typeof hintIndexOrOptions === "number") {
    level = Math.min(Math.max(hintIndexOrOptions + 1, 1), 4) as 1 | 2 | 3 | 4;
    if (maybeOptions) {
      if (maybeOptions.mode) mode = maybeOptions.mode;
      if (maybeOptions.language) language = maybeOptions.language;
      if (maybeOptions.code) code = maybeOptions.code;
      if (maybeOptions.codeLanguage) codeLanguage = maybeOptions.codeLanguage;
      if (maybeOptions.visibleTests) visibleTests = maybeOptions.visibleTests;
      if (maybeOptions.lookAtCode) lookAtCode = maybeOptions.lookAtCode;
      if (maybeOptions.followUpText) followUpText = maybeOptions.followUpText;
      if (maybeOptions.history) history = maybeOptions.history;
    }
  } else if (typeof hintIndexOrOptions === "object" && hintIndexOrOptions !== null) {
    if (hintIndexOrOptions.level) level = hintIndexOrOptions.level;
    if (hintIndexOrOptions.mode) mode = hintIndexOrOptions.mode;
    if (hintIndexOrOptions.language) language = hintIndexOrOptions.language;
    if (hintIndexOrOptions.code) code = hintIndexOrOptions.code;
    if (hintIndexOrOptions.codeLanguage) codeLanguage = hintIndexOrOptions.codeLanguage;
    if (hintIndexOrOptions.visibleTests) visibleTests = hintIndexOrOptions.visibleTests;
    if (hintIndexOrOptions.lookAtCode) lookAtCode = hintIndexOrOptions.lookAtCode;
    if (hintIndexOrOptions.followUpText) followUpText = hintIndexOrOptions.followUpText;
    if (hintIndexOrOptions.history) history = hintIndexOrOptions.history;
  }

  const staticFallbackHint = getStaticHintForProblem(problem, level, language);

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
          codeLanguage: lookAtCode ? codeLanguage : undefined,
          visibleTests: lookAtCode ? visibleTests : undefined,
          followUpText,
          history,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          hint: data.hint || staticFallbackHint,
          followUpQuestion: data.followUpQuestion,
          confidence: data.confidence,
          level,
          index: level - 1,
          totalHints: 4,
          source: data.source || "ai",
          mode,
          language,
          isFallback: Boolean(data.isFallback),
          fallbackReason: data.fallbackReason || (data.isFallback ? "Built-in hint (AI unavailable right now)" : undefined),
          reason: data.reason,
          isCached: Boolean(data.isCached),
          followUpsRemaining: data.followUpsRemaining,
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
          fallbackReason: errData.fallbackReason || "Built-in hint (AI unavailable right now)",
          reason: errData.reason || "rate_limit",
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
    totalHints: 4,
    source: "static",
    mode,
    language,
    isFallback: true,
    fallbackReason: "Built-in hint (AI unavailable right now)",
    reason: "provider_error",
  };
}
