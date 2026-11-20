import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Terminal, Github, Heart, ShieldCheck, Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-surface/30 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-forge-purple/20 border border-forge-cyan/30">
                <Terminal className="w-4 h-4 text-forge-cyan" />
              </div>
              <span className="text-lg font-bold text-white font-mono tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-forge-cyan font-mono bg-forge-cyan/10 border border-forge-cyan/20 w-fit px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free • No Paid APIs • Local Browser Sandboxed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/problems" className="hover:text-forge-cyan transition-colors">
                  Problems Directory
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-forge-cyan transition-colors">
                  Curated Roadmap
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-forge-cyan transition-colors">
                  Progress Tracker
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-forge-cyan transition-colors">
                  Philosophy & Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer / Open Source */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono mb-3">
              Open & Private
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-forge-amber" />
                <span>Zero Server Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-forge-green" />
                <span>Client-Side LocalStorage</span>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Handcrafted for students and developers worldwide.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-forge-pink fill-forge-pink" />
            <span>for zero-cost algorithmic education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
