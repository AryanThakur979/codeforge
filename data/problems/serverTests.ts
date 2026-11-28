import { IOTestCase } from "./ioSpecs";

/**
 * Server-only hidden edge and boundary test suites for CodeForge judge.
 * Never bundled into client components or transmitted to the client browser.
 */
export const SERVER_TEST_SUITES: Record<string, IOTestCase[]> = {
  "target-pair-sum": [
    { id: 101, input: "5\n-1 -2 -3 -4 -5\n-8", expectedOutput: "2 4", hidden: true, description: "All negative numbers" },
    { id: 102, input: "4\n0 4 3 0\n0", expectedOutput: "0 3", hidden: true, description: "Zero elements forming target zero" },
    { id: 103, input: "4\n1000 2000 3000 4000\n7000", expectedOutput: "2 3", hidden: true, description: "Large values at array tail" },
    { id: 104, input: "2\n-1000000000 1000000000\n0", expectedOutput: "0 1", hidden: true, description: "Boundary maximum integer constraints" },
  ],
  "palindrome-sentence": [
    { id: 101, input: "a", expectedOutput: "true", hidden: true, description: "Single character sentence" },
    { id: 102, input: "., ?!", expectedOutput: "true", hidden: true, description: "Punctuation only" },
    { id: 103, input: "0P", expectedOutput: "false", hidden: true, description: "Two alphanumeric characters mismatch" },
    { id: 104, input: "Was it a car or a cat I saw?", expectedOutput: "true", hidden: true, description: "Mixed case with punctuation" },
    { id: 105, input: "ab1234ba", expectedOutput: "false", hidden: true, description: "Non-palindrome with numbers" },
  ],
  "valid-delimiter-pairs": [
    { id: 101, input: "", expectedOutput: "true", hidden: true, description: "Empty string" },
    { id: 102, input: "[", expectedOutput: "false", hidden: true, description: "Single unclosed opening delimiter" },
    { id: 103, input: "{[()]}", expectedOutput: "true", hidden: true, description: "Nested symmetrical delimiters" },
    { id: 104, input: "([)]", expectedOutput: "false", hidden: true, description: "Cross-closing interleaving brackets" },
    { id: 105, input: "()[]{}(())", expectedOutput: "true", hidden: true, description: "Long compound balanced sequence" },
  ],
  "maximum-contiguous-gain": [
    { id: 101, input: "4\n-5 -2 -8 -1", expectedOutput: "-1", hidden: true, description: "All negative numbers" },
    { id: 102, input: "1\n-10", expectedOutput: "-10", hidden: true, description: "Single negative element" },
    { id: 103, input: "5\n5 -2 3 -1 2", expectedOutput: "7", hidden: true, description: "Alternating positive and negative sequence" },
    { id: 104, input: "3\n1 2 3", expectedOutput: "6", hidden: true, description: "All positive strictly ascending" },
  ],
  "condense-sorted-arrays": [
    { id: 101, input: "0\n\n3\n1 2 3", expectedOutput: "1 2 3", hidden: true, description: "First array empty" },
    { id: 102, input: "3\n1 3 5\n0\n", expectedOutput: "1 3 5", hidden: true, description: "Second array empty" },
    { id: 103, input: "2\n2 2\n2\n2 2", expectedOutput: "2 2 2 2", hidden: true, description: "All identical duplicate elements" },
    { id: 104, input: "3\n-5 0 5\n3\n-3 1 4", expectedOutput: "-5 -3 0 1 4 5", hidden: true, description: "Spanning negative and positive ranges" },
  ],
  "fizz-buzz-matrix": [
    { id: 101, input: "1", expectedOutput: "1", hidden: true, description: "Minimum single step" },
    { id: 102, input: "5", expectedOutput: "1 2 Fizz 4 Buzz", hidden: true, description: "Five elements up to Buzz" },
    { id: 103, input: "15", expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz", hidden: true, description: "Fifteen elements up to first FizzBuzz" },
  ],
  "frequency-anagrams": [
    { id: 101, input: "a b", expectedOutput: "false", hidden: true, description: "Single distinct characters" },
    { id: 102, input: "z z", expectedOutput: "true", hidden: true, description: "Single identical character" },
    { id: 103, input: "ab abc", expectedOutput: "false", hidden: true, description: "Different lengths" },
    { id: 104, input: "listen silent", expectedOutput: "true", hidden: true, description: "Standard anagram pair" },
    { id: 105, input: "aab abb", expectedOutput: "false", hidden: true, description: "Same characters but differing frequencies" },
  ],
  "binary-interval-search": [
    { id: 101, input: "1\n5\n5", expectedOutput: "0", hidden: true, description: "Single element found" },
    { id: 102, input: "1\n5\n3", expectedOutput: "-1", hidden: true, description: "Single element absent" },
    { id: 103, input: "4\n1 3 5 7\n1", expectedOutput: "0", hidden: true, description: "Target at lowest boundary (index 0)" },
    { id: 104, input: "4\n1 3 5 7\n7", expectedOutput: "3", hidden: true, description: "Target at highest boundary" },
    { id: 105, input: "5\n-10 -5 0 5 10\n-5", expectedOutput: "1", hidden: true, description: "Negative number lookup" },
  ],
  "longest-unique-substring": [
    { id: 101, input: "", expectedOutput: "0", hidden: true, description: "Empty string" },
    { id: 102, input: "bbbbb", expectedOutput: "1", hidden: true, description: "All identical characters" },
    { id: 103, input: "abcdef", expectedOutput: "6", hidden: true, description: "All distinct characters" },
    { id: 104, input: "pwwkew", expectedOutput: "3", hidden: true, description: "Repeating characters with distinct midsection" },
    { id: 105, input: "a b!a", expectedOutput: "4", hidden: true, description: "Spaces and symbols" },
  ],
  "vowel-consonant-flip": [
    { id: 101, input: "bcdfg", expectedOutput: "bcdfg", hidden: true, description: "No vowels present" },
    { id: 102, input: "aeiou", expectedOutput: "uoiea", hidden: true, description: "All vowels" },
    { id: 103, input: "A", expectedOutput: "A", hidden: true, description: "Single uppercase vowel" },
    { id: 104, input: "hEllo wOrld", expectedOutput: "hollO werld", hidden: true, description: "Mixed case vowel preservation" },
  ],
  "rotate-array-k-steps": [
    { id: 101, input: "3\n1 2 3\n0", expectedOutput: "1 2 3", hidden: true, description: "Zero rotations" },
    { id: 102, input: "3\n1 2 3\n4", expectedOutput: "3 1 2", hidden: true, description: "k exceeds array length" },
    { id: 103, input: "4\n1 2 3 4\n4", expectedOutput: "1 2 3 4", hidden: true, description: "k equals array length" },
    { id: 104, input: "4\n-1 -100 3 99\n2", expectedOutput: "3 99 -1 -100", hidden: true, description: "Negative and positive mixed elements" },
  ],
  "container-water-reservoir": [
    { id: 101, input: "2\n1 1", expectedOutput: "1", hidden: true, description: "Minimum two height columns" },
    { id: 102, input: "4\n4 3 2 1", expectedOutput: "4", hidden: true, description: "Monotonically decreasing heights" },
    { id: 103, input: "3\n5 1 5", expectedOutput: "10", hidden: true, description: "Tall boundary pillars with low middle" },
    { id: 104, input: "4\n3 3 3 3", expectedOutput: "9", hidden: true, description: "Uniform heights" },
  ],
  "missing-token-sequence": [
    { id: 101, input: "3\n3 1 2", expectedOutput: "0", hidden: true, description: "Missing 0 at start" },
    { id: 102, input: "3\n0 1 2", expectedOutput: "3", hidden: true, description: "Missing n at end" },
    { id: 103, input: "1\n0", expectedOutput: "1", hidden: true, description: "Single element missing 1" },
    { id: 104, input: "1\n1", expectedOutput: "0", hidden: true, description: "Single element missing 0" },
  ],
  "compress-char-runs": [
    { id: 101, input: "a", expectedOutput: "a1", hidden: true, description: "Single character run" },
    { id: 102, input: "abc", expectedOutput: "a1b1c1", hidden: true, description: "All distinct single characters" },
    { id: 103, input: "aaaaa", expectedOutput: "a5", hidden: true, description: "Long single character streak" },
    { id: 104, input: "aabba", expectedOutput: "a2b2a1", hidden: true, description: "Character reoccurring later" },
  ],
  "spiral-matrix-walk": [
    { id: 101, input: "1 1\n5", expectedOutput: "5", hidden: true, description: "1x1 matrix" },
    { id: 102, input: "1 3\n1 2 3", expectedOutput: "1 2 3", hidden: true, description: "Single row matrix" },
    { id: 103, input: "3 1\n1\n2\n3", expectedOutput: "1 2 3", hidden: true, description: "Single column matrix" },
    { id: 104, input: "2 2\n1 2\n3 4", expectedOutput: "1 2 4 3", hidden: true, description: "2x2 square matrix" },
  ],
  "coin-denominations-ways": [
    { id: 101, input: "3\n1 2 5\n0", expectedOutput: "0", hidden: true, description: "Target zero amount requires 0 coins" },
    { id: 102, input: "1\n2\n3", expectedOutput: "-1", hidden: true, description: "Impossible combination" },
    { id: 103, input: "1\n5\n5", expectedOutput: "1", hidden: true, description: "Single coin matches exact amount" },
    { id: 104, input: "3\n1 2 5\n11", expectedOutput: "3", hidden: true, description: "Greedy failure case solved by DP (5+5+1)" },
  ],
  "climb-stair-ways": [
    { id: 101, input: "1", expectedOutput: "1", hidden: true, description: "Base step 1" },
    { id: 102, input: "2", expectedOutput: "2", hidden: true, description: "Base step 2" },
    { id: 103, input: "3", expectedOutput: "3", hidden: true, description: "Base step 3" },
    { id: 104, input: "5", expectedOutput: "8", hidden: true, description: "Step 5 (Fibonacci 8)" },
    { id: 105, input: "10", expectedOutput: "89", hidden: true, description: "Step 10 (Fibonacci 89)" },
  ],
  "group-shifted-anagrams": [
    { id: 101, input: "1\na", expectedOutput: "1 1", hidden: true, description: "Single word group" },
    { id: 102, input: "2\na a", expectedOutput: "1 2", hidden: true, description: "Identical words group together" },
    { id: 103, input: "2\nab cd", expectedOutput: "2 1 1", hidden: true, description: "Different distinct groups" },
    { id: 104, input: "4\nabc bcd ace xyz", expectedOutput: "2 3 1", hidden: true, description: "Shifted cyclic shifts grouping" },
  ],
  "linked-cycle-detection": [
    { id: 101, input: "1\n0", expectedOutput: "true", hidden: true, description: "Single node pointing to itself" },
    { id: 102, input: "1\n-1", expectedOutput: "false", hidden: true, description: "Single node pointing to null" },
    { id: 103, input: "2\n1 0", expectedOutput: "true", hidden: true, description: "Two node mutual cycle" },
    { id: 104, input: "3\n1 2 -1", expectedOutput: "false", hidden: true, description: "Linear list terminating at null" },
  ],
  "stock-buy-sell-timing": [
    { id: 101, input: "5\n7 6 4 3 1", expectedOutput: "0", hidden: true, description: "Strictly decreasing prices yield 0 profit" },
    { id: 102, input: "1\n5", expectedOutput: "0", hidden: true, description: "Single day cannot buy and sell" },
    { id: 103, input: "6\n7 1 5 3 6 4", expectedOutput: "5", hidden: true, description: "Valley at 1 and peak at 6" },
    { id: 104, input: "5\n1 2 3 4 5", expectedOutput: "4", hidden: true, description: "Strictly increasing prices" },
  ],
};

/**
 * Retrieve server-side hidden test cases for a given problem slug.
 */
export function getServerIOTests(slug: string): IOTestCase[] {
  return SERVER_TEST_SUITES[slug] || [];
}
