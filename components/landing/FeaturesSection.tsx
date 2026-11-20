"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  MapPin,
  Laptop,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "WebAssembly Pyodide & Workers",
    description:
      "Execute Python and JavaScript entirely on your device with high-speed WebAssembly and isolated Web Workers. Zero remote execution latency.",
    color: "cyan",
  },
  {
    icon: ShieldCheck,
    title: "100% Free & No Sign-Up",
    description:
      "No account required, no email subscriptions, and zero paywalls. Jump right into practice. Your progress is safely kept in your local browser.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Infinite Loop & Timeout Guard",
    description:
      "Never crash your browser tab. Sandboxed execution with automatic 3-second hard timeout protection gracefully handles edge-case runaways.",
    color: "pink",
  },
  {
    icon: Layers,
    title: "CodeMirror 6 Mobile-Ready Editor",
    description:
      "Engineered specifically for exceptional touch ergonomics, smart indentation, syntax highlighting, and a dedicated mobile symbol toolbar.",
    color: "green",
  },
  {
    icon: MapPin,
    title: "Curated Algorithmic Roadmap",
    description:
      "From Two Pointers and Hash Tables to Dynamic Programming and Binary Trees—follow a step-by-step visual skill tree.",
    color: "amber",
  },
  {
    icon: Laptop,
    title: "Exportable Progress & Heatmap",
    description:
      "Track your streak, solved counts by difficulty, and daily activity calendar. Export and import your data anytime as a clean JSON backup.",
    color: "blue",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 border-t border-surface-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forge-purple/10 border border-forge-purple/30 text-forge-purple text-xs font-mono uppercase tracking-wider">
            Engineered For Speed &amp; Freedom
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything You Need to Ace Technical Interviews
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Built from first principles for students and self-taught engineers who want
            a lightning-fast, ad-free, completely gratis practice environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl border border-surface-border bg-surface/40 hover:bg-surface-secondary/70 p-6 backdrop-blur-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-secondary border border-surface-border group-hover:border-forge-cyan/50 mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-forge-cyan group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-forge-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
