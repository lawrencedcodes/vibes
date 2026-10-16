"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { login, loginDemo } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page-container">
      {/* Decorative Blur Glows */}
      <div className="login-glow" />
      <div className="login-glow-bottom" />

      {/* Login Card Panel */}
      <div className="login-card-panel glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-container" style={{ margin: "0 auto 0.5rem" }}>
            <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}>K</span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
            KASION LIFE
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: "1.4" }}>
            Sign in to your personal habits, focus blocks, and daily execution dashboard.
          </p>
        </div>

        {/* Error Alert Banner */}
        {state?.error && (
          <div className="error-banner animate-fade-in" role="alert">
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
              style={{ flexShrink: 0 }}
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
              autoComplete="username"
              enterKeyHint="next"
              placeholder="you@example.com"
              required
              className="login-input"
              disabled={isPending}
            />
          </div>

          <div className="login-form-group">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label className="login-label" htmlFor="current-password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent)",
                  fontSize: "0.725rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? "Hide password" : "Show password"}
              </button>
            </div>
            <input
              id="current-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              enterKeyHint="done"
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.875rem",
            borderTop: "1px solid var(--border)",
            paddingTop: "1.25rem",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "0.815rem", color: "var(--muted)" }}>
            New to KasionLife?{" "}
            <Link
              href="/signup"
              style={{
                color: "var(--accent)",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Create your account →
            </Link>
          </div>

          {/* One-Click Demo Workspace Form */}
          <form action={loginDemo}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.625rem 1rem",
                borderRadius: "0.75rem",
                backgroundColor: "var(--muted-bg)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ color: "var(--accent)" }}>●</span>
              <span>Try Instant Demo Workspace</span>
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
            <Link href="/welcome" style={{ color: "var(--muted)", textDecoration: "none" }}>← Overview</Link>
            <span>•</span>
            <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>Pricing Plans</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
