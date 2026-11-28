# ⚡ CodeForge

> **The Futuristic, Zero-Cost Coding Practice Platform**  
> Master algorithmic problem solving with interactive 3D visuals, instant in-browser code execution, and zero paid barriers. 100% free forever for students and engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![WebAssembly](https://img.shields.io/badge/Pyodide-WebAssembly-654FF0.svg)](https://pyodide.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployable%200%20Env%20Vars-000000.svg)](https://vercel.com/)

---

## 🌟 Key Highlights

- **100% Free Forever**: No credit cards, no subscriptions, no paywalled test cases, and zero ads.
- **In-Browser WebAssembly Execution**:
  - **JavaScript**: Evaluated inside an isolated `Blob` Web Worker with deep equality assertion and console interception.
  - **Python 3.12**: Powered by **Pyodide (WebAssembly)**, running completely on your device with stdout capture.
- **Infinite Loop & Timeout Guard**: Hard 3,000 ms execution protection automatically terminates runaway loops (`while True`) without crashing the browser tab.
- **Interactive 3D Visuals**: Three.js & `@react-three/fiber` hero scene with floating neon crystals, wireframe toroids, particle fields, and desktop mouse parallax, paired with an accessible CSS fallback for low-end hardware.
- **Touch-Friendly Mobile IDE**: Powered by **CodeMirror 6** (instead of heavy desktop-centric editors like Monaco), complete with a mobile-optimized quick-symbol toolbar (`( )`, `{ }`, `[ ]`, `;`, `:`, `""`, `''`, `=`, `=>`, `Tab`).
- **Complete Offline Privacy**: All streak tracking, submission histories, and draft solutions live in `localStorage`—no accounts or tracking required, with 1-click **JSON Export & Import**.
- **20 Original Handcrafted Problems**: Covering Arrays, Two Pointers, Sliding Window, Stacks, Binary Search, Dynamic Programming, and Simulation.
- **Visual Learning Roadmap**: 9-stage node-and-line milestone path with real-time mastery tracking.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (Futuristic Neon Dark & Light Themes) |
| **Animations** | Framer Motion & GSAP ScrollTrigger |
| **3D Rendering** | Three.js via `@react-three/fiber` & `@react-three/drei` |
| **Code Editor** | CodeMirror 6 (`@uiw/react-codemirror`) |
| **Python Engine** | Pyodide (v0.26.4 WebAssembly CPython) |
| **JS Sandbox** | Isolated Web Worker with 3s hard timeout guard |
| **State & Storage** | Zustand with `localStorage` synchronization |
| **Icons & FX** | Lucide React & `canvas-confetti` fireworks |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js `v18.17+` or `v20+`
- npm, yarn, or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/your-username/codeforge.git
cd codeforge
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start coding immediately.

### 3. Production Build & Test
```bash
# Run multi-language runner diagnostics
npm run test:runners

# Production build (passes with 0 environment variables)
npm run build
npm run start
```

---

## 🏷️ How to Rename the Platform in 1 Config File

CodeForge is built to be white-labeled or rebranded instantly. Open:

[`config/site.ts`](file:///c:/Users/hp/Downloads/codeforge/config/site.ts)

```typescript
export const siteConfig = {
  name: "CodeForge", // Change this to your preferred brand name!
  tagline: "The Futuristic, Zero-Cost Coding Practice Platform",
  description: "Master algorithmic problem solving...",
  url: "https://yourdomain.com",
  // ...
};
```
Every page, navbar, footer, metadata tag, sitemap, and browser title dynamically inherits from this single configuration file.

---

## ✍️ How to Add a New Problem

Adding a new challenge requires only adding a single object in [`data/problems/index.ts`](file:///c:/Users/hp/Downloads/codeforge/data/problems/index.ts):

```typescript
{
  id: "21",
  slug: "my-new-challenge",
  title: "My New Challenge",
  difficulty: "Easy", // "Easy" | "Medium" | "Hard"
  tags: ["Arrays", "Two Pointers"],
  description: "Problem markdown description here with requirements...",
  examples: [
    {
      id: 1,
      input: "nums = [1, 2, 3]",
      output: "6",
      explanation: "Sum of elements is 6."
    }
  ],
  constraints: ["1 <= nums.length <= 10^5"],
  hints: ["Think about iterating once through the array."],
  functionName: "mySolution",
  starterCode: {
    javascript: `function mySolution(nums) {\n  // Your code here\n}\n`,
    python: `def mySolution(nums):\n    # Your code here\n    pass\n`
  },
  testCases: [
    // Visible test cases (used during "Run Tests")
    { id: 1, input: [[1, 2, 3]], expected: 6, isHidden: false },
    // Hidden edge cases (evaluated during "Submit Solution")
    { id: 2, input: [[0]], expected: 0, isHidden: true },
    { id: 3, input: [[-5, 5]], expected: 0, isHidden: true }
  ]
}
```

The new problem will automatically appear in the Problems list, search filters, static site generation (`generateStaticParams`), and the topic roadmap!

---

## 🔌 How to Add a New Language Runner

CodeForge uses a pluggable execution interface defined in [`lib/runners/types.ts`](file:///c:/Users/hp/Downloads/codeforge/lib/runners/types.ts):

```typescript
export interface CodeRunner {
  run(
    code: string,
    functionName: string,
    testCases: TestCaseInput[],
    timeoutMs?: number
  ): Promise<RunnerResponse>;
}
```

To add another language (e.g. Ruby, Go, or Lua via WebAssembly):
1. Create `lib/runners/yourLanguageRunner.ts`.
2. Implement the `CodeRunner` interface:
   - Accept the user's code string and test cases.
   - Run in an isolated worker or WebAssembly engine.
   - Enforce a 3-second timeout protection.
   - Compare outputs with `deepEqual()`.
3. Register the runner in `components/editor/ProblemWorkspace.tsx` and add the language option in the dropdown selector.

---

## 🤖 AI Hint Agent & Mentor Architecture

CodeForge features a multi-tiered, pedagogically grounded **AI Hint Agent** designed to guide students toward the "Aha!" moment without spoiling code solutions.

### 🪜 4-Level Hint Ladder
1. **Level 1 (Nudge)**: Exactly one Socratic guiding question pointing toward the algorithmic invariant.
2. **Level 2 (Analogy)**: A real-world analogy (cricket, chai, train/metro, kitchen, cards) illustrating the algorithmic mechanism.
3. **Level 3 (Approach)**: Plain-English algorithmic strategy steps with zero code.
4. **Level 4 (Skeleton)**: Partial pseudocode with blanks (`____`) for the student to fill in. Full solutions are strictly refused.

### 🧠 Agent Features
- **Private Teacher Notes**: Every problem includes private pedagogical ground-truth notes (`coreIdea`, `optimalApproach`, `commonMistakes`, `edgeCases`, `conceptToTeach`). These inform the agent server-side and are never sent to the browser or leaked verbatim.
- **Two-Step Generation & Judge Pass**: Output is generated as structured JSON (`{ hint, followUpQuestion, confidence }`) and verified by an automated judge pass to ensure level adherence, solution safety, persona fidelity, and concise length (<120 words).
- **Interactive Follow-Up Chat**: Students can ask up to 3 conversational follow-up questions per problem, with full stuck-awareness and encouraging guidance.
- **Code Doctor 2.0 ("Look at my code")**: When enabled, the agent inspects the user's code alongside visible test execution results (failed input, expected vs. actual) to pinpoint the logic error without giving away the corrected code. Hidden test cases remain strictly confidential.
- **Authentic Personas**:
  - **Mentor Bhaiya**: Friendly elder brother with authentic Hinglish (or English).
  - **The Detective**: Noir investigator treating invariants and edge cases as clues.
  - **Cricket Commentary**: High-energy stadium commentator with cricket analogies.
- **Dual-Model Fallback & Resilience**: Seamlessly routes between a primary high-quality chat model and a fast fallback model on rate limits or errors, gracefully degrading to authentic built-in hints with `"Built-in hint (AI unavailable right now)"` if no API key is set.

---

### 🔑 Verified Free-Tier Models & Environment Variables

CodeForge connects to any OpenAI-compatible completions endpoint. The recommended free-tier setup uses **Groq**:

| Variable | Recommended Value | Notes |
| :--- | :--- | :--- |
| `AI_BASE_URL` | `https://api.groq.com/openai/v1` | OpenAI-compatible endpoint |
| `AI_MODEL` | `qwen/qwen3.8-27b` | **Primary Model**: Fast, accurate, excellent Hinglish |
| `AI_FALLBACK_MODEL` | `openai/gpt-oss-20b` | **Fallback Model**: Reasoning model for fallback |
| `AI_API_KEY` | `gsk_...` | Free key from [console.groq.com](https://console.groq.com/keys) |
| `AI_DAILY_LIMIT` | `500` | Optional global daily safety cap |

#### Steps to Set in Vercel:
1. Open your project on [Vercel Dashboard](https://vercel.com).
2. Go to **Settings** &rarr; **Environment Variables**.
3. Add `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, and `AI_FALLBACK_MODEL`.
4. Redeploy your project.

#### Run Hint Evaluation Suite:
Test all 20 problems across levels, languages, and personas for solution leaks, teacher note protection, and persona fidelity:
```bash
npm run eval:hints
```

> **Note**: If `AI_API_KEY` is not provided, the system automatically and gracefully degrades to the handcrafted built-in hint ladder for all problems with zero build or runtime errors.

---

## 🚢 Deploy to Vercel (100% Free, Zero Config)

Deploying CodeForge requires **no environment variables**, **no database**, and **no paid cloud addons**:

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit of CodeForge platform"
git branch -M main
git remote add origin https://github.com/<your-username>/codeforge.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your GitHub repository `codeforge`.
4. Framework Preset will be automatically detected as **Next.js**.
5. Leave all Environment Variables blank (none needed).
6. Click **Deploy**.

Your production platform will be live globally in under 60 seconds with SSL, edge caching, and automated preview deployments on every commit!

---

## 🔒 Privacy & Local Data Storage

- **Zero Tracking**: CodeForge does not store your code or personal metrics on external cloud databases.
- **Portability**: Back up your progress anytime via **Dashboard &rarr; Export JSON**.
- **Cross-device Transfer**: Import your JSON backup on any device to continue your streak.

---

## 📄 License

MIT License. Designed and built free for students and developers worldwide.
