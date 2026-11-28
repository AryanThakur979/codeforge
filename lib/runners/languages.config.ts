/**
 * Centralized Language & Compiler Configuration for CodeForge
 * Verified against live Judge0 CE endpoint: GET https://ce.judge0.com/languages
 */

export type SupportedLanguageKey =
  | "python3"
  | "javascript"
  | "typescript"
  | "cpp"
  | "java"
  | "c";

export interface LanguageConfig {
  key: SupportedLanguageKey;
  label: string;
  providerLanguageId: number;
  editorMode: "python" | "javascript" | "typescript" | "cpp" | "java" | "c";
  version: string;
  runtimeLabel: string;
  isBrowserExecution: boolean;
  enabled: boolean;
  column: 1 | 2;
  badge: string;
  extension: string;
  starterTemplate: (problemTitle?: string) => string;
}

export const LANGUAGES_CONFIG: LanguageConfig[] = [
  // Column 1: Client In-Browser Runtimes (Zero Cloud Latency, Zero API Limits)
  {
    key: "python3",
    label: "Python 3",
    providerLanguageId: 100, // Python (3.12.5) on Judge0 CE
    editorMode: "python",
    version: "3.12.4",
    runtimeLabel: "Python 3.12 (In-Browser Pyodide WASM)",
    isBrowserExecution: true,
    enabled: true,
    column: 1,
    badge: "Pyodide WASM",
    extension: ".py",
    starterTemplate: () => `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    # Read input data and solve
    # Output result to stdout
    pass

if __name__ == "__main__":
    solve()
`,
  },
  {
    key: "javascript",
    label: "JavaScript",
    providerLanguageId: 102, // JavaScript (Node.js 22.08.0) on Judge0 CE
    editorMode: "javascript",
    version: "Node.js 22.8",
    runtimeLabel: "JavaScript (Node.js 22 Compatible Worker)",
    isBrowserExecution: true,
    enabled: true,
    column: 1,
    badge: "0ms Worker",
    extension: ".js",
    starterTemplate: () => `const fs = require("fs");

function solve() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Read input tokens and solve
    // console.log(result);
}

solve();
`,
  },
  {
    key: "typescript",
    label: "TypeScript",
    providerLanguageId: 101, // TypeScript (5.6.2) on Judge0 CE
    editorMode: "typescript",
    version: "5.6.2",
    runtimeLabel: "TypeScript 5.6 (Client-Side Worker)",
    isBrowserExecution: true,
    enabled: true,
    column: 1,
    badge: "TS 5.6",
    extension: ".ts",
    starterTemplate: () => `const fs = require("fs");

function solve(): void {
    const input: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Read input tokens and solve
}

solve();
`,
  },

  // Column 2: Server-Side Cloud Compilers (GCC 14.1 / OpenJDK 17)
  {
    key: "cpp",
    label: "C++ (GCC 14.1)",
    providerLanguageId: 105, // C++ (GCC 14.1.0) on Judge0 CE
    editorMode: "cpp",
    version: "GCC 14.1.0",
    runtimeLabel: "C++ (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
    enabled: true,
    column: 2,
    badge: "GCC 14.1",
    extension: ".cpp",
    starterTemplate: () => `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read input from cin
    // Print result to cout

    return 0;
}
`,
  },
  {
    key: "java",
    label: "Java (OpenJDK 17)",
    providerLanguageId: 91, // Java (JDK 17.0.6) on Judge0 CE
    editorMode: "java",
    version: "OpenJDK 17.0.6",
    runtimeLabel: "Java (OpenJDK 17.0.6 Cloud)",
    isBrowserExecution: false,
    enabled: true,
    column: 2,
    badge: "JDK 17",
    extension: ".java",
    starterTemplate: () => `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        // Read input using Scanner or BufferedReader
        // System.out.println(result);
    }
}
`,
  },
  {
    key: "c",
    label: "C (GCC 14.1)",
    providerLanguageId: 103, // C (GCC 14.1.0) on Judge0 CE
    editorMode: "c",
    version: "GCC 14.1.0",
    runtimeLabel: "C (GCC 14.1.0 Cloud)",
    isBrowserExecution: false,
    enabled: true,
    column: 2,
    badge: "GCC 14.1",
    extension: ".c",
    starterTemplate: () => `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Read input using scanf
    // Print result using printf
    return 0;
}
`,
  },
];

export const LANGUAGES_MAP: Record<string, LanguageConfig> = Object.fromEntries(
  LANGUAGES_CONFIG.map((l) => [l.key, l])
);

// Map old "python" alias to "python3"
LANGUAGES_MAP["python"] = LANGUAGES_MAP["python3"];

export function getLanguageConfig(key: string): LanguageConfig {
  const normKey = key === "python" ? "python3" : key;
  return LANGUAGES_MAP[normKey] || LANGUAGES_MAP["python3"];
}

export function isLanguageEnabled(key: string): boolean {
  const cfg = getLanguageConfig(key);
  return cfg ? cfg.enabled : false;
}
