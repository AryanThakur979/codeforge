/**
 * Centralized Language & Compiler Configuration for CodeForge
 * 
 * Judge0 Language IDs verified from live endpoint GET https://ce.judge0.com/languages
 * Real compiler versions:
 * - Python: Python 3.12.5 (ID 100) / In-Browser Pyodide 3.12
 * - JavaScript: Node.js 22.08.0 (ID 102) / In-Browser Sandboxed Web Worker
 * - TypeScript: TypeScript 5.6.2 (ID 101) / Client-Side Worker
 * - C++: GCC 14.1.0 (ID 105)
 * - Java: OpenJDK 17.0.6 (ID 91)
 * - C: GCC 14.1.0 (ID 103)
 */

export interface LanguageMeta {
  id: string;
  name: string;
  extension: string;
  badge: string;
  runtimeLabel: string;
  isBrowserExecution: boolean;
  judge0Id: number;
  judge0Version: string;
  description: string;
}

export const VERIFIED_LANGUAGES: LanguageMeta[] = [
  {
    id: "python3",
    name: "Python 3",
    extension: ".py",
    badge: "Pyodide WASM",
    runtimeLabel: "Python 3.12 (In-Browser Pyodide WASM)",
    isBrowserExecution: true,
    judge0Id: 100, // Python (3.12.5) on Judge0 CE
    judge0Version: "Python 3.12.5",
    description: "Instant in-browser Python 3.12 powered by Pyodide WebAssembly with zero rate limits.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    badge: "Web Worker",
    runtimeLabel: "JavaScript (Node.js 22 Compatible Worker)",
    isBrowserExecution: true,
    judge0Id: 102, // JavaScript (Node.js 22.08.0) on Judge0 CE
    judge0Version: "Node.js 22.08.0",
    description: "Sandboxed client-side Web Worker execution with 0ms latency and deep assertions.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: ".ts",
    badge: "TS 5.6",
    runtimeLabel: "TypeScript 5.6 (Client-Side Worker)",
    isBrowserExecution: true,
    judge0Id: 101, // TypeScript (5.6.2) on Judge0 CE
    judge0Version: "TypeScript 5.6.2",
    description: "Client-side TypeScript execution with static types stripped in-browser.",
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    badge: "GCC 14.1",
    runtimeLabel: "C++ (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
    judge0Id: 105, // C++ (GCC 14.1.0) on Judge0 CE
    judge0Version: "GCC 14.1.0",
    description: "High-performance C++ compiled and executed with GCC 14.1.0 on zero-cost cloud.",
  },
  {
    id: "java",
    name: "Java",
    extension: ".java",
    badge: "JDK 17",
    runtimeLabel: "Java (OpenJDK 17.0.6 Cloud)",
    isBrowserExecution: false,
    judge0Id: 91, // Java (JDK 17.0.6) on Judge0 CE
    judge0Version: "OpenJDK 17.0.6",
    description: "Modern Java solutions executed on OpenJDK 17 LTS on zero-cost cloud.",
  },
  {
    id: "c",
    name: "C",
    extension: ".c",
    badge: "GCC 14.1",
    runtimeLabel: "C (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
    judge0Id: 103, // C (GCC 14.1.0) on Judge0 CE
    judge0Version: "GCC 14.1.0",
    description: "Pure C compiled with GCC 14.1.0 with memory-guarded execution.",
  },
];

export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python3: 100,    // Python (3.12.5)
  python: 100,     // Alias: Python 3 (3.12.5) - Never Python 2.7!
  javascript: 102, // JavaScript (Node.js 22.08.0)
  typescript: 101, // TypeScript (5.6.2)
  cpp: 105,        // C++ (GCC 14.1.0)
  java: 91,        // Java (JDK 17.0.6)
  c: 103,          // C (GCC 14.1.0)
};

export function getLanguageMeta(lang: string): LanguageMeta {
  const normalized = lang === "python" ? "python3" : lang;
  return (
    VERIFIED_LANGUAGES.find((l) => l.id === normalized) || {
      id: "python3",
      name: "Python 3",
      extension: ".py",
      badge: "Pyodide WASM",
      runtimeLabel: "Python 3.12 (In-Browser Pyodide WASM)",
      isBrowserExecution: true,
      judge0Id: 100,
      judge0Version: "Python 3.12.5",
      description: "Python 3 execution",
    }
  );
}
