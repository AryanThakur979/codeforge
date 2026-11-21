import { Problem, SupportedLanguage } from "@/types/problem";

export interface ProblemTemplate {
  typescript: string;
  cpp: string;
  java: string;
  c: string;
}

export const PROBLEM_TEMPLATES: Record<string, ProblemTemplate> = {
  "target-pair-sum": {
    typescript: `function findTargetPair(nums: number[], target: number): number[] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> findTargetPair(vector<int>& nums, int target) {
    // Your code here
    return {};
}
`,
    java: `import java.util.*;

class Solution {
    public static int[] findTargetPair(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* findTargetPair(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    return result;
}
`,
  },

  "palindrome-sentence": {
    typescript: `function isPalindrome(s: string): boolean {
  // Your code here
  return false;
}
`,
    cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    // Your code here
    return false;
}
`,
    java: `import java.util.*;

class Solution {
    public static boolean isPalindrome(String s) {
        // Your code here
        return false;
    }
}
`,
    c: `#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>
#include <string.h>

bool isPalindrome(char* s) {
    // Your code here
    return false;
}
`,
  },

  "valid-delimiter-pairs": {
    typescript: `function isValidDelimiters(s: string): boolean {
  // Your code here
  return false;
}
`,
    cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

bool isValidDelimiters(string s) {
    // Your code here
    return false;
}
`,
    java: `import java.util.*;

class Solution {
    public static boolean isValidDelimiters(String s) {
        // Your code here
        return false;
    }
}
`,
    c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

bool isValidDelimiters(char* s) {
    // Your code here
    return false;
}
`,
  },

  "maximum-contiguous-gain": {
    typescript: `function maxSubArrayGain(nums: number[]): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArrayGain(vector<int>& nums) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int maxSubArrayGain(int[] nums) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>

int maxSubArrayGain(int* nums, int numsSize) {
    // Your code here
    return 0;
}
`,
  },

  "condense-sorted-arrays": {
    typescript: `function mergeSortedArrays(nums1: number[], nums2: number[]): number[] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Your code here
    return {};
}
`,
    java: `import java.util.*;

class Solution {
    public static int[] mergeSortedArrays(int[] nums1, int[] nums2) {
        // Your code here
        return new int[]{};
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* mergeSortedArrays(int* nums1, int n1, int* nums2, int n2, int* returnSize) {
    // Your code here
    *returnSize = n1 + n2;
    int* res = (int*)malloc((n1 + n2) * sizeof(int));
    return res;
}
`,
  },

  "fizz-buzz-matrix": {
    typescript: `function codeForgeBuzz(n: number): string[] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<string> codeForgeBuzz(int n) {
    // Your code here
    return {};
}
`,
    java: `import java.util.*;

class Solution {
    public static String[] codeForgeBuzz(int n) {
        // Your code here
        return new String[]{};
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

char** codeForgeBuzz(int n, int* returnSize) {
    // Your code here
    *returnSize = n;
    return NULL;
}
`,
  },

  "frequency-anagrams": {
    typescript: `function isAnagram(s: string, t: string): boolean {
  // Your code here
  return false;
}
`,
    cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool isAnagram(string s, string t) {
    // Your code here
    return false;
}
`,
    java: `import java.util.*;

class Solution {
    public static boolean isAnagram(String s, String t) {
        // Your code here
        return false;
    }
}
`,
    c: `#include <stdio.h>
#include <stdbool.h>
#include <string.h>

bool isAnagram(char* s, char* t) {
    // Your code here
    return false;
}
`,
  },

  "binary-interval-search": {
    typescript: `function binarySearch(nums: number[], target: number): number {
  // Your code here
  return -1;
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& nums, int target) {
    // Your code here
    return -1;
}
`,
    java: `import java.util.*;

class Solution {
    public static int binarySearch(int[] nums, int target) {
        // Your code here
        return -1;
    }
}
`,
    c: `#include <stdio.h>

int binarySearch(int* nums, int numsSize, int target) {
    // Your code here
    return -1;
}
`,
  },

  "longest-unique-substring": {
    typescript: `function longestUniqueSubstr(s: string): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int longestUniqueSubstr(string s) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int longestUniqueSubstr(String s) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>
#include <string.h>

int longestUniqueSubstr(char* s) {
    // Your code here
    return 0;
}
`,
  },

  "vowel-consonant-flip": {
    typescript: `function reverseVowels(s: string): string {
  // Your code here
  return "";
}
`,
    cpp: `#include <iostream>
#include <string>
using namespace std;

string reverseVowels(string s) {
    // Your code here
    return s;
}
`,
    java: `import java.util.*;

class Solution {
    public static String reverseVowels(String s) {
        // Your code here
        return s;
    }
}
`,
    c: `#include <stdio.h>
#include <string.h>

char* reverseVowels(char* s) {
    // Your code here
    return s;
}
`,
  },

  "rotate-array-k-steps": {
    typescript: `function rotateArray(nums: number[], k: number): number[] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> rotateArray(vector<int>& nums, int k) {
    // Your code here
    return nums;
}
`,
    java: `import java.util.*;

class Solution {
    public static int[] rotateArray(int[] nums, int k) {
        // Your code here
        return nums;
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* rotateArray(int* nums, int numsSize, int k, int* returnSize) {
    // Your code here
    *returnSize = numsSize;
    return nums;
}
`,
  },

  "container-water-reservoir": {
    typescript: `function maxWaterArea(height: number[]): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxWaterArea(vector<int>& height) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int maxWaterArea(int[] height) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>

int maxWaterArea(int* height, int heightSize) {
    // Your code here
    return 0;
}
`,
  },

  "missing-token-sequence": {
    typescript: `function findMissingNumber(nums: number[]): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

int findMissingNumber(vector<int>& nums) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int findMissingNumber(int[] nums) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>

int findMissingNumber(int* nums, int numsSize) {
    // Your code here
    return 0;
}
`,
  },

  "compress-char-runs": {
    typescript: `function compressString(s: string): string {
  // Your code here
  return "";
}
`,
    cpp: `#include <iostream>
#include <string>
using namespace std;

string compressString(string s) {
    // Your code here
    return s;
}
`,
    java: `import java.util.*;

class Solution {
    public static String compressString(String s) {
        // Your code here
        return s;
    }
}
`,
    c: `#include <stdio.h>
#include <string.h>

char* compressString(char* s) {
    // Your code here
    return s;
}
`,
  },

  "spiral-matrix-walk": {
    typescript: `function spiralOrder(matrix: number[][]): number[] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Your code here
    return {};
}
`,
    java: `import java.util.*;

class Solution {
    public static int[] spiralOrder(int[][] matrix) {
        // Your code here
        return new int[]{};
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* spiralOrder(int** matrix, int matrixSize, int* matrixColSize, int* returnSize) {
    // Your code here
    *returnSize = 0;
    return NULL;
}
`,
  },

  "coin-denominations-ways": {
    typescript: `function coinChange(coins: number[], amount: number): number {
  // Your code here
  return -1;
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Your code here
    return -1;
}
`,
    java: `import java.util.*;

class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }
}
`,
    c: `#include <stdio.h>

int coinChange(int* coins, int coinsSize, int amount) {
    // Your code here
    return -1;
}
`,
  },

  "climb-stair-ways": {
    typescript: `function climbStairs(n: number): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int climbStairs(int n) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>

int climbStairs(int n) {
    // Your code here
    return 0;
}
`,
  },

  "group-shifted-anagrams": {
    typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Your code here
  return [];
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Your code here
    return {};
}
`,
    java: `import java.util.*;

class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Your code here
        return new ArrayList<>();
    }
}
`,
    c: `#include <stdio.h>
#include <stdlib.h>

char*** groupAnagrams(char** strs, int strsSize, int* returnSize, int** returnColumnSizes) {
    // Your code here
    *returnSize = 0;
    return NULL;
}
`,
  },

  "linked-cycle-detection": {
    typescript: `function hasJumpCycle(nums: number[]): boolean {
  // Your code here
  return false;
}
`,
    cpp: `#include <iostream>
#include <vector>
using namespace std;

bool hasJumpCycle(vector<int>& nums) {
    // Your code here
    return false;
}
`,
    java: `import java.util.*;

class Solution {
    public static boolean hasJumpCycle(int[] nums) {
        // Your code here
        return false;
    }
}
`,
    c: `#include <stdio.h>
#include <stdbool.h>

bool hasJumpCycle(int* nums, int numsSize) {
    // Your code here
    return false;
}
`,
  },

  "stock-buy-sell-timing": {
    typescript: `function maxProfit(prices: number[]): number {
  // Your code here
  return 0;
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Your code here
    return 0;
}
`,
    java: `import java.util.*;

class Solution {
    public static int maxProfit(int[] prices) {
        // Your code here
        return 0;
    }
}
`,
    c: `#include <stdio.h>

int maxProfit(int* prices, int pricesSize) {
    // Your code here
    return 0;
}
`,
  },
};

export function getStarterCode(problem: Problem, language: SupportedLanguage): string {
  // 1. Check if problem already has custom starterCode
  if (problem.starterCode && problem.starterCode[language]) {
    return problem.starterCode[language]!;
  }

  // 2. Check predefined template dictionary
  const template = PROBLEM_TEMPLATES[problem.slug];
  if (template) {
    if (language === "typescript") return template.typescript;
    if (language === "cpp") return template.cpp;
    if (language === "java") return template.java;
    if (language === "c") return template.c;
  }

  // 3. Fallbacks
  if (language === "javascript") return problem.starterCode.javascript;
  if (language === "python") return problem.starterCode.python;

  // Generic fallback if not matched
  if (language === "typescript") {
    return `function ${problem.functionName}(...args: any[]): any {\n  // Your code here\n}\n`;
  }
  if (language === "cpp") {
    return `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\n// Write your ${problem.functionName} solution here\n`;
  }
  if (language === "java") {
    return `import java.util.*;\n\nclass Solution {\n    // Write your ${problem.functionName} solution here\n}\n`;
  }
  if (language === "c") {
    return `#include <stdio.h>\n#include <stdlib.h>\n\n// Write your ${problem.functionName} solution here\n`;
  }

  return problem.starterCode.javascript;
}
