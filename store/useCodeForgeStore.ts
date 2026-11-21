"use client";

import { create } from "zustand";

import { SupportedLanguage } from "@/types/problem";

export interface SubmissionRecord {
  id: string;
  problemSlug: string;
  problemTitle: string;
  language: SupportedLanguage | string;
  status: "passed" | "failed" | "error" | "tle";
  runtime: number;
  timestamp: string;
  code: string;
}

export interface SolvedProblemRecord {
  slug: string;
  solvedAt: string;
  language: string;
  runtime: number;
}

interface CodeForgeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

  solvedProblems: Record<string, SolvedProblemRecord>;
  submissions: SubmissionRecord[];
  
  markProblemSolved: (
    slug: string,
    problemTitle: string,
    language: SupportedLanguage | string,
    runtime: number,
    code: string
  ) => void;
  
  recordSubmission: (
    problemSlug: string,
    problemTitle: string,
    language: SupportedLanguage | string,
    status: "passed" | "failed" | "error" | "tle",
    runtime: number,
    code: string
  ) => void;

  userCodeDrafts: Record<string, Record<string, string>>; // [slug][language] -> code
  saveCodeDraft: (slug: string, language: string, code: string) => void;

  isHydrated: boolean;
  setHydrated: () => void;

  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetAllData: () => void;
}

const STORAGE_KEY = "codeforge_user_data_v1";

export const useCodeForgeStore = create<CodeForgeState>((set, get) => ({
  theme: "dark",
  solvedProblems: {},
  submissions: [],
  userCodeDrafts: {},
  isHydrated: false,

  setHydrated: () => set({ isHydrated: true }),

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", nextTheme === "light");
    }
    set({ theme: nextTheme });
    try {
      localStorage.setItem("codeforge_theme", nextTheme);
    } catch {}
  },

  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", theme === "light");
    }
    set({ theme });
    try {
      localStorage.setItem("codeforge_theme", theme);
    } catch {}
  },

  markProblemSolved: (slug, problemTitle, language, runtime, code) => {
    const now = new Date().toISOString();
    const existing = get().solvedProblems;
    const updatedSolved = {
      ...existing,
      [slug]: {
        slug,
        solvedAt: existing[slug]?.solvedAt || now,
        language,
        runtime,
      },
    };

    const newSubmission: SubmissionRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      problemSlug: slug,
      problemTitle,
      language,
      status: "passed",
      runtime,
      timestamp: now,
      code,
    };

    const updatedSubmissions = [newSubmission, ...get().submissions].slice(0, 100);

    set({
      solvedProblems: updatedSolved,
      submissions: updatedSubmissions,
    });

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          solvedProblems: updatedSolved,
          submissions: updatedSubmissions,
          userCodeDrafts: get().userCodeDrafts,
        })
      );
    } catch (e) {
      console.warn("Failed to persist solved problem:", e);
    }
  },

  recordSubmission: (problemSlug, problemTitle, language, status, runtime, code) => {
    const now = new Date().toISOString();
    const newSubmission: SubmissionRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      problemSlug,
      problemTitle,
      language,
      status,
      runtime,
      timestamp: now,
      code,
    };

    const updatedSubmissions = [newSubmission, ...get().submissions].slice(0, 100);
    set({ submissions: updatedSubmissions });

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          solvedProblems: get().solvedProblems,
          submissions: updatedSubmissions,
          userCodeDrafts: get().userCodeDrafts,
        })
      );
    } catch {}
  },

  saveCodeDraft: (slug, language, code) => {
    const drafts = { ...get().userCodeDrafts };
    if (!drafts[slug]) drafts[slug] = {};
    drafts[slug][language] = code;

    set({ userCodeDrafts: drafts });
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          solvedProblems: get().solvedProblems,
          submissions: get().submissions,
          userCodeDrafts: drafts,
        })
      );
    } catch {}
  },

  exportData: () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      solvedProblems: get().solvedProblems,
      submissions: get().submissions,
      userCodeDrafts: get().userCodeDrafts,
    };
    return JSON.stringify(data, null, 2);
  },

  importData: (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed === "object") {
        set({
          solvedProblems: parsed.solvedProblems || {},
          submissions: parsed.submissions || [],
          userCodeDrafts: parsed.userCodeDrafts || {},
        });
        localStorage.setItem(STORAGE_KEY, jsonData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  resetAllData: () => {
    set({
      solvedProblems: {},
      submissions: [],
      userCodeDrafts: {},
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
}));
