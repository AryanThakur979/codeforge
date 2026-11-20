import Link from "next/link";
import { siteConfig } from "@/config/site";
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
} from "lucide-react";

export const metadata = {
  title: `About ${siteConfig.name} — Free Forever Coding Education`,
  description:
    "Learn why CodeForge was built: zero paywalls, zero ads, in-browser WebAssembly runtimes, and accessible computer science education for everyone.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider">
          Manifesto &amp; Philosophy
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          Coding Practice Should Be{" "}
          <span className="text-gradient-neon">100% Free Forever.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {siteConfig.name} is engineered to provide students and engineers worldwide with a
          blazing-fast, private, and ad-free environment to practice data structures and algorithms.
        </p>
      </div>

      {/* The Core Mission */}
      <div className="rounded-3xl border border-surface-border bg-surface/50 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-glow-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forge-pink/20 border border-forge-pink/40 text-forge-pink">
            <Heart className="w-5 h-5 fill-forge-pink" />
          </div>
          <h2 className="text-xl font-bold text-white">Built Free for Students</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Preparing for software engineering interviews shouldn&apos;t require expensive \$35/month
          subscriptions, paywalled test cases, or watching intrusive ads. Many aspiring developers
          worldwide cannot afford commercial coding platform fees or lack credit cards.
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          {siteConfig.name} was built from first principles: utilize modern browser technologies
          like <strong>WebAssembly (Pyodide)</strong> and <strong>sandboxed Web Workers</strong> to execute
          and benchmark code completely on your local device. The result is zero server computing costs,
          zero wait queues, and 100% free algorithmic prep for all.
        </p>
      </div>

      {/* Engineering Architecture */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center sm:text-left">
          How It Works Under the Hood
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2.5 text-forge-cyan font-bold text-sm">
              <Cpu className="w-4 h-4" />
              <span>WebAssembly (Pyodide)</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Python 3.12 runs entirely inside your browser via WebAssembly compiled CPython. No
              backend server is ever contacted to execute your Python code.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2.5 text-forge-purple font-bold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Sandboxed Web Workers</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              JavaScript runs off the main thread inside an isolated Worker with a hard 3-second
              execution timeout guard that safely halts infinite loops without freezing the page.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2.5 text-forge-green font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Privacy &amp; LocalStorage</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              No account creation, no password vulnerabilities, and zero data tracking. Your solved
              problems, activity streak, and code drafts remain on your device, with 1-click JSON backup.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md space-y-2">
            <div className="flex items-center gap-2.5 text-forge-pink font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>CodeMirror 6 Engine</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Selected over Monaco because it renders cleanly on mobile phones, integrates with
              on-screen keyboards, and supports dedicated touch-friendly programming symbol toolbars.
            </p>
          </div>
        </div>
      </div>

      {/* Deploy Your Own Copy */}
      <div className="rounded-3xl border border-forge-cyan/30 bg-gradient-to-b from-surface to-surface-secondary p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-neon-cyan">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-forge-cyan" />
          <span>Deploy Your Own Copy in 60 Seconds</span>
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {siteConfig.name} is designed to deploy on Vercel or any static host with{" "}
          <strong>zero environment variables</strong>, <strong>zero database connections</strong>, and{" "}
          <strong>zero paid accounts</strong>:
        </p>
        <div className="bg-background/80 border border-surface-border p-4 rounded-xl font-mono text-xs text-gray-300 space-y-1">
          <div>$ git clone https://github.com/your-username/codeforge.git</div>
          <div>$ cd codeforge</div>
          <div>$ npm install</div>
          <div>$ npm run build</div>
        </div>
        <p className="text-xs text-gray-400">
          Push to GitHub and import the repository into Vercel — it will build and deploy instantly on the free hobby tier.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-background bg-forge-cyan shadow-neon-cyan hover:scale-105 active:scale-95 transition-all text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Practicing Now</span>
        </Link>
      </div>
    </div>
  );
}
