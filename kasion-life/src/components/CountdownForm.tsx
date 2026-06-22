"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { createCountdown } from "@/app/actions/countdowns";

export default function CountdownForm() {
  const [state, formAction, isPending] = useActionState(createCountdown, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear inputs when successfully created
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="glass-panel animate-fade-in"
      style={{
        padding: "1.5rem",
        borderRadius: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        backgroundColor: "var(--card-bg)",
        height: "fit-content",
      }}
    >
      <h3 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Create Countdown</h3>
      
      {state?.error && (
        <div
          className="error-banner animate-fade-in"
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="title" style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
          Event Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Product Launch, Vacation, Exam..."
          required
          disabled={isPending}
          className="login-input"
          style={{ width: "100%", padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="targetDate" style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
          Target Date
        </label>
        <input
          id="targetDate"
          name="targetDate"
          type="date"
          required
          disabled={isPending}
          className="login-input"
          style={{ width: "100%", padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="login-btn"
        style={{ width: "100%", padding: "0.75rem", borderRadius: "0.75rem", fontWeight: "600" }}
      >
        {isPending ? "Creating..." : "Create Countdown"}
      </button>
    </form>
  );
}
