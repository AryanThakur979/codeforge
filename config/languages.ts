/**
 * Centralized Language & Compiler Configuration for CodeForge
 * Re-exports verified multi-language configuration supporting 30+ programming languages.
 */

import {
  ALL_CANDIDATE_LANGUAGES,
  ENABLED_LANGUAGES,
  TIER1_LANGUAGES,
  TIER2_LANGUAGES,
  TIER3_LANGUAGES,
  SUPPORTED_LANGUAGES_COUNT,
  LANGUAGES_MAP,
  LanguageConfig,
} from "@/lib/runners/languages.config";

export interface LanguageMeta {
  id: string;
  name: string;
  extension: string;
  badge: string;
  runtimeLabel: string;
  isBrowserExecution: boolean;
  judge0Id: number;
  judge0Version: string;
  description: string;
  tier: number;
}

export const VERIFIED_LANGUAGES: LanguageMeta[] = ENABLED_LANGUAGES.map((l) => ({
  id: l.key,
  name: l.label,
  extension: l.extension,
  badge: l.badge,
  runtimeLabel: `${l.label} (${l.version})`,
  isBrowserExecution: Boolean(l.isBrowserExecution),
  judge0Id: l.providerLanguageId,
  judge0Version: l.version,
  description: `${l.label} ${l.version} executed with memory and time safeguards.`,
  tier: l.tier,
}));

export const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python3: 100,
  python: 100,
  javascript: 102,
  js: 102,
  typescript: 101,
  ts: 101,
  cpp: 105,
  c: 103,
  java: 91,
};
for (const l of ALL_CANDIDATE_LANGUAGES) {
  JUDGE0_LANGUAGE_IDS[l.key] = l.providerLanguageId;
}
JUDGE0_LANGUAGE_IDS["rs"] = 108;

export {
  ALL_CANDIDATE_LANGUAGES,
  ENABLED_LANGUAGES,
  TIER1_LANGUAGES,
  TIER2_LANGUAGES,
  TIER3_LANGUAGES,
  SUPPORTED_LANGUAGES_COUNT,
  LANGUAGES_MAP,
};
