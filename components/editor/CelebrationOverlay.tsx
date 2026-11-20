"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, RotateCcw, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  problemTitle: string;
  runtime: number;
  nextSlug?: string;
}

export function CelebrationOverlay({
  isOpen,
  onClose,
  problemTitle,
  runtime,
  nextSlug,
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive multi-stage confetti fireworks
      const end = Date.now() + 2 * 1000;
      const colors = ["#00F0FF", "#9D00FF", "#FF007A", "#00FF66", "#FFB800"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-3xl border border-forge-cyan/40 bg-surface/95 p-6 sm:p-8 shadow-neon-cyan backdrop-blur-2xl text-center space-y-6 overflow-hidden"
          >
            {/* Background glowing ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-forge-cyan/20 rounded-full blur-[70px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-surface to-forge-cyan/20 border border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4">
                <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Test Cases Passed!</span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                Challenge Conquered!
              </h2>

              <p className="text-sm text-gray-300 mt-1">
                You successfully solved <span className="text-forge-cyan font-bold">{problemTitle}</span>.
              </p>

              {/* Runtime badge */}
              <div className="mt-4 px-4 py-2 rounded-xl bg-surface-secondary/70 border border-surface-border text-xs font-mono text-gray-300">
                Execution speed: <span className="text-forge-cyan font-semibold">{runtime} ms</span>
              </div>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-2">
              {nextSlug && (
                <Link
                  href={`/problems/${nextSlug}`}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-background bg-forge-cyan shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Next Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl font-semibold text-gray-300 bg-surface-secondary hover:bg-surface-secondary/80 border border-surface-border transition-colors text-sm"
              >
                Keep Reviewing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
