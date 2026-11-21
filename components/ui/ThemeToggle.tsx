"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme, setTheme } = useCodeForgeStore();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("codeforge_theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      if (saved === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [setTheme]);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-surface-secondary/40 border border-surface-border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-surface-border bg-surface/50 hover:bg-surface-secondary hover:border-forge-cyan/40 transition-colors duration-200 text-foreground group"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-forge-amber group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-forge-purple group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
