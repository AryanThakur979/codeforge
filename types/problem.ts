export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage =
  | "cpp"
  | "java"
  | "python3"
  | "python"
  | "javascript"
  | "typescript"
  | "csharp"
  | "c"
  | "go"
  | "kotlin"
  | "swift"
  | "rust"
  | "ruby"
  | "php"
  | "dart"
  | "scala"
  | "elixir"
  | "erlang"
  | "racket";

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  column: 1 | 2 | 3;
  extension: string;
  badge: string;
  runtimeLabel: string;
}

export const LEETCODE_LANGUAGES: LanguageInfo[] = [
  // Column 1
  {
    id: "cpp",
    name: "C++",
    column: 1,
    extension: ".cpp",
    badge: "GCC 14.1",
    runtimeLabel: "Compiler: GCC 14.1.0 (Zero-Cost Cloud)",
  },
  {
    id: "java",
    name: "Java",
    column: 1,
    extension: ".java",
    badge: "JDK 17",
    runtimeLabel: "Compiler: OpenJDK 17.0.6 (Zero-Cost Cloud)",
  },
  {
    id: "python3",
    name: "Python3",
    column: 1,
    extension: ".py",
    badge: "Pyodide WASM",
    runtimeLabel: "Pyodide 3.12 (In-Browser WebAssembly)",
  },
  {
    id: "python",
    name: "Python",
    column: 1,
    extension: ".py",
    badge: "Python 2.7",
    runtimeLabel: "Runtime: Python 2.7.17 (Zero-Cost Cloud)",
  },
  {
    id: "javascript",
    name: "JavaScript",
    column: 1,
    extension: ".js",
    badge: "Worker (0ms)",
    runtimeLabel: "Sandboxed Web Worker (3s Guard)",
  },
  {
    id: "typescript",
    name: "TypeScript",
    column: 1,
    extension: ".ts",
    badge: "TS 5.6",
    runtimeLabel: "Client-Side Worker (Instant TS)",
  },
  {
    id: "csharp",
    name: "C#",
    column: 1,
    extension: ".cs",
    badge: "Mono 6.6",
    runtimeLabel: "Compiler: C# Mono 6.6 (Zero-Cost Cloud)",
  },
  {
    id: "c",
    name: "C",
    column: 1,
    extension: ".c",
    badge: "GCC 14.1",
    runtimeLabel: "Compiler: GCC 14.1.0 (Zero-Cost Cloud)",
  },

  // Column 2
  {
    id: "go",
    name: "Go",
    column: 2,
    extension: ".go",
    badge: "Go 1.23",
    runtimeLabel: "Compiler: Go 1.23.5 (Zero-Cost Cloud)",
  },
  {
    id: "kotlin",
    name: "Kotlin",
    column: 2,
    extension: ".kt",
    badge: "Kotlin 2.1",
    runtimeLabel: "Compiler: Kotlin 2.1.10 (Zero-Cost Cloud)",
  },
  {
    id: "swift",
    name: "Swift",
    column: 2,
    extension: ".swift",
    badge: "Swift 5.2",
    runtimeLabel: "Compiler: Swift 5.2.3 (Zero-Cost Cloud)",
  },
  {
    id: "rust",
    name: "Rust",
    column: 2,
    extension: ".rs",
    badge: "Rust 1.85",
    runtimeLabel: "Compiler: Rust 1.85.0 (Zero-Cost Cloud)",
  },
  {
    id: "ruby",
    name: "Ruby",
    column: 2,
    extension: ".rb",
    badge: "Ruby 2.7",
    runtimeLabel: "Interpreter: Ruby 2.7.0 (Zero-Cost Cloud)",
  },
  {
    id: "php",
    name: "PHP",
    column: 2,
    extension: ".php",
    badge: "PHP 8.3",
    runtimeLabel: "Interpreter: PHP 8.3.11 (Zero-Cost Cloud)",
  },
  {
    id: "dart",
    name: "Dart",
    column: 2,
    extension: ".dart",
    badge: "Dart 2.19",
    runtimeLabel: "Compiler: Dart 2.19.2 (Zero-Cost Cloud)",
  },
  {
    id: "scala",
    name: "Scala",
    column: 2,
    extension: ".scala",
    badge: "Scala 2.13",
    runtimeLabel: "Compiler: Scala 2.13.2 (Zero-Cost Cloud)",
  },

  // Column 3
  {
    id: "elixir",
    name: "Elixir",
    column: 3,
    extension: ".ex",
    badge: "Elixir 1.9",
    runtimeLabel: "Compiler: Elixir 1.9.4 (Zero-Cost Cloud)",
  },
  {
    id: "erlang",
    name: "Erlang",
    column: 3,
    extension: ".erl",
    badge: "OTP 22.2",
    runtimeLabel: "Compiler: Erlang OTP 22.2 (Zero-Cost Cloud)",
  },
  {
    id: "racket",
    name: "Racket",
    column: 3,
    extension: ".rkt",
    badge: "Racket/Lisp",
    runtimeLabel: "Interpreter: Racket / Common Lisp (Zero-Cost Cloud)",
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
