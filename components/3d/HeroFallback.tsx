"use client";

import { motion } from "framer-motion";

export function HeroFallback() {
  const codeSymbols = ["{ }", "</>", "[ ]", "=>", "( )", "01", "&&", "||", "++"];

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-[540px] flex items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.12),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-forge-purple/20 blur-[90px] pointer-events-none" />

      {/* Cybernetic geometric circles */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer dashed ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-forge-cyan/30"
        />

        {/* Middle pulsing ring */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute inset-6 rounded-full border border-forge-purple/40"
        />

        {/* Inner geometric core */}
        <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-tr from-surface via-surface-secondary to-surface border border-forge-cyan/50 shadow-neon-cyan flex items-center justify-center backdrop-blur-md">
          <div className="text-center font-mono space-y-1">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-forge-cyan via-white to-forge-purple">
              &lt;CF /&gt;
            </span>
            <div className="text-[10px] text-forge-cyan/80 tracking-widest uppercase">
              WebAssembly
            </div>
          </div>
        </div>

        {/* Orbiting floating symbols */}
        {codeSymbols.map((sym, i) => {
          const angle = (i / codeSymbols.length) * 2 * Math.PI;
          const radius = 130;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={sym}
              style={{ x, y }}
              animate={{
                y: [y - 6, y + 6, y - 6],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute font-mono text-xs font-bold text-forge-cyan/70 bg-surface/80 border border-forge-cyan/20 px-2 py-1 rounded-md shadow-sm pointer-events-none"
            >
              {sym}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
