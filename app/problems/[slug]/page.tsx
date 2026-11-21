import { Metadata } from "next";
import { notFound } from "next/navigation";
import { problems, getProblemBySlug } from "@/data/problems";
import { ProblemWorkspace } from "@/components/editor/ProblemWorkspace";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export async function generateStaticParams() {
  // Prerender the top 30 problems at build time to keep build sub-20s
  return problems.slice(0, 30).map((problem) => ({
    slug: problem.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const problem = getProblemBySlug(params.slug);
  if (!problem) {
    return {
      title: "Problem Not Found",
    };
  }

  const problemUrl = `${siteConfig.url}/problems/${params.slug}`;

  return {
    title: `${problem.title} (${problem.difficulty})`,
    description: `Solve ${problem.title} on ${siteConfig.name}. Write, run, and benchmark your solution in-browser with zero latency.`,
    alternates: {
      canonical: `/problems/${params.slug}`,
    },
    openGraph: {
      title: `${problem.title} — ${siteConfig.name}`,
      description: `Practice ${problem.title} (${problem.difficulty} • ${problem.tags.join(", ")}) for free on ${siteConfig.name}.`,
      url: problemUrl,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title: `${problem.title} (${problem.difficulty}) | ${siteConfig.name}`,
      description: `Practice ${problem.title} on ${siteConfig.name}. 100% free coding platform.`,
    },
  };
}

export default function ProblemPage({ params }: PageProps) {
  const problem = getProblemBySlug(params.slug);
  if (!problem) {
    notFound();
  }

  return <ProblemWorkspace slug={params.slug} />;
}
