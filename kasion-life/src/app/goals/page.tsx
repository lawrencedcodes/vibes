import React from "react";
import { GoalsIcon } from "@/components/Icons";

export default function GoalsPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Active Goals
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Manage short-term objectives, long-term targets, and milestone progress.
        </p>
      </div>

      {/* Target Progress Panel */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Milestone Progress</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Aggregate completion score across all core active milestones.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", flex: 1, height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: "66%", height: "100%", backgroundColor: "var(--accent)" }} />
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: "700", fontFamily: "var(--font-mono)" }}>66%</span>
        </div>
      </div>

      {/* Goals Board */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Active Milestones</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ height: "18px", width: "18px", borderRadius: "4px", border: "2px solid var(--accent)", backgroundColor: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyItems: "center" }} />
              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: "600" }}>Define layout wireframes</h4>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "0.15rem" }}>Core design specs for kasionlife.com web foundation</p>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600", fontFamily: "var(--font-mono)" }}>COMPLETED</span>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ height: "18px", width: "18px", borderRadius: "4px", border: "2px solid var(--accent)", backgroundColor: "rgba(99,102,241,0.1)" }} />
              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: "600" }}>Integrate client routing layout</h4>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "0.15rem" }}>Basic paths for Overview, Tracker, Goals, and Settings</p>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600", fontFamily: "var(--font-mono)" }}>COMPLETED</span>
          </div>

          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ height: "18px", width: "18px", borderRadius: "4px", border: "2px solid var(--border)" }} />
              <div>
                <h4 style={{ fontSize: "0.875rem", fontWeight: "600" }}>Production deployment verify</h4>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "0.15rem" }}>Verify build output and launch to kasionlife.com host</p>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "600", fontFamily: "var(--font-mono)" }}>IN PROGRESS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
