import { Problem, SupportedLanguage } from "@/types/problem";
import { PROBLEM_IO_SPECS } from "@/data/problems/ioSpecs";
import { getStarterTemplate } from "@/lib/runners/languages.config";

export function getStarterCode(problem: Problem, language: SupportedLanguage): string {
  // 1. Check if problem has modern stdin/stdout ioSpec starter template
  const ioSpec = PROBLEM_IO_SPECS[problem.slug];
  if (ioSpec?.starterTemplates) {
    if (ioSpec.starterTemplates[language]) {
      return ioSpec.starterTemplates[language]!;
    }
    if ((language === "python3" || language === "python") && ioSpec.starterTemplates.python3) {
      return ioSpec.starterTemplates.python3;
    }
  }

  // 2. Check if problem explicitly has starterCode for this language
  if (problem.starterCode && problem.starterCode[language]) {
    return problem.starterCode[language]!;
  }

  // Handle python3 / python alias seamlessly
  if (language === "python3" || language === "python") {
    if (problem.starterCode?.python3) return problem.starterCode.python3;
    if (problem.starterCode?.python) return problem.starterCode.python;
  }

  // 3. Fall back to multi-language pattern library template
  const template = getStarterTemplate(language, problem.title);
  if (template) return template;

  const fn = problem.functionName || "solve";
  return `// Write your ${fn} solution here\n`;
}
