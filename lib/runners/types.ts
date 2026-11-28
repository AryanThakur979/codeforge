export type JudgeVerdict =
  | "Accepted"
  | "Wrong Answer"
  | "Compilation Error"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Memory Limit Exceeded"
  | "Provider Unavailable / Rate Limited"
  | "Internal Error";

export interface ErrorLocation {
  line: number;
  column?: number;
  message: string;
}

export interface CompilationDetails {
  rawMessage: string;
  errors: ErrorLocation[];
}

export interface RuntimeErrorDetails {
  type: string;
  explanation: string;
  cleanTraceback: string;
  signal?: number | string;
  exitCode?: number;
}

export interface IOExecutionResult {
  testId: number;
  passed: boolean;
  verdict: JudgeVerdict;
  input?: string; // Visible tests only
  expectedOutput?: string; // Visible tests only
  actualOutput?: string;
  runtimeMs: number;
  memoryKb?: number;
  stdout?: string;
  stderr?: string;
  isHidden: boolean;
  error?: string;
}

export interface JudgeResponse {
  verdict: JudgeVerdict;
  allPassed: boolean;
  totalRuntimeMs: number;
  maxMemoryKb?: number;
  results: IOExecutionResult[];
  compilationError?: CompilationDetails;
  runtimeError?: RuntimeErrorDetails;
  errorSummary?: string;
  mode: "run" | "submit";
  cached?: boolean;
}

// Backwards compatibility types
export interface ExecutionResult {
  testCaseId: number;
  passed: boolean;
  input: any[];
  expected: any;
  actual: any;
  runtime: number;
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
  judgeResponse?: JudgeResponse;
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
