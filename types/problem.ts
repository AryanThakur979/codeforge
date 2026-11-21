export type Difficulty = "Easy" | "Medium" | "Hard";

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "java"
  | "c";

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  shortName: string;
  badge: string;
  extension: string;
  runtimeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: "javascript",
    name: "JavaScript (ES6+)",
    shortName: "JS",
    badge: "Worker (0ms)",
    extension: ".js",
    runtimeLabel: "Sandboxed Web Worker (3s Guard)",
  },
  {
    id: "typescript",
    name: "TypeScript (v5.6)",
    shortName: "TS",
    badge: "Worker / TS 5.6",
    extension: ".ts",
    runtimeLabel: "Client-Side Worker (Instant TS)",
  },
  {
    id: "python",
    name: "Python 3 (Pyodide WASM)",
    shortName: "PY",
    badge: "Pyodide WASM",
    extension: ".py",
    runtimeLabel: "Pyodide 3.12 (In-Browser WebAssembly)",
  },
  {
    id: "cpp",
    name: "C++ (GCC 14.1)",
    shortName: "C++",
    badge: "GCC 14",
    extension: ".cpp",
    runtimeLabel: "Compiler: GCC 14.1.0 (Zero-Cost Judge0)",
  },
  {
    id: "java",
    name: "Java (JDK 17)",
    shortName: "JAVA",
    badge: "JDK 17",
    extension: ".java",
    runtimeLabel: "Compiler: OpenJDK 17.0.6 (Zero-Cost Judge0)",
  },
  {
    id: "c",
    name: "C (GCC 14.1)",
    shortName: "C",
    badge: "GCC 14",
    extension: ".c",
    runtimeLabel: "Compiler: GCC 14.1.0 (Zero-Cost Judge0)",
  },
];

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
  functionName: string;
  starterCode: {
    javascript: string;
    python: string;
    typescript?: string;
    cpp?: string;
    java?: string;
    c?: string;
    [key: string]: string | undefined;
  };
  testCases: TestCase[];
}
