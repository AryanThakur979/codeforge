export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage =
  | "python3"
  | "python"
  | "javascript"
  | "typescript"
  | "cpp"
  | "java"
  | "c";

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  column: 1 | 2;
  extension: string;
  badge: string;
  runtimeLabel: string;
  isBrowserExecution?: boolean;
}

export const LEETCODE_LANGUAGES: LanguageInfo[] = [
  // Column 1: High-Speed In-Browser Client Engines (0ms Network Latency)
  {
    id: "python3",
    name: "Python 3",
    column: 1,
    extension: ".py",
    badge: "Pyodide WASM",
    runtimeLabel: "Python 3.12 (In-Browser Pyodide WASM)",
    isBrowserExecution: true,
  },
  {
    id: "javascript",
    name: "JavaScript",
    column: 1,
    extension: ".js",
    badge: "0ms Worker",
    runtimeLabel: "JavaScript (Node.js 22 Compatible Worker)",
    isBrowserExecution: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    column: 1,
    extension: ".ts",
    badge: "TS 5.6",
    runtimeLabel: "TypeScript 5.6 (Client-Side Worker)",
    isBrowserExecution: true,
  },

  // Column 2: Zero-Cost Cloud Compilers (GCC 14.1 / OpenJDK 17)
  {
    id: "cpp",
    name: "C++",
    column: 2,
    extension: ".cpp",
    badge: "GCC 14.1",
    runtimeLabel: "C++ (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
  },
  {
    id: "java",
    name: "Java",
    column: 2,
    extension: ".java",
    badge: "JDK 17",
    runtimeLabel: "Java (OpenJDK 17.0.6 Cloud)",
    isBrowserExecution: false,
  },
  {
    id: "c",
    name: "C",
    column: 2,
    extension: ".c",
    badge: "GCC 14.1",
    runtimeLabel: "C (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
  },
];

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
}
