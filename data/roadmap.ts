export interface RoadmapTopic {
  id: string;
  step: number;
  title: string;
  category: string;
  description: string;
  problemTags: string[];
  recommendedSlugs: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const roadmapTopics: RoadmapTopic[] = [
  {
    id: "arrays-hashing",
    step: 1,
    title: "Arrays & Hashing",
    category: "Data Structures",
    description: "Master contiguous memory lookup, hash maps, frequency counters, and complement mapping.",
    problemTags: ["Arrays", "Hashing"],
    recommendedSlugs: ["target-pair-sum", "missing-token-sequence", "frequency-anagrams"],
    difficulty: "Beginner",
  },
  {
    id: "two-pointers",
    step: 2,
    title: "Two Pointers Technique",
    category: "Algorithmic Pattern",
    description: "Opposite-end converging pointers, fast/slow runners, and partitioned array scans.",
    problemTags: ["Two Pointers"],
    recommendedSlugs: ["palindrome-sentence", "condense-sorted-arrays", "vowel-consonant-flip", "container-water-reservoir"],
    difficulty: "Beginner",
  },
  {
    id: "stack-queue",
    step: 3,
    title: "Stacks & Queues",
    category: "Data Structures",
    description: "LIFO matching, monotonic stacks, balanced delimiters, and expression evaluation.",
    problemTags: ["Stack"],
    recommendedSlugs: ["valid-delimiter-pairs"],
    difficulty: "Beginner",
  },
  {
    id: "sliding-window",
    step: 4,
    title: "Sliding Window",
    category: "Algorithmic Pattern",
    description: "Variable-length and fixed-size windows for substring constraints and continuous subarray bounds.",
    problemTags: ["Sliding Window", "Strings"],
    recommendedSlugs: ["longest-unique-substring", "compress-char-runs"],
    difficulty: "Intermediate",
  },
  {
    id: "binary-search",
    step: 5,
    title: "Binary Search",
    category: "Searching",
    description: "Logarithmic interval reduction on sorted sequences and searching monotonic solution spaces.",
    problemTags: ["Binary Search"],
    recommendedSlugs: ["binary-interval-search"],
    difficulty: "Beginner",
  },
  {
    id: "matrix-simulation",
    step: 6,
    title: "2D Matrix & Grids",
    category: "Simulation",
    description: "Boundary shrinking, spiral sweeps, coordinate transforms, and in-place grid rotations.",
    problemTags: ["Matrix", "Simulation"],
    recommendedSlugs: ["spiral-matrix-walk", "fizz-buzz-matrix"],
    difficulty: "Intermediate",
  },
  {
    id: "linked-lists-cycles",
    step: 7,
    title: "Cycle Detection & Pointers",
    category: "Pointers & Graphs",
    description: "Floyd's Tortoise & Hare algorithm, state jumps, and pointer loop tracking.",
    problemTags: ["Two Pointers", "Simulation"],
    recommendedSlugs: ["linked-cycle-detection", "rotate-array-k-steps"],
    difficulty: "Intermediate",
  },
  {
    id: "greedy-intervals",
    step: 8,
    title: "Greedy Algorithms",
    category: "Optimization",
    description: "Locally optimal choices, interval scheduling, and single-pass asset trading windows.",
    problemTags: ["Greedy"],
    recommendedSlugs: ["stock-buy-sell-timing", "container-water-reservoir"],
    difficulty: "Intermediate",
  },
  {
    id: "dynamic-programming",
    step: 9,
    title: "Dynamic Programming",
    category: "Optimization",
    description: "Optimal substructure, overlapping subproblems, state transitions, memoization, and bottom-up DP tables.",
    problemTags: ["Dynamic Programming"],
    recommendedSlugs: ["maximum-contiguous-gain", "climb-stair-ways", "coin-denominations-ways"],
    difficulty: "Advanced",
  },
];
