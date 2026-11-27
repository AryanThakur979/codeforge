import { Problem } from "@/types/problem";

export const premierProblems: Problem[] = [
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
    hintTopic: "Hash Map Complement Lookup",
    hints: [
      "For any element x, what exact complementary value are you hoping has already appeared earlier in the array?",
      "Think of a coat-check counter at a wedding: whenever a guest arrives, before searching through hundreds of coats, the attendant checks a quick lookup ledger to see if their matching receipt number is already registered.",
      "1. Create an empty hash map storing number -> index.\n2. Iterate through each element with its index.\n3. Compute complement = target - currentNumber.\n4. If complement is already in your map, return both indices.\n5. Otherwise, store the current number in the map and continue.",
      "function findTargetPair(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = ____;\n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    seen.set(____, i);\n  }\n  return [];\n}",
    ],
    hintsHinglish: [
      "Har element x ke liye, target tak pahunchne ke liye kaunsi exact missing value pehle aa chuki honi chahiye?",
      "Shaadi ke coat-check counter jaisa socho: guest aate hi attendant register check karta hai ki matching receipt number pehle se jama hai ya nahi.",
      "1. Number se index map karne ke liye ek hash map banao.\\n2. Array ko iterate karo aur complement = target - currentNumber nikalo.\\n3. Agar complement map me hai, toh dono ke indices return karo.\\n4. Nahi toh current number ko map me daalo aur aage badho.",
      "function findTargetPair(nums, target) {\\n  const seen = new Map();\\n  for (let i = 0; i < nums.length; i++) {\\n    const complement = ____;\\n    if (seen.has(complement)) {\\n      return [seen.get(complement), i];\\n    }\\n    seen.set(____, i);\\n  }\\n  return [];\\n}",
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
      python: `def findTargetPair(nums: list[int], target: int) -> list[int]:
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
    hintTopic: "Two-Pointer Inward Boundary Scanning",
    hints: [
      "Instead of building a brand new filtered string in extra memory, can you check matching letters from both ends simultaneously?",
      "Think of folding a chapati or roti in half from outer crust to center: both opposite crust edges must match in shape before you check the inner layers.",
      "1. Initialize two pointers: left = 0 and right = s.length - 1.\n2. While left < right, skip any characters that are not alphanumeric.\n3. Compare the lowercase versions of characters at left and right.\n4. If they mismatch, return false immediately; if they match, move both pointers inward.\n5. If pointers cross without mismatch, return true.",
      "function isPalindrome(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    while (left < right && !isAlphaNum(s[left])) left++;\n    while (left < right && !isAlphaNum(s[right])) right--;\n    if (s[left].toLowerCase() !== ____) return false;\n    left++;\n    right--;\n  }\n  return ____;\n}",
    ],
    hintsHinglish: [
      "Naya filtered string banaye bina, kya hum dono ends se ek saath matching letters check kar sakte hain?",
      "Roti ya chapati ko beech me se fold karne jaisa socho: outer kinare pehle match hone chahiye, fir andar ki layers.",
      "1. Do pointers rakho: left = 0 aur right = s.length - 1.\\n2. Non-alphanumeric characters ko skip karo.\\n3. Dono characters ko lowercase me compare karo.\\n4. Mismatch mile toh seedha false return karo; match ho toh dono pointers andar lao.\\n5. Pointers cross hone par true return karo.",
      "function isPalindrome(s) {\\n  let left = 0, right = s.length - 1;\\n  while (left < right) {\\n    while (left < right && !isAlphaNum(s[left])) left++;\\n    while (left < right && !isAlphaNum(s[right])) right--;\\n    if (s[left].toLowerCase() !== ____) return false;\\n    left++; right--;\\n  }\\n  return ____;\\n}",
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
    hintTopic: "Last-In First-Out (LIFO) Stack Balancing",
    hints: [
      "When you open a nested parentheses '(', which closing bracket must you see first before closing any outer bracket?",
      "Think of a stack of stainless steel dinner plates in a wedding buffet: the last clean plate placed on top must be the very first plate lifted off.",
      "1. Create an empty stack and a lookup table mapping each closing delimiter to its opening counterpart.\n2. Iterate through each character in the string.\n3. If it is an opening bracket '(', '[', '{', push it onto the stack.\n4. If it is a closing bracket, check if the stack top matches; if not, return false.\n5. After inspecting all characters, return true only if the stack is completely empty.",
      "function isValidDelimiters(s) {\n  const stack = [];\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  for (const ch of s) {\n    if (ch === '(' || ch === '[' || ch === '{') {\n      stack.push(____);\n    } else if (pairs[ch]) {\n      if (stack.pop() !== ____) return false;\n    }\n  }\n  return stack.length === ____;\n}",
    ],
    hintsHinglish: [
      "Jab aap koi bracket '(' kholte hain, toh kisi outer bracket ko band karne se pehle kaunsa bracket band hona zaroori hai?",
      "Wedding buffet me plates ke stack jaisa socho: sabse aakhiri me upar rakhi plate hi sabse pehle uthayi jaati hai (LIFO).",
      "1. Ek empty stack banao aur closing brackets ka opening counterpart map karo.\\n2. String ke har character ko iterate karo.\\n3. Opening bracket ho toh stack me push karo.\\n4. Closing bracket aane par check karo ki stack top match karta hai ya nahi.\\n5. End me return true tabhi karo jab stack bilkul empty ho.",
      "function isValidDelimiters(s) {\\n  const stack = [];\\n  const pairs = { ')': '(', ']': '[', '}': '{' };\\n  for (const ch of s) {\\n    if (ch === '(' || ch === '[' || ch === '{') {\\n      stack.push(____);\\n    } else if (pairs[ch]) {\\n      if (stack.pop() !== ____) return false;\\n    }\\n  }\\n  return stack.length === ____;\\n}",
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
    hintTopic: "Kadane's Dynamic Accumulator",
    hints: [
      "If the cumulative sum of your current subarray drops into negative territory, does it help or hurt the numbers that come after it?",
      "Think of batting momentum in a cricket T20 powerplay: if previous overs have dragged down your run rate below zero, it's better to reset your partnership fresh rather than carrying negative momentum.",
      "1. Track two variables: currentSum and maxSum, initialized to the first element.\n2. Iterate through the array starting from index 1.\n3. At each number, decide: is it better to add it to currentSum or start a new subarray with this number alone?\n4. Update maxSum with the highest value seen so far.\n5. Return maxSum.",
      "function maxSubArrayGain(nums) {\n  let current = nums[0];\n  let maxGain = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    current = Math.max(nums[i], ____ + nums[i]);\n    maxGain = Math.max(maxGain, ____);\n  }\n  return maxGain;\n}",
    ],
    hintsHinglish: [
      "Agar aapke current subarray ka sum negative ho jata hai, toh kya wo aane wale agle numbers ko fayda dega ya nuksaan?",
      "Cricket T20 powerplay ki batting partnership jaisa socho: agar pichle overs negative momentum de rahe hain, toh nayi partnership fresh shuru karna better hota hai.",
      "1. Do variables rakho: currentSum aur maxSum, dono ko first number se initialize karo.\\n2. Index 1 se loop chalao.\\n3. Har number par decide karo: purane sum me add karein ya naya subarray isi number se start karein?\\n4. maxSum ko highest value se update karte raho.\\n5. maxSum return karo.",
      "function maxSubArrayGain(nums) {\\n  let current = nums[0];\\n  let maxGain = nums[0];\\n  for (let i = 1; i < nums.length; i++) {\\n    current = Math.max(nums[i], ____ + nums[i]);\\n    maxGain = Math.max(maxGain, ____);\\n  }\\n  return maxGain;\\n}",
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
    hintTopic: "Two-Pointer Sorted Sequence Merge",
    hints: [
      "Since both input arrays are already sorted, where will their smallest overall elements always be located?",
      "Think of two separate queues of passengers boarding a flight by seat sequence: the ticket agent repeatedly picks whoever in front of either queue has the earlier sequence ticket.",
      "1. Initialize two pointers i = 0 (for nums1) and j = 0 (for nums2), and an empty merged array.\n2. While both pointers are within bounds, compare nums1[i] and nums2[j].\n3. Append the smaller element to the merged array and advance its pointer.\n4. Once one array is exhausted, append all remaining items from the other array.\n5. Return the merged array.",
      "function mergeSortedArrays(nums1, nums2) {\n  let i = 0, j = 0;\n  const result = [];\n  while (i < nums1.length && j < nums2.length) {\n    if (nums1[i] <= nums2[j]) {\n      result.push(nums1[____]);\n    } else {\n      result.push(nums2[____]);\n    }\n  }\n  return result.concat(nums1.slice(i)).concat(nums2.slice(____));\n}",
    ],
    hintsHinglish: [
      "Chunki dono arrays pehle se sorted hain, dono arrays ke sabse chote elements hamesha kahan milenge?",
      "Flight boarding ke do alag queues jaisa socho: ticket checker dono lines ke aage khade passenger me se jiska seat number chota hai, usko pehle aage bhejta hai.",
      "1. Pointers i = 0 aur j = 0 rakho aur ek result array banao.\\n2. Jab tak dono bounds me hain, nums1[i] aur nums2[j] ko compare karo.\\n3. Chote element ko result me push karo aur uska pointer aage badhao.\\n4. Loop khatam hone ke baad bache huye elements ko concat karo.\\n5. Merged array return karo.",
      "function mergeSortedArrays(nums1, nums2) {\\n  let i = 0, j = 0;\\n  const result = [];\\n  while (i < nums1.length && j < nums2.length) {\\n    if (nums1[i] <= nums2[j]) {\\n      result.push(nums1[____]);\\n    } else {\\n      result.push(nums2[____]);\\n    }\\n  }\\n  return result.concat(nums1.slice(i)).concat(nums2.slice(____));\\n}",
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
    hintTopic: "Modulo Divisibility Branching",
    hints: [
      "Which divisibility check must you perform first to avoid premature matching on single multiples?",
      "Think of a school roll-call game: players must shout the special team name when both rules trigger before shouting individual team calls.",
      "1. Loop from 1 to n.\n2. For each number, check if divisible by both 3 and 5 first (or 15).\n3. Otherwise check divisibility by 3, then 5.\n4. If none match, convert the number to string.\n5. Push the resulting token into an array and return it.",
      "function generateForgeSequence(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) {\n      result.push('CodeForge');\n    } else if (i % 3 === 0) {\n      result.push(____);\n    } else if (i % 5 === 0) {\n      result.push(____);\n    } else {\n      result.push(String(____));\n    }\n  }\n  return result;\n}",
    ],
    hintsHinglish: [
      "Kaunsa divisibility check pehle karna chahiye taaki single multiples prematurely match na ho jayein?",
      "School ke roll-call game jaisa socho: jab dono rules match hote hain toh special team name pehle bolna padta hai, single rule baad me.",
      "1. 1 se n tak loop lagao.\\n2. Har number ke liye pehle check karo agar 3 aur 5 dono se divisible ho (ya 15 se).\\n3. Fir 3 se, aur fir 5 se check karo.\\n4. Agar koi match na ho toh number ko string me convert karo.\\n5. Array me push karke return karo.",
      "function generateForgeSequence(n) {\\n  const result = [];\\n  for (let i = 1; i <= n; i++) {\\n    if (i % 15 === 0) {\\n      result.push('CodeForge');\\n    } else if (i % 3 === 0) {\\n      result.push(____);\\n    } else if (i % 5 === 0) {\\n      result.push(____);\\n    } else {\\n      result.push(String(____));\\n    }\\n  }\\n  return result;\\n}",
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
    hintTopic: "Character Frequency Hash Mapping",
    hints: [
      "If two words are valid anagrams, what must be true about the exact counts of each letter?",
      "Think of two grocery shopping bags: if two chefs cooked identical dishes, every ingredient packet in both bags must match item-by-item in exact count.",
      "1. Check if strings have identical length; if not, return false immediately.\n2. Build a frequency table or array of size 26 for string s.\n3. Decrement frequencies using characters from string t.\n4. If any count drops below zero, return false.\n5. Return true if all counts match zero.",
      "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const counts = {};\n  for (const char of s) {\n    counts[char] = (counts[char] || 0) + 1;\n  }\n  for (const char of t) {\n    if (!counts[char]) return false;\n    counts[char] = counts[char] - ____;\n  }\n  return ____;\n}",
    ],
    hintsHinglish: [
      "Agar do words valid anagrams hain, toh har letter ke exact count ke baare me kya sach hona zaroori hai?",
      "Do shopping bags jaisa socho: agar do chefs ne ek jaisi recipe banayi hai, toh dono ke bags me har ek ingredient packet ka count exactly barabar hona chahiye.",
      "1. Pehle check karo agar strings ki length alag hai toh seedha false return karo.\\n2. Pehli string ke letters ka count 26-size array ya map me store karo.\\n3. Dusri string ke letters se counts decrement karo.\\n4. Agar koi count negative hua toh return false.\\n5. Sab match hone par return true.",
      "function isAnagram(s, t) {\\n  if (s.length !== t.length) return false;\\n  const counts = {};\\n  for (const char of s) {\\n    counts[char] = (counts[char] || 0) + 1;\\n  }\\n  for (const char of t) {\\n    if (!counts[char]) return false;\\n    counts[char] = counts[char] - ____;\\n  }\\n  return ____;\\n}",
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
    hintTopic: "Logarithmic Interval Division",
    hints: [
      "How can you cut the search space in half after a single comparison in a sorted array?",
      "Think of looking up a contact in an old telephone directory: you flip open to the middle page, determine if the surname comes before or after, and discard half the book instantly.",
      "1. Maintain two boundaries: left = 0 and right = nums.length - 1.\n2. While left <= right, calculate mid = Math.floor((left + right) / 2).\n3. If nums[mid] === target, return mid.\n4. If nums[mid] < target, discard left half: left = mid + 1.\n5. If nums[mid] > target, discard right half: right = mid - 1.\n6. Return -1 if not found.",
      "function searchTarget(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = ____;\n    else right = ____;\n  }\n  return -1;\n}",
    ],
    hintsHinglish: [
      "Sorted array me ek single comparison ke baad aap search space ko aadha kaise kar sakte hain?",
      "Puraani telephone directory me contact dhoondhne jaisa socho: aap beech ka page kholte hain, dekhte hain ki naam pehle aayega ya baad me, aur aadhi kitaab turant chhod dete hain.",
      "1. Boundaries rakho: left = 0 aur right = n - 1.\\n2. Jab tak left <= right, mid = Math.floor((left + right) / 2) calculate karo.\\n3. Agar nums[mid] === target toh mid return karo.\\n4. Agar nums[mid] < target toh left half chhod do: left = mid + 1.\\n5. Agar nums[mid] > target toh right half chhod do: right = mid - 1.\\n6. Agar na mile toh return -1.",
      "function searchTarget(nums, target) {\\n  let left = 0, right = nums.length - 1;\\n  while (left <= right) {\\n    const mid = Math.floor((left + right) / 2);\\n    if (nums[mid] === target) return mid;\\n    if (nums[mid] < target) left = ____;\\n    else right = ____;\\n  }\\n  return -1;\\n}",
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
    hintTopic: "Sliding Window with Hash Set",
    hints: [
      "When you encounter a duplicate character while scanning rightward, how should your window's left boundary adjust?",
      "Think of an expanding rubber band across a bookshelf: you stretch the right end until you hit a duplicate book title, then slide the left end forward to restore uniqueness.",
      "1. Maintain two pointers left = 0, right = 0 and a Set of characters in the current window.\n2. Expand right pointer across the string.\n3. If char at right is already in Set, delete s[left] and increment left until duplicate is removed.\n4. Add s[right] to Set and update maxLength = Math.max(maxLength, right - left + 1).\n5. Return maxLength.",
      "function lengthOfLongestSubstring(s) {\n  const seen = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (seen.has(s[right])) {\n      seen.delete(s[____]);\n      left++;\n    }\n    seen.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + ____);\n  }\n  return maxLen;\n}",
    ],
    hintsHinglish: [
      "Rightward scan karte waqt jab koi duplicate character milta hai, toh aapke window ki left boundary ko kaise aage badhna chahiye?",
      "Bookshelf par rubber band stretch karne jaisa socho: right end ko tab tak kheecho jab tak duplicate book na mile, fir duplicate hatane ke liye left end aage slide karo.",
      "1. Do pointers left = 0, right = 0 aur ek visited Set maintain karo.\\n2. right pointer se string ko expand karo.\\n3. Agar s[right] pehle se Set me hai, toh s[left] ko delete karke left++ karte raho jab tak duplicate na nikal jaye.\\n4. s[right] ko Set me add karo aur maxLen update karo.\\n5. maxLen return karo.",
      "function lengthOfLongestSubstring(s) {\\n  const seen = new Set();\\n  let left = 0, maxLen = 0;\\n  for (let right = 0; right < s.length; right++) {\\n    while (seen.has(s[right])) {\\n      seen.delete(s[____]);\\n      left++;\\n    }\\n    seen.add(s[right]);\\n    maxLen = Math.max(maxLen, right - left + ____);\\n  }\\n  return maxLen;\\n}",
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
    hintTopic: "Two-Pointer Inward Vowel Swapping",
    hints: [
      "How can you track the next vowel from the start and the next vowel from the end simultaneously?",
      "Think of two passengers on a train carriage swapping reserved window seats: both walk down the aisle from opposite ends until they meet at their respective seat numbers and swap tokens.",
      "1. Convert string to character array.\n2. Initialize left = 0 and right = arr.length - 1.\n3. Advance left until pointing at a vowel.\n4. Decrement right until pointing at a vowel.\n5. Swap vowels at left and right, then move both inward.\n6. Return joined array as string.",
      "function reverseVowels(s) {\n  const vowels = new Set('aeiouAEIOU');\n  const arr = s.split('');\n  let left = 0, right = arr.length - 1;\n  while (left < right) {\n    while (left < right && !vowels.has(arr[left])) left++;\n    while (left < right && !vowels.has(arr[right])) right--;\n    if (left < right) {\n      const temp = arr[left];\n      arr[left] = arr[right];\n      arr[right] = temp;\n      left++; right--;\n    }\n  }\n  return arr.join(____);\n}",
    ],
    hintsHinglish: [
      "Shuruat se agla vowel aur aakhir se agla vowel ek saath kaise track kar sakte hain?",
      "Train carriage me do passengers ke reserved window seats swap karne jaisa socho: dono opposite darwaze se chalte hain aur aamne-saamne aane par seats swap karte hain.",
      "1. String ko character array me convert karo.\\n2. left = 0 aur right = arr.length - 1 pointers lo.\\n3. left ko aage badhao jab tak vowel na mile.\\n4. right ko peeche lao jab tak vowel na mile.\\n5. Dono vowels swap karo, fir left++ aur right-- karo.\\n6. Array ko join karke string return karo.",
      "function reverseVowels(s) {\\n  const vowels = new Set('aeiouAEIOU');\\n  const arr = s.split('');\\n  let left = 0, right = arr.length - 1;\\n  while (left < right) {\\n    while (left < right && !vowels.has(arr[left])) left++;\\n    while (left < right && !vowels.has(arr[right])) right--;\\n    if (left < right) {\\n      const temp = arr[left];\\n      arr[left] = arr[right];\\n      arr[right] = temp;\\n      left++; right--;\\n    }\\n  }\\n  return arr.join(____);\\n}",
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
    hintTopic: "Modulo Normalization & Three-Phase Reversal",
    hints: [
      "What happens if you reverse the entire array first, then reverse the two partitions separately?",
      "Think of rearranging playing cards in your hand: flip the whole deck upside down, then flip the top group and bottom group back upright to shift their order in-place.",
      "1. Normalize k = k % nums.length.\n2. Reverse the entire array from 0 to n - 1.\n3. Reverse the first k elements from 0 to k - 1.\n4. Reverse the remaining elements from k to n - 1.\n5. Return the modified array.",
      "function rotateArray(nums, k) {\n  k = k % nums.length;\n  const reverse = (start, end) => {\n    while (start < end) {\n      [nums[start], nums[end]] = [nums[end], nums[start]];\n      start++; end--;\n    }\n  };\n  reverse(0, nums.length - 1);\n  reverse(0, ____);\n  reverse(k, nums.length - 1);\n  return nums;\n}",
    ],
    hintsHinglish: [
      "Agar aap pehle poore array ko reverse karein, aur fir dono parts ko alag-alag reverse karein, toh kya hota hai?",
      "Haath me taash ke patte ghumane jaisa socho: poori gaddi ulto, fir upar ka hissa aur neeche ka hissa seedha karo, order bina extra jagah ke shift ho jata hai.",
      "1. k ko normalize karo: k = k % nums.length.\\n2. Poore array ko 0 se n - 1 reverse karo.\\n3. Pehle k elements ko 0 se k - 1 reverse karo.\\n4. Bache huye elements ko k se n - 1 reverse karo.\\n5. Modified array return karo.",
      "function rotateArray(nums, k) {\\n  k = k % nums.length;\\n  const reverse = (start, end) => {\\n    while (start < end) {\\n      [nums[start], nums[end]] = [nums[end], nums[start]];\\n      start++; end--;\\n    }\\n  };\\n  reverse(0, nums.length - 1);\\n  reverse(0, ____);\\n  reverse(k, nums.length - 1);\\n  return nums;\\n}",
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
    hintTopic: "Greedy Boundary Squeeze",
    hints: [
      "Between the two vertical walls bounding your reservoir, which wall limits the total water height you can hold?",
      "Think of a wooden storage barrel: water leaks out over the lowest stave, so making the barrel taller on the high side never increases capacity until you raise the shortest side.",
      "1. Initialize two pointers left = 0 and right = height.length - 1.\n2. Compute current area = min(height[left], height[right]) * (right - left).\n3. Update maxArea with current area.\n4. Move the pointer pointing to the shorter wall inward.\n5. Repeat until pointers meet and return maxArea.",
      "function maxWaterArea(height) {\n  let left = 0, right = height.length - 1, maxArea = 0;\n  while (left < right) {\n    const h = Math.min(height[left], height[right]);\n    maxArea = Math.max(maxArea, h * (____));\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return maxArea;\n}",
    ],
    hintsHinglish: [
      "Dono vertical diwaaron me se kaunsi diwaar yeh tay karti hai ki aap kitna paani rok sakte hain?",
      "Lakdi ke baalti jaisa socho: paani sabse chote phatte se bahar nikalta hai, isliye badi diwaar ko aur bada karne se fayda nahi hoga jab tak choti diwaar na badle.",
      "1. Pointers left = 0 aur right = height.length - 1 initialize karo.\\n2. Current area = min(height[left], height[right]) * (right - left) nikalo.\\n3. maxArea ko maximize karo.\\n4. Choti diwaar wale pointer ko andar move karo.\\n5. Pointers milne par maxArea return karo.",
      "function maxWaterArea(height) {\\n  let left = 0, right = height.length - 1, maxArea = 0;\\n  while (left < right) {\\n    const h = Math.min(height[left], height[right]);\\n    maxArea = Math.max(maxArea, h * (____));\\n    if (height[left] < height[right]) left++;\\n    else right--;\\n  }\\n  return maxArea;\\n}",
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
    hintTopic: "Gauss Arithmetic Sum Formula",
    hints: [
      "What is the mathematical sum of consecutive integers from 0 to n compared to the actual sum of your array?",
      "Think of a pack of 10 numbered coupons: if you add up the numbers that should be in a full set and subtract what you physically hold, the difference is the missing coupon.",
      "1. Let n = nums.length.\n2. Compute expectedSum = n * (n + 1) / 2.\n3. Calculate actualSum = sum of all elements in nums.\n4. Return expectedSum - actualSum.",
      "function findMissingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((acc, curr) => acc + ____, 0);\n  return expectedSum - ____;\n}",
    ],
    hintsHinglish: [
      "0 se n tak ke natural numbers ka mathematical sum aur aapke array ke actual sum me kya relation hota hai?",
      "10 numbered coupons ke pack jaisa socho: agar poore set ka expected total pata hai, toh haath me maujood coupons ke total ko subtract karke missing coupon turant mil jata hai.",
      "1. n = nums.length lo.\\n2. expectedSum = (n * (n + 1)) / 2 nikalo.\\n3. actualSum = nums ke sabhi elements ka jod nikalo.\\n4. expectedSum - actualSum return karo.",
      "function findMissingNumber(nums) {\\n  const n = nums.length;\\n  const expectedSum = (n * (n + 1)) / 2;\\n  const actualSum = nums.reduce((acc, curr) => acc + ____, 0);\\n  return expectedSum - ____;\\n}",
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
    hintTopic: "Contiguous Run-Length Two-Pointer Inspection",
    hints: [
      "How can you count the run length of identical letters before advancing your write index?",
      "Think of a shorthand stenographer: when someone repeats the word 'aye' four times, the scribe writes 'aye4' instead of spelling each out.",
      "1. Use read pointer to find start of character run.\n2. Advance read pointer while characters match to calculate count.\n3. Write the character at write pointer.\n4. If count > 1, convert count to string and write each digit.\n5. Return compressed length.",
      "function compressSequence(chars) {\n  let write = 0, read = 0;\n  while (read < chars.length) {\n    const char = chars[read];\n    let count = 0;\n    while (read < chars.length && chars[read] === char) {\n      read++; count++;\n    }\n    chars[write++] = char;\n    if (count > 1) {\n      for (const digit of String(count)) {\n        chars[write++] = ____;\n      }\n    }\n  }\n  return ____;\n}",
    ],
    hintsHinglish: [
      "Write index ko aage badhane se pehle identical letters ki run length kaise count kar sakte hain?",
      "Shorthand munshi jaisa socho: agar koi lagataar char baar 'haan' bolta hai, toh munshi 'haan4' likhta hai bajaye har baar dohrane ke.",
      "1. read pointer se current character ka sequence count karo.\\n2. Jab tak same character mile, read++ aur count++ karo.\\n3. Character ko write pointer par daalo.\\n4. Agar count > 1 ho, toh count ke har digit ko write pointer par daalo.\\n5. write length return karo.",
      "function compressSequence(chars) {\\n  let write = 0, read = 0;\\n  while (read < chars.length) {\\n    const char = chars[read];\\n    let count = 0;\\n    while (read < chars.length && chars[read] === char) {\\n      read++; count++;\\n    }\\n    chars[write++] = char;\\n    if (count > 1) {\\n      for (const digit of String(count)) {\\n        chars[write++] = ____;\\n      }\\n    }\\n  }\\n  return ____;\\n}",
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
    hintTopic: "Four-Boundary Shrinking Matrix Traversal",
    hints: [
      "How can you contract the four borders (top, bottom, left, right) after each direction sweep?",
      "Think of peeling an onion layer by layer or driving along a shrinking rectangular perimeter fence inward until reaching the center pole.",
      "1. Maintain boundaries top = 0, bottom = rows - 1, left = 0, right = cols - 1.\n2. Traverse left-to-right along top boundary, then increment top.\n3. Traverse top-to-bottom along right boundary, then decrement right.\n4. If boundaries still valid, traverse right-to-left along bottom, then decrement bottom.\n5. If boundaries still valid, traverse bottom-to-top along left, then increment left.\n6. Return collected order.",
      "function walkSpiral(matrix) {\n  const res = [];\n  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\n    right--;\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\n      left++;\n    }\n  }\n  return ____;\n}",
    ],
    hintsHinglish: [
      "Har direction me chakkar lagane ke baad aap chaaro deewaron (top, bottom, left, right) ko kaise contract kar sakte hain?",
      "Pyaz ke chhilke utarne ya gol ghumte huye khet ki baadh andar karte jaane jaisa socho jab tak aap center me na pahunch jayein.",
      "1. Boundaries lo: top = 0, bottom = rows - 1, left = 0, right = cols - 1.\\n2. Top row left-to-right traverse karo, top++ karo.\\n3. Right col top-to-bottom traverse karo, right-- karo.\\n4. Agar boundaries valid hain, bottom row right-to-left traverse karo, bottom-- karo.\\n5. Left col bottom-to-top traverse karo, left++ karo.\\n6. Collected order return karo.",
      "function walkSpiral(matrix) {\\n  const res = [];\\n  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\\n  while (top <= bottom && left <= right) {\\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\\n    top++;\\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\\n    right--;\\n    if (top <= bottom) {\\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\\n      bottom--;\\n    }\\n    if (left <= right) {\\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\\n      left++;\\n    }\\n  }\\n  return ____;\\n}",
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
    hintTopic: "Dynamic Programming Unbounded Knapsack Tabulation",
    hints: [
      "If you know the minimum coins required for every value up to i, how can testing each coin denomination build the answer for i?",
      "Think of paying exact bus fare using change in your pocket: for every rupee amount, you try using each coin once and look up the known fewest coins for the remaining change.",
      "1. Create array dp of size amount + 1 filled with Infinity.\n2. Base case: dp[0] = 0 (zero coins needed for zero amount).\n3. For each coin c and each target i from c to amount: dp[i] = Math.min(dp[i], dp[i - c] + 1).\n4. Return dp[amount] === Infinity ? -1 : dp[amount].",
      "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (const coin of coins) {\n    for (let i = coin; i <= amount; i++) {\n      dp[i] = Math.min(dp[i], dp[____] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[____];\n}",
    ],
    hintsHinglish: [
      "Agar aapko amount i tak ke har value ke minimum coins pata hain, toh har coin try karke agla answer kaise banayenge?",
      "Pocket ke khulle paise se bus ticket khareedne jaisa socho: har amount ke liye aap har sikke ko try karte hain aur bache huye change ka best answer lookup karte hain.",
      "1. dp array banao size amount + 1, Infinity se bharo aur dp[0] = 0 karo.\\n2. Har coin c ke liye, loop i from c to amount.\\n3. dp[i] = Math.min(dp[i], dp[i - c] + 1) update karo.\\n4. Return dp[amount] === Infinity ? -1 : dp[amount].",
      "function coinChange(coins, amount) {\\n  const dp = new Array(amount + 1).fill(Infinity);\\n  dp[0] = 0;\\n  for (const coin of coins) {\\n    for (let i = coin; i <= amount; i++) {\\n      dp[i] = Math.min(dp[i], dp[____] + 1);\\n    }\\n  }\\n  return dp[amount] === Infinity ? -1 : dp[____];\\n}",
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
    hintTopic: "Fibonacci Recurrence Dynamic Programming",
    hints: [
      "To arrive at step n, you must have stepped from either step n - 1 or step n - 2. How does this define the number of ways?",
      "Think of playing hopscotch: to land on tile 5, you either jumped 1 tile from tile 4 or 2 tiles from tile 3; your options are simply the sum of both paths.",
      "1. Base cases: if n <= 2, return n.\n2. Initialize two variables prev2 = 1 (step 1) and prev1 = 2 (step 2).\n3. Loop i from 3 to n.\n4. Compute current = prev1 + prev2.\n5. Advance prev2 = prev1, prev1 = current.\n6. Return prev1.",
      "function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const current = prev1 + ____;\n    prev2 = prev1;\n    prev1 = ____;\n  }\n  return prev1;\n}",
    ],
    hintsHinglish: [
      "Step n par aane ke liye aap ya toh step n - 1 se ya step n - 2 se jump kar sakte hain. Yeh formula kaise banta hai?",
      "Langdi taang ya hopscotch khelne jaisa socho: tile 5 par aane ke liye aapne ya toh 4 se 1 jump lagayi hogi ya 3 se 2 jump; total raaste dono ka sum hain.",
      "1. Base cases: agar n <= 2 ho toh n return karo.\\n2. Do variables lo prev2 = 1 aur prev1 = 2.\\n3. Loop i = 3 to n chalao.\\n4. current = prev1 + prev2 nikalo, prev2 = prev1 aur prev1 = current karo.\\n5. prev1 return karo.",
      "function climbStairs(n) {\\n  if (n <= 2) return n;\\n  let prev2 = 1, prev1 = 2;\\n  for (let i = 3; i <= n; i++) {\\n    const current = prev1 + ____;\\n    prev2 = prev1;\\n    prev1 = ____;\\n  }\\n  return prev1;\\n}",
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
    hintTopic: "Categorization via Canonical Hash Keys",
    hints: [
      "What transformation can you apply to any word so that all of its anagrams produce the exact same identifier?",
      "Think of sorting student folders into library pigeonholes: sorting all the letters alphabetically gives every anagram the identical label sticker.",
      "1. Create a hash map groups mapping signature string -> list of words.\n2. For each word in the input, sort its letters to produce key = word.split('').sort().join('').\n3. Append the word to groups[key].\n4. Return Object.values(groups).",
      "function groupAnagrams(strs) {\n  const map = {};\n  for (const s of strs) {\n    const key = s.split('').sort().join('____');\n    if (!map[key]) map[key] = [];\n    map[key].push(____);\n  }\n  return Object.values(____);\n}",
    ],
    hintsHinglish: [
      "Aap kisi bhi word par kaunsa transform laga sakte hain taaki uske sabhi anagrams ka exactly same identifier bane?",
      "Library me kitaabein pigeonhole rack me rakhne jaisa socho: letters ko alphabetically sort karne se har anagram ko ek jaisa sticker label mil jata hai.",
      "1. Hash map groups banao mapping signature string -> list of words.\\n2. Har word ke letters sort karke key = word.split('').sort().join('') banao.\\n3. word ko groups[key] me push karo.\\n4. Object.values(groups) return karo.",
      "function groupAnagrams(strs) {\\n  const map = {};\\n  for (const s of strs) {\\n    const key = s.split('').sort().join('____');\\n    if (!map[key]) map[key] = [];\\n    map[key].push(____);\\n  }\\n  return Object.values(____);\\n}",
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
    hintTopic: "Floyd's Tortoise and Hare Cycle Detection",
    hints: [
      "If two runners jog around a circular racing track at different speeds, will the faster runner eventually lap the slower runner?",
      "Think of two cars on a circular race circuit: a sports car moving at 200 km/h will eventually pull up right behind a truck going at 100 km/h if there's a loop.",
      "1. Initialize two pointers slow and fast at start index 0.\n2. In each iteration, advance slow by 1 jump and fast by 2 jumps.\n3. If fast falls out of bounds or reaches -1, no cycle exists; return false.\n4. If slow === fast, a cycle is detected; return true.",
      "function hasJumpCycle(nextPointers) {\\n  let slow = 0, fast = 0;\n  while (fast !== -1 && nextPointers[fast] !== -1 && nextPointers[fast] !== undefined) {\n    slow = nextPointers[slow];\n    fast = nextPointers[nextPointers[fast]];\n    if (slow === ____) return true;\n  }\n  return ____;\n}",
    ],
    hintsHinglish: [
      "Agar do runners circular track par alag-alag speed se daud rahe hain, toh kya tez runner dheere wale ko lap karega?",
      "Circular race circuit par do gaadiyon jaisa socho: 200 km/h wali sports car loop me ghoomte huye aage chal rahi 100 km/h wali truck ke peeche zaroor aayegi.",
      "1. Do pointers slow = 0 aur fast = 0 initialize karo.\\n2. Har step me slow ko 1 jump aur fast ko 2 jumps aage badhao.\\n3. Agar fast out of bounds ya -1 par pahuche, toh koi cycle nahi hai (return false).\\n4. Agar slow === fast ho jaye, toh cycle detect ho gayi (return true).",
      "function hasJumpCycle(nextPointers) {\\n  let slow = 0, fast = 0;\\n  while (fast !== -1 && nextPointers[fast] !== -1 && nextPointers[fast] !== undefined) {\\n    slow = nextPointers[slow];\\n    fast = nextPointers[nextPointers[fast]];\\n    if (slow === ____) return true;\\n  }\\n  return ____;\\n}",
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
    hintTopic: "Single-Pass Trailing Minimum Tracking",
    hints: [
      "To maximize your profit, on any given day, what single piece of historical price information do you wish you knew?",
      "Think of buying gold at jewelry bazaars: you always remember the cheapest price you've ever seen so far, and calculate today's profit against that minimum.",
      "1. Initialize minPrice = Infinity and maxProfit = 0.\n2. Iterate through each price in the array.\n3. Update minPrice = Math.min(minPrice, price).\n4. Calculate potentialProfit = price - minPrice.\n5. Update maxProfit = Math.max(maxProfit, potentialProfit).\n6. Return maxProfit.",
      "function maxProfit(prices) {\n  let minPrice = Infinity, maxProfit = 0;\n  for (const p of prices) {\n    minPrice = Math.min(minPrice, ____);\n    maxProfit = Math.max(maxProfit, p - ____);\n  }\n  return maxProfit;\n}",
    ],
    hintsHinglish: [
      "Profit maximize karne ke liye, kisi bhi din par, pichle dino ki kaunsi ek price information pata honi zaroori hai?",
      "Jewelry bazaar me gold khareedne jaisa socho: aap hamesha ab tak ka sabse sasta daam yaad rakhte hain, aur aaj bechne par usi minimum price ke against profit calculate karte hain.",
      "1. minPrice = Infinity aur maxProfit = 0 initialize karo.\\n2. Prices array me iterate karo.\\n3. minPrice = Math.min(minPrice, price) update karo.\\n4. Aaj ka profit = price - minPrice nikalo aur maxProfit = Math.max(maxProfit, potentialProfit) karo.\\n5. maxProfit return karo.",
      "function maxProfit(prices) {\\n  let minPrice = Infinity, maxProfit = 0;\\n  for (const p of prices) {\\n    minPrice = Math.min(minPrice, ____);\\n    maxProfit = Math.max(maxProfit, p - ____);\\n  }\\n  return maxProfit;\\n}",
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

import catalogData from "./problemsCatalog.json";
import detailsData from "./problemsDetails.json";

const premierMap = new Map<string, Problem>(premierProblems.map((p) => [p.slug, p]));

export const problems: Problem[] = (
  catalogData as Array<{
    id: string;
    slug: string;
    title: string;
    difficulty: any;
    tags: string[];
  }>
).map((item) => {
  const premier = premierMap.get(item.slug);
  if (premier) return premier;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    difficulty: item.difficulty,
    tags: item.tags,
    description: "",
    examples: [],
    constraints: [],
    hints: [],
    functionName: item.slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()),
    starterCode: {
      javascript: "",
      python: "",
    },
    testCases: [],
  };
});

const detailsMap = detailsData as Record<
  string,
  {
    id: string;
    slug: string;
    title: string;
    difficulty: any;
    tags: string[];
    description: string;
    functionName: string;
  }
>;

export function getProblemBySlug(slug: string): Problem | undefined {
  const premier = premierMap.get(slug);
  if (premier) return premier;

  const detail = detailsMap[slug];
  if (!detail) return undefined;

  const fnName = detail.functionName || slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

  return {
    id: detail.id,
    slug: detail.slug,
    title: detail.title,
    difficulty: detail.difficulty,
    tags: detail.tags,
    description: detail.description,
    examples: [
      {
        id: 1,
        input: "Refer to the problem description for format & constraints.",
        output: "Valid result matching problem specifications.",
      },
    ],
    constraints: [
      "Optimal time and space complexity required.",
      "Handle all edge cases and boundary conditions.",
    ],
    hintTopic: detail.tags?.[0] ? `${detail.tags[0]} Strategy` : "Algorithmic Pattern",
    hints: [
      "Analyze the problem constraints: What invariant or property of the input allows you to eliminate brute force?",
      "Think of an organized workshop ledger: maintaining sorted order or direct hash lookup turns linear scans into instant O(1) operations.",
      "1. Clarify input bounds and identify edge conditions.\n2. Choose the primary data structure or state transition (e.g., Two Pointers, Hash Table, or DP).\n3. Iterate and compute result in optimal time complexity.",
      `function ${fnName}(...args) {\n  // 1. Initialize state\n  let result = ____;\n  // 2. Iterate and process\n  for (let item of (args[0] || [])) {\n    if (____) result = ____;\n  }\n  return result;\n}`,
    ],
    hintsHinglish: [
      "Input bounds aur constraints ko samjho: Kaunsi aisi property hai jisse brute force scan hataya ja sake?",
      "Organized workshop ledger jaisa socho: sorted order ya direct hash table se linear search instant O(1) me badal jaata hai.",
      "1. Boundary conditions aur edge cases clarify karo.\n2. Primary data structure ya state choose karo (e.g. Two Pointers, Hash Table, ya DP).\n3. Single pass ya optimal traversal se result compute karo.",
      `function ${fnName}(...args) {\n  // 1. State initialize karo\n  let result = ____;\n  // 2. Process karo\n  for (let item of (args[0] || [])) {\n    if (____) result = ____;\n  }\n  return result;\n}`,
    ],
    functionName: fnName,
    starterCode: {
      javascript: `/**\n * @return {any}\n */\nvar ${fnName} = function(...args) {\n    // Your code here\n};\n`,
      python: `def ${fnName}(*args):\n    # Your code here\n    pass\n`,
    },
    testCases: [
      { id: 1, input: [], expected: true, isHidden: false },
      { id: 2, input: [], expected: true, isHidden: true },
    ],
  };
}

export function getAllProblems(): Problem[] {
  return problems;
}
