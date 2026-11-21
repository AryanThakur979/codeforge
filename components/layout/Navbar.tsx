"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Code2, Menu, X, Sparkles, Terminal } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-forge-purple/20 via-surface to-forge-cyan/20 border border-forge-cyan/30 shadow-neon-cyan group-hover:border-forge-cyan group-hover:scale-105 transition-all duration-300">
            <Terminal className="w-5 h-5 text-forge-cyan group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-forge-cyan to-forge-purple opacity-20 blur-sm group-hover:opacity-60 transition duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-mono flex items-center gap-1 transition-colors">
              {siteConfig.name}
              <span className="inline-block w-2 h-2 rounded-full bg-forge-cyan animate-pulse" />
            </span>
            <span className="text-[10px] tracking-wider text-slate-500 dark:text-gray-400 font-mono uppercase -mt-1 transition-colors">
              Zero-Cost Coding
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-forge-cyan bg-forge-cyan/15 border border-forge-cyan/30 shadow-sm font-semibold"
                    : "text-slate-700 hover:text-slate-950 dark:text-gray-300 dark:hover:text-white hover:bg-surface-secondary/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/problems"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white dark:text-slate-950 bg-forge-cyan hover:opacity-90 transition-all shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Practice</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg border border-surface-border text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white hover:bg-surface-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-forge-cyan" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-background/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {siteConfig.navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-forge-cyan bg-forge-cyan/15 border border-forge-cyan/30 font-semibold"
                    : "text-slate-700 hover:text-slate-950 dark:text-gray-300 dark:hover:text-white hover:bg-surface-secondary/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/problems"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-bold text-white dark:text-slate-950 bg-forge-cyan shadow-neon-cyan"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Practice Free</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
