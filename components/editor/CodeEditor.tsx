"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";
import { SupportedLanguage } from "@/types/problem";

export interface CodeEditorHandle {
  insertText: (text: string) => void;
  goToLine: (line: number, column?: number) => void;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  height?: string;
  className?: string;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  ({ value, onChange, language, height = "400px", className = "" }, ref) => {
    const { theme } = useCodeForgeStore();
    const cmRef = useRef<ReactCodeMirrorRef>(null);
    const [langExtension, setLangExtension] = useState<any[]>([]);

    useImperativeHandle(ref, () => ({
      insertText: (text: string) => {
        const view = cmRef.current?.view;
        if (!view) return;

        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
        });
        view.focus();
      },
      goToLine: (line: number, column?: number) => {
        const view = cmRef.current?.view;
        if (!view) return;
        const doc = view.state.doc;
        const targetLine = Math.max(1, Math.min(line, doc.lines));
        const lineObj = doc.line(targetLine);
        const targetPos = Math.min(
          lineObj.from + Math.max(0, (column || 1) - 1),
          lineObj.to
        );
        view.dispatch({
          selection: { anchor: targetPos, head: targetPos },
          scrollIntoView: true,
        });
        view.focus();
      },
    }));

    // Lazy load language syntax highlighter on demand to avoid bloating initial bundle
    useEffect(() => {
      let isMounted = true;

      async function loadLanguagePack() {
        try {
          const l = language.toLowerCase();
          if (l === "javascript" || l === "js") {
            const { javascript } = await import("@codemirror/lang-javascript");
            if (isMounted) setLangExtension([javascript({ jsx: false, typescript: false })]);
          } else if (l === "typescript" || l === "ts") {
            const { javascript } = await import("@codemirror/lang-javascript");
            if (isMounted) setLangExtension([javascript({ jsx: false, typescript: true })]);
          } else if (l === "python" || l === "python3" || l === "py") {
            const { python } = await import("@codemirror/lang-python");
            if (isMounted) setLangExtension([python()]);
          } else if (l === "cpp" || l === "c") {
            const { cpp } = await import("@codemirror/lang-cpp");
            if (isMounted) setLangExtension([cpp()]);
          } else if (
            l === "java" ||
            l === "csharp" ||
            l === "cs" ||
            l === "kotlin" ||
            l === "scala" ||
            l === "dart" ||
            l === "swift" ||
            l === "d" ||
            l === "objectivec"
          ) {
            const { java } = await import("@codemirror/lang-java");
            if (isMounted) setLangExtension([java()]);
          } else if (l === "go") {
            const { go } = await import("@codemirror/lang-go");
            if (isMounted) setLangExtension([go()]);
          } else if (l === "rust" || l === "rs") {
            const { rust } = await import("@codemirror/lang-rust");
            if (isMounted) setLangExtension([rust()]);
          } else if (l === "php") {
            const { php } = await import("@codemirror/lang-php");
            if (isMounted) setLangExtension([php()]);
          } else {
            if (isMounted) setLangExtension([]);
          }
        } catch {
          if (isMounted) setLangExtension([]);
        }
      }

      loadLanguagePack();
      return () => {
        isMounted = false;
      };
    }, [language]);

    return (
      <div className={`relative overflow-hidden font-mono text-sm ${className}`}>
        <CodeMirror
          ref={cmRef}
          value={value}
          height={height}
          extensions={langExtension}
          theme={theme === "dark" ? oneDark : "light"}
          onChange={onChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          className="h-full border-none outline-none font-mono text-[13px] leading-relaxed"
        />
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";
