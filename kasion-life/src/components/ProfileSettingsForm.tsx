"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { updateProfile } from "@/app/actions/auth";

interface ProfileSettingsFormProps {
  initialName: string;
  email: string;
}

export default function ProfileSettingsForm({ initialName, email }: ProfileSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, undefined);

  return (
    <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Account &amp; Workspace Profile</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Manage your personal display name and workspace onboarding templates.
          </p>
        </div>

        <Link
          href="/onboarding"
          style={{
            padding: "0.55rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: "var(--muted-bg)",
            border: "1px solid var(--border)",
            color: "var(--accent)",
            fontSize: "0.8rem",
            fontWeight: "700",
            textDecoration: "none",
          }}
        >
          Re-run Onboarding Wizard →
        </Link>
      </div>

      {state?.error && (
        <div className="error-banner" role="alert">
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div
          role="status"
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "#10b981",
            fontSize: "0.825rem",
            fontWeight: "600",
          }}
        >
          ✓ {state.message || "Profile updated successfully."}
        </div>
      )}

      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px" }}>
        <div className="login-form-group">
          <label className="login-label" htmlFor="profile-name">
            Display Name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={initialName}
            required
            minLength={2}
            className="login-input"
            disabled={isPending}
          />
        </div>

        <div className="login-form-group">
          <label className="login-label" htmlFor="profile-email">
            Account Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            disabled
            className="login-input"
            style={{ opacity: 0.65, cursor: "not-allowed" }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="login-btn"
            style={{ width: "auto", padding: "0.625rem 1.25rem" }}
          >
            {isPending ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
