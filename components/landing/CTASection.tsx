"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 border-t border-surface-border relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(157,0,255,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl border border-forge-cyan/30 bg-gradient-to-b from-surface/80 to-surface-secondary/80 backdrop-blur-2xl shadow-neon-cyan">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider mb-6">
            Ready to Code?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Start Your Free Algorithmic Journey Today
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            No registration, no monthly subscription, no cloud latency. Open any problem and run your code immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/problems"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-background bg-forge-cyan shadow-neon-cyan hover:shadow-cyan-400/60 hover:scale-105 active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="w-5 h-5" />
              <span>Browse All Problems</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-surface-secondary border border-surface-border hover:border-forge-purple/50 transition-colors"
            >
              <span>Explore Topic Roadmap</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
