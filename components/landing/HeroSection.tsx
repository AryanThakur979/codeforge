"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Terminal, Cpu, ShieldCheck } from "lucide-react";
import { HeroFallback } from "@/components/3d/HeroFallback";

const HeroCanvas = dynamic(
  () => import("@/components/3d/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24">
      {/* Background neon ambient gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-forge-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-forge-cyan/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Animated Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left z-10"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono tracking-wide shadow-neon-cyan">
              <span className="w-2 h-2 rounded-full bg-forge-cyan animate-pulse" />
              <span>Next-Gen Browser Sandboxed Practice • 100% Free</span>
            </div>

            {/* Headline with Text Gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Master Algorithms in{" "}
              <span className="text-gradient-neon block sm:inline">
                Futuristic 3D.
              </span>{" "}
              Zero Cost. Zero Limits.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Sharpen your coding skills with instant, sandboxed JavaScript &amp; Python
              execution inside your browser. No servers, no sign-ups, and no paywalls.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/problems"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-background bg-forge-cyan shadow-neon-cyan hover:shadow-cyan-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-background group-hover:rotate-12 transition-transform" />
                <span>Start Solving Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/roadmap"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-foreground bg-surface/70 hover:bg-surface-secondary border border-surface-border hover:border-forge-purple/50 transition-all duration-200 w-full sm:w-auto"
              >
                <span>View Learning Path</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-surface-border text-left">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-forge-cyan shrink-0" />
                <span className="text-xs text-gray-300 font-mono">WebAssembly Powered</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-forge-green shrink-0" />
                <span className="text-xs text-gray-300 font-mono">Zero Logins Required</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-forge-purple shrink-0" />
                <span className="text-xs text-gray-300 font-mono">Isolated Web Worker</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl border border-surface-border bg-surface/30 backdrop-blur-xl p-2 sm:p-4 shadow-glow-card overflow-hidden">
              {/* Corner accent glow lines */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-forge-cyan" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-forge-purple" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-forge-purple" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-forge-pink" />

              <HeroCanvas />

              <div className="text-center pb-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                  Interactive 3D Simulation • Drag / Move Mouse
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
