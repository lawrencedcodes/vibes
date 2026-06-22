import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import EventForm from "@/components/EventForm";
import WeeklyTimeBlocker from "@/components/WeeklyTimeBlocker";
import { syncGoogleCalendar } from "@/lib/googleCalendar";

export default async function PlannerPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await props.searchParams;
  const syncStatus = resolvedParams.sync;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Check if Google OAuth integration exists for the current user
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { googleToken: { select: { id: true } } },
  });
  const isGoogleConnected = !!user?.googleToken;

  // Safely execute Google Calendar synchronization in the background on page load
  if (isGoogleConnected) {
    try {
      await syncGoogleCalendar(session.userId);
    } catch (error) {
      console.error("[Planner Background Sync] Failed to sync Google Calendar events:", error);
    }
  }

  // Calculate Monday to Sunday of the current week (local time bounds)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay();
  // Monday is 1, Sunday is 0. If day is Sunday (0), diff is today - 6. Else it's today - day + 1.
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Fetch events (including any newly synced ones) for the current week
  const events = await db.event.findMany({
    where: {
      userId: session.userId,
      startTime: {
        gte: monday,
        lte: sunday,
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Map events to a clean, serializable format for the client
  const serializedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
    isAllDay: event.isAllDay,
  }));

  // Build the 7 day objects for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNum: d.getDate(),
      dateStr: d.toDateString(),
      dateKey: d.toISOString().split("T")[0],
    };
  });

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Planner & Agenda
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Schedule events, plan sessions, and manage your daily calendar slots.
        </p>
      </div>

      {/* Sync Banners */}
      {syncStatus === "success" && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "rgba(52, 168, 83, 0.15)", border: "1px solid rgba(52, 168, 83, 0.3)", color: "#34a853", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Google Calendar connected successfully! Events will now sync.</span>
        </div>
      )}
      {syncStatus === "error" && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "rgba(234, 67, 53, 0.15)", border: "1px solid rgba(234, 67, 53, 0.3)", color: "#ea4335", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>Failed to link Google Calendar. Please try again.</span>
        </div>
      )}

      {/* Google Integration Status Card */}
      <div className="glass-panel" style={{ padding: "1rem 1.5rem", borderRadius: "1.25rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: "rgba(66, 133, 244, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "600" }}>Google Calendar Sync</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {isGoogleConnected ? "Integrations active. Events are automatically kept up to date." : "Connect your Google Account to synchronize your local agenda."}
            </p>
          </div>
        </div>
        <div>
          {isGoogleConnected ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "rgba(52, 168, 83, 0.08)", padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "1px solid rgba(52, 168, 83, 0.2)" }}>
              <span style={{ height: "6px", width: "6px", borderRadius: "50%", backgroundColor: "#34a853" }}></span>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#34a853", letterSpacing: "0.02em" }}>ACTIVE</span>
            </div>
          ) : (
            <a 
              href="/api/auth/google" 
              className="login-btn" 
              style={{ 
                textDecoration: "none", 
                fontSize: "0.75rem", 
                fontWeight: "600", 
                padding: "0.5rem 0.875rem", 
                width: "auto", 
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                borderRadius: "0.5rem",
                boxShadow: "none"
              }}
            >
              Link Account
            </a>
          )}
        </div>
      </div>

      {/* Quick Add Form Container */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "1.25rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "1rem" }}>Add New Event</h2>
        <EventForm />
      </div>

      {/* Time-Blocked Weekly Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Weekly Schedule</h2>
        
        <WeeklyTimeBlocker 
          events={serializedEvents} 
          weekDays={weekDays} 
        />
      </div>
    </div>
  );
}
