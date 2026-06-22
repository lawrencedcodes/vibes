import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import EventForm from "@/components/EventForm";

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
    select: { googleRefreshToken: true },
  });
  const isGoogleConnected = !!user?.googleRefreshToken;

  // Fetch events
  const events = await db.event.findMany({
    where: { userId: session.userId },
    orderBy: { startTime: "asc" },
  });

  // Group events by date string
  const groupedEvents: { [key: string]: typeof events } = {};
  events.forEach((event) => {
    const dateStr = new Date(event.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!groupedEvents[dateStr]) {
      groupedEvents[dateStr] = [];
    }
    groupedEvents[dateStr].push(event);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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

      {/* Daily Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Daily Agenda</h2>

        {events.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem 2rem", borderRadius: "1.25rem", borderStyle: "dashed", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
              No events scheduled in your planner yet. Create one above to set up your timeline.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {Object.entries(groupedEvents).map(([dateStr, dayEvents]) => (
              <div key={dateStr} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Day Header */}
                <h3 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--accent)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", letterSpacing: "0.02em" }}>
                  {dateStr}
                </h3>
                
                {/* Timeline vertical list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderLeft: "2px solid var(--border)", paddingLeft: "1.25rem", marginLeft: "0.5rem" }}>
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: "1rem 1.25rem", 
                        borderRadius: "0.75rem", 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.375rem", 
                        position: "relative" 
                      }}
                    >
                      {/* Left timeline dot indicator */}
                      <span 
                        style={{ 
                          position: "absolute", 
                          left: "calc(-1.25rem - 6px)", 
                          top: "1.25rem", 
                          height: "10px", 
                          width: "10px", 
                          borderRadius: "50%", 
                          backgroundColor: "var(--accent)", 
                          border: "2px solid var(--background)" 
                        }} 
                      />
                      
                      {/* Time and Title Row */}
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.5rem" }}>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--foreground)" }}>
                          {event.title}
                        </h4>
                        
                        <span style={{ fontSize: "0.75rem", color: "var(--accent)", fontFamily: "var(--font-mono)", fontWeight: "600" }}>
                          {event.isAllDay ? (
                            "ALL DAY"
                          ) : (
                            `${formatTime(new Date(event.startTime))} - ${formatTime(new Date(event.endTime))}`
                          )}
                        </span>
                      </div>

                      {event.description && (
                        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: "1.4" }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
