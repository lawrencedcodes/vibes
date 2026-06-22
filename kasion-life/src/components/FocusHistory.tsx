"use client";

import React, { useState, useEffect } from "react";

interface FocusSessionSummary {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  todoContent: string | null;
}

interface FocusHistoryProps {
  sessions: FocusSessionSummary[];
}

export default function FocusHistory({ sessions }: FocusHistoryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatSessionTime = (isoString: string) => {
    const d = new Date(isoString);
    let hrs = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    return `${hrs}:${mins} ${ampm}`;
  };

  const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Today's Focus Stats */}
      <div className="glass-panel" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.25rem 1.5rem",
        borderRadius: "1rem"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Performance summary</span>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Focus Sessions Today</h3>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Completed</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              {sessions.length}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Total Time</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
              {totalMinutes} <span style={{ fontSize: "0.75rem", fontWeight: "500", color: "var(--muted)" }}>mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* History Log Card */}
      <div className="dashboard-card glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <h4 style={{ fontSize: "0.875rem", fontWeight: "700", marginBottom: "1rem", color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Today's Focus Log</h4>
        
        {!mounted ? (
          <div style={{ padding: "1rem 0", color: "var(--muted)", fontSize: "0.825rem", textAlign: "center" }}>
            Loading focus logs...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: "1.5rem 0", color: "var(--muted)", fontSize: "0.825rem", textAlign: "center" }}>
            No sessions logged today. Start the timer to lock in your first focus session!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  fontSize: "0.875rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0, flex: 1 }}>
                  {/* Clock icon */}
                  <span style={{ color: "var(--accent)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </span>
                  
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontWeight: "600", color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.todoContent ? `Focused on: "${session.todoContent}"` : "Completed focus session"}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>
                      Logged at {formatSessionTime(session.startTime)}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  color: "var(--accent)",
                  backgroundColor: "rgba(99, 102, 241, 0.08)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  flexShrink: 0
                }}>
                  +{session.duration}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
