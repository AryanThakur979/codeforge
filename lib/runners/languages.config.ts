/**
 * CodeForge Multi-Language Configuration
 * Supports 30+ general-purpose programming languages verified against Judge0 CE.
 *
 * Languages are partitioned into three distinct tiers:
 * - Tier 1: Core Foundation Languages (In-browser 0ms or top placement runtimes)
 * - Tier 2: Modern & Popular Languages (Go, Rust, C#, Kotlin, Swift, Ruby, PHP, Scala, Dart, Perl, Lua, Haskell, R)
 * - Tier 3: Classic, Systems & Functional Languages (Elixir, Erlang, Clojure, F#, Groovy, D, Fortran, Pascal, Bash, Basic, OCaml, etc.)
 */

import { TIER2_STARTER_TEMPLATES, TIER3_GENERIC_SKELETONS } from "./patternLibrary";

export type LanguageTier = 1 | 2 | 3;
export type SupportedLanguageKey = string;

export interface LanguageConfig {
  key: string;
  label: string;
  providerLanguageId: number;
  version: string;
  tier: LanguageTier;
  editorMode: string;
  starterTemplate: (problemTitle?: string) => string;
  timeMultiplier: number;
  memoryLimit: number; // in KB
  enabled: boolean;
  isBrowserExecution?: boolean;
  badge: string;
  extension: string;
}

import verifiedReport from "@/data/verified-languages.json";

// Read verified results from automated verification report
const verifiedMap: Record<string, boolean> = {};
if (verifiedReport && Array.isArray((verifiedReport as any).languages)) {
  for (const item of (verifiedReport as any).languages) {
    verifiedMap[item.key] = item.enabled;
  }
} else {
  // Default verified baseline if json not loaded
  const defaultKeys = [
    "python3", "javascript", "typescript", "cpp", "c", "java", "go", "rust",
    "csharp", "kotlin", "swift", "ruby", "php", "dart", "perl", "lua", "haskell",
    "elixir", "erlang", "clojure", "fsharp", "groovy", "d", "fortran", "pascal",
    "bash", "basic", "ocaml", "commonlisp", "vbnet", "objectivec", "octave", "assembly"
  ];
  for (const k of defaultKeys) {
    verifiedMap[k] = true;
  }
}

export const ALL_CANDIDATE_LANGUAGES: LanguageConfig[] = [
  // =========================================================================
  // TIER 1: Core Foundation Languages
  // =========================================================================
  {
    key: "python3",
    label: "Python 3",
    providerLanguageId: 100, // Python (3.12.5) on Judge0 CE
    version: "3.12.5",
    tier: 1,
    editorMode: "python",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["python3"] ?? true,
    isBrowserExecution: true,
    badge: "Pyodide WASM",
    extension: ".py",
    starterTemplate: (title = "Solution") => `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Solve problem: ${title}
    # Output result to stdout
    pass

if __name__ == "__main__":
    solve()
`,
  },
  {
    key: "javascript",
    label: "JavaScript",
    providerLanguageId: 102, // JavaScript (Node.js 22.08.0)
    version: "Node.js 22.8",
    tier: 1,
    editorMode: "javascript",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["javascript"] ?? true,
    isBrowserExecution: true,
    badge: "0ms Worker",
    extension: ".js",
    starterTemplate: (title = "Solution") => `const fs = require("fs");

function solve() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Solve problem: ${title}
    // console.log(result);
}

solve();
`,
  },
  {
    key: "typescript",
    label: "TypeScript",
    providerLanguageId: 101, // TypeScript (5.6.2)
    version: "5.6.2",
    tier: 1,
    editorMode: "typescript",
    timeMultiplier: 1.2,
    memoryLimit: 256000,
    enabled: verifiedMap["typescript"] ?? true,
    isBrowserExecution: true,
    badge: "TS 5.6",
    extension: ".ts",
    starterTemplate: (title = "Solution") => `declare var require: any;
const fs = require("fs");

function solve(): void {
    const input: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Solve problem: ${title}
}

solve();
`,
  },
  {
    key: "cpp",
    label: "C++",
    providerLanguageId: 105, // C++ (GCC 14.1.0)
    version: "GCC 14.1.0",
    tier: 1,
    editorMode: "cpp",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["cpp"] ?? true,
    badge: "GCC 14.1",
    extension: ".cpp",
    starterTemplate: (title = "Solution") => `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Solve problem: ${title}
    return 0;
}
`,
  },
  {
    key: "c",
    label: "C",
    providerLanguageId: 103, // C (GCC 14.1.0)
    version: "GCC 14.1.0",
    tier: 1,
    editorMode: "c",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["c"] ?? true,
    badge: "GCC 14.1",
    extension: ".c",
    starterTemplate: (title = "Solution") => `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

int main() {
    // Solve problem: ${title}
    return 0;
}
`,
  },
  {
    key: "java",
    label: "Java",
    providerLanguageId: 91, // Java (JDK 17.0.6)
    version: "JDK 17.0.6",
    tier: 1,
    editorMode: "java",
    timeMultiplier: 1.75,
    memoryLimit: 512000,
    enabled: verifiedMap["java"] ?? true,
    badge: "JDK 17",
    extension: ".java",
    starterTemplate: (title = "Solution") => `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Solve problem: ${title}
    }
}
`,
  },

  // =========================================================================
  // TIER 2: Modern & Popular Languages
  // =========================================================================
  {
    key: "go",
    label: "Go",
    providerLanguageId: 107, // Go (1.23.5)
    version: "1.23.5",
    tier: 2,
    editorMode: "go",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["go"] ?? true,
    badge: "Go 1.23",
    extension: ".go",
    starterTemplate: TIER2_STARTER_TEMPLATES.go,
  },
  {
    key: "rust",
    label: "Rust",
    providerLanguageId: 108, // Rust (1.85.0)
    version: "1.85.0",
    tier: 2,
    editorMode: "rust",
    timeMultiplier: 1.2,
    memoryLimit: 256000,
    enabled: verifiedMap["rust"] ?? true,
    badge: "Rust 1.85",
    extension: ".rs",
    starterTemplate: TIER2_STARTER_TEMPLATES.rust,
  },
  {
    key: "csharp",
    label: "C#",
    providerLanguageId: 51, // C# (Mono 6.6.0.161)
    version: "Mono 6.6.0",
    tier: 2,
    editorMode: "csharp",
    timeMultiplier: 1.5,
    memoryLimit: 512000,
    enabled: verifiedMap["csharp"] ?? true,
    badge: "C# Mono",
    extension: ".cs",
    starterTemplate: TIER2_STARTER_TEMPLATES.csharp,
  },
  {
    key: "kotlin",
    label: "Kotlin",
    providerLanguageId: 111, // Kotlin (2.1.10)
    version: "2.1.10",
    tier: 2,
    editorMode: "kotlin",
    timeMultiplier: 2.0,
    memoryLimit: 512000,
    enabled: verifiedMap["kotlin"] ?? true,
    badge: "Kotlin 2.1",
    extension: ".kt",
    starterTemplate: TIER2_STARTER_TEMPLATES.kotlin,
  },
  {
    key: "swift",
    label: "Swift",
    providerLanguageId: 83, // Swift (5.2.3)
    version: "5.2.3",
    tier: 2,
    editorMode: "swift",
    timeMultiplier: 1.5,
    memoryLimit: 256000,
    enabled: verifiedMap["swift"] ?? true,
    badge: "Swift 5.2",
    extension: ".swift",
    starterTemplate: TIER2_STARTER_TEMPLATES.swift,
  },
  {
    key: "ruby",
    label: "Ruby",
    providerLanguageId: 72, // Ruby (2.7.0)
    version: "2.7.0",
    tier: 2,
    editorMode: "ruby",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["ruby"] ?? true,
    badge: "Ruby 2.7",
    extension: ".rb",
    starterTemplate: TIER2_STARTER_TEMPLATES.ruby,
  },
  {
    key: "php",
    label: "PHP",
    providerLanguageId: 98, // PHP (8.3.11)
    version: "8.3.11",
    tier: 2,
    editorMode: "php",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["php"] ?? true,
    badge: "PHP 8.3",
    extension: ".php",
    starterTemplate: TIER2_STARTER_TEMPLATES.php,
  },
  {
    key: "scala",
    label: "Scala",
    providerLanguageId: 112, // Scala (3.4.2)
    version: "3.4.2",
    tier: 2,
    editorMode: "scala",
    timeMultiplier: 2.5,
    memoryLimit: 512000,
    enabled: verifiedMap["scala"] ?? false,
    badge: "Scala 3.4",
    extension: ".scala",
    starterTemplate: TIER2_STARTER_TEMPLATES.scala,
  },
  {
    key: "r",
    label: "R",
    providerLanguageId: 99, // R (4.4.1)
    version: "4.4.1",
    tier: 2,
    editorMode: "r",
    timeMultiplier: 2.0,
    memoryLimit: 256000,
    enabled: verifiedMap["r"] ?? false,
    badge: "R 4.4",
    extension: ".r",
    starterTemplate: TIER2_STARTER_TEMPLATES.r,
  },
  {
    key: "dart",
    label: "Dart",
    providerLanguageId: 90, // Dart (2.19.2)
    version: "2.19.2",
    tier: 2,
    editorMode: "dart",
    timeMultiplier: 1.2,
    memoryLimit: 256000,
    enabled: verifiedMap["dart"] ?? true,
    badge: "Dart 2.19",
    extension: ".dart",
    starterTemplate: TIER2_STARTER_TEMPLATES.dart,
  },
  {
    key: "perl",
    label: "Perl",
    providerLanguageId: 85, // Perl (5.28.1)
    version: "5.28.1",
    tier: 2,
    editorMode: "perl",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["perl"] ?? true,
    badge: "Perl 5.28",
    extension: ".pl",
    starterTemplate: TIER2_STARTER_TEMPLATES.perl,
  },
  {
    key: "lua",
    label: "Lua",
    providerLanguageId: 64, // Lua (5.3.5)
    version: "5.3.5",
    tier: 2,
    editorMode: "lua",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["lua"] ?? true,
    badge: "Lua 5.3",
    extension: ".lua",
    starterTemplate: TIER2_STARTER_TEMPLATES.lua,
  },
  {
    key: "haskell",
    label: "Haskell",
    providerLanguageId: 61, // Haskell (GHC 8.8.1)
    version: "GHC 8.8.1",
    tier: 2,
    editorMode: "haskell",
    timeMultiplier: 1.5,
    memoryLimit: 256000,
    enabled: verifiedMap["haskell"] ?? true,
    badge: "GHC 8.8",
    extension: ".hs",
    starterTemplate: TIER2_STARTER_TEMPLATES.haskell,
  },

  // =========================================================================
  // TIER 3: Classic, Systems & Functional Languages (Experimental)
  // =========================================================================
  {
    key: "elixir",
    label: "Elixir",
    providerLanguageId: 57, // Elixir (1.9.4)
    version: "1.9.4",
    tier: 3,
    editorMode: "elixir",
    timeMultiplier: 1.5,
    memoryLimit: 256000,
    enabled: verifiedMap["elixir"] ?? true,
    badge: "Elixir",
    extension: ".ex",
    starterTemplate: TIER3_GENERIC_SKELETONS.elixir,
  },
  {
    key: "erlang",
    label: "Erlang",
    providerLanguageId: 58, // Erlang (OTP 22.2)
    version: "OTP 22.2",
    tier: 3,
    editorMode: "erlang",
    timeMultiplier: 1.5,
    memoryLimit: 256000,
    enabled: verifiedMap["erlang"] ?? false,
    badge: "Erlang",
    extension: ".erl",
    starterTemplate: TIER3_GENERIC_SKELETONS.erlang,
  },
  {
    key: "clojure",
    label: "Clojure",
    providerLanguageId: 86, // Clojure (1.10.1)
    version: "1.10.1",
    tier: 3,
    editorMode: "clojure",
    timeMultiplier: 2.0,
    memoryLimit: 512000,
    enabled: verifiedMap["clojure"] ?? true,
    badge: "Clojure",
    extension: ".clj",
    starterTemplate: TIER3_GENERIC_SKELETONS.clojure,
  },
  {
    key: "fsharp",
    label: "F#",
    providerLanguageId: 87, // F# (.NET Core SDK 3.1.202)
    version: ".NET Core 3.1",
    tier: 3,
    editorMode: "fsharp",
    timeMultiplier: 1.75,
    memoryLimit: 512000,
    enabled: verifiedMap["fsharp"] ?? true,
    badge: "F#",
    extension: ".fs",
    starterTemplate: TIER3_GENERIC_SKELETONS.fsharp,
  },
  {
    key: "groovy",
    label: "Groovy",
    providerLanguageId: 88, // Groovy (3.0.3)
    version: "3.0.3",
    tier: 3,
    editorMode: "groovy",
    timeMultiplier: 1.75,
    memoryLimit: 512000,
    enabled: verifiedMap["groovy"] ?? true,
    badge: "Groovy",
    extension: ".groovy",
    starterTemplate: TIER3_GENERIC_SKELETONS.groovy,
  },
  {
    key: "d",
    label: "D",
    providerLanguageId: 56, // D (DMD 2.089.1)
    version: "DMD 2.089.1",
    tier: 3,
    editorMode: "d",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["d"] ?? true,
    badge: "D",
    extension: ".d",
    starterTemplate: TIER3_GENERIC_SKELETONS.d,
  },
  {
    key: "fortran",
    label: "Fortran",
    providerLanguageId: 59, // Fortran (GFortran 9.2.0)
    version: "GFortran 9.2",
    tier: 3,
    editorMode: "fortran",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["fortran"] ?? true,
    badge: "Fortran",
    extension: ".f90",
    starterTemplate: TIER3_GENERIC_SKELETONS.fortran,
  },
  {
    key: "pascal",
    label: "Pascal",
    providerLanguageId: 67, // Pascal (FPC 3.0.4)
    version: "FPC 3.0.4",
    tier: 3,
    editorMode: "pascal",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["pascal"] ?? true,
    badge: "Pascal",
    extension: ".pas",
    starterTemplate: TIER3_GENERIC_SKELETONS.pascal,
  },
  {
    key: "bash",
    label: "Bash",
    providerLanguageId: 46, // Bash (5.0.0)
    version: "5.0.0",
    tier: 3,
    editorMode: "bash",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["bash"] ?? true,
    badge: "Bash",
    extension: ".sh",
    starterTemplate: TIER3_GENERIC_SKELETONS.bash,
  },
  {
    key: "basic",
    label: "Basic",
    providerLanguageId: 47, // Basic (FBC 1.07.1)
    version: "FBC 1.07.1",
    tier: 3,
    editorMode: "basic",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["basic"] ?? true,
    badge: "Basic",
    extension: ".bas",
    starterTemplate: TIER3_GENERIC_SKELETONS.basic,
  },
  {
    key: "ocaml",
    label: "OCaml",
    providerLanguageId: 65, // OCaml (4.09.0)
    version: "4.09.0",
    tier: 3,
    editorMode: "ocaml",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["ocaml"] ?? true,
    badge: "OCaml",
    extension: ".ml",
    starterTemplate: TIER3_GENERIC_SKELETONS.ocaml,
  },
  {
    key: "commonlisp",
    label: "Common Lisp",
    providerLanguageId: 55, // Common Lisp (SBCL 2.0.0)
    version: "SBCL 2.0.0",
    tier: 3,
    editorMode: "commonlisp",
    timeMultiplier: 1.2,
    memoryLimit: 256000,
    enabled: verifiedMap["commonlisp"] ?? true,
    badge: "Lisp",
    extension: ".lisp",
    starterTemplate: TIER3_GENERIC_SKELETONS.commonlisp,
  },
  {
    key: "vbnet",
    label: "Visual Basic .NET",
    providerLanguageId: 84, // Visual Basic.Net (vbnc 0.0.0.5943)
    version: "vbnc",
    tier: 3,
    editorMode: "vbnet",
    timeMultiplier: 1.5,
    memoryLimit: 512000,
    enabled: verifiedMap["vbnet"] ?? true,
    badge: "VB.NET",
    extension: ".vb",
    starterTemplate: TIER3_GENERIC_SKELETONS.vbnet,
  },
  {
    key: "objectivec",
    label: "Objective-C",
    providerLanguageId: 79, // Objective-C (Clang 7.0.1)
    version: "Clang 7.0.1",
    tier: 3,
    editorMode: "objectivec",
    timeMultiplier: 1.2,
    memoryLimit: 256000,
    enabled: verifiedMap["objectivec"] ?? true,
    badge: "Obj-C",
    extension: ".m",
    starterTemplate: TIER3_GENERIC_SKELETONS.objectivec,
  },
  {
    key: "cobol",
    label: "COBOL",
    providerLanguageId: 77, // COBOL (GnuCOBOL 2.2)
    version: "GnuCOBOL 2.2",
    tier: 3,
    editorMode: "cobol",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["cobol"] ?? false,
    badge: "COBOL",
    extension: ".cbl",
    starterTemplate: TIER3_GENERIC_SKELETONS.cobol,
  },
  {
    key: "octave",
    label: "Octave",
    providerLanguageId: 66, // Octave (5.1.0)
    version: "5.1.0",
    tier: 3,
    editorMode: "octave",
    timeMultiplier: 1.5,
    memoryLimit: 256000,
    enabled: verifiedMap["octave"] ?? false,
    badge: "Octave",
    extension: ".m",
    starterTemplate: TIER3_GENERIC_SKELETONS.octave,
  },
  {
    key: "prolog",
    label: "Prolog",
    providerLanguageId: 69, // Prolog (GNU Prolog 1.4.5)
    version: "GNU Prolog 1.4.5",
    tier: 3,
    editorMode: "prolog",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["prolog"] ?? false,
    badge: "Prolog",
    extension: ".pro",
    starterTemplate: TIER3_GENERIC_SKELETONS.prolog,
  },
  {
    key: "assembly",
    label: "Assembly",
    providerLanguageId: 45, // Assembly (NASM 2.14.02)
    version: "NASM 2.14.02",
    tier: 3,
    editorMode: "assembly",
    timeMultiplier: 1.0,
    memoryLimit: 256000,
    enabled: verifiedMap["assembly"] ?? false,
    badge: "NASM",
    extension: ".asm",
    starterTemplate: TIER3_GENERIC_SKELETONS.assembly,
  },
];

export const LANGUAGES_MAP: Record<string, LanguageConfig> = {};
for (const lang of ALL_CANDIDATE_LANGUAGES) {
  LANGUAGES_MAP[lang.key] = lang;
}

// Aliases
LANGUAGES_MAP["python"] = LANGUAGES_MAP["python3"];
LANGUAGES_MAP["js"] = LANGUAGES_MAP["javascript"];
LANGUAGES_MAP["ts"] = LANGUAGES_MAP["typescript"];
LANGUAGES_MAP["cs"] = LANGUAGES_MAP["csharp"];
LANGUAGES_MAP["rs"] = LANGUAGES_MAP["rust"];

export const ENABLED_LANGUAGES: LanguageConfig[] = ALL_CANDIDATE_LANGUAGES.filter((l) => l.enabled);
export const TIER1_LANGUAGES: LanguageConfig[] = ENABLED_LANGUAGES.filter((l) => l.tier === 1);
export const TIER2_LANGUAGES: LanguageConfig[] = ENABLED_LANGUAGES.filter((l) => l.tier === 2);
export const TIER3_LANGUAGES: LanguageConfig[] = ENABLED_LANGUAGES.filter((l) => l.tier === 3);

// Dynamic verified languages count
export const SUPPORTED_LANGUAGES_COUNT: number = ENABLED_LANGUAGES.length;

export function getLanguageConfig(key: string): LanguageConfig | undefined {
  return LANGUAGES_MAP[key];
}

export function getStarterTemplate(key: string, problemTitle?: string): string {
  const cfg = LANGUAGES_MAP[key];
  if (cfg && typeof cfg.starterTemplate === "function") {
    return cfg.starterTemplate(problemTitle);
  }
  return `// Write your ${problemTitle || "solution"} here\n`;
}
