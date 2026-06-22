"use client";

import React, { useEffect, useRef, useMemo } from "react";

interface EventInfo {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
}

interface DayCol {
  dayName: string;
  dayNum: number;
  dateStr: string;
  dateKey: string;
}

interface WeeklyTimeBlockerProps {
  events: EventInfo[];
  weekDays: DayCol[];
}

export default function WeeklyTimeBlocker({ events, weekDays }: WeeklyTimeBlockerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to morning hours (7:00 AM) on mount
  useEffect(() => {
    if (scrollRef.current) {
      // 7 hours * 60px per hour = 420px
      scrollRef.current.scrollTop = 420;
    }
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const period = i >= 12 ? "PM" : "AM";
    const hour = i % 12 === 0 ? 12 : i % 12;
    return `${hour} ${period}`;
  });

  const eventColors = [
    { bg: "rgba(129, 140, 248, 0.12)", border: "var(--accent)", text: "var(--accent)" }, // Indigo theme
    { bg: "rgba(16, 185, 129, 0.12)", border: "#10b981", text: "#10b981" },               // Emerald
    { bg: "rgba(245, 158, 11, 0.12)", border: "#f59e0b", text: "#f59e0b" },               // Amber
    { bg: "rgba(239, 68, 68, 0.12)", border: "#ef4444", text: "#ef4444" },                 // Red
    { bg: "rgba(6, 182, 212, 0.12)", border: "#06b6d4", text: "#06b6d4" },                 // Cyan
    { bg: "rgba(236, 72, 153, 0.12)", border: "#ec4899", text: "#ec4899" },                 // Pink
  ];

  const getColors = (title: string) => {
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return eventColors[sum % eventColors.length];
  };

  // Algorithm to compute non-overlapping vertical lane configurations
  const layoutEvents = (dayEvents: EventInfo[]) => {
    if (dayEvents.length === 0) return [];

    const sorted = [...dayEvents].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    const clusters: EventInfo[][] = [];
    let currentCluster: EventInfo[] = [];

    for (const event of sorted) {
      const eventStart = new Date(event.startTime).getTime();
      
      if (currentCluster.length === 0) {
        currentCluster.push(event);
      } else {
        const maxEnd = Math.max(...currentCluster.map(e => new Date(e.endTime).getTime()));
        if (eventStart < maxEnd) {
          currentCluster.push(event);
        } else {
          clusters.push(currentCluster);
          currentCluster = [event];
        }
      }
    }
    if (currentCluster.length > 0) {
      clusters.push(currentCluster);
    }

    const processed: (EventInfo & { lane: number; totalLanes: number })[] = [];

    for (const cluster of clusters) {
      const lanes: EventInfo[][] = [];

      for (const event of cluster) {
        const eventStart = new Date(event.startTime).getTime();
        let assignedLane = -1;

        for (let l = 0; l < lanes.length; l++) {
          const lastEventInLane = lanes[l][lanes[l].length - 1];
          const lastEnd = new Date(lastEventInLane.endTime).getTime();
          if (eventStart >= lastEnd) {
            assignedLane = l;
            lanes[l].push(event);
            break;
          }
        }

        if (assignedLane === -1) {
          lanes.push([event]);
          assignedLane = lanes.length - 1;
        }

        processed.push({
          ...event,
          lane: assignedLane,
          totalLanes: lanes.length,
        });
      }
    }

    return processed;
  };

  // Memoize grouped layout events
  const layedOutCalendar = useMemo(() => {
    return weekDays.map((day) => {
      const rawEvents = events.filter((e) => {
        const dateStr = new Date(e.startTime).toISOString().split("T")[0];
        return dateStr === day.dateKey;
      });

      return {
        ...day,
        events: layoutEvents(rawEvents),
      };
    });
  }, [events, weekDays]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <style>{`
        .planner-container {
          overflow-y: auto;
          height: 650px;
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          position: relative;
          background-color: var(--card-bg);
          scrollbar-width: thin;
        }
        .planner-grid {
          display: grid;
          grid-template-columns: 55px repeat(7, 1fr);
          min-width: 900px;
          position: relative;
        }
        .planner-header-sticky {
          position: sticky;
          top: 0;
          z-index: 20;
          background-color: var(--card-bg);
          border-bottom: 1px solid var(--border);
        }
        .hour-label {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.5rem;
          color: var(--muted);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          height: 60px;
          box-sizing: border-box;
        }
        .day-column {
          border-left: 1px solid var(--border);
          position: relative;
          height: 1440px; /* 24 hours * 60px */
          box-sizing: border-box;
        }
        .hour-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--border);
          opacity: 0.25;
        }
        .timeblock-card {
          position: absolute;
          box-sizing: border-box;
          border-left: 3px solid;
          border-radius: 0.375rem;
          padding: 0.375rem 0.5rem;
          font-size: 0.725rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          z-index: 10;
          transition: transform 0.2s ease, z-index 0.2s ease;
          cursor: pointer;
        }
        .timeblock-card:hover {
          z-index: 15;
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* Week Navigation Header Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: "600" }}>
          Timeline view
        </span>
        <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
          WEEKLY PLANNER
        </span>
      </div>

      {/* Main planner board wrapper */}
      <div ref={scrollRef} className="planner-container">
        <div className="planner-grid">
          
          {/* Header Row */}
          <div className="planner-header-sticky" style={{ gridColumn: "1 / span 8", display: "grid", gridTemplateColumns: "55px repeat(7, 1fr)", minWidth: "900px" }}>
            <div style={{ height: "45px", borderRight: "1px solid var(--border)" }} />
            {weekDays.map((day) => (
              <div 
                key={day.dateKey} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  height: "45px", 
                  borderLeft: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "0.625rem", color: "var(--muted)", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
                  {day.dayName}
                </span>
                <span style={{ fontSize: "0.875rem", fontWeight: "800", color: "var(--foreground)", marginTop: "0.1rem" }}>
                  {day.dayNum}
                </span>
              </div>
            ))}
          </div>

          {/* Time axis Y labels column */}
          <div style={{ display: "flex", flexDirection: "column", gridColumn: "1", borderRight: "1px solid var(--border)" }}>
            {hours.map((hour, index) => (
              <div key={index} className="hour-label">
                {hour}
              </div>
            ))}
          </div>

          {/* Columns Grid columns represent days */}
          {layedOutCalendar.map((dayCol) => (
            <div key={dayCol.dateKey} className="day-column">
              {/* Horizontal Hour grid line overlays */}
              {Array.from({ length: 24 }).map((_, h) => (
                <div 
                  key={h} 
                  className="hour-line" 
                  style={{ top: `${h * 60}px` }} 
                />
              ))}

              {/* Event cards layout */}
              {dayCol.events.map((event) => {
                const colors = getColors(event.title);
                
                const start = new Date(event.startTime);
                const end = new Date(event.endTime);
                
                const startHour = start.getHours() + start.getMinutes() / 60;
                const endHour = end.getHours() + end.getMinutes() / 60;
                const duration = Math.max(0.5, endHour - startHour);

                // Absolute pixels mapping: Hour = 60px
                const top = startHour * 60;
                const height = duration * 60;

                // Absolute positions logic for lane sizing (overlapping lanes)
                const laneWidth = 100 / event.totalLanes;
                const laneLeft = event.lane * laneWidth;

                // Formatting times for UI
                const timeString = event.isAllDay 
                  ? "All Day" 
                  : `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}`;

                return (
                  <div
                    key={event.id}
                    className="timeblock-card"
                    title={`${event.title}\n${timeString}${event.description ? `\n\n${event.description}` : ""}`}
                    style={{
                      top: `${top + 2}px`,
                      height: `${height - 4}px`,
                      left: `${laneLeft}%`,
                      width: `${laneWidth - 2}%`,
                      backgroundColor: colors.bg,
                      borderColor: colors.border,
                      color: colors.text,
                    }}
                  >
                    <div style={{ fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: "0.625rem", opacity: 0.8, marginTop: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {timeString}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
