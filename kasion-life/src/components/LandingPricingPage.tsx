"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { loginDemo } from "@/app/actions/auth";
import {
  TrackerIcon,
  TimerIcon,
  CalendarIcon,
  JournalIcon,
  GoalsIcon,
  HealthIcon,
  SunIcon,
  MoonIcon,
} from "./Icons";

interface LandingPricingPageProps {
  isAuthenticated?: boolean;
  userName?: string | null;
  focusPricing?: boolean;
}

const PREVIEW_HABITS = [
  { id: "h1", title: "Deep Work Sprint (90m)", routine: "MORNING", streak: 14, defaultDone: true },
  { id: "h2", title: "Hydration Target (8/8 glasses)", routine: "ANYTIME", streak: 21, defaultDone: true },
  { id: "h3", title: "Ship 1 Production Commit", routine: "AFTERNOON", streak: 9, defaultDone: true },
  { id: "h4", title: "Evening Reflection Log", routine: "EVENING", streak: 12, defaultDone: false },
];

// Deterministic heatmap cells for the hero preview
const PREVIEW_HEATMAP_LEVELS = [
  1, 2, 3, 2, 3, 3, 1, 2, 3, 3, 2, 3, 3, 3,
  2, 1, 3, 3, 2, 3, 3, 0, 2, 3, 3, 3, 2, 3,
  3, 3, 2, 3, 3, 1, 2, 3, 3, 3, 2, 3, 3, 3,
  2, 3, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3,
];

export default function LandingPricingPage({
  isAuthenticated = false,
  userName = null,
  focusPricing = false,
}: LandingPricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [completedPreviewHabits, setCompletedPreviewHabits] = useState<string[]>(
    PREVIEW_HABITS.filter((h) => h.defaultDone).map((h) => h.id)
  );

  useEffect(() => {
    const storedTheme = localStorage.getItem("kasion-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, []);

  useEffect(() => {
    if (focusPricing) {
      const pricingEl = document.getElementById("pricing");
      if (pricingEl) {
        pricingEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [focusPricing]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("kasion-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const togglePreviewHabit = (id: string) => {
    setCompletedPreviewHabits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const liveExecutionScore = Math.round(
    68 + (completedPreviewHabits.length / PREVIEW_HABITS.length) * 28
  );

  return (
    <div className="landing-scroll-root">
      <style>{`
        .landing-scroll-root {
          block-size: 100dvh;
          inline-size: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: var(--background);
          color: var(--foreground);
          position: relative;
          scroll-behavior: smooth;
        }
        .landing-container {
          inline-size: 100%;
          max-inline-size: 1160px;
          margin-inline: auto;
          padding-inline: 1.5rem;
        }
        .landing-nav {
          position: sticky;
          inset-block-start: 0;
          z-index: 50;
          background-color: rgba(9, 9, 11, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-block-end: 1px solid var(--border);
        }
        [data-theme="light"] .landing-nav {
          background-color: rgba(248, 250, 252, 0.82);
        }
        .landing-nav-inner {
          display: flex;
          align-items: safe center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          min-block-size: 72px;
          padding-block: 0.75rem;
        }
        .landing-nav-links {
          display: flex;
          align-items: safe center;
          flex-wrap: wrap;
          flex-wrap: balance;
          gap: 1.5rem;
        }
        .landing-nav-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .landing-nav-link:hover {
          color: var(--foreground);
        }
        .pill-row {
          display: flex;
          flex-wrap: wrap;
          flex-wrap: balance;
          justify-content: center;
          gap: 0.625rem;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
        }
        /* CSS Grid + Subgrid for aligned pricing cards */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 1.5rem;
          inline-size: 100%;
        }
        .pricing-card {
          grid-row: span 4;
          display: grid;
          /* Same-cascade fallback for older browsers */
          grid-template-rows: auto auto 1fr auto;
          grid-template-rows: subgrid;
          gap: 1.5rem;
          padding: 2rem;
          border-radius: 1.5rem;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .pricing-card:hover {
          transform: translateY(-4px);
        }
        .pricing-card.featured {
          border: 1.5px solid var(--accent);
          box-shadow: 0 20px 50px var(--accent-glow);
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.09) 0%, var(--card-bg) 100%);
        }
        .preview-bento {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 900px) {
          .preview-bento {
            grid-template-columns: 1.1fr 1.4fr 1.1fr;
          }
        }
        details.faq-item {
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.2s ease;
        }
        details.faq-item[open] {
          border-color: var(--accent);
        }
        details.faq-item summary {
          cursor: pointer;
          font-weight: 700;
          font-size: 0.95rem;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        details.faq-item summary::-webkit-details-marker {
          display: none;
        }
      `}</style>

      {/* Ambient Glows */}
      <div className="login-glow" style={{ width: "550px", height: "550px", top: "-160px", right: "-120px" }} />
      <div className="login-glow-bottom" style={{ width: "600px", height: "600px", bottom: "15%", left: "-200px" }} />

      {/* Sticky Top Navbar */}
      <header className="landing-nav">
        <div className="landing-container landing-nav-inner">
          <Link
            href="/welcome"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              color: "var(--foreground)",
            }}
          >
            <div className="logo-container">
              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#ffffff" }}>K</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: "800", letterSpacing: "0.04em" }}>
                KASION LIFE
              </span>
              <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--muted)", letterSpacing: "0.14em" }}>
                PERSONAL OS v1.0
              </span>
            </div>
          </Link>

          <nav className="landing-nav-links" aria-label="Landing Navigation">
            <a href="#preview" className="landing-nav-link">Live Preview</a>
            <a href="#features" className="landing-nav-link">Modules</a>
            <a href="#pricing" className="landing-nav-link">Pricing</a>
            <a href="#faq" className="landing-nav-link">FAQ</a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                inlineSize: "2.25rem",
                blockSize: "2.25rem",
                borderRadius: "0.65rem",
                border: "1px solid var(--border)",
                backgroundColor: "var(--muted-bg)",
                color: "var(--foreground)",
                cursor: "pointer",
              }}
            >
              {theme === "dark" ? <SunIcon size={15} /> : <MoonIcon size={15} />}
            </button>

            {isAuthenticated ? (
              <Link
                href="/"
                className="login-btn"
                style={{
                  inlineSize: "auto",
                  padding: "0.55rem 1.15rem",
                  textDecoration: "none",
                  fontSize: "0.825rem",
                }}
              >
                Open Dashboard {userName ? `(${userName.split(" ")[0]})` : ""} →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: "0.825rem",
                    fontWeight: "600",
                    color: "var(--foreground)",
                    textDecoration: "none",
                    padding: "0.55rem 0.9rem",
                    borderRadius: "0.65rem",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--muted-bg)",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="login-btn"
                  style={{
                    inlineSize: "auto",
                    padding: "0.55rem 1.15rem",
                    textDecoration: "none",
                    fontSize: "0.825rem",
                  }}
                >
                  Start Free →
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-container" style={{ display: "flex", flexDirection: "column", gap: "6rem", paddingBlock: "4rem 5rem" }}>
        {/* HERO SECTION */}
        <section
          className="animate-fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.75rem",
            paddingBlockStart: "1rem",
          }}
        >
          <div className="pill-row">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "var(--accent)",
                fontSize: "0.75rem",
                fontWeight: "700",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span>●</span> 12-WEEK YEAR EXECUTION OS
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                backgroundColor: "var(--muted-bg)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              2-Way Google Calendar Sync • GitHub Heatmaps • Pomodoro Flow
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              lineHeight: "1.06",
              maxInlineSize: "880px",
            }}
          >
            Ditch the fragmented productivity stack.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Execute on one screen.
            </span>
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "clamp(1rem, 1.8vw, 1.175rem)",
              lineHeight: "1.6",
              maxInlineSize: "680px",
            }}
          >
            Stop jumping between Notion for journals, Google Calendar for time-blocking, phone apps for habits, and browser tabs for Pomodoro timers. KasionLife unifies your daily execution into one high-density Personal OS.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "safe center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.875rem",
              marginBlockStart: "0.5rem",
            }}
          >
            <Link
              href={isAuthenticated ? "/" : "/signup"}
              className="login-btn"
              style={{
                inlineSize: "auto",
                padding: "0.875rem 1.75rem",
                fontSize: "0.95rem",
                fontWeight: "700",
                textDecoration: "none",
                borderRadius: "0.875rem",
              }}
            >
              {isAuthenticated ? "Return to Your Dashboard →" : "Create Your Personal OS Free →"}
            </Link>

            {!isAuthenticated && (
              <form action={loginDemo}>
                <button
                  type="submit"
                  style={{
                    padding: "0.875rem 1.5rem",
                    borderRadius: "0.875rem",
                    backgroundColor: "var(--muted-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ color: "#10b981" }}>●</span>
                  <span>Try Live Demo Workspace</span>
                </button>
              </form>
            )}

            <a
              href="#pricing"
              style={{
                padding: "0.875rem 1.25rem",
                borderRadius: "0.875rem",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: "0.9rem",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              View Pricing
            </a>
          </div>
        </section>

        {/* INTERACTIVE BENTO PREVIEW SHOWCASE */}
        <section id="preview" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="status-dot pulse" />
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Interactive Bento Preview — Click habits below to test live 12-Week scoring
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              kasionlife.com/dashboard
            </span>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: "1.5rem",
              borderRadius: "1.5rem",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="preview-bento">
              {/* Preview Column 1: 12-Week Radial Score */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "1.25rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  textAlign: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", inlineSize: "100%" }}>
                  <TrackerIcon size={15} style={{ color: "var(--accent)" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                    12-Week Execution
                  </span>
                </div>

                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="136" height="136" viewBox="0 0 150 150" style={{ transform: "rotate(-90deg)", display: "block" }}>
                    <circle cx="75" cy="75" r="60" fill="transparent" stroke="rgba(129, 140, 248, 0.12)" strokeWidth="11" />
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="transparent"
                      stroke="var(--accent)"
                      strokeWidth="11"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 - (liveExecutionScore / 100) * 2 * Math.PI * 60}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.35s ease" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "1.85rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                      {liveExecutionScore}%
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Weekly Score
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "0.775rem", color: "var(--muted)" }}>
                  {liveExecutionScore >= 85
                    ? "🔥 Above the 85% 12-Week Year threshold!"
                    : "Check off one more habit to hit 85%+ execution"}
                </div>
              </div>

              {/* Preview Column 2: Interactive Habit Stack + Mini Heatmap */}
              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "1.25rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                    Interactive Daily Habits (Try Clicking)
                  </span>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
                    {completedPreviewHabits.length}/{PREVIEW_HABITS.length} Done
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {PREVIEW_HABITS.map((habit) => {
                    const done = completedPreviewHabits.includes(habit.id);
                    return (
                      <button
                        key={habit.id}
                        type="button"
                        onClick={() => togglePreviewHabit(habit.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.65rem 0.85rem",
                          borderRadius: "0.75rem",
                          backgroundColor: done ? "rgba(99, 102, 241, 0.12)" : "var(--background)",
                          border: done ? "1px solid var(--accent)" : "1px solid var(--border)",
                          color: "var(--foreground)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <span
                            style={{
                              inlineSize: "18px",
                              blockSize: "18px",
                              borderRadius: "5px",
                              backgroundColor: done ? "var(--accent)" : "transparent",
                              border: done ? "none" : "1.5px solid var(--muted)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontSize: "0.7rem",
                              fontWeight: "800",
                            }}
                          >
                            {done ? "✓" : ""}
                          </span>
                          <span
                            style={{
                              fontSize: "0.825rem",
                              fontWeight: "600",
                              textDecoration: done ? "line-through" : "none",
                              opacity: done ? 0.85 : 1,
                            }}
                          >
                            {habit.title}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                          🔥 {habit.streak + (done ? 1 : 0)}d
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Mini Contribution Heatmap Strip */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", paddingTop: "0.25rem" }}>
                  <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                    365-DAY CONTRIBUTION MATRIX
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(14, 1fr)",
                      gap: "4px",
                    }}
                  >
                    {PREVIEW_HEATMAP_LEVELS.map((lvl, idx) => {
                      const colors = [
                        "rgba(255,255,255,0.05)",
                        "rgba(99, 102, 241, 0.3)",
                        "rgba(99, 102, 241, 0.6)",
                        "#818cf8",
                      ];
                      return (
                        <div
                          key={idx}
                          style={{
                            aspectRatio: "1 / 1",
                            borderRadius: "3px",
                            backgroundColor: colors[lvl],
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Preview Column 3: Focus Timer + Time-Blocked Agenda + Vitals */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    padding: "1.25rem",
                    borderRadius: "1.25rem",
                    backgroundColor: "var(--muted-bg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <TimerIcon size={14} style={{ color: "var(--accent)" }} />
                      <span style={{ fontSize: "0.68rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                        Deep Work Timer
                      </span>
                    </div>
                    <span style={{ fontSize: "0.68rem", color: "#10b981", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
                      2.5h Logged Today
                    </span>
                  </div>
                  <div style={{ fontSize: "1.65rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                    25:00 <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>• Linked to Launch Sprint</span>
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: "1.25rem",
                    borderRadius: "1.25rem",
                    backgroundColor: "var(--muted-bg)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CalendarIcon size={14} style={{ color: "var(--accent)" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                      Google Calendar Time-Blocker
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ padding: "0.55rem 0.75rem", borderRadius: "0.65rem", backgroundColor: "rgba(99, 102, 241, 0.12)", borderLeft: "3px solid var(--accent)" }}>
                      <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>09:00 AM – 10:30 AM</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "700" }}>Architecture &amp; Core Feature Sprint</div>
                    </div>
                    <div style={{ padding: "0.55rem 0.75rem", borderRadius: "0.65rem", backgroundColor: "var(--background)", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700" }}>02:00 PM – 03:00 PM</div>
                      <div style={{ fontSize: "0.8rem", fontWeight: "600" }}>12-Week Year Weekly Review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 CORE MODULES SECTION */}
        <section id="features" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div style={{ textAlign: "center", maxInlineSize: "680px", marginInline: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Unified Execution Architecture
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Six specialized apps replaced by one cohesive system.
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Every module shares data natively—your habits feed your 12-Week Goal score, your Todo subtasks power your Pomodoro timer, and your planner syncs with Google Calendar.
            </p>
          </div>

          <div className="feature-grid">
            {[
              {
                icon: GoalsIcon,
                tag: "12-WEEK YEAR ENGINE",
                title: "Metric-Driven Goal Execution",
                desc: "Map daily habits directly to 12-week goals. Track your real-time weekly execution percentage against the proven 85% success benchmark.",
              },
              {
                icon: TrackerIcon,
                tag: "365-DAY HEATMAPS",
                title: "Boolean & Numeric Habit Matrix",
                desc: "Log binary completions or numeric daily targets (glasses of water, pages read) with instant optimistic updates and full-year GitHub-style contribution grids.",
              },
              {
                icon: CalendarIcon,
                tag: "COLLISION-AWARE PLANNER",
                title: "Weekly Time-Blocker + Google Sync",
                desc: "Plan your week on a 24-hour vertical grid with automatic side-by-side collision layout and 2-way OAuth 2.0 Google Calendar synchronization.",
              },
              {
                icon: TimerIcon,
                tag: "DEEP WORK FLOW",
                title: "Task-Linked Pomodoro Timer",
                desc: "Attach 25-minute focus sprints directly to project Todo items. Completed intervals automatically log to your daily focus timeline.",
              },
              {
                icon: JournalIcon,
                tag: "DISTRACTION-FREE CANVAS",
                title: "Auto-Saving Daily Reflections",
                desc: "Write daily reflection logs and milestone notes with 1.5-second debounced server auto-save, live word counts, and chronological archives.",
              },
              {
                icon: HealthIcon,
                tag: "BIOMETRICS & MILESTONES",
                title: "Daily Vitals & D-Day Countdowns",
                desc: "Correlate sleep hours, hydration, and energy levels with your output while keeping your top 3 upcoming milestone countdowns front and center.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-panel dashboard-card"
                  style={{ padding: "1.75rem", justifyContent: "flex-start" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--accent)",
                        fontWeight: "700",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {feature.tag}
                    </span>
                    <div
                      style={{
                        inlineSize: "2.25rem",
                        blockSize: "2.25rem",
                        borderRadius: "0.65rem",
                        backgroundColor: "rgba(99, 102, 241, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "800", letterSpacing: "-0.01em" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.55" }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div style={{ textAlign: "center", maxInlineSize: "680px", marginInline: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Simple, Transparent Pricing
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Invest in your 12-Week Year execution.
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Start free for as long as you like, or upgrade to Kasion Pro for unlimited habits, 365-day heatmaps, and 2-way Google Calendar sync.
            </p>

            {/* Billing Toggle */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.35rem",
                borderRadius: "0.875rem",
                backgroundColor: "var(--muted-bg)",
                border: "1px solid var(--border)",
                marginTop: "0.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.65rem",
                  border: "none",
                  backgroundColor: billingCycle === "annual" ? "var(--accent)" : "transparent",
                  color: billingCycle === "annual" ? "#ffffff" : "var(--muted)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Annual Billing (Save 20%)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.65rem",
                  border: "none",
                  backgroundColor: billingCycle === "monthly" ? "var(--accent)" : "transparent",
                  color: billingCycle === "monthly" ? "#ffffff" : "var(--muted)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Monthly Billing
              </button>
            </div>
          </div>

          {/* 3-Column Subgrid Pricing Cards */}
          <div className="pricing-grid">
            {/* Tier 1: Starter Free */}
            <div className="glass-panel pricing-card">
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    Starter OS
                  </span>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", padding: "0.2rem 0.55rem", borderRadius: "999px", backgroundColor: "var(--muted-bg)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    Free Forever
                  </span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--muted)" }}>
                  Essential daily habits, focus timer, and reflection journal for solo starters.
                </p>
              </div>

              <div style={{ borderBlock: "1px solid var(--border)", paddingBlock: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>$0</span>
                  <span style={{ fontSize: "0.825rem", color: "var(--muted)" }}>/ forever</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  No credit card required
                </div>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Up to 3 active daily habits</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>1 active 12-Week Year Goal</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Pomodoro Focus Timer &amp; Todo Lists</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Daily Auto-Saving Reflection Journal</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Sleep, Hydration &amp; Energy Vitals</span>
                </li>
              </ul>

              <Link
                href={isAuthenticated ? "/" : "/signup?plan=free"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "0.875rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                {isAuthenticated ? "Current Workspace" : "Get Started Free →"}
              </Link>
            </div>

            {/* Tier 2: Kasion Pro (Featured) */}
            <div className="glass-panel pricing-card featured">
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "800", textTransform: "uppercase" }}>
                    Kasion Pro
                  </span>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", padding: "0.2rem 0.65rem", borderRadius: "999px", backgroundColor: "var(--accent)", color: "#ffffff", fontWeight: "700" }}>
                    Most Popular
                  </span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--muted)" }}>
                  Full 12-Week Year execution stack with 365-day heatmaps and Google Calendar sync.
                </p>
              </div>

              <div style={{ borderBlock: "1px solid var(--border)", paddingBlock: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                    {billingCycle === "annual" ? "$8" : "$10"}
                  </span>
                  <span style={{ fontSize: "0.825rem", color: "var(--muted)" }}>
                    / month
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: "0.25rem", fontFamily: "var(--font-mono)" }}>
                  {billingCycle === "annual" ? "Billed $96 annually • 14-day free trial" : "Billed monthly • Cancel anytime"}
                </div>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: "800" }}>✓</span>
                  <span><strong>Unlimited</strong> habits, projects &amp; 12-Week Goals</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: "800" }}>✓</span>
                  <span><strong>365-Day</strong> GitHub-style contribution heatmaps</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: "800" }}>✓</span>
                  <span><strong>2-Way Google Calendar</strong> OAuth 2.0 Sync</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: "800" }}>✓</span>
                  <span>12-Week Year Weekly Execution Analytics</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "var(--accent)", fontWeight: "800" }}>✓</span>
                  <span>Full JSON/CSV Data Portability &amp; Backups</span>
                </li>
              </ul>

              <Link
                href={isAuthenticated ? "/settings" : `/signup?plan=pro&billing=${billingCycle}`}
                className="login-btn"
                style={{
                  padding: "0.85rem 1.25rem",
                  borderRadius: "0.875rem",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                {isAuthenticated ? "Upgrade in Settings →" : "Start 14-Day Pro Trial →"}
              </Link>
            </div>

            {/* Tier 3: Founder Lifetime */}
            <div className="glass-panel pricing-card">
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "700", textTransform: "uppercase" }}>
                    Founder Edition
                  </span>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", padding: "0.2rem 0.55rem", borderRadius: "999px", backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981", fontWeight: "700" }}>
                    One-Time Pay
                  </span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--muted)" }}>
                  Pay once, own Kasion Pro forever with zero recurring subscription fees.
                </p>
              </div>

              <div style={{ borderBlock: "1px solid var(--border)", paddingBlock: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>$149</span>
                  <span style={{ fontSize: "0.825rem", color: "var(--muted)" }}>/ lifetime</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  One-time payment • Lifetime updates included
                </div>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Everything in <strong>Kasion Pro</strong> forever</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Unlimited local + cloud-synced workspaces</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Early access to AI 12-Week Review Coach</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Self-hostable SQLite snapshot exports</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ color: "#10b981", fontWeight: "800" }}>✓</span>
                  <span>Founder badge &amp; priority feature voting</span>
                </li>
              </ul>

              <Link
                href={isAuthenticated ? "/settings" : "/signup?plan=lifetime"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.85rem 1.25rem",
                  borderRadius: "0.875rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  textDecoration: "none",
                }}
              >
                {isAuthenticated ? "Claim Founder Pass →" : "Claim Lifetime Access →"}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" style={{ display: "flex", flexDirection: "column", gap: "2rem", maxInlineSize: "780px", marginInline: "auto", inlineSize: "100%" }}>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Frequently Asked Questions
            </span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
              Everything you need to know
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {[
              {
                q: "What is the 12-Week Year Execution Score?",
                a: "Instead of setting annualized goals that stall by February, KasionLife structures your objectives into focused 12-week sprints. Your daily habits feed a live weekly execution percentage—hitting 85% or higher keeps you on track to achieve your 12-week targets.",
              },
              {
                q: "Can I try KasionLife without creating an account first?",
                a: "Yes! Click 'Try Live Demo Workspace' at the top of this page to launch an instant pre-seeded workspace, or sign up for the Free Forever Starter plan in 30 seconds.",
              },
              {
                q: "How does the Google Calendar integration work?",
                a: "KasionLife uses official Google OAuth 2.0 with encrypted token storage. Once connected in the Weekly Planner, your upcoming 30 days of events sync directly into KasionLife's collision-aware time-blocking grid.",
              },
              {
                q: "Do I own my journal entries and habit data?",
                a: "100%. KasionLife is built on a fast, local-first SQLite + Prisma architecture with full JSON data export, so your reflections, habits, and focus logs are always yours.",
              },
            ].map((item) => (
              <details key={item.q} className="glass-panel faq-item">
                <summary>
                  <span>{item.q}</span>
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>+</span>
                </summary>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: "1.6", marginTop: "0.85rem" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section
          className="glass-panel"
          style={{
            padding: "3rem 2rem",
            borderRadius: "1.75rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(139, 92, 246, 0.06) 100%)",
            border: "1px solid rgba(129, 140, 248, 0.3)",
          }}
        >
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: "900", letterSpacing: "-0.03em" }}>
            Ready to make your next 12 weeks count?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxInlineSize: "540px", lineHeight: "1.55" }}>
            Set up your 12-Week Goal, daily habit stack, and focus launchpad in under 60 seconds.
          </p>
          <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href={isAuthenticated ? "/onboarding" : "/signup"}
              className="login-btn"
              style={{
                inlineSize: "auto",
                padding: "0.875rem 2rem",
                fontSize: "0.95rem",
                fontWeight: "700",
                textDecoration: "none",
                borderRadius: "0.875rem",
              }}
            >
              {isAuthenticated ? "Launch 12-Week Setup Wizard →" : "Create Free Account →"}
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            borderBlockStart: "1px solid var(--border)",
            paddingBlockStart: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.775rem",
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: "800", color: "var(--foreground)" }}>KASION LIFE</span>
            <span>• Personal Operating System &amp; 12-Week Year Dashboard</span>
          </div>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            <Link href="/welcome" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
            <Link href="/pricing" style={{ color: "var(--muted)", textDecoration: "none" }}>Pricing</Link>
            <Link href="/login" style={{ color: "var(--muted)", textDecoration: "none" }}>Sign In</Link>
            <Link href="/signup" style={{ color: "var(--muted)", textDecoration: "none" }}>Sign Up</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
