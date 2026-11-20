export interface ExecutionResult {
  testCaseId: number;
  passed: boolean;
  input: any[];
  expected: any;
  actual: any;
  runtime: number; // milliseconds
  logs: string[];
  error?: string;
  isTimeout?: boolean;
}

export interface RunnerResponse {
  results: ExecutionResult[];
  status: "success" | "failed" | "error" | "tle";
  totalRuntime: number;
  allPassed: boolean;
  logs: string[];
  errorSummary?: string;
}

export interface TestCaseInput {
  id: number;
  input: any[];
  expected: any;
  isHidden?: boolean;
  description?: string;
}

export interface CodeRunner {
  run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs?: number
  ): Promise<RunnerResponse>;
}
