export const siteConfig = {
  name: "CodeForge",
  tagline: "The Futuristic, Zero-Cost Coding Practice Platform",
  description:
    "Master algorithmic problem solving with interactive 3D visuals, instant in-browser code execution, and zero paid barriers. 100% free forever for students and engineers.",
  url: "https://codeforge.dev",
  author: {
    name: "CodeForge Team",
    github: "https://github.com",
  },
  links: {
    github: "https://github.com",
    docs: "/about",
  },
  navItems: [
    { label: "Problems", href: "/problems" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About", href: "/about" },
  ],
  stats: {
    problemsCount: "20+",
    languagesSupported: "2 (JS & Python)",
    cost: "100% Free",
    runtimeTarget: "0ms Backend Wait",
  },
};

export type SiteConfig = typeof siteConfig;
