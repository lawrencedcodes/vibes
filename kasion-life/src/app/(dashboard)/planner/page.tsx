import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import EventForm from "@/components/EventForm";

export default async function PlannerPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

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
