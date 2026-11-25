"use client";

import React, { Suspense, useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/actions/auth";

function SignupFormContent() {
  const [state, formAction, isPending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const selectedPlan = searchParams.get("plan") || "free";
  const selectedBilling = searchParams.get("billing") || "annual";

  return (
    <div className="login-card-panel glass-panel animate-fade-in">
      <div className="login-header">
        <div className="logo-container" style={{ margin: "0 auto 0.5rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}>K</span>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
          CREATE YOUR OS
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.825rem", lineHeight: "1.4" }}>
          Start your 12-Week Year workspace with unified habits, focus blocks, and daily reflections.
        </p>
        {(selectedPlan === "pro" || selectedPlan === "lifetime") && (
          <div
            style={{
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              backgroundColor:
                selectedPlan === "lifetime"
                  ? "rgba(16, 185, 129, 0.14)"
                  : "rgba(99, 102, 241, 0.14)",
              border:
                selectedPlan === "lifetime"
                  ? "1px solid rgba(16, 185, 129, 0.35)"
                  : "1px solid rgba(99, 102, 241, 0.35)",
              color: selectedPlan === "lifetime" ? "#10b981" : "var(--accent)",
              fontSize: "0.725rem",
              fontWeight: "700",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>●</span>
            <span>
              {selectedPlan === "lifetime"
                ? "Selected: Founder Edition ($149 Lifetime)"
                : `Selected: Kasion Pro (${
                    selectedBilling === "monthly" ? "$10/mo" : "$8/mo Annual"
                  } • 14-Day Free Trial)`}
            </span>
          </div>
        )}
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
        <input type="hidden" name="selectedPlan" value={selectedPlan} />
        <input type="hidden" name="selectedBilling" value={selectedBilling} />
        <div className="login-form-group">
          <label className="login-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            placeholder="e.g. Alex Rivera"
            required
              minLength={2}
              className="login-input"
              disabled={isPending}
            />
          </div>

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
              <label className="login-label" htmlFor="new-password">
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
              id="new-password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              enterKeyHint="done"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="login-input"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="login-btn"
            style={{ marginTop: "0.5rem" }}
          >
            {isPending ? "Creating Workspace..." : "Continue to Onboarding →"}
          </button>
        </form>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.25rem",
            textAlign: "center",
            fontSize: "0.815rem",
            color: "var(--muted)",
            display: "flex",
            flexDirection: "column",
            gap: "0.65rem",
          }}
        >
          <div>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--accent)",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--muted)" }}>
            <Link href="/welcome" style={{ color: "var(--muted)", textDecoration: "none" }}>← Overview</Link>
            <span>•</span>
            <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>Compare Pricing</Link>
          </div>
        </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="login-page-container">
      {/* Decorative Blur Glows */}
      <div className="login-glow" />
      <div className="login-glow-bottom" />

      <Suspense fallback={null}>
        <SignupFormContent />
      </Suspense>
    </div>
  );
}
