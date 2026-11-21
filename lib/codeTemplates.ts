import { Problem, SupportedLanguage } from "@/types/problem";

export function getStarterCode(problem: Problem, language: SupportedLanguage): string {
  // Check if problem explicitly has starterCode for this language
  if (problem.starterCode && problem.starterCode[language]) {
    return problem.starterCode[language]!;
  }

  const fn = problem.functionName;

  switch (language) {
    case "cpp":
      return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    // Write your ${fn} solution here
};
`;

    case "java":
      return `import java.util.*;

class Solution {
    // Write your ${fn} solution here
}
`;

    case "python3":
      return `class Solution:
    def ${fn}(self, *args):
        # Your code here
        pass
`;

    case "python":
      return `class Solution(object):
    def ${fn}(self, *args):
        # Your code here
        pass
`;

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

    case "csharp":
      return `using System;
using System.Collections.Generic;

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

    case "go":
      return `package main

// Write your ${fn} solution here
`;

    case "kotlin":
      return `class Solution {
    fun ${fn}() {
        // Your code here
    }
}
`;

    case "swift":
      return `class Solution {
    func ${fn}() {
        // Your code here
    }
}
`;

    case "rust":
      return `impl Solution {
    pub fn ${fn}() {
        // Your code here
    }
}
`;

    case "ruby":
      return `# @return {any}
def ${fn}(*args)
    # Your code here
end
`;

    case "php":
      return `class Solution {
    /**
     * @return mixed
     */
    function ${fn}(...$args) {
        // Your code here
    }
}
`;

    case "dart":
      return `class Solution {
  dynamic ${fn}() {
    // Your code here
  }
}
`;

    case "scala":
      return `object Solution {
    def ${fn}(): Any = {
        // Your code here
    }
}
`;

    case "elixir":
      return `defmodule Solution do
  @spec ${fn}(any) :: any
  def ${fn}(args) do
    # Your code here
  end
end
`;

    case "erlang":
      return `-module(solution).
-export([${fn}/1]).

${fn}(Args) ->
    ok.
`;

    case "racket":
      return `(define/contract (${fn} . args)
  (-> any/c any/c)
  ;; Your code here
  )
`;

    default:
      return problem.starterCode?.javascript || `// Write your ${fn} solution here\n`;
  }
}
