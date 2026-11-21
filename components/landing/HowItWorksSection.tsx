"use client";

import { motion } from "framer-motion";
import { Terminal, CheckCircle2, Play, Trophy } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Select a Handcrafted Challenge",
    desc: "Browse beginner to medium problems categorized by topic, difficulty, and algorithmic paradigm.",
    icon: Terminal,
  },
  {
    step: "02",
    title: "Code in CodeMirror 6",
    desc: "Write your solution in JavaScript or Python with smart autocomplete, syntax highlighting, and mobile key shortcuts.",
    icon: Play,
  },
  {
    step: "03",
    title: "Instant In-Browser Test Run",
    desc: "Pyodide and Web Workers evaluate your code against visible and hidden edge cases in milliseconds.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Track Mastery & Heatmap",
    desc: "Celebrate success with confetti bursts, maintain your streak, and view your progress rings update in real-time.",
    icon: Trophy,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 border-t border-surface-border bg-surface/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-cyan/10 border border-forge-cyan/30 text-forge-cyan text-xs font-mono uppercase tracking-wider">
            The Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How CodeForge Works
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Zero servers, zero API tokens, and zero latency. Your machine is the execution engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative rounded-2xl border border-surface-border bg-surface/50 p-6 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-forge-cyan/60 dark:text-forge-cyan/40">
                      {s.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-surface-secondary border border-surface-border">
                      <Icon className="w-5 h-5 text-forge-cyan" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
