import React from "react";
import { TrackerIcon, JournalIcon, GoalsIcon } from "@/components/Icons";

export default function OverviewPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Hero Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Welcome back, Kasion
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Here is your personal life overview for today. All systems operational.
        </p>
      </div>

      {/* Grid of Minimal Metric Cards */}
      <div className="metric-grid">
        {/* Habit Card */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Daily Habits</span>
            <span className="card-icon-wrapper">
              <TrackerIcon size={18} />
            </span>
          </div>
          <div>
            <div className="card-value">4/6</div>
            <div className="card-description" style={{ marginTop: "0.25rem" }}>
              Streak: 12 days • 67% completed
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: "67%", height: "100%", backgroundColor: "var(--accent)" }} />
          </div>
        </div>

        {/* Journal Card */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Daily Journal</span>
            <span className="card-icon-wrapper">
              <JournalIcon size={18} />
            </span>
          </div>
          <div>
            <div className="card-value" style={{ fontSize: "1.25rem", fontFamily: "var(--font-sans)", fontWeight: "600", minHeight: "3rem", display: "flex", alignItems: "center" }}>
              "Reflecting on today's engineering goals and progress..."
            </div>
            <div className="card-description" style={{ marginTop: "0.5rem" }}>
              Logged at 9:30 AM • 120 words
            </div>
          </div>
        </div>

        {/* Goals Card */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Active Goals</span>
            <span className="card-icon-wrapper">
              <GoalsIcon size={18} />
            </span>
          </div>
          <div>
            <div className="card-value">2/3</div>
            <div className="card-description" style={{ marginTop: "0.25rem" }}>
              Current Milestone: Web Launch Prep
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: "66%", height: "100%", backgroundColor: "var(--accent)" }} />
          </div>
        </div>
      </div>

      {/* Focus & Highlights Section */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Focus Area</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Your primary task focus for the week.
          </p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "1rem", padding: "1rem", borderRadius: "0.75rem", backgroundColor: "var(--muted-bg)", border: "1px solid var(--border)" }}>
            <div style={{ height: "10px", width: "10px", borderRadius: "50%", backgroundColor: "var(--accent)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "600" }}>Launch kasionlife.com</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                Finalize responsive styles, build, check environment configurations.
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: "500", fontFamily: "var(--font-mono)" }}>
              IN PROGRESS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
