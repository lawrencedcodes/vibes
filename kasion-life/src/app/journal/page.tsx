import React from "react";
import { JournalIcon } from "@/components/Icons";

export default function JournalPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Daily Journal
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Capture ideas, reflect on daily lessons, and record key thoughts.
        </p>
      </div>

      {/* Editor Placeholder Area */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>NEW LOG</span>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "700", marginTop: "0.25rem" }}>Reflections on Web Foundation Architecture</h2>
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Draft • Saved 3m ago
          </span>
        </div>

        {/* Minimal input area */}
        <textarea
          placeholder="Start writing..."
          defaultValue={`Setting up a minimalist Next.js dashboard template with structured vanilla CSS. The layout feels lightweight and responsive. The implementation uses system font variables and a sleek dark theme. Next steps: configuring state synchronization and database connections...`}
          style={{
            width: "100%",
            minHeight: "150px",
            background: "transparent",
            border: "none",
            resize: "vertical",
            outline: "none",
            color: "var(--foreground)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            lineHeight: "1.6",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <button style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Discard
          </button>
          <button style={{
            backgroundColor: "var(--accent)",
            border: "none",
            color: "var(--accent-foreground)",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Publish Log
          </button>
        </div>
      </div>

      {/* History */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Past Logs</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>JUNE 19, 2026</span>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginTop: "0.15rem" }}>Personal development milestones for mid-year review</h4>
            </div>
            <span style={{ color: "var(--muted)" }}><JournalIcon size={16} /></span>
          </div>
          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>JUNE 18, 2026</span>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginTop: "0.15rem" }}>Initial plans for kasionlife.com launch strategy</h4>
            </div>
            <span style={{ color: "var(--muted)" }}><JournalIcon size={16} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
