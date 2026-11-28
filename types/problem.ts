import { ENABLED_LANGUAGES } from "@/lib/runners/languages.config";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage = string;

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  column: 1 | 2;
  extension: string;
  badge: string;
  runtimeLabel: string;
  isBrowserExecution?: boolean;
  tier?: number;
  version?: string;
}

export const LEETCODE_LANGUAGES: LanguageInfo[] = ENABLED_LANGUAGES.map((l) => ({
  id: l.key,
  name: l.label,
  column: l.isBrowserExecution ? 1 : 2,
  extension: l.extension,
  badge: l.badge,
  runtimeLabel: `${l.label} (${l.version})`,
  isBrowserExecution: l.isBrowserExecution,
  tier: l.tier,
  version: l.version,
}));

// Backwards compatibility alias
export const SUPPORTED_LANGUAGES = LEETCODE_LANGUAGES;

export interface TestCase {
  id: number;
  input: any[];
  expected: any;
  isHidden?: boolean;
  description?: string;
}

export interface ProblemExample {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export type MentorMode = "mentor_bhaiya" | "detective" | "cricket_commentary";
export type HintLanguage = "english" | "hinglish";

export type AIHintFailureReason =
  | "provider_error"
  | "rate_limit"
  | "auth"
  | "model"
  | "parse"
  | "guard"
  | "timeout"
  | "limit_reached"
  | "missing_key";

export interface VisibleTestResultSummary {
  id: number;
  input: string;
  expected: string;
  actual?: string;
  passed: boolean;
  errorMessage?: string;
}

export interface CodeDoctorPayload {
  code: string;
  language: string;
  visibleTests?: VisibleTestResultSummary[];
}

export interface FollowUpMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIHintResponse {
  hint: string;
  followUpQuestion?: string;
  confidence?: number;
  level: 1 | 2 | 3 | 4;
  index: number;
  totalHints: number;
  source: "static" | "ai";
  mode?: MentorMode;
  language?: HintLanguage;
  isFallback?: boolean;
  fallbackReason?: string;
  reason?: AIHintFailureReason;
  isCached?: boolean;
  followUpsRemaining?: number;
}

export interface ProblemIOTest {
  id: number;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string;
}

export interface ProblemIOSpec {
  inputFormat: string;
  outputFormat: string;
  tests: ProblemIOTest[];
  numericTolerance?: number;
  starterTemplates?: Partial<Record<SupportedLanguage, string>>;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  hintsHinglish?: string[];
  hintTopic?: string;
  functionName: string;
  starterCode: {
    javascript: string;
    python: string;
    [key: string]: string | undefined;
  };
  testCases: TestCase[];
  ioSpec?: ProblemIOSpec;
}
