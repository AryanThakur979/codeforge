import { Problem } from "@/types/problem";

export const problems: Problem[] = [
  {
    id: "1",
    slug: "target-pair-sum",
    title: "Target Pair Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hashing", "Two Pointers"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer in any order (sorted indices preferred).`,
    examples: [
      {
        id: 1,
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].",
      },
      {
        id: 2,
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A brute force search takes O(n^2) time. Can you use a hash map to look up complements in O(1)?",
      "As you iterate, calculate complement = target - num, and check if it already exists in your map.",
    ],
    functionName: "findTargetPair",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function findTargetPair(nums, target) {
  // Your code here
}
`,
      python: `def findTargetPair(nums, target):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[2, 7, 11, 15], 9], expected: [0, 1], isHidden: false },
      { id: 2, input: [[3, 2, 4], 6], expected: [1, 2], isHidden: false },
      { id: 3, input: [[3, 3], 6], expected: [0, 1], isHidden: false },
      { id: 4, input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], isHidden: true },
      { id: 5, input: [[0, 4, 3, 0], 0], expected: [0, 3], isHidden: true },
      { id: 6, input: [[1000, 2000, 3000, 4000], 7000], expected: [2, 3], isHidden: true },
    ],
  },
  {
    id: "2",
    slug: "palindrome-sentence",
    title: "Clean Palindrome Verifier",
    difficulty: "Easy",
    tags: ["Strings", "Two Pointers"],
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        id: 1,
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        id: 2,
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters.",
    ],
    hints: [
      "Filter out non-alphanumeric characters and convert to lower case first.",
      "Use two pointers, one at the beginning and one at the end, moving towards the middle.",
    ],
    functionName: "isPalindrome",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Your code here
}
`,
      python: `def isPalindrome(s: str) -> bool:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["A man, a plan, a canal: Panama"], expected: true, isHidden: false },
      { id: 2, input: ["race a car"], expected: false, isHidden: false },
      { id: 3, input: [" "], expected: true, isHidden: false },
      { id: 4, input: ["0P"], expected: false, isHidden: true },
      { id: 5, input: ["No 'x' in Nixon"], expected: true, isHidden: true },
      { id: 6, input: ["12321"], expected: true, isHidden: true },
    ],
  },
  {
    id: "3",
    slug: "valid-delimiter-pairs",
    title: "Balanced Bracket Sequence",
    difficulty: "Easy",
    tags: ["Stack", "Strings"],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        id: 1,
        input: 's = "()"',
        output: "true",
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        id: 3,
        input: 's = "(]"',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    hints: [
      "Use a Last-In-First-Out (Stack) data structure.",
      "Push opening brackets onto the stack. When encountering a closing bracket, check if the stack top matches.",
    ],
    functionName: "isValidDelimiters",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValidDelimiters(s) {
  // Your code here
}
`,
      python: `def isValidDelimiters(s: str) -> bool:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["()"], expected: true, isHidden: false },
      { id: 2, input: ["()[]{}"], expected: true, isHidden: false },
      { id: 3, input: ["(]"], expected: false, isHidden: false },
      { id: 4, input: ["([{}])"], expected: true, isHidden: true },
      { id: 5, input: ["]["], expected: false, isHidden: true },
      { id: 6, input: ["{([])}"], expected: true, isHidden: true },
    ],
  },
  {
    id: "4",
    slug: "maximum-contiguous-gain",
    title: "Maximum Contiguous Subarray",
    difficulty: "Medium",
    tags: ["Arrays", "Dynamic Programming"],
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return **its sum**.

A **subarray** is a contiguous part of an array.`,
    examples: [
      {
        id: 1,
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "Subarray [4, -1, 2, 1] has the largest sum = 6.",
      },
      {
        id: 2,
        input: "nums = [1]",
        output: "1",
      },
      {
        id: 3,
        input: "nums = [5, 4, -1, 7, 8]",
        output: "23",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    hints: [
      "Look into Kadane's Algorithm which runs in O(n) time.",
      "Keep track of the current subarray sum. If it drops below zero, reset it to zero.",
    ],
    functionName: "maxSubArrayGain",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArrayGain(nums) {
  // Your code here
}
`,
      python: `def maxSubArrayGain(nums):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, isHidden: false },
      { id: 2, input: [[1]], expected: 1, isHidden: false },
      { id: 3, input: [[5, 4, -1, 7, 8]], expected: 23, isHidden: false },
      { id: 4, input: [[-5, -2, -8, -1]], expected: -1, isHidden: true },
      { id: 5, input: [[-1, 0, -2]], expected: 0, isHidden: true },
      { id: 6, input: [[1, 2, 3, 4, 5]], expected: 15, isHidden: true },
    ],
  },
  {
    id: "5",
    slug: "condense-sorted-arrays",
    title: "Merge Two Sorted Sequences",
    difficulty: "Easy",
    tags: ["Arrays", "Two Pointers"],
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, both sorted in non-decreasing order.

Merge \`nums1\` and \`nums2\` into a single, combined array sorted in non-decreasing order, and return it.`,
    examples: [
      {
        id: 1,
        input: "nums1 = [1, 3, 5], nums2 = [2, 4, 6]",
        output: "[1, 2, 3, 4, 5, 6]",
      },
      {
        id: 2,
        input: "nums1 = [], nums2 = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "0 <= nums1.length, nums2.length <= 10^4",
      "-10^9 <= nums1[i], nums2[i] <= 10^9",
    ],
    hints: [
      "Use two pointers, starting from the beginning of both arrays.",
      "Compare elements, append the smaller one, and advance that pointer.",
    ],
    functionName: "mergeSortedArrays",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
function mergeSortedArrays(nums1, nums2) {
  // Your code here
}
`,
      python: `def mergeSortedArrays(nums1, nums2):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], isHidden: false },
      { id: 2, input: [[], [0]], expected: [0], isHidden: false },
      { id: 3, input: [[1, 2, 3], []], expected: [1, 2, 3], isHidden: false },
      { id: 4, input: [[2, 2, 2], [2, 2]], expected: [2, 2, 2, 2, 2], isHidden: true },
      { id: 5, input: [[-5, -1, 4], [-3, 0, 8]], expected: [-5, -3, -1, 0, 4, 8], isHidden: true },
    ],
  },
  {
    id: "6",
    slug: "fizz-buzz-matrix",
    title: "CodeForge FizzBuzz",
    difficulty: "Easy",
    tags: ["Math", "Simulation"],
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:
- \`answer[i] == "CodeForge"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Code"\` if \`i\` is divisible by 3.
- \`answer[i] == "Forge"\` if \`i\` is divisible by 5.
- \`answer[i] == String(i)\` if none of the above conditions are true.`,
    examples: [
      {
        id: 1,
        input: "n = 5",
        output: '["1", "2", "Code", "4", "Forge"]',
      },
      {
        id: 2,
        input: "n = 15",
        output: '["1","2","Code","4","Forge","Code","7","8","Code","Forge","11","Code","13","14","CodeForge"]',
      },
    ],
    constraints: ["1 <= n <= 10^4"],
    hints: [
      "Check divisibility by 15 first (both 3 and 5), or concatenate strings.",
    ],
    functionName: "codeForgeBuzz",
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
function codeForgeBuzz(n) {
  // Your code here
}
`,
      python: `def codeForgeBuzz(n: int):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [3], expected: ["1", "2", "Code"], isHidden: false },
      { id: 2, input: [5], expected: ["1", "2", "Code", "4", "Forge"], isHidden: false },
      { id: 3, input: [15], expected: ["1","2","Code","4","Forge","Code","7","8","Code","Forge","11","Code","13","14","CodeForge"], isHidden: false },
      { id: 4, input: [1], expected: ["1"], isHidden: true },
      { id: 5, input: [6], expected: ["1", "2", "Code", "4", "Forge", "Code"], isHidden: true },
    ],
  },
  {
    id: "7",
    slug: "frequency-anagrams",
    title: "Valid Anagram Detector",
    difficulty: "Easy",
    tags: ["Strings", "Hashing"],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        id: 1,
        input: 's = "anagram", t = "nagaram"',
        output: "true",
      },
      {
        id: 2,
        input: 's = "rat", t = "car"',
        output: "false",
      },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    hints: [
      "Check lengths first. If lengths differ, they cannot be anagrams.",
      "Count frequencies of each character using a frequency table or array.",
    ],
    functionName: "isAnagram",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Your code here
}
`,
      python: `def isAnagram(s: str, t: str) -> bool:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["anagram", "nagaram"], expected: true, isHidden: false },
      { id: 2, input: ["rat", "car"], expected: false, isHidden: false },
      { id: 3, input: ["listen", "silent"], expected: true, isHidden: false },
      { id: 4, input: ["a", "ab"], expected: false, isHidden: true },
      { id: 5, input: ["meteor", "remote"], expected: true, isHidden: true },
      { id: 6, input: ["aa", "a"], expected: false, isHidden: true },
    ],
  },
  {
    id: "8",
    slug: "binary-interval-search",
    title: "Logarithmic Search Index",
    difficulty: "Easy",
    tags: ["Binary Search", "Arrays"],
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        id: 1,
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
        output: "4",
      },
      {
        id: 2,
        input: "nums = [-1, 0, 3, 5, 9, 12], target = 2",
        output: "-1",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    hints: [
      "Maintain low and high pointers. Check the mid element at each step.",
    ],
    functionName: "binarySearch",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function binarySearch(nums, target) {
  // Your code here
}
`,
      python: `def binarySearch(nums, target: int) -> int:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, isHidden: false },
      { id: 2, input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, isHidden: false },
      { id: 3, input: [[5], 5], expected: 0, isHidden: false },
      { id: 4, input: [[5], -5], expected: -1, isHidden: true },
      { id: 5, input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0, isHidden: true },
      { id: 6, input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10], expected: 9, isHidden: true },
    ],
  },
  {
    id: "9",
    slug: "longest-unique-substring",
    title: "Longest Non-Repeating Substring",
    difficulty: "Medium",
    tags: ["Strings", "Sliding Window", "Hashing"],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with length 1.',
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with length 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    hints: [
      "Use a sliding window with two pointers (left and right) and a Set or Map to track characters currently in the window.",
      "When a duplicate is encountered, advance the left pointer until the duplicate is evicted.",
    ],
    functionName: "longestUniqueSubstr",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function longestUniqueSubstr(s) {
  // Your code here
}
`,
      python: `def longestUniqueSubstr(s: str) -> int:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["abcabcbb"], expected: 3, isHidden: false },
      { id: 2, input: ["bbbbb"], expected: 1, isHidden: false },
      { id: 3, input: ["pwwkew"], expected: 3, isHidden: false },
      { id: 4, input: [""], expected: 0, isHidden: true },
      { id: 5, input: [" "], expected: 1, isHidden: true },
      { id: 6, input: ["au"], expected: 2, isHidden: true },
      { id: 7, input: ["dvdf"], expected: 3, isHidden: true },
    ],
  },
  {
    id: "10",
    slug: "vowel-consonant-flip",
    title: "Reverse Vowels in String",
    difficulty: "Easy",
    tags: ["Strings", "Two Pointers"],
    description: `Given a string \`s\`, reverse only all the vowels in the string and return it.

The vowels are \`'a'\`, \`'e'\`, \`'i'\`, \`'o'\`, and \`'u'\`, and they can appear in both lower and upper cases, more than once. All consonants and punctuation must remain in their original positions.`,
    examples: [
      {
        id: 1,
        input: 's = "hello"',
        output: '"holle"',
      },
      {
        id: 2,
        input: 's = "CodeForge"',
        output: '"CedeForgo"',
      },
    ],
    constraints: [
      "1 <= s.length <= 3 * 10^5",
      "s consist of printable ASCII characters.",
    ],
    hints: [
      "Two pointers: left starting at 0, right starting at length - 1.",
      "Move left forward until it points to a vowel. Move right backward until it points to a vowel. Swap them, then increment left and decrement right.",
    ],
    functionName: "reverseVowels",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
function reverseVowels(s) {
  // Your code here
}
`,
      python: `def reverseVowels(s: str) -> str:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["hello"], expected: "holle", isHidden: false },
      { id: 2, input: ["CodeForge"], expected: "CedeForgo", isHidden: false },
      { id: 3, input: ["aA"], expected: "Aa", isHidden: false },
      { id: 4, input: ["xyz"], expected: "xyz", isHidden: true },
      { id: 5, input: ["aeiou"], expected: "uoiea", isHidden: true },
    ],
  },
  {
    id: "11",
    slug: "rotate-array-k-steps",
    title: "Array Shift By K Positions",
    difficulty: "Medium",
    tags: ["Arrays", "Math", "Two Pointers"],
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative. Return the rotated array.`,
    examples: [
      {
        id: 1,
        input: "nums = [1, 2, 3, 4, 5, 6, 7], k = 3",
        output: "[5, 6, 7, 1, 2, 3, 4]",
      },
      {
        id: 2,
        input: "nums = [-1, -100, 3, 99], k = 2",
        output: "[3, 99, -1, -100]",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1",
      "0 <= k <= 10^5",
    ],
    hints: [
      "Notice that rotating by nums.length steps results in the original array. First do k = k % nums.length.",
      "Can you reverse the entire array, then reverse the first k elements, and reverse the remaining elements?",
    ],
    functionName: "rotateArray",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function rotateArray(nums, k) {
  // Your code here
}
`,
      python: `def rotateArray(nums, k: int):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4], isHidden: false },
      { id: 2, input: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100], isHidden: false },
      { id: 3, input: [[1, 2], 0], expected: [1, 2], isHidden: false },
      { id: 4, input: [[1, 2], 3], expected: [2, 1], isHidden: true },
      { id: 5, input: [[1], 100], expected: [1], isHidden: true },
    ],
  },
  {
    id: "12",
    slug: "container-water-reservoir",
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Two Pointers", "Greedy", "Arrays"],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return **the maximum amount of water** a container can store. Notice that you may not slant the container.`,
    examples: [
      {
        id: 1,
        input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        output: "49",
        explanation: "The max water area is between index 1 (height 8) and index 8 (height 7): min(8, 7) * (8 - 1) = 7 * 7 = 49.",
      },
      {
        id: 2,
        input: "height = [1, 1]",
        output: "1",
      },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    hints: [
      "Start with the widest container: two pointers at opposite ends of the array.",
      "The height of the water is constrained by the shorter wall. Moving the taller wall will never increase the area, so move the shorter wall inward.",
    ],
    functionName: "maxWaterArea",
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function maxWaterArea(height) {
  // Your code here
}
`,
      python: `def maxWaterArea(height):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, isHidden: false },
      { id: 2, input: [[1, 1]], expected: 1, isHidden: false },
      { id: 3, input: [[4, 3, 2, 1, 4]], expected: 16, isHidden: false },
      { id: 4, input: [[1, 2, 1]], expected: 2, isHidden: true },
      { id: 5, input: [[1, 2, 4, 3]], expected: 4, isHidden: true },
    ],
  },
  {
    id: "13",
    slug: "missing-token-sequence",
    title: "Locate Missing Sequence Number",
    difficulty: "Easy",
    tags: ["Math", "Arrays", "Bit Manipulation"],
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.`,
    examples: [
      {
        id: 1,
        input: "nums = [3, 0, 1]",
        output: "2",
        explanation: "n = 3 since there are 3 numbers, so all numbers are in the range [0, 3]. 2 is the missing number.",
      },
      {
        id: 2,
        input: "nums = [0, 1]",
        output: "2",
      },
      {
        id: 3,
        input: "nums = [9,6,4,2,3,5,7,0,1]",
        output: "8",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 10^4",
      "0 <= nums[i] <= n",
      "All the numbers of nums are unique.",
    ],
    hints: [
      "The sum of numbers from 0 to n is (n * (n + 1)) / 2.",
      "Subtract the sum of the array elements from the expected total.",
    ],
    functionName: "findMissingNumber",
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function findMissingNumber(nums) {
  // Your code here
}
`,
      python: `def findMissingNumber(nums) -> int:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[3, 0, 1]], expected: 2, isHidden: false },
      { id: 2, input: [[0, 1]], expected: 2, isHidden: false },
      { id: 3, input: [[9,6,4,2,3,5,7,0,1]], expected: 8, isHidden: false },
      { id: 4, input: [[0]], expected: 1, isHidden: true },
      { id: 5, input: [[1]], expected: 0, isHidden: true },
    ],
  },
  {
    id: "14",
    slug: "compress-char-runs",
    title: "Run-Length String Encoding",
    difficulty: "Medium",
    tags: ["Strings", "Two Pointers"],
    description: `Given a string \`s\`, perform basic string compression using the counts of repeated characters.

For example, the string \`"aabcccccaaa"\` would become \`"a2b1c5a3"\`. If the "compressed" string would not become smaller than the original string, your method should return the original string.`,
    examples: [
      {
        id: 1,
        input: 's = "aabcccccaaa"',
        output: '"a2b1c5a3"',
      },
      {
        id: 2,
        input: 's = "abcdef"',
        output: '"abcdef"',
        explanation: 'Compressed form "a1b1c1d1e1f1" is longer than original, so return "abcdef".',
      },
    ],
    constraints: [
      "0 <= s.length <= 10^5",
      "s consists of lowercase and uppercase letters.",
    ],
    hints: [
      "Iterate through the string with a pointer tracking the start of each contiguous run of characters.",
      "Check length of compressed output before returning.",
    ],
    functionName: "compressString",
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
function compressString(s) {
  // Your code here
}
`,
      python: `def compressString(s: str) -> str:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: ["aabcccccaaa"], expected: "a2b1c5a3", isHidden: false },
      { id: 2, input: ["abcdef"], expected: "abcdef", isHidden: false },
      { id: 3, input: ["aabb"], expected: "aabb", isHidden: false },
      { id: 4, input: ["aaaaaa"], expected: "a6", isHidden: true },
      { id: 5, input: [""], expected: "", isHidden: true },
    ],
  },
  {
    id: "15",
    slug: "spiral-matrix-walk",
    title: "Spiral Grid Traversal",
    difficulty: "Medium",
    tags: ["Matrix", "Simulation"],
    description: `Given an \`m x n\` matrix, return all elements of the matrix in **spiral order**.`,
    examples: [
      {
        id: 1,
        input: "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]",
        output: "[1, 2, 3, 6, 9, 8, 7, 4, 5]",
      },
      {
        id: 2,
        input: "matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]",
        output: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10",
      "-100 <= matrix[i][j] <= 100",
    ],
    hints: [
      "Maintain four boundaries: top, bottom, left, right.",
      "Traverse right along top, down along right, left along bottom, up along left, shrinking boundaries after each row/column traversal.",
    ],
    functionName: "spiralOrder",
    starterCode: {
      javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
function spiralOrder(matrix) {
  // Your code here
}
`,
      python: `def spiralOrder(matrix):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5], isHidden: false },
      { id: 2, input: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], isHidden: false },
      { id: 3, input: [[[1]]], expected: [1], isHidden: false },
      { id: 4, input: [[[1, 2], [3, 4]]], expected: [1, 2, 4, 3], isHidden: true },
      { id: 5, input: [[[2, 5, 8], [4, 0, -1]]], expected: [2, 5, 8, -1, 0, 4], isHidden: true },
    ],
  },
  {
    id: "16",
    slug: "coin-denominations-ways",
    title: "Minimum Currency Coins",
    difficulty: "Medium",
    tags: ["Dynamic Programming", "Breadth-First Search"],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        id: 1,
        input: "coins = [1, 2, 5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
      {
        id: 2,
        input: "coins = [2], amount = 3",
        output: "-1",
      },
      {
        id: 3,
        input: "coins = [1], amount = 0",
        output: "0",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    hints: [
      "Define dp[i] as the minimum coins needed to make amount i.",
      "Initialize dp array with Infinity. Base case: dp[0] = 0.",
      "For each coin c and amount i from c to amount: dp[i] = min(dp[i], dp[i - c] + 1).",
    ],
    functionName: "coinChange",
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  // Your code here
}
`,
      python: `def coinChange(coins, amount: int) -> int:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[1, 2, 5], 11], expected: 3, isHidden: false },
      { id: 2, input: [[2], 3], expected: -1, isHidden: false },
      { id: 3, input: [[1], 0], expected: 0, isHidden: false },
      { id: 4, input: [[2, 5, 10, 1], 27], expected: 4, isHidden: true },
      { id: 5, input: [[186, 419, 83, 408], 6249], expected: 20, isHidden: true },
    ],
  },
  {
    id: "17",
    slug: "climb-stair-ways",
    title: "Stepping Stones Combinations",
    difficulty: "Easy",
    tags: ["Dynamic Programming", "Recursion", "Math"],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        id: 1,
        input: "n = 2",
        output: "2",
        explanation: "There are two ways: 1 step + 1 step, or 2 steps.",
      },
      {
        id: 2,
        input: "n = 3",
        output: "3",
        explanation: "There are three ways: (1+1+1), (1+2), (2+1).",
      },
    ],
    constraints: ["1 <= n <= 45"],
    hints: [
      "To reach step n, you must come from either step (n - 1) or step (n - 2).",
      "ways(n) = ways(n - 1) + ways(n - 2). This is the Fibonacci sequence!",
    ],
    functionName: "climbStairs",
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your code here
}
`,
      python: `def climbStairs(n: int) -> int:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [2], expected: 2, isHidden: false },
      { id: 2, input: [3], expected: 3, isHidden: false },
      { id: 3, input: [4], expected: 5, isHidden: false },
      { id: 4, input: [1], expected: 1, isHidden: true },
      { id: 5, input: [5], expected: 8, isHidden: true },
      { id: 6, input: [10], expected: 89, isHidden: true },
    ],
  },
  {
    id: "18",
    slug: "group-shifted-anagrams",
    title: "Group Anagram Clusters",
    difficulty: "Medium",
    tags: ["Strings", "Hashing", "Sorting"],
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order, with inner groups sorted.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase.`,
    examples: [
      {
        id: 1,
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
      },
      {
        id: 2,
        input: 'strs = [""]',
        output: '[[""]]',
      },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    hints: [
      "Sort each string alphabetically to form a signature key for the hash map.",
      "Collect all words sharing the same signature key into an array.",
    ],
    functionName: "groupAnagrams",
    starterCode: {
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Your code here
}
`,
      python: `def groupAnagrams(strs):
    # Your code here
    pass
`,
    },
    testCases: [
      {
        id: 1,
        input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
        isHidden: false,
      },
      { id: 2, input: [[""]], expected: [[""]], isHidden: false },
      { id: 3, input: [["a"]], expected: [["a"]], isHidden: false },
      {
        id: 4,
        input: [["stop", "pots", "tops", "opts"]],
        expected: [["opts", "pots", "stop", "tops"]],
        isHidden: true,
      },
      {
        id: 5,
        input: [["cat", "dog", "tac", "god", "act"]],
        expected: [["act", "cat", "tac"], ["dog", "god"]],
        isHidden: true,
      },
    ],
  },
  {
    id: "19",
    slug: "linked-cycle-detection",
    title: "Graph Sequence Cycle Detector",
    difficulty: "Medium",
    tags: ["Two Pointers", "Hashing", "Simulation"],
    description: `Given an array \`nextPointers\` of length \`n\` representing directed jumps where \`nextPointers[i]\` is the index of the node that node \`i\` points to (or \`-1\` if it terminates), determine if there is a cycle starting from index \`0\`.

Return \`true\` if there is a cycle in the jumps starting from index 0, or \`false\` if it reaches \`-1\` or an index out of bounds.`,
    examples: [
      {
        id: 1,
        input: "nextPointers = [1, 2, 0]",
        output: "true",
        explanation: "0 -> 1 -> 2 -> 0 is an infinite cycle.",
      },
      {
        id: 2,
        input: "nextPointers = [1, 2, -1]",
        output: "false",
        explanation: "0 -> 1 -> 2 -> -1 terminates.",
      },
    ],
    constraints: [
      "1 <= nextPointers.length <= 10^4",
      "-1 <= nextPointers[i] < nextPointers.length",
    ],
    hints: [
      "Use Floyd's Cycle-Finding Algorithm (Tortoise and Hare with slow and fast pointers), or a visited Set.",
    ],
    functionName: "hasJumpCycle",
    starterCode: {
      javascript: `/**
 * @param {number[]} nextPointers
 * @return {boolean}
 */
function hasJumpCycle(nextPointers) {
  // Your code here
}
`,
      python: `def hasJumpCycle(nextPointers) -> bool:
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[1, 2, 0]], expected: true, isHidden: false },
      { id: 2, input: [[1, 2, -1]], expected: false, isHidden: false },
      { id: 3, input: [[-1]], expected: false, isHidden: false },
      { id: 4, input: [[0]], expected: true, isHidden: true },
      { id: 5, input: [[1, 3, -1, 2]], expected: false, isHidden: true },
      { id: 6, input: [[1, 2, 3, 1]], expected: true, isHidden: true },
    ],
  },
  {
    id: "20",
    slug: "stock-buy-sell-timing",
    title: "Optimal Asset Trading Interval",
    difficulty: "Easy",
    tags: ["Arrays", "Dynamic Programming", "Greedy"],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        id: 1,
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
      },
      {
        id: 2,
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4",
    ],
    hints: [
      "Track the minimum price seen so far as you iterate through the days.",
      "Calculate potential profit = current_price - min_price, and update max profit.",
    ],
    functionName: "maxProfit",
    starterCode: {
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Your code here
}
`,
      python: `def maxProfit(prices):
    # Your code here
    pass
`,
    },
    testCases: [
      { id: 1, input: [[7, 1, 5, 3, 6, 4]], expected: 5, isHidden: false },
      { id: 2, input: [[7, 6, 4, 3, 1]], expected: 0, isHidden: false },
      { id: 3, input: [[2, 4, 1]], expected: 2, isHidden: false },
      { id: 4, input: [[1, 2]], expected: 1, isHidden: true },
      { id: 5, input: [[3, 3, 3, 3]], expected: 0, isHidden: true },
      { id: 6, input: [[1, 2, 4, 2, 5, 7, 2, 4, 9, 0]], expected: 8, isHidden: true },
    ],
  },
];

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getAllProblems(): Problem[] {
  return problems;
}
