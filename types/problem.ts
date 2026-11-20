export type Difficulty = "Easy" | "Medium" | "Hard";

export interface TestCase {
  id: number;
  input: any[];
  expected: any;
  isHidden?: boolean;
  description?: string;
}

export interface ProblemExample {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  functionName: string;
  starterCode: {
    javascript: string;
    python: string;
  };
  testCases: TestCase[];
}
