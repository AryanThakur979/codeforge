import { Problem, SupportedLanguage } from "@/types/problem";
import { PROBLEM_IO_SPECS } from "@/data/problems/ioSpecs";

export function getStarterCode(problem: Problem, language: SupportedLanguage): string {
  // 1. Check if problem has modern stdin/stdout ioSpec starter template
  const ioSpec = PROBLEM_IO_SPECS[problem.slug];
  if (ioSpec?.starterTemplates) {
    if (ioSpec.starterTemplates[language]) {
      return ioSpec.starterTemplates[language]!;
    }
    if ((language === "python3" || language === "python") && ioSpec.starterTemplates.python3) {
      return ioSpec.starterTemplates.python3;
    }
  }

  // 2. Check if problem explicitly has starterCode for this language
  if (problem.starterCode && problem.starterCode[language]) {
    return problem.starterCode[language]!;
  }

  // Handle python3 / python alias seamlessly
  if (language === "python3" || language === "python") {
    if (problem.starterCode?.python3) return problem.starterCode.python3;
    if (problem.starterCode?.python) return problem.starterCode.python;
  }

  const fn = problem.functionName || "solve";

  switch (language) {
    case "python3":
    case "python":
      return `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    # Your solution logic here
    pass

if __name__ == "__main__":
    solve()
`;

    case "javascript":
      return problem.starterCode?.javascript || `const fs = require("fs");

function solve() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Your solution logic here
}

solve();
`;

    case "typescript":
      return `const fs = require("fs");

function solve(): void {
    const input: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length === 0 || input[0] === "") return;
    // Your solution logic here
}

solve();
`;

    case "cpp":
      return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    // Your solution logic here
    return 0;
}
`;

    case "java":
      return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your solution logic here
    }
}
`;

    case "c":
      return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

int main() {
    // Your solution logic here
    return 0;
}
`;

    default:
      return problem.starterCode?.javascript || `// Write your ${fn} solution here\n`;
  }
}
