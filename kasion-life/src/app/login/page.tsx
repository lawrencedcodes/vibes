"use client";

import React, { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div className="login-page-container">
      {/* Decorative Blur Glows */}
      <div className="login-glow" />
      <div className="login-glow-bottom" />

      {/* Login Card Panel */}
      <div className="login-card-panel glass-panel">
        <div className="login-header">
          <div className="logo-container" style={{ margin: "0 auto 0.5rem" }}>
            <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}>K</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
            KASION LIFE
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: "1.4" }}>
            Access your personal habits, metrics, and daily logs dashboard.
          </p>
        </div>

        {/* Error Alert Banner */}
        {state?.error && (
          <div className="error-banner animate-fade-in">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="login-form">
          <div className="login-form-group">
            <label className="login-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. admin@kasionlife.com"
              required
              className="login-input"
              disabled={isPending}
            />
          </div>

          <div className="login-form-group">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="login-input"
              disabled={isPending}
            />
          </div>

          <button type="submit" disabled={isPending} className="login-btn" style={{ marginTop: "0.5rem" }}>
            {isPending ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Help box for the user */}
        <div className="login-tip-box">
          <div style={{ fontWeight: "700", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span style={{ color: "var(--accent)" }}>●</span> First-Time Access Tip:
          </div>
          <div>
            The database will automatically seed a default demo user upon your first login attempt. Use these credentials to access the dashboard:
          </div>
          <div style={{ marginTop: "0.25rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <div>Email: <strong style={{ color: "var(--foreground)" }}>admin@kasionlife.com</strong></div>
            <div>Pass: <strong style={{ color: "var(--foreground)" }}>password123</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
