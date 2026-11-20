"use client";

import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { useCodeForgeStore } from "@/store/useCodeForgeStore";

export interface CodeEditorHandle {
  insertText: (text: string) => void;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "javascript" | "python";
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
    }));

    const extensions = useMemo(() => {
      const exts = [];
      if (language === "javascript") {
        exts.push(javascript({ jsx: false, typescript: false }));
      } else if (language === "python") {
        exts.push(python());
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
          className="border border-surface-border rounded-b-xl overflow-hidden"
        />
      </div>
    );
  }
);

CodeEditor.displayName = "CodeEditor";
