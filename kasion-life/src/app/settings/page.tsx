import React from "react";
import { SettingsIcon } from "@/components/Icons";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Settings & Configurations
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Configure user profile settings, application modes, and export databases.
        </p>
      </div>

      {/* General Settings Card */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>System Details</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Review baseline parameters for local compilation.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Domain Target</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>kasionlife.com</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Build Mode</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>Next.js App Router (Static/PPR Ready)</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Next.js Directory version</span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "var(--font-mono)" }}>v16+ (Canary Doc-Enabled)</span>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Data Portability</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Export or erase metrics and logs recorded inside the browser workspace.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{
            backgroundColor: "var(--accent)",
            border: "none",
            color: "var(--accent-foreground)",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Export Logs (JSON)
          </button>
          <button style={{
            backgroundColor: "transparent",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Clear Browser Database
          </button>
        </div>
      </div>
    </div>
  );
}
