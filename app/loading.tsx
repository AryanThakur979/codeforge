export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-secondary border border-forge-cyan/40 shadow-neon-cyan">
        <span className="font-mono text-xl font-bold text-forge-cyan animate-pulse">
          &lt;CF /&gt;
        </span>
        <div className="absolute inset-0 rounded-2xl border-2 border-forge-cyan/50 border-t-transparent animate-spin" />
      </div>
      <div className="text-xs font-mono text-slate-600 dark:text-gray-400 tracking-wider uppercase animate-pulse">
        Initializing Quantum Runtime...
      </div>
    </div>
  );
}
