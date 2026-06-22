import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getWeeklyExecutionScore } from "@/lib/scoring";
import Link from "next/link";
import {
  TrackerIcon,
  TimerIcon,
  HealthIcon,
  CalendarIcon,
  CountdownIcon,
} from "@/components/Icons";

export default async function OverviewPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Parallel fetch master dashboard data
  const [countdowns, healthLog, focusSessions, events, weeklyScore] = await Promise.all([
    db.countdown.findMany({
      where: { userId: session.userId },
      orderBy: { targetDate: "asc" },
      take: 3,
    }),
    db.healthLog.findUnique({
      where: {
        userId_date: {
          userId: session.userId,
          date: today,
        },
      },
    }),
    db.focusSession.findMany({
      where: {
        userId: session.userId,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),
    db.event.findMany({
      where: {
        userId: session.userId,
        startTime: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    }),
    getWeeklyExecutionScore(session.userId),
  ]);

  const totalFocusMinutes = focusSessions.reduce((acc, s) => acc + s.duration, 0);

  const formatFocusDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const hrs = (mins / 60).toFixed(1);
    return `${hrs}h`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysRemaining = (targetDate: Date) => {
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        .bento-card {
          padding: 1.5rem;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          transition: all 0.2s ease;
        }
        .bento-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }
        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(6, 1fr);
            grid-auto-rows: minmax(180px, auto);
          }
          .col-span-4 { grid-column: span 4; }
          .col-span-3 { grid-column: span 3; }
          .col-span-2 { grid-column: span 2; }
          .col-span-6 { grid-column: span 6; }
          .row-span-2 { grid-row: span 2; }
        }
      `}</style>

      {/* Welcome Hero Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Welcome back, Lawrence
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Here is your overview for today
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Card 1: Weekly Habits Score (Radial progress ring) */}
        <div className="glass-panel bento-card col-span-2 row-span-2" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", textAlign: "center", minHeight: "340px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "flex-start" }}>
            <TrackerIcon size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Weekly Execution
            </span>
          </div>
          
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)" }}>
              <circle
                cx="75"
                cy="75"
                r="60"
                fill="transparent"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
              />
              <circle
                cx="75"
                cy="75"
                r="60"
                fill="transparent"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 - (weeklyScore / 100) * 2 * Math.PI * 60}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "2rem", fontWeight: "900", color: "var(--foreground)" }}>
                {weeklyScore}%
              </span>
              <span style={{ fontSize: "0.625rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Execution
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.815rem", fontWeight: "600" }}>12 Week Year Score</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {weeklyScore >= 85 ? "Excellent focus this week!" : weeklyScore >= 60 ? "On track, keep logging!" : "Focus on active habits!"}
            </span>
          </div>
        </div>

        {/* Card 2: Today's Focus sessions summary */}
        <div className="glass-panel bento-card col-span-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TimerIcon size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                Focus Time
              </span>
            </div>
            <Link href="/focus" style={{ fontSize: "0.675rem", color: "var(--accent)", fontWeight: "600", textDecoration: "none" }}>
              Start session &rarr;
            </Link>
          </div>

          <div>
            <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "var(--foreground)", lineHeight: "1" }}>
              {formatFocusDuration(totalFocusMinutes)}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem", display: "block" }}>
              {focusSessions.length} completed session{focusSessions.length === 1 ? "" : "s"} today
            </span>
          </div>

          <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, (totalFocusMinutes / 120) * 100)}%`, height: "100%", backgroundColor: "var(--accent)", borderRadius: "2px" }} />
          </div>
        </div>

        {/* Card 3: Today's Health Log Vitals */}
        <div className="glass-panel bento-card col-span-2" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <HealthIcon size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                Health Status
              </span>
            </div>
            <Link href="/health" style={{ fontSize: "0.675rem", color: "var(--accent)", fontWeight: "600", textDecoration: "none" }}>
              Log vitals &rarr;
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: "800" }}>💧 {healthLog?.waterIntake ?? 0}</span>
              <span style={{ fontSize: "0.625rem", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>glasses</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: "800" }}>😴 {healthLog?.sleepHours ?? 0}</span>
              <span style={{ fontSize: "0.625rem", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>hours</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.125rem", fontWeight: "800" }}>⚡ {healthLog?.energyLevel ?? 5}/10</span>
              <span style={{ fontSize: "0.625rem", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>energy</span>
            </div>
          </div>

          <span style={{ fontSize: "0.725rem", color: "var(--muted)" }}>
            {healthLog ? "Vitals updated today" : "No health updates today"}
          </span>
        </div>

        {/* Card 4: Timeline Snippet of Today's Events */}
        <div className="glass-panel bento-card col-span-4" style={{ display: "flex", flexDirection: "column", gap: "1rem", minHeight: "180px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CalendarIcon size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Today's Schedule
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", overflowY: "auto", maxHeight: "140px", paddingRight: "0.5rem" }}>
            {events.length === 0 ? (
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", height: "100%" }}>
                <p style={{ color: "var(--muted)", fontSize: "0.815rem", fontStyle: "italic" }}>
                  No calendar events scheduled for today.
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "0.625rem 0.875rem", borderRadius: "0.75rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: "70px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                      {formatTime(event.startTime)}
                    </span>
                    <span style={{ fontSize: "0.625rem", color: "var(--muted)" }}>
                      {event.isAllDay ? "All Day" : "Start"}
                    </span>
                  </div>
                  <div style={{ height: "20px", width: "1px", backgroundColor: "var(--border)", alignSelf: "center" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.815rem", fontWeight: "700", color: "var(--foreground)" }}>
                      {event.title}
                    </h4>
                    {event.description && (
                      <p style={{ fontSize: "0.725rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 5: Top 3 Closest Countdowns */}
        <div className="glass-panel bento-card col-span-6" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CountdownIcon size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                Upcoming Milestones
              </span>
            </div>
            <Link href="/countdowns" style={{ fontSize: "0.675rem", color: "var(--accent)", fontWeight: "600", textDecoration: "none" }}>
              Manage countdowns &rarr;
            </Link>
          </div>

          {countdowns.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.815rem", fontStyle: "italic", textAlign: "center", padding: "1rem" }}>
              No active milestones countdowns.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {countdowns.map((cd) => {
                const days = getDaysRemaining(cd.targetDate);
                return (
                  <div key={cd.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem 1rem", borderRadius: "0.75rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "950", color: days <= 3 ? "#ef4444" : "var(--accent)", fontFamily: "var(--font-mono)" }}>
                      {days < 0 ? `-${Math.abs(days)}` : days}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.815rem", fontWeight: "700", color: "var(--foreground)" }}>
                        {cd.title}
                      </span>
                      <span style={{ fontSize: "0.625rem", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginTop: "0.1rem" }}>
                        {days === 0 ? "D-Day" : days === 1 ? "day left" : days < 0 ? "days ago" : "days left"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

