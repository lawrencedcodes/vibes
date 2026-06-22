"use client";

import React, { useState, useEffect, useMemo } from "react";

interface FocusSessionSummary {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  todoContent: string | null;
}

interface FocusTimelineProps {
  sessions: FocusSessionSummary[];
}

export default function FocusTimeline({ sessions }: FocusTimelineProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalMinutes = useMemo(() => {
    return sessions.reduce((acc, curr) => acc + curr.duration, 0);
  }, [sessions]);

  const targetMinutes = 240; // 4 hours deep work target
  const percentage = Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  const formatSessionTime = (isoString: string) => {
    const d = new Date(isoString);
    let hrs = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    return `${hrs}:${mins} ${ampm}`;
  };

  const chronologicalSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [sessions]);

  // SVG progress ring configuration
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      <style>{`
        .timeline-container {
          position: relative;
          padding-left: 1.5rem;
          border-left: 2px solid var(--border);
          margin-left: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .timeline-item {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .timeline-dot {
          position: absolute;
          left: calc(-1.5rem - 5px);
          top: 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--accent);
          border: 2px solid var(--background);
        }
        .timeline-time {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent);
        }
        .timeline-duration {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
        }
        .timeline-content {
          font-size: 0.815rem;
          color: var(--foreground);
          font-weight: 600;
        }
      `}</style>

      {/* Widget 1: Pomodoro Stats with Radial Progress Ring */}
      <div className="glass-panel" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem",
        borderRadius: "1.25rem",
        backgroundColor: "var(--card-bg)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>
            Deep Work Target
          </span>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "800", color: "var(--foreground)" }}>
            Daily Focus Progress
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            {totalMinutes} of {targetMinutes} minutes logged ({percentage}%)
          </span>
        </div>

        {/* Circular progress SVG */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "90px", height: "90px" }}>
          <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--accent)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "1.125rem", fontWeight: "900", color: "var(--foreground)" }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Widget 2: Chronological Timeline Log */}
      <div className="dashboard-card glass-panel" style={{ padding: "1.75rem", borderRadius: "1.25rem" }}>
        <h4 style={{ fontSize: "0.825rem", fontWeight: "700", marginBottom: "1.5rem", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>
          Chronological Focus Timeline
        </h4>

        {!mounted ? (
          <div style={{ padding: "1rem 0", color: "var(--muted)", fontSize: "0.825rem", textAlign: "center" }}>
            Loading timeline...
          </div>
        ) : chronologicalSessions.length === 0 ? (
          <div style={{ padding: "2rem 0", color: "var(--muted)", fontSize: "0.825rem", textAlign: "center", fontStyle: "italic" }}>
            No focus sessions logged today. Start a Pomodoro interval to map your first timeline node!
          </div>
        ) : (
          <div className="timeline-container">
            {chronologicalSessions.map((session) => {
              const startText = formatSessionTime(session.startTime);
              const endText = session.endTime ? formatSessionTime(session.endTime) : "";
              
              return (
                <div key={session.id} className="timeline-item">
                  {/* Spine bullet indicator */}
                  <span className="timeline-dot" />

                  {/* Header Row: Duration Badge & Time Bounds */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span className="timeline-time">
                      {startText} {endText && `- ${endText}`}
                    </span>
                    <span className="timeline-duration">
                      • {session.duration} mins
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="timeline-content">
                    {session.todoContent ? (
                      <span>Focused on: <strong style={{ color: "var(--accent)" }}>"{session.todoContent}"</strong></span>
                    ) : (
                      "Deep work session completed"
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
