export interface TeacherNotes {
  coreIdea: string;
  optimalApproach: string;
  commonMistakes: [string, string, string];
  edgeCases: string[];
  conceptToTeach: string;
}

export const TEACHER_NOTES: Record<string, TeacherNotes> = {
  "target-pair-sum": {
    coreIdea: "Trade space for time by storing visited numbers in a hash map to look up the complement in O(1).",
    optimalApproach: "Single pass with hash map: calculate complement = target - nums[i]. If complement is in map, return [map[complement], i]. Otherwise map[nums[i]] = i.",
    commonMistakes: [
      "Using the same element twice (e.g. nums[i] + nums[i] === target when only one instance exists).",
      "Using an O(n^2) nested loop when constraints require an O(n) solution.",
      "Inserting into the hash map before checking for complement, which allows self-matching."
    ],
    edgeCases: ["Negative numbers", "Duplicates adding up to target", "Two elements only", "Large target values"],
    conceptToTeach: "Hash map complement lookup for O(n) single-pass pair finding."
  },
  "palindrome-sentence": {
    coreIdea: "Compare characters symmetrically from both ends inward, ignoring non-alphanumeric symbols and case.",
    optimalApproach: "Two pointers (left = 0, right = n - 1). Advance past non-alphanumeric chars, compare lowercased characters. If mismatch return false; continue until pointers meet.",
    commonMistakes: [
      "Creating a new filtered string in O(n) memory instead of in-place two-pointer traversal.",
      "Forgetting to check left < right inside the inner while-loops when skipping punctuation.",
      "Failing to handle case-insensitivity or non-ASCII characters properly."
    ],
    edgeCases: ["Empty string or string with only punctuation", "Single character", "Already a palindrome", "Odd vs even length matches"],
    conceptToTeach: "Inward two-pointer scanning with boundary guards."
  },
  "valid-delimiter-pairs": {
    coreIdea: "A stack guarantees that the most recently opened bracket must be the first bracket closed (LIFO).",
    optimalApproach: "Iterate through string. Push opening brackets onto stack. For closing brackets, check if stack is empty or top does not match corresponding pair. Return stack.length === 0 at end.",
    commonMistakes: [
      "Popping from an empty stack when encountering a closing bracket first (causes undefined comparison).",
      "Returning true if stack has unclosed opening brackets left at the end (e.g. '(()').",
      "Mismatched bracket types (e.g. '(]' treated as valid if only checking counts instead of order)."
    ],
    edgeCases: ["String of odd length (immediately false)", "Only opening brackets", "Only closing brackets", "Correct brackets in wrong nested order"],
    conceptToTeach: "LIFO stack discipline for nested syntactic validation."
  },
  "maximum-contiguous-gain": {
    coreIdea: "At every index, decide whether to extend the existing contiguous subarray or restart fresh from the current number (Kadane's Algorithm).",
    optimalApproach: "Maintain currentSum and maxSum initialized to nums[0]. For i from 1 to n - 1: currentSum = Math.max(nums[i], currentSum + nums[i]); maxSum = Math.max(maxSum, currentSum).",
    commonMistakes: [
      "Initializing maxSum to 0 instead of nums[0] or -Infinity, which fails when all numbers are negative.",
      "Resetting currentSum to 0 before comparing with maxSum, losing negative single-element maximums.",
      "Trying to sort the array, which destroys contiguity."
    ],
    edgeCases: ["All negative numbers (e.g. [-3, -1, -5])", "Single element array", "All positive numbers", "Alternating large positive and negative numbers"],
    conceptToTeach: "Dynamic programming state transition: local optimal restart vs accumulator."
  },
  "condense-sorted-arrays": {
    coreIdea: "Leverage existing sorted order by repeatedly picking the smaller head element between two pointer queues.",
    optimalApproach: "Maintain pointer i for nums1 and j for nums2. Compare nums1[i] and nums2[j], append smaller to output. Slice remainder once one array exhausts.",
    commonMistakes: [
      "Concatenating and calling .sort(), which costs O((m+n) log(m+n)) instead of linear O(m+n).",
      "Off-by-one errors when advancing indices after appending.",
      "Forgetting to drain remaining elements after the main while loop terminates."
    ],
    edgeCases: ["One array is empty", "Both arrays have identical duplicates", "Disjoint ranges (all elements in nums1 smaller than nums2)", "Single elements"],
    conceptToTeach: "Two-pointer linear sequence merging."
  },
  "fizz-buzz-matrix": {
    coreIdea: "Check combined divisibility (multiples of 15) before checking individual prime factors (3 and 5).",
    optimalApproach: "Loop 1 to n. Check i % 15 === 0 first (or string concatenation of 'Code' and 'Forge'), then i % 3, then i % 5, else string representation.",
    commonMistakes: [
      "Checking i % 3 === 0 before i % 15 === 0, which prevents 'CodeForge' from ever triggering.",
      "1-based indexing vs 0-based indexing mix-ups in the output array.",
      "Returning integers instead of stringified numbers for non-multiples."
    ],
    edgeCases: ["n = 1", "n = 15 (exact boundary)", "Large n values up to 10^4"],
    conceptToTeach: "Order of conditional precedence in divisibility rules."
  },
  "frequency-anagrams": {
    coreIdea: "Two strings are anagrams if and only if their character frequency histograms match exactly.",
    optimalApproach: "If lengths differ, return false. Count characters of first string in array of size 26 (or map). Decrement counts using second string. If any count drops below 0, return false.",
    commonMistakes: [
      "Sorting both strings (O(n log n)) instead of counting frequencies in O(n) time.",
      "Forgetting early exit when s.length !== t.length.",
      "Creating two separate maps and failing to handle missing keys during comparison."
    ],
    edgeCases: ["Different lengths", "Single character match/mismatch", "Strings with identical characters repeated different times", "Non-lowercase inputs"],
    conceptToTeach: "Histogram frequency vector comparison."
  },
  "binary-interval-search": {
    coreIdea: "Halve the monotonic search space with each comparison by checking the midpoint.",
    optimalApproach: "left = 0, right = n - 1. While left <= right: mid = Math.floor((left + right) / 2). If nums[mid] === target return mid. If nums[mid] < target left = mid + 1 else right = mid - 1. Return -1.",
    commonMistakes: [
      "Using left < right instead of left <= right, missing single-element ranges or search targets at ends.",
      "Integer overflow in (left + right) / 2 in languages with fixed-width integers (use left + Math.floor((right - left) / 2)).",
      "Setting left = mid instead of left = mid + 1, causing infinite loops."
    ],
    edgeCases: ["Target not in array", "Array of length 1", "Target is first or last element", "Two elements"],
    conceptToTeach: "Logarithmic binary search boundary invariants."
  },
  "longest-unique-substring": {
    coreIdea: "Maintain a dynamic sliding window [left, right] that expands rightward and contracts from left whenever a duplicate is found.",
    optimalApproach: "Use a Set or Map of visited chars. Expand right pointer. While s[right] is in Set, delete s[left] and increment left. Add s[right], update maxLen = Math.max(maxLen, right - left + 1).",
    commonMistakes: [
      "Not deleting characters from left boundary while shrinking the window, leaving stale characters in the set.",
      "Resetting left all the way to 0 on duplicate instead of sliding forward.",
      "Computing window length as right - left instead of right - left + 1."
    ],
    edgeCases: ["Empty string", "All identical characters ('bbbbb')", "All distinct characters ('abcdef')", "Long strings with repeating patterns"],
    conceptToTeach: "Sliding window with dynamic set contraction."
  },
  "vowel-consonant-flip": {
    coreIdea: "Use two pointers moving inward to swap vowels in-place without altering consonants.",
    optimalApproach: "Convert string to array. Pointers left = 0, right = n - 1. Advance left while char is not vowel; decrement right while char is not vowel. Swap if left < right, then left++, right--. Join and return.",
    commonMistakes: [
      "Attempting string mutation in languages where strings are immutable without converting to array.",
      "Missing uppercase vowels ('A', 'E', 'I', 'O', 'U') in the vowel lookup set.",
      "Missing the left < right check inside the inner skipping while-loops."
    ],
    edgeCases: ["No vowels in string", "All vowels in string", "Single vowel", "Palindrome vowels"],
    conceptToTeach: "Dual inward pointer scanning with conditional filter predicate."
  },
  "rotate-array-k-steps": {
    coreIdea: "Three-phase in-place reversal: reversing the whole array and then each partition shifts elements by k modulo n.",
    optimalApproach: "k = k % n. Reverse entire array 0 to n - 1. Reverse first k elements 0 to k - 1. Reverse remaining elements k to n - 1.",
    commonMistakes: [
      "Forgetting to normalize k with k = k % n, which fails when k >= n.",
      "Using unneeded O(n) auxiliary space when the problem asks for O(1) in-place rotation.",
      "Off-by-one errors in reversal boundaries (k vs k - 1)."
    ],
    edgeCases: ["k = 0 or k === n", "k > n", "Single element array", "Array of length 2 with k = 1"],
    conceptToTeach: "Array reversal partition arithmetic."
  },
  "container-water-reservoir": {
    coreIdea: "The water volume is bounded by the shorter line; to find a larger area, you must greedily move the pointer at the shorter boundary inward.",
    optimalApproach: "left = 0, right = n - 1. While left < right: currentArea = Math.min(h[left], h[right]) * (right - left). Maximize area. Advance whichever pointer is shorter.",
    commonMistakes: [
      "Advancing the taller pointer instead of the shorter pointer, which can never increase the minimum height.",
      "Calculating area with the taller wall instead of the shorter wall.",
      "Using an O(n^2) nested loop when two pointers solve it in O(n)."
    ],
    edgeCases: ["All heights equal", "Strictly ascending or strictly descending heights", "Two elements only", "Very tall narrow peaks vs wide short troughs"],
    conceptToTeach: "Two-pointer greedy boundary elimination."
  },
  "missing-token-sequence": {
    coreIdea: "The expected sum of numbers 0 through n is n * (n + 1) / 2; subtracting the actual array sum gives the missing number.",
    optimalApproach: "n = nums.length. expectedSum = (n * (n + 1)) / 2. actualSum = sum of elements in nums. Return expectedSum - actualSum (or use XOR reduction).",
    commonMistakes: [
      "Sorting the array (O(n log n)) instead of O(n) arithmetic sum or XOR.",
      "Off-by-one with n (using nums.length - 1 instead of nums.length).",
      "Using a hash set which requires unnecessary O(n) extra memory."
    ],
    edgeCases: ["Missing number is 0", "Missing number is n (at the end)", "Array with single element [0] or [1]"],
    conceptToTeach: "Gauss sum reduction or XOR bitwise cancellation."
  },
  "compress-char-runs": {
    coreIdea: "Two pointers (read and write): count consecutive occurrences of the current character and write character followed by count digits in-place.",
    optimalApproach: "read = 0, write = 0. While read < n: start = read, advance read while chars[read] === chars[start]. chars[write++] = chars[start]. If count > 1, write each digit of String(count). Return write.",
    commonMistakes: [
      "Writing '1' when a character appears only once (single characters should have no count written).",
      "Writing multi-digit counts as a single character (e.g. 12 must be written as '1', '2').",
      "Overwriting characters not yet read by letting write pointer pass read pointer (guaranteed safe if moving monotonically)."
    ],
    edgeCases: ["Array with no repeated characters", "Single character array", "Count >= 10 (multi-digit)", "All identical characters"],
    conceptToTeach: "Two-pointer in-place write compaction."
  },
  "spiral-matrix-walk": {
    coreIdea: "Maintain four boundaries (top, bottom, left, right) and shrink them as you traverse the perimeter clockwise.",
    optimalApproach: "top = 0, bottom = m - 1, left = 0, right = n - 1. Loop while top <= bottom && left <= right: traverse top row (top++), right column (right--), bottom row if top <= bottom (bottom--), left column if left <= right (left++).",
    commonMistakes: [
      "Forgetting to verify top <= bottom or left <= right before the reverse traversals (causes duplicate row/column visits in non-square matrices).",
      "Index out of bounds by not contracting boundaries immediately after a traversal.",
      "Failing on 1xN or Nx1 single row or single column matrices."
    ],
    edgeCases: ["Single cell matrix [[1]]", "Single row matrix", "Single column matrix", "Non-square rectangular matrix"],
    conceptToTeach: "Four-boundary perimeter shrinking simulation."
  },
  "coin-denominations-ways": {
    coreIdea: "Unbounded knapsack dynamic programming: dp[i] represents the minimum coins needed to make amount i.",
    optimalApproach: "dp array of size amount + 1 filled with Infinity, dp[0] = 0. For coin of coins: for i from coin to amount: dp[i] = Math.min(dp[i], dp[i - coin] + 1). Return dp[amount] === Infinity ? -1 : dp[amount].",
    commonMistakes: [
      "Using a greedy approach (picking largest coins first), which fails for denominations like [1, 3, 4] with amount 6 (greedy picks 4+1+1=3 coins, optimal is 3+3=2 coins).",
      "Initializing dp array with 0 instead of Infinity, corrupting min() calculations.",
      "Looping backwards when multiple coins of same denomination are allowed (unbounded requires forward inner loop)."
    ],
    edgeCases: ["amount = 0 (returns 0)", "No coin combination can form amount (returns -1)", "Coins greater than amount", "Single coin equals amount"],
    conceptToTeach: "Dynamic programming tabulation for unbounded knapsack."
  },
  "climb-stair-ways": {
    coreIdea: "To reach step n, you must arrive from either step n - 1 (1-step jump) or step n - 2 (2-step jump). Total ways is ways(n-1) + ways(n-2) (Fibonacci sequence).",
    optimalApproach: "If n <= 2 return n. Initialize prev2 = 1, prev1 = 2. Loop i from 3 to n: current = prev1 + prev2, prev2 = prev1, prev1 = current. Return prev1 in O(1) space.",
    commonMistakes: [
      "Using unmemoized recursion which has O(2^n) time complexity and times out.",
      "Off-by-one in base cases: ways(1) = 1, ways(2) = 2, ways(3) = 3.",
      "Allocating an O(n) array when only the last two values are needed for state transition."
    ],
    edgeCases: ["n = 1", "n = 2", "Large n up to 45"],
    conceptToTeach: "Fibonacci linear recurrence with state compression."
  },
  "group-shifted-anagrams": {
    coreIdea: "Words that are anagrams share an identical canonical signature when their sorted characters (or character frequency tuples) are used as hash map keys.",
    optimalApproach: "Map signature -> array of words. For each word, sort its characters to form signature (or use 26-char frequency string). Append word to map[signature]. Return Object.values(map).",
    commonMistakes: [
      "Comparing all pairs of words with anagram helper (O(n^2 * k log k)) instead of single-pass grouping (O(n * k log k)).",
      "Using object references as keys instead of serialized primitive strings.",
      "Forgetting to handle empty string inputs ['']."
    ],
    edgeCases: ["Array with empty string ['']", "Single word array", "All words are anagrams of each other", "No two words are anagrams"],
    conceptToTeach: "Canonical representation hashing for equivalence class partitioning."
  },
  "linked-cycle-detection": {
    coreIdea: "Floyd's Tortoise and Hare algorithm: if a cycle exists, a pointer advancing 2 steps will eventually lap and meet a pointer advancing 1 step.",
    optimalApproach: "slow = 0, fast = 0. While fast !== -1 and next[fast] !== -1: slow = next[slow]; fast = next[next[fast]]. If slow === fast return true. If out of bounds return false.",
    commonMistakes: [
      "Advancing fast pointer twice without verifying next[fast] exists, causing null/undefined pointer exceptions.",
      "Using an auxiliary Set when O(1) memory is expected.",
      "Checking slow === fast at the very start before either pointer moves."
    ],
    edgeCases: ["No cycle (terminates at -1 or out of bounds)", "Cycle of length 1 (self-loop)", "Cycle of length 2", "Start index already in cycle vs tail leading into cycle"],
    conceptToTeach: "Floyd's cycle-finding pointer phase synchronization."
  },
  "stock-buy-sell-timing": {
    coreIdea: "To maximize profit on day i, you should sell at price[i] after buying at the minimum price seen on any previous day.",
    optimalApproach: "minPrice = Infinity, maxProfit = 0. For price of prices: minPrice = Math.min(minPrice, price); maxProfit = Math.max(maxProfit, price - minPrice). Return maxProfit.",
    commonMistakes: [
      "Selling before buying (e.g. finding max element and min element regardless of temporal index order).",
      "Using O(n^2) nested loop checking all buy/sell pairs.",
      "Returning negative profit when prices strictly decrease (problem requires returning 0 if no profit is possible)."
    ],
    edgeCases: ["Strictly decreasing prices (e.g. [7, 6, 4, 3, 1], profit must be 0)", "Single day prices", "Prices strictly increasing", "All prices equal"],
    conceptToTeach: "Single-pass temporal prefix minimum tracking."
  }
};

export function getTeacherNotes(slug: string, tags?: string[], title?: string): TeacherNotes {
  if (TEACHER_NOTES[slug]) {
    return TEACHER_NOTES[slug];
  }
  const mainTag = tags?.[0] || "Algorithmic";
  return {
    coreIdea: `Identify the core ${mainTag} invariant to avoid brute-force search.`,
    optimalApproach: `Analyze problem input constraints, choose the optimal state representation, and process elements in a single pass or structured traversal.`,
    commonMistakes: [
      "Re-scanning elements redundantly instead of using memoization or fast lookup.",
      "Missing boundary conditions and empty/single-element inputs.",
      "Incorrect complexity trade-off between memory and computation time."
    ],
    edgeCases: ["Empty input or minimal boundary size", "Duplicate or negative elements", "Maximum constraint bounds"],
    conceptToTeach: `${mainTag} pattern optimization.`
  };
}
