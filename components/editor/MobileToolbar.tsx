"use client";

interface MobileToolbarProps {
  onInsertSymbol: (symbol: string) => void;
}

export function MobileToolbar({ onInsertSymbol }: MobileToolbarProps) {
  const symbols = [
    { label: "( )", insert: "()" },
    { label: "{ }", insert: "{}" },
    { label: "[ ]", insert: "[]" },
    { label: "< >", insert: "<>" },
    { label: ";", insert: ";" },
    { label: ":", insert: ":" },
    { label: '"', insert: '""' },
    { label: "'", insert: "''" },
    { label: "=", insert: " = " },
    { label: "->", insert: "->" },
    { label: "=>", insert: " => " },
    { label: "Tab", insert: "  " },
  ];

  return (
    <div className="md:hidden flex items-center gap-1.5 overflow-x-auto py-2 px-3 bg-surface/90 border-t border-b border-surface-border backdrop-blur-md scrollbar-none">
      <span className="text-[10px] uppercase font-mono text-gray-500 mr-1 shrink-0">Quick Keys:</span>
      {symbols.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onInsertSymbol(item.insert)}
          className="px-2.5 py-1.5 rounded-md bg-surface-secondary text-gray-200 hover:text-forge-cyan hover:bg-surface-secondary/90 border border-surface-border text-xs font-mono font-semibold shrink-0 active:scale-95 transition-transform"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
