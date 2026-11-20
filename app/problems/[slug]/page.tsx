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

export async function generateStaticParams() {
  return problems.map((problem) => ({
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

  return {
    title: `${problem.title} (${problem.difficulty})`,
    description: `Solve ${problem.title} on ${siteConfig.name}. Write, run, and benchmark your solution in-browser with zero latency.`,
    openGraph: {
      title: `${problem.title} — ${siteConfig.name}`,
      description: `Practice ${problem.title} (${problem.difficulty} • ${problem.tags.join(", ")}) for free on ${siteConfig.name}.`,
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
