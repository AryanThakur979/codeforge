import { Problem, SupportedLanguage } from "@/types/problem";

export function getStarterCode(problem: Problem, language: SupportedLanguage): string {
  // Check if problem explicitly has starterCode for this language
  if (problem.starterCode && problem.starterCode[language]) {
    return problem.starterCode[language]!;
  }

  // Handle python3 / python alias seamlessly
  if (language === "python3" || language === "python") {
    if (problem.starterCode?.python) return problem.starterCode.python;
    if (problem.starterCode?.python3) return problem.starterCode.python3;
  }

  const fn = problem.functionName;

  switch (language) {
    case "python3":
    case "python":
      return `def ${fn}(*args):\n    # Your code here\n    pass\n`;

    case "javascript":
      return problem.starterCode?.javascript || `/**
 * @return {any}
 */
var ${fn} = function(...args) {
    // Your code here
};
`;

    case "typescript":
      return `function ${fn}(...args: any[]): any {
    // Your code here
}
`;

    case "cpp":
      return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

// Write your ${fn} solution here
`;

    case "java":
      return `import java.util.*;

public class Solution {
    // Write your ${fn} solution here
}
`;

    case "c":
      return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

// Write your ${fn} solution here
`;

    default:
      return problem.starterCode?.javascript || `// Write your ${fn} solution here\n`;
  }
}
