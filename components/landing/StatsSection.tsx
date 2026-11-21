"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

const stats = [
  { value: "3,000+", label: "Algorithmic Challenges", sub: "Easy, Medium & Hard" },
  { value: "100%", label: "Free Forever", sub: "No Credit Card Needed" },
  { value: "< 5ms", label: "Browser Execution", sub: "Sandboxed Web Workers" },
  { value: "0", label: "External Tracking", sub: "100% Privacy Preserving" },
];

export function StatsSection() {
  return (
    <section className="py-16 border-t border-surface-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-surface-border bg-surface/40 backdrop-blur-md"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-gradient-neon font-mono mb-1">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-white">{s.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
