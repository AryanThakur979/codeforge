"use client";

import { useMemo, useState } from "react";
import { SubmissionRecord } from "@/store/useCodeForgeStore";

interface ActivityHeatmapProps {
  submissions: SubmissionRecord[];
}

export function ActivityHeatmap({ submissions }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    dateStr: string;
    count: number;
  } | null>(null);

  // Group submissions by day (YYYY-MM-DD)
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach((s) => {
      if (!s.timestamp) return;
      const dateKey = s.timestamp.slice(0, 10);
      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });
    return map;
  }, [submissions]);

  // Generate 16 weeks of calendar days leading up to today
  const weeks = useMemo(() => {
    const totalDays = 16 * 7;
    const result: Array<Array<{ date: Date; dateStr: string; count: number }>> = [];
    const today = new Date();

    const allDays = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = activityMap.get(dateStr) || 0;
      allDays.push({ date: d, dateStr, count });
    }

    for (let w = 0; w < 16; w++) {
      result.push(allDays.slice(w * 7, w * 7 + 7));
    }
    return result;
  }, [activityMap]);

  const getCellColor = (count: number) => {
    if (count === 0) return "bg-surface-secondary/60 border-surface-border";
    if (count === 1) return "bg-forge-cyan/30 border-forge-cyan/50";
    if (count <= 3) return "bg-forge-cyan/60 border-forge-cyan/80 shadow-[0_0_8px_rgba(0,240,255,0.4)]";
    return "bg-forge-cyan border-white shadow-[0_0_12px_rgba(0,240,255,0.8)]";
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-2xl border border-surface-border bg-surface/40 p-6 backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white">Daily Activity Heatmap</h3>
          <p className="text-xs text-gray-400">
            Recorded algorithmic problem submissions across the past 16 weeks.
          </p>
        </div>

        {/* Hover info pill */}
        <div className="h-6 flex items-center">
          {hoveredCell ? (
            <span className="text-xs font-mono text-forge-cyan bg-forge-cyan/10 border border-forge-cyan/30 px-2.5 py-0.5 rounded-full">
              {hoveredCell.dateStr}: {hoveredCell.count}{" "}
              {hoveredCell.count === 1 ? "submission" : "submissions"}
            </span>
          ) : (
            <span className="text-xs font-mono text-gray-500">Hover over any square for date details</span>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1.5 min-w-fit">
          {/* Day of week labels */}
          <div className="flex flex-col justify-between py-1 pr-1 text-[10px] font-mono text-gray-500 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Week Columns */}
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.dateStr}
                  onMouseEnter={() =>
                    setHoveredCell({ dateStr: day.dateStr, count: day.count })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-3.5 h-3.5 rounded-[3px] border transition-transform duration-150 hover:scale-125 cursor-pointer ${getCellColor(
                    day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-surface-border">
        <span>Contributions saved in local browser storage</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-surface-secondary/60 border border-surface-border" />
          <div className="w-3 h-3 rounded-[2px] bg-forge-cyan/30 border border-forge-cyan/50" />
          <div className="w-3 h-3 rounded-[2px] bg-forge-cyan/60 border border-forge-cyan/80" />
          <div className="w-3 h-3 rounded-[2px] bg-forge-cyan border-white" />
          <span className="text-[11px] font-mono">More</span>
        </div>
      </div>
    </div>
  );
}
