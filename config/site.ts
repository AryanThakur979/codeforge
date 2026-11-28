import { SUPPORTED_LANGUAGES_COUNT } from "@/lib/runners/languages.config";

export const siteConfig = {
  name: "CodeForge",
  tagline: "The Futuristic, Zero-Cost Coding Practice Platform",
  description:
    "Master algorithmic problem solving with interactive 3D visuals, instant in-browser code execution, and zero paid barriers. 100% free forever for students and engineers.",
  url: "https://codeforge-eight-liart.vercel.app",
  author: {
    name: "Aryan",
    github: "https://github.com/AryanThakur979",
  },
  links: {
    github: "https://github.com/AryanThakur979/codeforge",
    docs: "/about",
  },
  navItems: [
    { label: "Problems", href: "/problems" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About", href: "/about" },
  ],
  stats: {
    problemsCount: "3,000+",
    languagesSupported: `${SUPPORTED_LANGUAGES_COUNT}+ Verified Languages`,
    cost: "100% Free",
    runtimeTarget: "0ms Backend Wait",
  },
};

export type SiteConfig = typeof siteConfig;
