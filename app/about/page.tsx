import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import {
  Heart,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  Zap,
  Github,
  Globe,
  CheckCircle2,
} from "lucide-react";
import {
  SUPPORTED_LANGUAGES_COUNT,
  TIER1_LANGUAGES,
  TIER2_LANGUAGES,
  TIER3_LANGUAGES,
} from "@/lib/runners/languages.config";

export const metadata: Metadata = {
  title: `About ${siteConfig.name} — Free Forever Coding Education`,
  description:
    "Learn why CodeForge was built: zero paywalls, zero ads, in-browser WebAssembly runtimes, and accessible computer science education for everyone.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${siteConfig.name} — Free Forever Coding Education`,
    description:
      "Learn why CodeForge was built: zero paywalls, zero ads, in-browser WebAssembly runtimes, and accessible computer science education for everyone.",
    url: `${siteConfig.url}/about`,
    type: "website",
    siteName: siteConfig.name,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider">
          Manifesto &amp; Philosophy
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Coding Practice Should Be{" "}
          <span className="text-gradient-neon">100% Free Forever.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.name} is engineered to provide students and engineers worldwide with a
          blazing-fast, private, and ad-free environment to practice data structures and algorithms.
        </p>
      </div>

      {/* The Core Mission */}
      <div className="rounded-3xl border border-surface-border bg-surface/50 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-glow-card">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">The Manifesto</h2>
        </div>
        <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm">
          Technical interviews have become the standard gateway to software engineering careers. Yet,
          aspiring developers often hit paywalls for basic practice, premium problem explanations, and
          debugger access.
        </p>
        <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-sm">
          CodeForge is built on the belief that coding practice tools should be free, open, and
          infinitely accessible. We leverage cutting-edge browser technologies like WebAssembly,
          Pyodide, Web Workers, and WebGL to deliver an interview-grade coding playground directly on
          client devices.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
          <Layers className="w-5 h-5 text-forge-cyan" />
          <span>Under the Hood Architecture</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <Cpu className="w-6 h-6 text-forge-cyan" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Client-Side WASM &amp; Workers</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Code is executed safely in sandboxed WebAssembly (Pyodide 3.12) and Web Workers. No remote
              cloud wait times, no queuing, and instant feedback.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <ShieldCheck className="w-6 h-6 text-forge-green" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Local-First Privacy</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Your submissions, draft codes, and progress heatmaps are persisted locally in your
              browser&apos;s encrypted storage. No tracking, no mandatory signups.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <Zap className="w-6 h-6 text-forge-amber" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Language Execution Runtimes</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              {SUPPORTED_LANGUAGES_COUNT}+ verified programming languages supported across 3 execution tiers: in-browser WebAssembly, modern system runtimes, and classic languages with zero subscription fees.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <Sparkles className="w-6 h-6 text-forge-magenta" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Modern Aesthetic</h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Futuristic cyberpunk dark mode, glowing accents, 3D interactive graphics, and smooth
              typography designed for focused algorithmic immersion.
            </p>
          </div>
        </div>
      </div>

      {/* Supported Languages Section */}
      <div className="rounded-3xl border border-surface-border bg-surface/50 p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-glow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-forge-cyan" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Verified Supported Languages ({SUPPORTED_LANGUAGES_COUNT})
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Automated test verification against real compiler and interpreter runtimes.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            100% Tested &amp; Active
          </span>
        </div>

        {/* Tier 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-forge-cyan" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-forge-cyan">
              Tier 1: Core Foundation Languages ({TIER1_LANGUAGES.length})
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-gray-400">
              — Zero-latency client sandbox or high-volume runtimes
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {TIER1_LANGUAGES.map((l) => (
              <div
                key={l.key}
                className="p-3 rounded-xl border border-surface-border bg-surface/60 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                    {l.label}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-forge-cyan" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono truncate">
                  {l.version}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Tier 2: Modern &amp; Popular Languages ({TIER2_LANGUAGES.length})
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-gray-400">
              — Standard input-reading pattern library
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TIER2_LANGUAGES.map((l) => (
              <div
                key={l.key}
                className="p-3 rounded-xl border border-surface-border bg-surface/60 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                    {l.label}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono truncate">
                  {l.version}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3 */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Tier 3: Classic, Systems &amp; Functional ({TIER3_LANGUAGES.length})
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-gray-400">
              — Verified stdin/stdout execution engines
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TIER3_LANGUAGES.map((l) => (
              <div
                key={l.key}
                className="p-3 rounded-xl border border-surface-border bg-surface/60 flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                    {l.label}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-gray-400 font-mono truncate">
                  {l.version}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zero Cost Guarantee */}
      <div className="p-6 rounded-3xl border border-forge-cyan/30 bg-forge-cyan/5 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Always Free. Zero Paywalls.</h4>
          <p className="text-xs text-slate-600 dark:text-gray-400 max-w-md">
            No credit card, no premium tiers, no locked questions. Start practicing instantly.
          </p>
        </div>
        <Link
          href="/problems"
          className="px-6 py-3 rounded-xl bg-forge-cyan text-white dark:text-background font-bold text-sm shadow-neon-cyan hover:scale-[1.02] transition-transform shrink-0"
        >
          Explore All Problems
        </Link>
      </div>
    </div>
  );
}
