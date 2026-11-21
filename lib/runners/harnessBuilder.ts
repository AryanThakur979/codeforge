import { TestCaseInput } from "./types";

function toCppLiteral(val: any): string {
  if (val === null || val === undefined) return "nullptr";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return JSON.stringify(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "{}";
    if (typeof val[0] === "number") return `{${val.join(", ")}}`;
    if (typeof val[0] === "string") return `{${val.map((s) => JSON.stringify(s)).join(", ")}}`;
    if (Array.isArray(val[0])) return `{${val.map(toCppLiteral).join(", ")}}`;
  }
  return String(val);
}

function toCppType(val: any): string {
  if (typeof val === "boolean") return "bool";
  if (typeof val === "number") return Number.isInteger(val) ? "int" : "double";
  if (typeof val === "string") return "string";
  if (Array.isArray(val)) {
    if (val.length === 0) return "vector<int>";
    if (typeof val[0] === "number") return "vector<int>";
    if (typeof val[0] === "string") return "vector<string>";
    if (Array.isArray(val[0])) return `vector<${toCppType(val[0])}>`;
  }
  return "auto";
}

function toJavaLiteral(val: any): string {
  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return JSON.stringify(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "new int[]{}";
    if (typeof val[0] === "number") return `new int[]{${val.join(", ")}}`;
    if (typeof val[0] === "string") return `new String[]{${val.map((s) => JSON.stringify(s)).join(", ")}}`;
    if (Array.isArray(val[0])) {
      return `new int[][]{${val.map((inner: any[]) => `{${inner.join(", ")}}`).join(", ")}}`;
    }
  }
  return String(val);
}

function toJavaType(val: any): string {
  if (typeof val === "boolean") return "boolean";
  if (typeof val === "number") return Number.isInteger(val) ? "int" : "double";
  if (typeof val === "string") return "String";
  if (Array.isArray(val)) {
    if (val.length === 0) return "int[]";
    if (typeof val[0] === "number") return "int[]";
    if (typeof val[0] === "string") return "String[]";
    if (Array.isArray(val[0])) return "int[][]";
  }
  return "Object";
}

export function buildCppSource(
  userCode: string,
  functionName: string,
  testCases: TestCaseInput[]
): string {
  // If user provided a complete program with main(), run directly
  if (/\bint\s+main\s*\(/.test(userCode)) {
    return userCode;
  }

  let testCalls = "";
  testCases.forEach((tc, idx) => {
    const argDeclarations = tc.input
      .map((arg, argIdx) => {
        const type = toCppType(arg);
        const lit = toCppLiteral(arg);
        return `        ${type} arg_${idx}_${argIdx} = ${lit};`;
      })
      .join("\n");

    const argNames = tc.input.map((_, argIdx) => `arg_${idx}_${argIdx}`).join(", ");

    testCalls += `
    {
${argDeclarations}
        try {
            auto actual = ${functionName}(${argNames});
            std::cout << "__TC_${tc.id}__";
            printVal(actual);
            std::cout << "\\n";
        } catch (const std::exception& e) {
            std::cout << "__TC_${tc.id}__EXCEPTION: " << e.what() << "\\n";
        } catch (...) {
            std::cout << "__TC_${tc.id}__EXCEPTION: Unknown error\\n";
        }
    }
`;
  });

  const harness = `
// ==================== CODEFORGE TEST HARNESS ====================
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

void printVal(bool val) {
    std::cout << (val ? "true" : "false");
}

void printVal(int val) {
    std::cout << val;
}

void printVal(double val) {
    std::cout << val;
}

void printVal(const std::string& val) {
    std::cout << "\\"" << val << "\\"";
}

template<typename T>
void printVal(const std::vector<T>& vec) {
    std::cout << "[";
    for (size_t i = 0; i < vec.size(); ++i) {
        if (i > 0) std::cout << ", ";
        printVal(vec[i]);
    }
    std::cout << "]";
}

int main() {
    std::cout << "__CODEFORGE_START__\\n";
${testCalls}
    std::cout << "__CODEFORGE_END__\\n";
    return 0;
}
`;

  return `${userCode}\n${harness}`;
}

export function buildJavaSource(
  userCode: string,
  functionName: string,
  testCases: TestCaseInput[]
): string {
  if (/\bpublic\s+static\s+void\s+main\s*\(/.test(userCode)) {
    return userCode;
  }

  let testCalls = "";
  testCases.forEach((tc, idx) => {
    const argDeclarations = tc.input
      .map((arg, argIdx) => {
        const type = toJavaType(arg);
        const lit = toJavaLiteral(arg);
        return `        ${type} arg_${idx}_${argIdx} = ${lit};`;
      })
      .join("\n");

    const argNames = tc.input.map((_, argIdx) => `arg_${idx}_${argIdx}`).join(", ");

    testCalls += `
    {
${argDeclarations}
        try {
            Object actual = Solution.${functionName}(${argNames});
            System.out.print("__TC_${tc.id}__");
            printVal(actual);
            System.out.println();
        } catch (Exception e) {
            System.out.println("__TC_${tc.id}__EXCEPTION: " + e.getMessage());
        }
    }
`;
  });

  const harness = `
public class Main {
    public static void printVal(Object val) {
        if (val == null) {
            System.out.print("null");
        } else if (val instanceof int[]) {
            System.out.print(java.util.Arrays.toString((int[]) val));
        } else if (val instanceof String[]) {
            System.out.print(java.util.Arrays.toString((String[]) val));
        } else if (val instanceof Object[]) {
            System.out.print(java.util.Arrays.deepToString((Object[]) val));
        } else if (val instanceof String) {
            System.out.print("\\"" + val + "\\"");
        } else {
            System.out.print(val);
        }
    }

    public static void main(String[] args) {
        System.out.println("__CODEFORGE_START__");
${testCalls}
        System.out.println("__CODEFORGE_END__");
    }
}
`;

  return `${userCode}\n${harness}`;
}

export function buildCSource(
  userCode: string,
  functionName: string,
  testCases: TestCaseInput[]
): string {
  if (/\bint\s+main\s*\(/.test(userCode)) {
    return userCode;
  }

  let testCalls = "";
  testCases.forEach((tc, idx) => {
    const isFirstArray = Array.isArray(tc.input[0]);
    if (isFirstArray) {
      const arr = tc.input[0];
      const lit = `{${arr.join(", ")}}`;
      testCalls += `
    {
        int arr[] = ${lit};
        int retSize = 0;
        int* res = ${functionName}(arr, ${arr.length}, ${tc.input[1] !== undefined ? tc.input[1] : "&retSize"}, &retSize);
        printf("__TC_${tc.id}__[");
        if (res != NULL) {
            for (int i = 0; i < retSize; i++) {
                if (i > 0) printf(", ");
                printf("%d", res[i]);
            }
        }
        printf("]\\n");
    }
`;
    } else {
      const argLits = tc.input
        .map((a) => (typeof a === "string" ? JSON.stringify(a) : String(a)))
        .join(", ");
      testCalls += `
    {
        auto res = ${functionName}(${argLits});
        printf("__TC_${tc.id}__%d\\n", (int)res);
    }
`;
    }
  });

  const harness = `
int main() {
    printf("__CODEFORGE_START__\\n");
${testCalls}
    printf("__CODEFORGE_END__\\n");
    return 0;
}
`;

  return `${userCode}\n${harness}`;
}
