import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteCountdown } from "@/app/actions/countdowns";
import CountdownForm from "@/components/CountdownForm";

export default async function CountdownsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countdowns = await db.countdown.findMany({
    where: {
      userId: session.userId,
    },
    orderBy: {
      targetDate: "asc",
    },
  });

  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const getDaysRemaining = (targetDate: Date) => {
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysColor = (days: number) => {
    if (days < 0) return "var(--muted)";
    if (days === 0) return "#ef4444"; // D-Day (Red)
    if (days <= 3) return "#f97316"; // Orange
    if (days <= 7) return "#eab308"; // Yellow
    return "var(--accent)"; // Accent
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <style>{`
        .delete-btn {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
        }
        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .countdown-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 1024px) {
          .countdown-layout {
            grid-template-columns: 3fr 1fr;
          }
        }
      `}</style>

      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Countdowns
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Track important milestones, deadlines, and events.
        </p>
      </div>

      <div className="countdown-layout">
        {/* Countdowns Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Active Milestones</h2>
          
          {countdowns.length === 0 ? (
            <div className="glass-panel" style={{ padding: "3rem", borderRadius: "1.25rem", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                No active countdowns. Add one in the sidebar to start tracking!
              </p>
            </div>
          ) : (
            <div className="countdown-grid">
              {countdowns.map((countdown) => {
                const days = getDaysRemaining(countdown.targetDate);
                const color = getDaysColor(days);
                
                return (
                  <div
                    key={countdown.id}
                    className="glass-panel"
                    style={{
                      padding: "1.5rem",
                      borderRadius: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "1.5rem",
                      backgroundColor: "var(--card-bg)",
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--foreground)" }}>
                          {countdown.title}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                          {formatDate(countdown.targetDate)}
                        </span>
                      </div>
                      
                      {/* Delete form */}
                      <form action={deleteCountdown.bind(null, countdown.id)} style={{ margin: 0 }}>
                        <button type="submit" className="delete-btn" aria-label="Delete countdown">
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
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </form>
                    </div>

                    {/* Numeric Countdown Visual */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ fontSize: "3rem", fontWeight: "900", color: color, lineHeight: "1", letterSpacing: "-0.05em" }}>
                        {days < 0 ? Math.abs(days) : days}
                      </span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>
                        {days === 0 && "Today is the day!"}
                        {days === 1 && "Day remaining"}
                        {days > 1 && "Days remaining"}
                        {days === -1 && "Day ago"}
                        {days < -1 && "Days ago"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Form Sidebar */}
        <div>
          <CountdownForm />
        </div>
      </div>
    </div>
  );
}
