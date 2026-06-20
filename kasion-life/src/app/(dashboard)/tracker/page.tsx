import React from "react";
import { TrackerIcon } from "@/components/Icons";

export default function TrackerPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Metrics Tracker
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Track daily logs, physical parameters, and mental well-being indexes.
        </p>
      </div>

      {/* Grid containing tracking categories */}
      <div className="metric-grid">
        {/* Habit Card */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Habits Checklist</span>
            <span className="card-icon-wrapper"><TrackerIcon size={18} /></span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "0.5rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
              <span style={{ textDecoration: "line-through", color: "var(--muted)" }}>Read 30 mins</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
              <span style={{ textDecoration: "line-through", color: "var(--muted)" }}>Exercise 45 mins</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.875rem" }}>
              <input type="checkbox" style={{ accentColor: "var(--accent)" }} />
              <span>Hydrate 3L</span>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Sleep Quality</span>
            <span className="card-icon-wrapper"><TrackerIcon size={18} /></span>
          </div>
          <div>
            <div className="card-value">7.5<span style={{ fontSize: "1rem", color: "var(--muted)" }}> hrs</span></div>
            <div className="card-description" style={{ marginTop: "0.25rem" }}>
              Deep sleep: 2.1h (28%)
            </div>
          </div>
        </div>

        {/* Focus Score */}
        <div className="dashboard-card glass-panel">
          <div className="card-title-row">
            <span className="card-title">Productivity Log</span>
            <span className="card-icon-wrapper"><TrackerIcon size={18} /></span>
          </div>
          <div>
            <div className="card-value">88<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/100</span></div>
            <div className="card-description" style={{ marginTop: "0.25rem" }}>
              Highly focused session recorded
            </div>
          </div>
        </div>
      </div>

      {/* Blank State Integration Container */}
      <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>No external integrations connected</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", maxWidth: "450px", margin: "0 auto 1.5rem" }}>
          Connect Apple Health, Oura Ring, or custom integrations to automatically sync tracker data.
        </p>
        <button style={{
          backgroundColor: "var(--muted-bg)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          padding: "0.625rem 1.25rem",
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "border-color 0.2s ease"
        }}>
          Manage Integrations
        </button>
      </div>
    </div>
  );
}
