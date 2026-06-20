"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { createEvent } from "@/app/actions/events";

export default function EventForm() {
  const [state, formAction, isPending] = useActionState(createEvent, undefined);
  const [isAllDay, setIsAllDay] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset inputs on success
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
      setIsAllDay(false);
    }
  }, [state]);

  // Default dates
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "580px" }}>
      {state?.error && (
        <div className="error-banner animate-fade-in" style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
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

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          name="title"
          placeholder="Event Title (e.g. Sync Session, Gym)..."
          required
          disabled={isPending}
          className="login-input"
          style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
        />
        
        <input
          name="description"
          placeholder="Event description (optional)..."
          disabled={isPending}
          className="login-input"
          style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
        />

        {/* Date/Time pickers */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: "140px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>START DATE</label>
            <input
              name="startDate"
              type="date"
              defaultValue={todayStr}
              required
              disabled={isPending}
              className="login-input"
              style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}
            />
          </div>
          
          {!isAllDay && (
            <div style={{ width: "110px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>START TIME</label>
              <input
                name="startTime"
                type="time"
                defaultValue="09:00"
                required={!isAllDay}
                disabled={isPending}
                className="login-input"
                style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: "140px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>END DATE</label>
            <input
              name="endDate"
              type="date"
              defaultValue={todayStr}
              required
              disabled={isPending}
              className="login-input"
              style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}
            />
          </div>

          {!isAllDay && (
            <div style={{ width: "110px", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)" }}>END TIME</label>
              <input
                name="endTime"
                type="time"
                defaultValue="10:00"
                required={!isAllDay}
                disabled={isPending}
                className="login-input"
                style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}
              />
            </div>
          )}
        </div>

        {/* All-Day checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
          <input
            id="isAllDay"
            name="isAllDay"
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            disabled={isPending}
            style={{ accentColor: "var(--accent)", cursor: "pointer", height: "14px", width: "14px" }}
          />
          <label htmlFor="isAllDay" style={{ fontSize: "0.75rem", color: "var(--muted)", cursor: "pointer" }}>
            All-day event
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="login-btn"
          style={{ width: "auto", alignSelf: "flex-start", padding: "0.625rem 1.25rem", borderRadius: "0.75rem", fontSize: "0.825rem", marginTop: "0.5rem" }}
        >
          {isPending ? "Creating..." : "Create Event"}
        </button>
      </div>
    </form>
  );
}
