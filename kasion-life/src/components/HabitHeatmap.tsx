"use client";

import React, { useMemo } from "react";

interface HabitLogInfo {
  date: string;
  isCompleted: boolean;
  value: number | null;
}

interface HabitHeatmapProps {
  logs: HabitLogInfo[];
  type: string;
  dailyTarget: number;
}

export default function HabitHeatmap({ logs, type, dailyTarget }: HabitHeatmapProps) {
  // Generate the 365 days list memoized
  const dayGrid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates: Date[] = [];
    // 364 days ago to today represents exactly 365 days
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      dates.push(d);
    }

    // Index logs by date time for O(1) performance lookup
    const logsMap = new Map<number, { isCompleted: boolean; value: number | null }>();
    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      logsMap.set(logDate.getTime(), { isCompleted: log.isCompleted, value: log.value });
    }

    return dates.map(date => {
      const logInfo = logsMap.get(date.getTime());
      let score = 0;
      let displayVal = 0;
      let isCompleted = false;

      if (logInfo) {
        isCompleted = logInfo.isCompleted;
        if (type === "BOOLEAN") {
          score = logInfo.isCompleted ? 1.0 : 0.0;
          displayVal = logInfo.isCompleted ? 1 : 0;
        } else {
          const val = logInfo.value ?? 0;
          displayVal = val;
          const target = dailyTarget || 1;
          score = Math.min(1.0, Math.max(0.0, val / target));
        }
      }

      // Format tooltip string
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      let tooltip = "";
      if (type === "BOOLEAN") {
        tooltip = `${dateString}: ${isCompleted ? "Completed" : "No entry"}`;
      } else {
        tooltip = `${dateString}: ${displayVal} / ${dailyTarget} (${Math.round(score * 100)}%)`;
      }

      return {
        id: date.getTime(),
        score,
        tooltip,
      };
    });
  }, [logs, type, dailyTarget]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", marginTop: "0.25rem" }}>
      {/* Heatmap Grid Wrapper */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateRows: "repeat(7, 8px)", 
          gridAutoFlow: "column", 
          gap: "3px", 
          overflowX: "auto", 
          paddingBottom: "0.5rem",
          width: "100%",
          scrollbarWidth: "none", // Hide scrollbar in Firefox
          msOverflowStyle: "none",  // Hide scrollbar in IE/Edge
        }}
        className="heatmap-container"
      >
        {dayGrid.map((day) => {
          let opacity = 0.2;
          let color = "var(--border)";
          
          if (day.score > 0) {
            color = "var(--accent)";
            if (day.score <= 0.25) opacity = 0.25;
            else if (day.score <= 0.5) opacity = 0.5;
            else if (day.score <= 0.75) opacity = 0.75;
            else opacity = 1.0;
          }

          return (
            <div
              key={day.id}
              title={day.tooltip}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "1.5px",
                backgroundColor: color,
                opacity,
                transition: "opacity 0.2s ease, transform 0.1s ease",
                cursor: "pointer",
              }}
              className="heatmap-square"
            />
          );
        })}
      </div>
    </div>
  );
}
