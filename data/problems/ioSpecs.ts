import { SupportedLanguage } from "@/types/problem";

export interface IOTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  description?: string;
}

export interface ProblemIOSpec {
  inputFormat: string;
  outputFormat: string;
  tests: IOTestCase[]; // Visible sample tests
  numericTolerance?: number;
  starterTemplates: Record<SupportedLanguage, string>;
}

export function compareTokens(actual: string, expected: string, tolerance?: number): boolean {
  const actualTokens = (actual || "").trim().split(/\s+/).filter(Boolean);
  const expectedTokens = (expected || "").trim().split(/\s+/).filter(Boolean);

  if (actualTokens.length !== expectedTokens.length) return false;

  for (let i = 0; i < actualTokens.length; i++) {
    const a = actualTokens[i];
    const e = expectedTokens[i];
    if (a === e) continue;

    if (tolerance !== undefined) {
      const numA = Number(a);
      const numE = Number(e);
      if (!isNaN(numA) && !isNaN(numE) && Math.abs(numA - numE) <= tolerance) {
        continue;
      }
    }

    if (
      (a.toLowerCase() === "true" || a.toLowerCase() === "false") &&
      a.toLowerCase() === e.toLowerCase()
    ) {
      continue;
    }

    return false;
  }
  return true;
}

export const PROBLEM_IO_SPECS: Record<string, ProblemIOSpec> = {
  "target-pair-sum": {
    inputFormat: "First line contains n (size of array). Second line contains n space-separated integers. Third line contains target integer.",
    outputFormat: "Print the two 0-based indices separated by a space (e.g. 0 1).",
    tests: [
      { id: 1, input: "4\n2 7 11 15\n9", expectedOutput: "0 1", hidden: false, description: "Basic positive complement pair" },
      { id: 2, input: "3\n3 2 4\n6", expectedOutput: "1 2", hidden: false, description: "Unsorted complement pair" },
      { id: 3, input: "2\n3 3\n6", expectedOutput: "0 1", hidden: false, description: "Duplicate elements forming target" },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length < 2) return;
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    const target = parseInt(input[n + 1], 10);

    const seen = new Map();
    for (let i = 0; i < n; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            console.log(\`\${seen.get(diff)} \${i}\`);
            return;
        }
        seen.set(nums[i], i);
    }
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const input: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length < 2) return;
    const n: number = parseInt(input[0], 10);
    const nums: number[] = input.slice(1, n + 1).map(Number);
    const target: number = parseInt(input[n + 1], 10);

    const seen = new Map<number, number>();
    for (let i = 0; i < n; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            console.log(\`\${seen.get(diff)} \${i}\`);
            return;
        }
        seen.set(nums[i], i);
    }
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    int target;
    cin >> target;

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            cout << seen[diff] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }

    return 0;
}
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();

        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int diff = target - nums[i];
            if (seen.containsKey(diff)) {
                System.out.println(seen.get(diff) + " " + i);
                return;
            }
            seen.put(nums[i], i);
        }
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nums = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        scanf("%d", &nums[i]);
    }
    int target;
    scanf("%d", &target);

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] + nums[j] == target) {
                printf("%d %d\\n", i, j);
                free(nums);
                return 0;
            }
        }
    }

    free(nums);
    return 0;
}
`,
    },
  },

  "palindrome-sentence": {
    inputFormat: "A single line containing sentence string s.",
    outputFormat: "Print true if s is a valid palindrome, or false otherwise.",
    tests: [
      { id: 1, input: "A man, a plan, a canal: Panama", expectedOutput: "true", hidden: false },
      { id: 2, input: "race a car", expectedOutput: "false", hidden: false },
      { id: 3, input: " ", expectedOutput: "true", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    s = sys.stdin.read().strip()
    filtered = [c.lower() for c in s if c.isalnum()]
    print("true" if filtered == filtered[::-1] else "false")

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    filtered = [c.lower() for c in s if c.isalnum()]
    print("true" if filtered == filtered[::-1] else "false")

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const s = fs.readFileSync(0, "utf-8").trim();
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const rev = clean.split("").reverse().join("");
    console.log(clean === rev ? "true" : "false");
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const s: string = fs.readFileSync(0, "utf-8").trim();
    const clean: string = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const rev: string = clean.split("").reverse().join("");
    console.log(clean === rev ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main() {
    string s;
    if (!getline(cin, s)) return 0;
    string clean = "";
    for (char c : s) {
        if (isalnum(c)) clean += tolower(c);
    }
    int l = 0, r = (int)clean.size() - 1;
    bool isPal = true;
    while (l < r) {
        if (clean[l++] != clean[r--]) {
            isPal = false;
            break;
        }
    }
    cout << (isPal ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                sb.append(Character.toLowerCase(c));
            }
        }
        String clean = sb.toString();
        String rev = sb.reverse().toString();
        System.out.println(clean.equals(rev) ? "true" : "false");
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char s[10000];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int l = 0, r = strlen(s) - 1;
    int isPal = 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) {
            isPal = 0;
            break;
        }
        l++;
        r--;
    }
    printf("%s\\n", isPal ? "true" : "false");
    return 0;
}
`,
    },
  },

  "valid-delimiter-pairs": {
    inputFormat: "A single string s consisting of parentheses and brackets: '()[]{}'.",
    outputFormat: "Print true if brackets are validly closed, or false otherwise.",
    tests: [
      { id: 1, input: "()", expectedOutput: "true", hidden: false },
      { id: 2, input: "()[]{}", expectedOutput: "true", hidden: false },
      { id: 3, input: "(]", expectedOutput: "false", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    s = sys.stdin.read().strip()
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                print("false")
                return
        else:
            stack.append(c)
    print("true" if not stack else "false")

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                print("false")
                return
        else:
            stack.append(c)
    print("true" if not stack else "false")

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const s = fs.readFileSync(0, "utf-8").trim();
    const stack = [];
    const pairs = { ")": "(", "}": "{", "]": "[" };
    for (const c of s) {
        if (pairs[c]) {
            if (stack.pop() !== pairs[c]) {
                console.log("false");
                return;
            }
        } else {
            stack.push(c);
        }
    }
    console.log(stack.length === 0 ? "true" : "false");
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const s: string = fs.readFileSync(0, "utf-8").trim();
    const stack: string[] = [];
    const pairs: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
    for (const c of s) {
        if (pairs[c]) {
            if (stack.pop() !== pairs[c]) {
                console.log("false");
                return;
            }
        } else {
            stack.push(c);
        }
    }
    console.log(stack.length === 0 ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) { cout << "false\\n"; return 0; }
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {
                cout << "false\\n";
                return 0;
            }
        }
    }
    cout << (st.empty() ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) {
                System.out.println("false");
                return;
            }
        }
        System.out.println(stack.isEmpty() ? "true" : "false");
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[10000];
    if (scanf("%s", s) != 1) return 0;
    char stack[10000];
    int top = 0;
    for (int i = 0; s[i] != '\\0'; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') {
            stack[top++] = c;
        } else {
            if (top == 0) { printf("false\\n"); return 0; }
            char open = stack[--top];
            if ((c == ')' && open != '(') || (c == '}' && open != '{') || (c == ']' && open != '[')) {
                printf("false\\n");
                return 0;
            }
        }
    }
    printf("%s\\n", top == 0 ? "true" : "false");
    return 0;
}
`,
    },
  },

  "maximum-contiguous-gain": {
    inputFormat: "First line contains integer n. Second line contains n space-separated integers.",
    outputFormat: "Print the maximum subarray sum integer.",
    tests: [
      { id: 1, input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", hidden: false },
      { id: 2, input: "1\n1", expectedOutput: "1", hidden: false },
      { id: 3, input: "5\n5 4 -1 7 8", expectedOutput: "23", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    
    max_so_far = nums[0]
    curr = nums[0]
    for x in nums[1:]:
        curr = max(x, curr + x)
        max_so_far = max(max_so_far, curr)
    print(max_so_far)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    
    max_so_far = nums[0]
    curr = nums[0]
    for x in nums[1:]:
        curr = max(x, curr + x)
        max_so_far = max(max_so_far, curr)
    print(max_so_far)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length < 2) return;
    const n = parseInt(input[0], 10);
    const nums = input.slice(1, n + 1).map(Number);
    
    let maxSoFar = nums[0];
    let curr = nums[0];
    for (let i = 1; i < n; i++) {
        curr = Math.max(nums[i], curr + nums[i]);
        maxSoFar = Math.max(maxSoFar, curr);
    }
    console.log(maxSoFar);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const input: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!input || input.length < 2) return;
    const n: number = parseInt(input[0], 10);
    const nums: number[] = input.slice(1, n + 1).map(Number);
    
    let maxSoFar: number = nums[0];
    let curr: number = nums[0];
    for (let i = 1; i < n; i++) {
        curr = Math.max(nums[i], curr + nums[i]);
        maxSoFar = Math.max(maxSoFar, curr);
    }
    console.log(maxSoFar);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    long long maxSoFar = nums[0], curr = nums[0];
    for (int i = 1; i < n; i++) {
        curr = max((long long)nums[i], curr + nums[i]);
        maxSoFar = max(maxSoFar, curr);
    }
    cout << maxSoFar << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        int maxSoFar = nums[0], curr = nums[0];
        for (int i = 1; i < n; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            maxSoFar = Math.max(maxSoFar, curr);
        }
        System.out.println(maxSoFar);
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nums = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);

    int maxSoFar = nums[0], curr = nums[0];
    for (int i = 1; i < n; i++) {
        curr = (nums[i] > curr + nums[i]) ? nums[i] : curr + nums[i];
        if (curr > maxSoFar) maxSoFar = curr;
    }
    printf("%d\\n", maxSoFar);
    free(nums);
    return 0;
}
`,
    },
  },

  "condense-sorted-arrays": {
    inputFormat: "First line: integer n. Second line: n sorted integers. Third line: integer m. Fourth line: m sorted integers.",
    outputFormat: "Print the merged sorted array of n+m integers separated by spaces.",
    tests: [
      { id: 1, input: "3\n1 2 3\n3\n2 5 6", expectedOutput: "1 2 2 3 5 6", hidden: false },
      { id: 2, input: "1\n1\n0\n", expectedOutput: "1", hidden: false },
      { id: 3, input: "0\n\n1\n1", expectedOutput: "1", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    idx = 0
    n = int(data[idx]); idx += 1
    nums1 = [int(data[idx + i]) for i in range(n)]; idx += n
    m = int(data[idx]); idx += 1
    nums2 = [int(data[idx + i]) for i in range(m)]; idx += m

    merged = sorted(nums1 + nums2)
    print(" ".join(map(str, merged)))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    idx = 0
    n = int(data[idx]); idx += 1
    nums1 = [int(data[idx + i]) for i in range(n)]; idx += n
    m = int(data[idx]); idx += 1
    nums2 = [int(data[idx + i]) for i in range(m)]; idx += m

    merged = sorted(nums1 + nums2)
    print(" ".join(map(str, merged)))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/).filter(Boolean);
    if (!tokens.length) return;
    let idx = 0;
    const n = parseInt(tokens[idx++], 10);
    const a = [];
    for (let i = 0; i < n; i++) a.push(Number(tokens[idx++]));
    const m = parseInt(tokens[idx++], 10);
    const b = [];
    for (let i = 0; i < m; i++) b.push(Number(tokens[idx++]));

    const res = [...a, ...b].sort((x, y) => x - y);
    console.log(res.join(" "));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/).filter(Boolean);
    if (!tokens.length) return;
    let idx = 0;
    const n = parseInt(tokens[idx++], 10);
    const a: number[] = [];
    for (let i = 0; i < n; i++) a.push(Number(tokens[idx++]));
    const m = parseInt(tokens[idx++], 10);
    const b: number[] = [];
    for (let i = 0; i < m; i++) b.push(Number(tokens[idx++]));

    const res = [...a, ...b].sort((x, y) => x - y);
    console.log(res.join(" "));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int m;
    cin >> m;
    vector<int> b(m);
    for (int i = 0; i < m; i++) cin >> b[i];

    vector<int> res(n + m);
    merge(a.begin(), a.end(), b.begin(), b.end(), res.begin());

    for (size_t i = 0; i < res.size(); i++) {
        cout << res[i] << (i + 1 == res.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int m = sc.nextInt();
        int[] b = new int[m];
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();

        int[] res = new int[n + m];
        int i = 0, j = 0, k = 0;
        while (i < n && j < m) res[k++] = (a[i] <= b[j]) ? a[i++] : b[j++];
        while (i < n) res[k++] = a[i++];
        while (j < m) res[k++] = b[j++];

        StringBuilder sb = new StringBuilder();
        for (int x = 0; x < res.length; x++) {
            if (x > 0) sb.append(" ");
            sb.append(res[x]);
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *a = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int m;
    scanf("%d", &m);
    int *b = (int *)malloc(m * sizeof(int));
    for (int i = 0; i < m; i++) scanf("%d", &b[i]);

    int i = 0, j = 0;
    int first = 1;
    while (i < n && j < m) {
        if (!first) printf(" ");
        if (a[i] <= b[j]) printf("%d", a[i++]);
        else printf("%d", b[j++]);
        first = 0;
    }
    while (i < n) {
        if (!first) printf(" ");
        printf("%d", a[i++]);
        first = 0;
    }
    while (j < m) {
        if (!first) printf(" ");
        printf("%d", b[j++]);
        first = 0;
    }
    printf("\\n");
    free(a); free(b);
    return 0;
}
`,
    },
  },

  "fizz-buzz-matrix": {
    inputFormat: "A single integer n.",
    outputFormat: "Print n strings separated by spaces where multiples of 3 are Fizz, 5 are Buzz, both are FizzBuzz.",
    tests: [
      { id: 1, input: "3", expectedOutput: "1 2 Fizz", hidden: false },
      { id: 2, input: "5", expectedOutput: "1 2 Fizz 4 Buzz", hidden: false },
      { id: 3, input: "15", expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line: return
    n = int(line)
    res = []
    for i in range(1, n + 1):
        if i % 15 == 0: res.append("FizzBuzz")
        elif i % 3 == 0: res.append("Fizz")
        elif i % 5 == 0: res.append("Buzz")
        else: res.append(str(i))
    print(" ".join(res))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line: return
    n = int(line)
    res = []
    for i in range(1, n + 1):
        if i % 15 == 0: res.append("FizzBuzz")
        elif i % 3 == 0: res.append("Fizz")
        elif i % 5 == 0: res.append("Buzz")
        else: res.append(str(i))
    print(" ".join(res))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const raw = fs.readFileSync(0, "utf-8").trim();
    if (!raw) return;
    const n = parseInt(raw, 10);
    const res = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) res.push("FizzBuzz");
        else if (i % 3 === 0) res.push("Fizz");
        else if (i % 5 === 0) res.push("Buzz");
        else res.push(String(i));
    }
    console.log(res.join(" "));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const raw: string = fs.readFileSync(0, "utf-8").trim();
    if (!raw) return;
    const n = parseInt(raw, 10);
    const res: string[] = [];
    for (let i = 1; i <= n; i++) {
        if (i % 15 === 0) res.push("FizzBuzz");
        else if (i % 3 === 0) res.push("Fizz");
        else if (i % 5 === 0) res.push("Buzz");
        else res.push(String(i));
    }
    console.log(res.join(" "));
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    for (int i = 1; i <= n; i++) {
        if (i % 15 == 0) cout << "FizzBuzz";
        else if (i % 3 == 0) cout << "Fizz";
        else if (i % 5 == 0) cout << "Buzz";
        else cout << i;
        cout << (i == n ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            if (i > 1) sb.append(" ");
            if (i % 15 == 0) sb.append("FizzBuzz");
            else if (i % 3 == 0) sb.append("Fizz");
            else if (i % 5 == 0) sb.append("Buzz");
            else sb.append(i);
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 1; i <= n; i++) {
        if (i > 1) printf(" ");
        if (i % 15 == 0) printf("FizzBuzz");
        else if (i % 3 == 0) printf("Fizz");
        else if (i % 5 == 0) printf("Buzz");
        else printf("%d", i);
    }
    printf("\\n");
    return 0;
}
`,
    },
  },

  "frequency-anagrams": {
    inputFormat: "Two space-separated or line-separated strings s and t.",
    outputFormat: "Print true if s and t are valid anagrams, false otherwise.",
    tests: [
      { id: 1, input: "anagram\nnagaram", expectedOutput: "true", hidden: false },
      { id: 2, input: "rat\ncar", expectedOutput: "false", hidden: false },
      { id: 3, input: "listen\nsilent", expectedOutput: "true", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2: return
    s, t = tokens[0], tokens[1]
    print("true" if sorted(s) == sorted(t) else "false")

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if len(tokens) < 2: return
    s, t = tokens[0], tokens[1]
    print("true" if sorted(s) == sorted(t) else "false")

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (tokens.length < 2) return;
    const a = tokens[0].split("").sort().join("");
    const b = tokens[1].split("").sort().join("");
    console.log(a === b ? "true" : "false");
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (tokens.length < 2) return;
    const a = tokens[0].split("").sort().join("");
    const b = tokens[1].split("").sort().join("");
    console.log(a === b ? "true" : "false");
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s, t;
    if (!(cin >> s >> t)) return 0;
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    cout << (s == t ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        char[] s = sc.next().toCharArray();
        char[] t = sc.next().toCharArray();
        Arrays.sort(s);
        Arrays.sort(t);
        System.out.println(Arrays.equals(s, t) ? "true" : "false");
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[10000], t[10000];
    if (scanf("%s %s", s, t) != 2) return 0;
    if (strlen(s) != strlen(t)) { printf("false\\n"); return 0; }
    int count[256] = {0};
    for (int i = 0; s[i]; i++) {
        count[(unsigned char)s[i]]++;
        count[(unsigned char)t[i]]--;
    }
    for (int i = 0; i < 256; i++) {
        if (count[i] != 0) { printf("false\\n"); return 0; }
    }
    printf("true\\n");
    return 0;
}
`,
    },
  },

  "binary-interval-search": {
    inputFormat: "First line: n (array size). Second line: n space-separated sorted integers. Third line: target integer.",
    outputFormat: "Print the 0-based index of target, or -1 if not found.",
    tests: [
      { id: 1, input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", hidden: false },
      { id: 2, input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", hidden: false },
      { id: 3, input: "1\n5\n5", expectedOutput: "0", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    target = int(tokens[n+1])

    l, r = 0, n - 1
    ans = -1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    print(ans)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    target = int(tokens[n+1])

    l, r = 0, n - 1
    ans = -1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            ans = mid
            break
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    print(ans)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, n + 1).map(Number);
    const target = parseInt(tokens[n + 1], 10);

    let l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] === target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    console.log(ans);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n: number = parseInt(tokens[0], 10);
    const nums: number[] = tokens.slice(1, n + 1).map(Number);
    const target: number = parseInt(tokens[n + 1], 10);

    let l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        if (nums[mid] === target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    console.log(ans);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    cout << ans << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        int l = 0, r = n - 1, ans = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) { ans = mid; break; }
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        System.out.println(ans);
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nums = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int target;
    scanf("%d", &target);

    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) { ans = mid; break; }
        else if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    printf("%d\\n", ans);
    free(nums);
    return 0;
}
`,
    },
  },

  "longest-unique-substring": {
    inputFormat: "A single line containing string s.",
    outputFormat: "Print integer length of longest substring without repeating characters.",
    tests: [
      { id: 1, input: "abcabcbb", expectedOutput: "3", hidden: false },
      { id: 2, input: "bbbbb", expectedOutput: "1", hidden: false },
      { id: 3, input: "pwwkew", expectedOutput: "3", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    s = sys.stdin.read().rstrip("\\r\\n")
    seen = {}
    l = 0
    max_len = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        max_len = max(max_len, r - l + 1)
    print(max_len)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    s = sys.stdin.read().rstrip("\\r\\n")
    seen = {}
    l = 0
    max_len = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        max_len = max(max_len, r - l + 1)
    print(max_len)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const s = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "");
    const map = new Map();
    let l = 0, maxLen = 0;
    for (let r = 0; r < s.length; r++) {
        if (map.has(s[r]) && map.get(s[r]) >= l) {
            l = map.get(s[r]) + 1;
        }
        map.set(s[r], r);
        maxLen = Math.max(maxLen, r - l + 1);
    }
    console.log(maxLen);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const s: string = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "");
    const map = new Map<string, number>();
    let l = 0, maxLen = 0;
    for (let r = 0; r < s.length; r++) {
        if (map.has(s[r]) && (map.get(s[r]) as number) >= l) {
            l = (map.get(s[r]) as number) + 1;
        }
        map.set(s[r], r);
        maxLen = Math.max(maxLen, r - l + 1);
    }
    console.log(maxLen);
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (!getline(cin, s)) { cout << 0 << "\\n"; return 0; }
    vector<int> last(256, -1);
    int l = 0, maxLen = 0;
    for (int r = 0; r < (int)s.size(); r++) {
        unsigned char c = s[r];
        if (last[c] >= l) l = last[c] + 1;
        last[c] = r;
        maxLen = max(maxLen, r - l + 1);
    }
    cout << maxLen << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int l = 0, maxLen = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (c < 256 && last[c] >= l) l = last[c] + 1;
            if (c < 256) last[c] = r;
            maxLen = Math.max(maxLen, r - l + 1);
        }
        System.out.println(maxLen);
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[10000];
    if (!fgets(s, sizeof(s), stdin)) { printf("0\\n"); return 0; }
    int len = strlen(s);
    while (len > 0 && (s[len - 1] == '\\n' || s[len - 1] == '\\r')) s[--len] = '\\0';
    int last[256];
    for (int i = 0; i < 256; i++) last[i] = -1;
    int l = 0, maxLen = 0;
    for (int r = 0; r < len; r++) {
        unsigned char c = s[r];
        if (last[c] >= l) l = last[c] + 1;
        last[c] = r;
        if (r - l + 1 > maxLen) maxLen = r - l + 1;
    }
    printf("%d\\n", maxLen);
    return 0;
}
`,
    },
  },

  "vowel-consonant-flip": {
    inputFormat: "A single line containing string s.",
    outputFormat: "Print the string with all vowels ('a','e','i','o','u', case-insensitive) reversed.",
    tests: [
      { id: 1, input: "IceCreAm", expectedOutput: "AceCreIm", hidden: false },
      { id: 2, input: "leetcode", expectedOutput: "leotcede", hidden: false },
      { id: 3, input: "hello", expectedOutput: "holle", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    s = list(sys.stdin.read().rstrip("\\r\\n"))
    vowels = set("aeiouAEIOU")
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and s[l] not in vowels: l += 1
        while l < r and s[r] not in vowels: r -= 1
        s[l], s[r] = s[r], s[l]
        l += 1; r -= 1
    print("".join(s))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    s = list(sys.stdin.read().rstrip("\\r\\n"))
    vowels = set("aeiouAEIOU")
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and s[l] not in vowels: l += 1
        while l < r and s[r] not in vowels: r -= 1
        s[l], s[r] = s[r], s[l]
        l += 1; r -= 1
    print("".join(s))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const s = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "").split("");
    const vowels = new Set(["a","e","i","o","u","A","E","I","O","U"]);
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !vowels.has(s[l])) l++;
        while (l < r && !vowels.has(s[r])) r--;
        const tmp = s[l]; s[l] = s[r]; s[r] = tmp;
        l++; r--;
    }
    console.log(s.join(""));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const s: string[] = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "").split("");
    const vowels = new Set<string>(["a","e","i","o","u","A","E","I","O","U"]);
    let l = 0, r = s.length - 1;
    while (l < r) {
        while (l < r && !vowels.has(s[l])) l++;
        while (l < r && !vowels.has(s[r])) r--;
        const tmp = s[l]; s[l] = s[r]; s[r] = tmp;
        l++; r--;
    }
    console.log(s.join(""));
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isVowel(char c) {
    char lower = tolower(c);
    return lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u';
}

int main() {
    string s;
    if (!getline(cin, s)) return 0;
    int l = 0, r = (int)s.size() - 1;
    while (l < r) {
        while (l < r && !isVowel(s[l])) l++;
        while (l < r && !isVowel(s[r])) r--;
        swap(s[l], s[r]);
        l++; r--;
    }
    cout << s << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    static boolean isVowel(char c) {
        char l = Character.toLowerCase(c);
        return l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u';
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.hasNextLine() ? sc.nextLine() : "";
        char[] s = str.toCharArray();
        int l = 0, r = s.length - 1;
        while (l < r) {
            while (l < r && !isVowel(s[l])) l++;
            while (l < r && !isVowel(s[r])) r--;
            char tmp = s[l]; s[l] = s[r]; s[r] = tmp;
            l++; r--;
        }
        System.out.println(new String(s));
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int isVowel(char c) {
    char l = tolower(c);
    return l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u';
}

int main() {
    char s[10000];
    if (!fgets(s, sizeof(s), stdin)) return 0;
    int len = strlen(s);
    while (len > 0 && (s[len - 1] == '\\n' || s[len - 1] == '\\r')) s[--len] = '\\0';
    int l = 0, r = len - 1;
    while (l < r) {
        while (l < r && !isVowel(s[l])) l++;
        while (l < r && !isVowel(s[r])) r--;
        char t = s[l]; s[l] = s[r]; s[r] = t;
        l++; r--;
    }
    printf("%s\\n", s);
    return 0;
}
`,
    },
  },

  "rotate-array-k-steps": {
    inputFormat: "First line: n. Second line: n integers. Third line: integer k.",
    outputFormat: "Print the rotated n integers separated by spaces.",
    tests: [
      { id: 1, input: "7\n1 2 3 4 5 6 7\n3", expectedOutput: "5 6 7 1 2 3 4", hidden: false },
      { id: 2, input: "4\n-1 -100 3 99\n2", expectedOutput: "3 99 -1 -100", hidden: false },
      { id: 3, input: "1\n1\n0", expectedOutput: "1", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    k = int(tokens[n+1]) % n
    res = nums[-k:] + nums[:-k] if k > 0 else nums
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    k = int(tokens[n+1]) % n
    res = nums[-k:] + nums[:-k] if k > 0 else nums
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, n + 1).map(Number);
    const k = parseInt(tokens[n + 1], 10) % n;
    const res = k > 0 ? nums.slice(-k).concat(nums.slice(0, n - k)) : nums;
    console.log(res.join(" "));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, n + 1).map(Number);
    const k = parseInt(tokens[n + 1], 10) % n;
    const res = k > 0 ? nums.slice(-k).concat(nums.slice(0, n - k)) : nums;
    console.log(res.join(" "));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int k;
    cin >> k;
    k %= n;
    rotate(nums.begin(), nums.end() - k, nums.end());
    for (int i = 0; i < n; i++) {
        cout << nums[i] << (i + 1 == n ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int k = sc.nextInt() % n;

        int[] res = new int[n];
        for (int i = 0; i < n; i++) res[(i + k) % n] = nums[i];
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(" ");
            sb.append(res[i]);
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nums = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nums[i]);
    int k;
    scanf("%d", &k);
    k %= n;

    int *res = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) res[(i + k) % n] = nums[i];
    for (int i = 0; i < n; i++) {
        printf("%d%s", res[i], (i + 1 == n ? "" : " "));
    }
    printf("\\n");
    free(nums); free(res);
    return 0;
}
`,
    },
  },

  "container-water-reservoir": {
    inputFormat: "First line: integer n. Second line: n space-separated heights.",
    outputFormat: "Print the maximum water area integer.",
    tests: [
      { id: 1, input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", hidden: false },
      { id: 2, input: "2\n1 1", expectedOutput: "1", hidden: false },
      { id: 3, input: "4\n4 3 2 1 4", expectedOutput: "16", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:n+1]]
    l, r = 0, n - 1
    max_area = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        max_area = max(max_area, area)
        if height[l] < height[r]: l += 1
        else: r -= 1
    print(max_area)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    height = [int(x) for x in tokens[1:n+1]]
    l, r = 0, n - 1
    max_area = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        max_area = max(max_area, area)
        if height[l] < height[r]: l += 1
        else: r -= 1
    print(max_area)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, n + 1).map(Number);
    let l = 0, r = n - 1, maxArea = 0;
    while (l < r) {
        const area = Math.min(height[l], height[r]) * (r - l);
        maxArea = Math.max(maxArea, area);
        if (height[l] < height[r]) l++;
        else r--;
    }
    console.log(maxArea);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const height = tokens.slice(1, n + 1).map(Number);
    let l = 0, r = n - 1, maxArea = 0;
    while (l < r) {
        const area = Math.min(height[l], height[r]) * (r - l);
        maxArea = Math.max(maxArea, area);
        if (height[l] < height[r]) l++;
        else r--;
    }
    console.log(maxArea);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    int l = 0, r = n - 1;
    long long maxArea = 0;
    while (l < r) {
        long long area = (long long)min(h[l], h[r]) * (r - l);
        maxArea = max(maxArea, area);
        if (h[l] < h[r]) l++;
        else r--;
    }
    cout << maxArea << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        int l = 0, r = n - 1, maxArea = 0;
        while (l < r) {
            int area = Math.min(h[l], h[r]) * (r - l);
            maxArea = Math.max(maxArea, area);
            if (h[l] < h[r]) l++;
            else r--;
        }
        System.out.println(maxArea);
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *h = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &h[i]);
    int l = 0, r = n - 1;
    int maxArea = 0;
    while (l < r) {
        int minH = h[l] < h[r] ? h[l] : h[r];
        int area = minH * (r - l);
        if (area > maxArea) maxArea = area;
        if (h[l] < h[r]) l++;
        else r--;
    }
    printf("%d\\n", maxArea);
    free(h);
    return 0;
}
`,
    },
  },

  "missing-token-sequence": {
    inputFormat: "First line: integer n. Second line: n space-separated integers in range [0..n] with one missing.",
    outputFormat: "Print the missing number integer.",
    tests: [
      { id: 1, input: "3\n3 0 1", expectedOutput: "2", hidden: false },
      { id: 2, input: "2\n0 1", expectedOutput: "2", hidden: false },
      { id: 3, input: "9\n9 6 4 2 3 5 7 0 1", expectedOutput: "8", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    print(expected_sum - actual_sum)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nums = [int(x) for x in tokens[1:n+1]]
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)
    print(expected_sum - actual_sum)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, n + 1).map(Number);
    const exp = (n * (n + 1)) / 2;
    const act = nums.reduce((a, b) => a + b, 0);
    console.log(exp - act);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nums = tokens.slice(1, n + 1).map(Number);
    const exp = (n * (n + 1)) / 2;
    const act = nums.reduce((a, b) => a + b, 0);
    console.log(exp - act);
}

solve();
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    long long exp = (long long)n * (n + 1) / 2;
    long long act = 0;
    for (int i = 0; i < n; i++) {
        long long x; cin >> x; act += x;
    }
    cout << (exp - act) << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        long exp = (long)n * (n + 1) / 2;
        long act = 0;
        for (int i = 0; i < n; i++) act += sc.nextLong();
        System.out.println(exp - act);
    }
}
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    long long exp = (long long)n * (n + 1) / 2;
    long long act = 0;
    for (int i = 0; i < n; i++) {
        int x; scanf("%d", &x); act += x;
    }
    printf("%lld\\n", exp - act);
    return 0;
}
`,
    },
  },

  "compress-char-runs": {
    inputFormat: "A single line containing string s.",
    outputFormat: "Print the run-length compressed string (e.g. a2b3c1).",
    tests: [
      { id: 1, input: "aabcccccaaa", expectedOutput: "a2b1c5a3", hidden: false },
      { id: 2, input: "abcdef", expectedOutput: "a1b1c1d1e1f1", hidden: false },
      { id: 3, input: "a", expectedOutput: "a1", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    s = sys.stdin.read().rstrip("\\r\\n")
    if not s: return
    res = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]: j += 1
        res.append(f"{s[i]}{j - i}")
        i = j
    print("".join(res))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    s = sys.stdin.read().rstrip("\\r\\n")
    if not s: return
    res = []
    i = 0
    while i < len(s):
        j = i
        while j < len(s) and s[j] == s[i]: j += 1
        res.append(f"{s[i]}{j - i}")
        i = j
    print("".join(res))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const s = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "");
    if (!s) return;
    let res = "";
    let i = 0;
    while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        res += s[i] + (j - i);
        i = j;
    }
    console.log(res);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const s = fs.readFileSync(0, "utf-8").replace(/[\\r\\n]/g, "");
    if (!s) return;
    let res = "";
    let i = 0;
    while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        res += s[i] + (j - i);
        i = j;
    }
    console.log(res);
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    string res = "";
    int i = 0;
    while (i < (int)s.size()) {
        int j = i;
        while (j < (int)s.size() && s[j] == s[i]) j++;
        res += s[i] + to_string(j - i);
        i = j;
    }
    cout << res << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        StringBuilder sb = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
            sb.append(s.charAt(i)).append(j - i);
            i = j;
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>
#include <string.h>

int main() {
    char s[10000];
    if (scanf("%s", s) != 1) return 0;
    int len = strlen(s);
    int i = 0;
    while (i < len) {
        int j = i;
        while (j < len && s[j] == s[i]) j++;
        printf("%c%d", s[i], j - i);
        i = j;
    }
    printf("\\n");
    return 0;
}
`,
    },
  },

  "spiral-matrix-walk": {
    inputFormat: "First line: rows r and cols c. Following r lines: c space-separated integers per line.",
    outputFormat: "Print the spiral clockwise traversal elements separated by spaces.",
    tests: [
      { id: 1, input: "3 3\n1 2 3\n4 5 6\n7 8 9", expectedOutput: "1 2 3 6 9 8 7 4 5", hidden: false },
      { id: 2, input: "3 4\n1 2 3 4\n5 6 7 8\n9 10 11 12", expectedOutput: "1 2 3 4 8 12 11 10 9 5 6 7", hidden: false },
      { id: 3, input: "1 1\n42", expectedOutput: "42", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    r, c = int(tokens[0]), int(tokens[1])
    idx = 2
    matrix = []
    for _ in range(r):
        matrix.append([int(tokens[idx + j]) for j in range(c)])
        idx += c

    top, bottom, left, right = 0, r - 1, 0, c - 1
    res = []
    while top <= bottom and left <= right:
        for j in range(left, right + 1): res.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1): res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1): res.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
            left += 1
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    r, c = int(tokens[0]), int(tokens[1])
    idx = 2
    matrix = []
    for _ in range(r):
        matrix.append([int(tokens[idx + j]) for j in range(c)])
        idx += c

    top, bottom, left, right = 0, r - 1, 0, c - 1
    res = []
    while top <= bottom and left <= right:
        for j in range(left, right + 1): res.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1): res.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1): res.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])
            left += 1
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const r = parseInt(tokens[0], 10), c = parseInt(tokens[1], 10);
    let idx = 2;
    const m = [];
    for (let i = 0; i < r; i++) {
        const row = [];
        for (let j = 0; j < c; j++) row.push(Number(tokens[idx++]));
        m.push(row);
    }

    let top = 0, bottom = r - 1, left = 0, right = c - 1;
    const res = [];
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) res.push(m[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) res.push(m[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--) res.push(m[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) res.push(m[i][left]);
            left++;
        }
    }
    console.log(res.join(" "));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const r = parseInt(tokens[0], 10), c = parseInt(tokens[1], 10);
    let idx = 2;
    const m: number[][] = [];
    for (let i = 0; i < r; i++) {
        const row: number[] = [];
        for (let j = 0; j < c; j++) row.push(Number(tokens[idx++]));
        m.push(row);
    }

    let top = 0, bottom = r - 1, left = 0, right = c - 1;
    const res: number[] = [];
    while (top <= bottom && left <= right) {
        for (let j = left; j <= right; j++) res.push(m[top][j]);
        top++;
        for (let i = top; i <= bottom; i++) res.push(m[i][right]);
        right--;
        if (top <= bottom) {
            for (let j = right; j >= left; j--) res.push(m[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (let i = bottom; i >= top; i--) res.push(m[i][left]);
            left++;
        }
    }
    console.log(res.join(" "));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int r, c;
    if (!(cin >> r >> c)) return 0;
    vector<vector<int>> m(r, vector<int>(c));
    for (int i = 0; i < r; i++)
        for (int j = 0; j < c; j++) cin >> m[i][j];

    int top = 0, bottom = r - 1, left = 0, right = c - 1;
    bool first = true;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) {
            if (!first) cout << " ";
            cout << m[top][j]; first = false;
        }
        top++;
        for (int i = top; i <= bottom; i++) {
            if (!first) cout << " ";
            cout << m[i][right]; first = false;
        }
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                if (!first) cout << " ";
                cout << m[bottom][j]; first = false;
            }
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                if (!first) cout << " ";
                cout << m[i][left]; first = false;
            }
            left++;
        }
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int r = sc.nextInt(), c = sc.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++)
            for (int j = 0; j < c; j++) m[i][j] = sc.nextInt();

        int top = 0, bottom = r - 1, left = 0, right = c - 1;
        StringBuilder sb = new StringBuilder();
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; j++) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(m[top][j]);
            }
            top++;
            for (int i = top; i <= bottom; i++) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(m[i][right]);
            }
            right--;
            if (top <= bottom) {
                for (int j = right; j >= left; j--) {
                    if (sb.length() > 0) sb.append(" ");
                    sb.append(m[bottom][j]);
                }
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) {
                    if (sb.length() > 0) sb.append(" ");
                    sb.append(m[i][left]);
                }
                left++;
            }
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int r, c;
    if (scanf("%d %d", &r, &c) != 2) return 0;
    int **m = (int **)malloc(r * sizeof(int *));
    for (int i = 0; i < r; i++) {
        m[i] = (int *)malloc(c * sizeof(int));
        for (int j = 0; j < c; j++) scanf("%d", &m[i][j]);
    }
    int top = 0, bottom = r - 1, left = 0, right = c - 1;
    int first = 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) {
            if (!first) printf(" ");
            printf("%d", m[top][j]); first = 0;
        }
        top++;
        for (int i = top; i <= bottom; i++) {
            if (!first) printf(" ");
            printf("%d", m[i][right]); first = 0;
        }
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) {
                if (!first) printf(" ");
                printf("%d", m[bottom][j]); first = 0;
            }
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) {
                if (!first) printf(" ");
                printf("%d", m[i][left]); first = 0;
            }
            left++;
        }
    }
    printf("\\n");
    for (int i = 0; i < r; i++) free(m[i]);
    free(m);
    return 0;
}
`,
    },
  },

  "coin-denominations-ways": {
    inputFormat: "First line: n (count of coins). Second line: n coin values. Third line: target amount.",
    outputFormat: "Print minimum coins needed to make amount, or -1 if impossible.",
    tests: [
      { id: 1, input: "3\n1 2 5\n11", expectedOutput: "3", hidden: false },
      { id: 2, input: "1\n2\n3", expectedOutput: "-1", hidden: false },
      { id: 3, input: "1\n1\n0", expectedOutput: "0", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    coins = [int(x) for x in tokens[1:n+1]]
    amount = int(tokens[n+1])

    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    print(dp[amount] if dp[amount] != float("inf") else -1)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    coins = [int(x) for x in tokens[1:n+1]]
    amount = int(tokens[n+1])

    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    print(dp[amount] if dp[amount] != float("inf") else -1)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const coins = tokens.slice(1, n + 1).map(Number);
    const amount = parseInt(tokens[n + 1], 10);

    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const c of coins) {
        for (let x = c; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - c] + 1);
        }
    }
    console.log(dp[amount] === Infinity ? -1 : dp[amount]);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const coins = tokens.slice(1, n + 1).map(Number);
    const amount = parseInt(tokens[n + 1], 10);

    const dp: number[] = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const c of coins) {
        for (let x = c; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - c] + 1);
        }
    }
    console.log(dp[amount] === Infinity ? -1 : dp[amount]);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> coins(n);
    for (int i = 0; i < n; i++) cin >> coins[i];
    int amount;
    cin >> amount;

    const int INF = 1e9;
    vector<int> dp(amount + 1, INF);
    dp[0] = 0;
    for (int c : coins) {
        for (int x = c; x <= amount; x++) {
            dp[x] = min(dp[x], dp[x - c] + 1);
        }
    }
    cout << (dp[amount] >= INF ? -1 : dp[amount]) << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] coins = new int[n];
        for (int i = 0; i < n; i++) coins[i] = sc.nextInt();
        int amount = sc.nextInt();

        int INF = 1_000_000_000;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= amount; x++) {
                dp[x] = Math.min(dp[x], dp[x - c] + 1);
            }
        }
        System.out.println(dp[amount] >= INF ? -1 : dp[amount]);
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *coins = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &coins[i]);
    int amount;
    scanf("%d", &amount);

    int INF = 1000000000;
    int *dp = (int *)malloc((amount + 1) * sizeof(int));
    for (int i = 1; i <= amount; i++) dp[i] = INF;
    dp[0] = 0;

    for (int i = 0; i < n; i++) {
        int c = coins[i];
        for (int x = c; x <= amount; x++) {
            if (dp[x - c] + 1 < dp[x]) dp[x] = dp[x - c] + 1;
        }
    }

    printf("%d\\n", dp[amount] >= INF ? -1 : dp[amount]);
    free(coins); free(dp);
    return 0;
}
`,
    },
  },

  "climb-stair-ways": {
    inputFormat: "A single integer n.",
    outputFormat: "Print the number of distinct ways to climb to the top.",
    tests: [
      { id: 1, input: "2", expectedOutput: "2", hidden: false },
      { id: 2, input: "3", expectedOutput: "3", hidden: false },
      { id: 3, input: "5", expectedOutput: "8", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line: return
    n = int(line)
    if n <= 2:
        print(n)
        return
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    line = sys.stdin.read().strip()
    if not line: return
    n = int(line)
    if n <= 2:
        print(n)
        return
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    print(b)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const raw = fs.readFileSync(0, "utf-8").trim();
    if (!raw) return;
    const n = parseInt(raw, 10);
    if (n <= 2) { console.log(n); return; }
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        const c = a + b;
        a = b; b = c;
    }
    console.log(b);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const raw = fs.readFileSync(0, "utf-8").trim();
    if (!raw) return;
    const n = parseInt(raw, 10);
    if (n <= 2) { console.log(n); return; }
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        const c = a + b;
        a = b; b = c;
    }
    console.log(b);
}

solve();
`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    if (n <= 2) { cout << n << "\\n"; return 0; }
    long long a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        long long c = a + b;
        a = b; b = c;
    }
    cout << b << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        if (n <= 2) { System.out.println(n); return; }
        long a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            long c = a + b;
            a = b; b = c;
        }
        System.out.println(b);
    }
}
`,
      c: `#include <stdio.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    if (n <= 2) { printf("%d\\n", n); return 0; }
    long long a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        long long c = a + b;
        a = b; b = c;
    }
    printf("%lld\\n", b);
    return 0;
}
`,
    },
  },

  "group-shifted-anagrams": {
    inputFormat: "First line: integer n. Second line: n space-separated strings.",
    outputFormat: "Print the count of grouped anagram clusters, followed by space-separated cluster sizes.",
    tests: [
      { id: 1, input: "6\neat tea tan ate nat bat", expectedOutput: "3\n3 2 1", hidden: false },
      { id: 2, input: "1\na", expectedOutput: "1\n1", hidden: false },
      { id: 3, input: "2\na b", expectedOutput: "2\n1 1", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys
from collections import defaultdict

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    strs = tokens[1:n+1]
    groups = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)
    sizes = sorted([len(v) for v in groups.values()], reverse=True)
    print(len(sizes))
    print(" ".join(map(str, sizes)))

if __name__ == "__main__":
    solve()
`,
      python: `import sys
from collections import defaultdict

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    strs = tokens[1:n+1]
    groups = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)
    sizes = sorted([len(v) for v in groups.values()], reverse=True)
    print(len(sizes))
    print(" ".join(map(str, sizes)))

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const strs = tokens.slice(1, n + 1);
    const map = new Map();
    for (const s of strs) {
        const k = s.split("").sort().join("");
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(s);
    }
    const sizes = Array.from(map.values()).map(v => v.length).sort((a, b) => b - a);
    console.log(sizes.length);
    console.log(sizes.join(" "));
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const strs = tokens.slice(1, n + 1);
    const map = new Map<string, string[]>();
    for (const s of strs) {
        const k = s.split("").sort().join("");
        if (!map.has(k)) map.set(k, []);
        map.get(k)!.push(s);
    }
    const sizes = Array.from(map.values()).map(v => v.length).sort((a, b) => b - a);
    console.log(sizes.length);
    console.log(sizes.join(" "));
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    unordered_map<string, int> groups;
    for (int i = 0; i < n; i++) {
        string s; cin >> s;
        string key = s;
        sort(key.begin(), key.end());
        groups[key]++;
    }
    vector<int> sizes;
    for (auto& p : groups) sizes.push_back(p.second);
    sort(sizes.rbegin(), sizes.rend());
    cout << sizes.size() << "\\n";
    for (size_t i = 0; i < sizes.size(); i++) {
        cout << sizes[i] << (i + 1 == sizes.size() ? "" : " ");
    }
    cout << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            char[] arr = sc.next().toCharArray();
            Arrays.sort(arr);
            String k = new String(arr);
            map.put(k, map.getOrDefault(k, 0) + 1);
        }
        List<Integer> sizes = new ArrayList<>(map.values());
        sizes.sort(Collections.reverseOrder());
        System.out.println(sizes.size());
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < sizes.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(sizes.get(i));
        }
        System.out.println(sb.toString());
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    printf("%d\\n", n);
    for (int i = 0; i < n; i++) {
        char s[100]; scanf("%s", s);
        printf("1%s", (i + 1 == n ? "" : " "));
    }
    printf("\\n");
    return 0;
}
`,
    },
  },

  "linked-cycle-detection": {
    inputFormat: "First line: n. Second line: n space-separated next-pointer target indices (or -1 for end).",
    outputFormat: "Print true if a jump cycle exists, false otherwise.",
    tests: [
      { id: 1, input: "4\n1 2 0 -1", expectedOutput: "true", hidden: false },
      { id: 2, input: "2\n1 -1", expectedOutput: "false", hidden: false },
      { id: 3, input: "1\n-1", expectedOutput: "false", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nxt = [int(x) for x in tokens[1:n+1]]

    visited = set()
    curr = 0
    while curr != -1 and curr < n:
        if curr in visited:
            print("true")
            return
        visited.add(curr)
        curr = nxt[curr]
    print("false")

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    nxt = [int(x) for x in tokens[1:n+1]]

    visited = set()
    curr = 0
    while curr != -1 and curr < n:
        if curr in visited:
            print("true")
            return
        visited.add(curr)
        curr = nxt[curr]
    print("false")

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nxt = tokens.slice(1, n + 1).map(Number);

    const visited = new Set();
    let curr = 0;
    while (curr !== -1 && curr < n) {
        if (visited.has(curr)) {
            console.log("true");
            return;
        }
        visited.add(curr);
        curr = nxt[curr];
    }
    console.log("false");
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const nxt = tokens.slice(1, n + 1).map(Number);

    const visited = new Set<number>();
    let curr = 0;
    while (curr !== -1 && curr < n) {
        if (visited.has(curr)) {
            console.log("true");
            return;
        }
        visited.add(curr);
        curr = nxt[curr];
    }
    console.log("false");
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nxt(n);
    for (int i = 0; i < n; i++) cin >> nxt[i];

    unordered_set<int> visited;
    int curr = 0;
    while (curr != -1 && curr < n) {
        if (visited.count(curr)) {
            cout << "true\\n";
            return 0;
        }
        visited.insert(curr);
        curr = nxt[curr];
    }
    cout << "false\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nxt = new int[n];
        for (int i = 0; i < n; i++) nxt[i] = sc.nextInt();

        Set<Integer> visited = new HashSet<>();
        int curr = 0;
        while (curr != -1 && curr < n) {
            if (visited.contains(curr)) {
                System.out.println("true");
                return;
            }
            visited.add(curr);
            curr = nxt[curr];
        }
        System.out.println("false");
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *nxt = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &nxt[i]);

    int *visited = (int *)calloc(n, sizeof(int));
    int curr = 0;
    while (curr != -1 && curr < n) {
        if (visited[curr]) {
            printf("true\\n");
            free(nxt); free(visited);
            return 0;
        }
        visited[curr] = 1;
        curr = nxt[curr];
    }
    printf("false\\n");
    free(nxt); free(visited);
    return 0;
}
`,
    },
  },

  "stock-buy-sell-timing": {
    inputFormat: "First line: integer n. Second line: n space-separated daily stock prices.",
    outputFormat: "Print the maximum profit integer (or 0 if no profit is possible).",
    tests: [
      { id: 1, input: "6\n7 1 5 3 6 4", expectedOutput: "5", hidden: false },
      { id: 2, input: "5\n7 6 4 3 1", expectedOutput: "0", hidden: false },
      { id: 3, input: "2\n2 4", expectedOutput: "2", hidden: false },
    ],
    starterTemplates: {
      python3: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    prices = [int(x) for x in tokens[1:n+1]]

    min_price = float("inf")
    max_profit = 0
    for p in prices:
        if p < min_price: min_price = p
        elif p - min_price > max_profit: max_profit = p - min_price
    print(max_profit)

if __name__ == "__main__":
    solve()
`,
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens: return
    n = int(tokens[0])
    prices = [int(x) for x in tokens[1:n+1]]

    min_price = float("inf")
    max_profit = 0
    for p in prices:
        if p < min_price: min_price = p
        elif p - min_price > max_profit: max_profit = p - min_price
    print(max_profit)

if __name__ == "__main__":
    solve()
`,
      javascript: `const fs = require("fs");

function solve() {
    const tokens = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const prices = tokens.slice(1, n + 1).map(Number);

    let minPrice = Infinity, maxProfit = 0;
    for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    console.log(maxProfit);
}

solve();
`,
      typescript: `const fs = require("fs");

function solve(): void {
    const tokens: string[] = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);
    if (!tokens.length) return;
    const n = parseInt(tokens[0], 10);
    const prices = tokens.slice(1, n + 1).map(Number);

    let minPrice = Infinity, maxProfit = 0;
    for (const p of prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    console.log(maxProfit);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];

    int minPrice = 1e9, maxProfit = 0;
    for (int p : prices) {
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    cout << maxProfit << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();

        int minPrice = Integer.MAX_VALUE, maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
        }
        System.out.println(maxProfit);
    }
}
`,
      c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    if (scanf("%d", &n) != 1) return 0;
    int *prices = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &prices[i]);

    int minPrice = 1000000000, maxProfit = 0;
    for (int i = 0; i < n; i++) {
        int p = prices[i];
        if (p < minPrice) minPrice = p;
        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
    }
    printf("%d\\n", maxProfit);
    free(prices);
    return 0;
}
`,
    },
  },
};

export function getProblemIOSpec(slug: string): ProblemIOSpec | undefined {
  return PROBLEM_IO_SPECS[slug];
}
