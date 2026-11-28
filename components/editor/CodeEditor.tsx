"use client";

import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
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

    const extensions = useMemo(() => {
      const exts = [];
      if (language === "javascript") {
        exts.push(javascript({ jsx: false, typescript: false }));
      } else if (language === "typescript") {
        exts.push(javascript({ jsx: false, typescript: true }));
      } else if (language === "python" || language === "python3") {
        exts.push(python());
      } else if (language === "java") {
        exts.push(java());
      } else {
        // C++, C
        exts.push(cpp());
      }
      return exts;
    }, [language]);

    return (
      <div className={`relative overflow-hidden font-mono text-sm ${className}`}>
        <CodeMirror
          ref={cmRef}
          value={value}
          height={height}
          extensions={extensions}
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
