"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  TrackerIcon,
  JournalIcon,
  GoalsIcon,
  SettingsIcon,
  MenuIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  ListIcon,
  ProjectIcon,
  CalendarIcon,
  TimerIcon,
  CountdownIcon,
  HealthIcon,
} from "./Icons";
import { logout } from "@/app/actions/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userPlan?: string;
}

interface ModuleConnectionInfo {
  title: string;
  pipelineBadge: string;
  flowChain: { label: string; path: string; current?: boolean }[];
  howItConnects: string;
  nextStepLabel: string;
  nextStepPath: string;
}

const MODULE_CONNECTION_MAP: Record<string, ModuleConnectionInfo> = {
  "/goals": {
    title: "Active Goals",
    pipelineBadge: "12-WEEK STRATEGY PIPELINE",
    flowChain: [
      { label: "🎯 Goals", path: "/goals", current: true },
      { label: "✅ Habit Tracker", path: "/tracker" },
      { label: "📈 Weekly Execution Score", path: "/" },
    ],
    howItConnects:
      "Goals define your 12-Week Year targets. Attach Daily Habits to any Goal below—when you check off those habits in Tracker, this Goal's Weekly Execution % and your Overview ring update automatically.",
    nextStepLabel: "Check Off Linked Habits in Tracker →",
    nextStepPath: "/tracker",
  },
  "/tracker": {
    title: "Habit Tracker",
    pipelineBadge: "12-WEEK STRATEGY PIPELINE",
    flowChain: [
      { label: "🎯 Goals", path: "/goals" },
      { label: "✅ Habit Tracker", path: "/tracker", current: true },
      { label: "📈 Weekly Execution Score", path: "/" },
    ],
    howItConnects:
      "Your Daily Habits link directly to your 12-Week Goals. Every habit you complete today increments your streak, fills your 365-day consistency heatmap, and raises your Weekly Execution Score.",
    nextStepLabel: "View Goal Execution Scores →",
    nextStepPath: "/goals",
  },
  "/countdowns": {
    title: "Milestone Countdowns",
    pipelineBadge: "12-WEEK STRATEGY PIPELINE",
    flowChain: [
      { label: "🎯 Goals", path: "/goals" },
      { label: "⏳ Countdowns", path: "/countdowns", current: true },
      { label: "🏠 Overview Milestones", path: "/" },
    ],
    howItConnects:
      "Countdowns track D-Day deadlines for your major 12-Week launches and checkpoints. Your 3 closest upcoming deadlines automatically surface on the Overview command center.",
    nextStepLabel: "Time-Block Deadlines in Planner →",
    nextStepPath: "/planner",
  },
  "/projects": {
    title: "Projects Workspace",
    pipelineBadge: "DEEP WORK DELIVERY PIPELINE",
    flowChain: [
      { label: "📁 Projects", path: "/projects", current: true },
      { label: "📋 Task Lists", path: "/lists" },
      { label: "⏱️ Focus Space", path: "/focus" },
      { label: "🏠 Overview Focus Time", path: "/" },
    ],
    howItConnects:
      "Projects are top-level containers for your initiatives. Open any Project to create Task Lists and add Todo items—those tasks automatically populate the Focus Space Pomodoro timer.",
    nextStepLabel: "View All Task Lists →",
    nextStepPath: "/lists",
  },
  "/lists": {
    title: "Task Lists",
    pipelineBadge: "DEEP WORK DELIVERY PIPELINE",
    flowChain: [
      { label: "📁 Projects", path: "/projects" },
      { label: "📋 Task Lists", path: "/lists", current: true },
      { label: "⏱️ Focus Space", path: "/focus" },
      { label: "🏠 Overview Focus Time", path: "/" },
    ],
    howItConnects:
      "Lists organize actionable Tasks and Subtasks (either standalone or inside a Project). Every incomplete Task inside your Lists automatically appears in the Focus Space Pomodoro selector.",
    nextStepLabel: "Run a 25m Pomodoro on Your Tasks →",
    nextStepPath: "/focus",
  },
  "/focus": {
    title: "Focus Space",
    pipelineBadge: "DEEP WORK DELIVERY PIPELINE",
    flowChain: [
      { label: "📁 Projects", path: "/projects" },
      { label: "📋 Lists & Tasks", path: "/lists" },
      { label: "⏱️ Focus Space", path: "/focus", current: true },
      { label: "🏠 Overview Focus Time", path: "/" },
    ],
    howItConnects:
      "Focus Space pulls incomplete Tasks directly from your Project Lists. Pick a task, run a 25-minute Pomodoro sprint, and completed sessions automatically log to your Focus Timeline and Overview.",
    nextStepLabel: "Add More Tasks in Lists →",
    nextStepPath: "/lists",
  },
  "/planner": {
    title: "Planner & Agenda",
    pipelineBadge: "DEEP WORK DELIVERY PIPELINE",
    flowChain: [
      { label: "📅 Weekly Planner", path: "/planner", current: true },
      { label: "⏱️ Focus Space", path: "/focus" },
      { label: "🏠 Overview Schedule", path: "/" },
    ],
    howItConnects:
      "Time-block your deep work intervals and events on the 7-day calendar (or sync with Google Calendar). Today's scheduled events automatically feed the Today's Schedule card on Overview.",
    nextStepLabel: "Start a Focus Session Now →",
    nextStepPath: "/focus",
  },
  "/health": {
    title: "Health & Wellness OS",
    pipelineBadge: "BIO-RHYTHM & REFLECTION LOOP",
    flowChain: [
      { label: "🫀 Health OS", path: "/health", current: true },
      { label: "⏱️ Focus Space", path: "/focus" },
      { label: "📓 Daily Journal", path: "/journal" },
      { label: "🏠 Overview Vitals", path: "/" },
    ],
    howItConnects:
      "Calibrate sleep, water, energy, workouts, macros, mood, and recovery in one place. Your biometrics compute a live 0–100% Daily Readiness Score and sync directly to your Overview Health card.",
    nextStepLabel: "Log Evening Reflection in Journal →",
    nextStepPath: "/journal",
  },
  "/journal": {
    title: "Daily Journal",
    pipelineBadge: "BIO-RHYTHM & REFLECTION LOOP",
    flowChain: [
      { label: "🫀 Health OS", path: "/health" },
      { label: "⏱️ Focus Space", path: "/focus" },
      { label: "📓 Daily Journal", path: "/journal", current: true },
      { label: "🏠 Overview", path: "/" },
    ],
    howItConnects:
      "Your Evening Shutdown hub. Capture daily wins, mental clarity, and lessons learned—every entry is saved into your searchable archive and completes Step 5 of your daily Happy Path.",
    nextStepLabel: "Return to Overview Command Center →",
    nextStepPath: "/",
  },
};

export default function DashboardLayout({
  children,
  userName,
  userEmail,
  userPlan = "FREE",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();
  const guideDialogRef = useRef<HTMLDialogElement>(null);

  const getUserInitials = () => {
    const source = (userName || userEmail || "KL").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  };

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const storedTheme = localStorage.getItem("kasion-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = (targetTheme: "dark" | "light") => {
    setTheme(targetTheme);
    localStorage.setItem("kasion-theme", targetTheme);
    document.documentElement.setAttribute("data-theme", targetTheme);
  };

  const openGuideModal = () => {
    setSidebarOpen(false);
    guideDialogRef.current?.showModal();
  };

  const navSections = [
    {
      section: "Command Center",
      items: [{ name: "Overview", path: "/", icon: DashboardIcon, hint: "Daily HQ" }],
    },
    {
      section: "12-Week Strategy",
      items: [
        { name: "Goals", path: "/goals", icon: GoalsIcon, hint: "1. Targets" },
        { name: "Tracker", path: "/tracker", icon: TrackerIcon, hint: "2. Habits" },
        { name: "Countdowns", path: "/countdowns", icon: CountdownIcon, hint: "Deadlines" },
      ],
    },
    {
      section: "Deep Work Pipeline",
      items: [
        { name: "Projects", path: "/projects", icon: ProjectIcon, hint: "1. Workspaces" },
        { name: "Lists", path: "/lists", icon: ListIcon, hint: "2. Tasks" },
        { name: "Focus", path: "/focus", icon: TimerIcon, hint: "3. Pomodoro" },
        { name: "Planner", path: "/planner", icon: CalendarIcon, hint: "Time Blocks" },
      ],
    },
    {
      section: "Bio & Reflection",
      items: [
        { name: "Health", path: "/health", icon: HealthIcon, hint: "Morning Vitals" },
        { name: "Journal", path: "/journal", icon: JournalIcon, hint: "Evening Log" },
      ],
    },
    {
      section: "Account",
      items: [{ name: "Settings", path: "/settings", icon: SettingsIcon, hint: "Billing & Profile" }],
    },
  ];

  // Match current route for the contextual connection banner
  const activeModuleKey = Object.keys(MODULE_CONNECTION_MAP).find(
    (key) => pathname === key || pathname.startsWith(`${key}/`)
  );
  const activeConnection = activeModuleKey ? MODULE_CONNECTION_MAP[activeModuleKey] : null;

  // Helper to format date elegantly
  const getFormattedDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="layout-container">
      <style>{`
        .module-connection-details {
          margin-bottom: 1.5rem;
          border-radius: 1rem;
          border: 1px solid rgba(99, 102, 241, 0.25);
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(16, 185, 129, 0.03) 100%);
          overflow: hidden;
        }
        .module-connection-summary {
          list-style: none;
          cursor: pointer;
          padding: 0.75rem 1.15rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          user-select: none;
        }
        .module-connection-summary::-webkit-details-marker {
          display: none;
        }
        .module-connection-summary::after {
          content: "How this connects ▼";
          font-size: 0.7rem;
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--accent);
        }
        .module-connection-details[open] .module-connection-summary {
          border-bottom: 1px solid var(--border);
        }
        .module-connection-details[open] .module-connection-summary::after {
          content: "Hide connection guide ▲";
        }
        .guide-modal-dialog {
          margin: auto;
          width: min(92vw, 780px);
          max-height: 86vh;
          border-radius: 1.35rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          padding: 0;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.55);
          overflow-y: auto;
        }
        .guide-modal-dialog::backdrop {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand / Logo Header */}
        <div className="sidebar-header">
          <Link href="/" className="nav-item" style={{ padding: 0, gap: "0.75rem", background: "transparent" }}>
            <div className="logo-container">
              <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#ffffff", letterSpacing: "0.05em" }}>K</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="logo-text-large">
                KASION LIFE
              </span>
              <span className="logo-text-sub">
                Life Dashboard
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="close-btn"
            aria-label="Close menu"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Sidebar Navigation Grouped by Workflow */}
        <div className="sidebar-content">
          {navSections.map((group, groupIdx) => (
            <div key={group.section} style={{ marginTop: groupIdx === 0 ? 0 : "1.1rem" }}>
              <div className="nav-section-title" style={{ marginBottom: "0.35rem" }}>
                {group.section}
              </div>
              <nav className="nav-list">
                {group.items.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? pathname === "/"
                      : pathname === item.path || pathname.startsWith(`${item.path}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`nav-item ${isActive ? "active" : ""}`}
                      style={{ justifyContent: "space-between" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Icon
                          style={{
                            transition: "transform 0.2s ease",
                            color: isActive ? "var(--accent)" : "var(--muted)",
                          }}
                        />
                        <span>{item.name}</span>
                      </span>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          fontFamily: "var(--font-mono)",
                          color: isActive ? "var(--accent)" : "var(--muted)",
                          opacity: 0.8,
                        }}
                      >
                        {item.hint}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Workspace & Plan Quick Links */}
          <div className="sidebar-footer-divider" style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--sidebar-border)" }}>
            <div className="nav-section-title" style={{ marginBottom: "0.65rem" }}>
              Guide &amp; Plan
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              <button
                type="button"
                onClick={openGuideModal}
                className="add-widget-dashed"
                style={{
                  width: "100%",
                  cursor: "pointer",
                  background: "rgba(99, 102, 241, 0.08)",
                  borderStyle: "solid",
                  borderColor: "rgba(99, 102, 241, 0.3)",
                  textAlign: "left",
                }}
              >
                <span style={{ color: "var(--foreground)", fontWeight: "700" }}>
                  🧭 Workflow &amp; OS Map
                </span>
                <span className="badge-plus" style={{ color: "var(--accent)" }}>
                  GUIDE
                </span>
              </button>

              <Link
                href={userPlan === "FREE" ? "/pricing" : "/settings"}
                className="add-widget-dashed"
                style={{
                  textDecoration: "none",
                  borderStyle: "solid",
                  borderColor:
                    userPlan === "LIFETIME"
                      ? "rgba(16, 185, 129, 0.35)"
                      : "rgba(99, 102, 241, 0.25)",
                }}
              >
                <span style={{ color: "var(--foreground)", fontWeight: "600" }}>
                  {userPlan === "LIFETIME"
                    ? "✦ Founder Edition"
                    : userPlan === "PRO"
                    ? "⚡ Kasion Pro Active"
                    : "⚡ Upgrade to Pro"}
                </span>
                <span
                  className="badge-plus"
                  style={{
                    color: userPlan === "LIFETIME" ? "#10b981" : "var(--accent)",
                  }}
                >
                  {userPlan === "LIFETIME"
                    ? "LIFE"
                    : userPlan === "PRO"
                    ? "PRO"
                    : "FREE"}
                </span>
              </Link>
              <Link href="/onboarding" className="add-widget-dashed" style={{ textDecoration: "none" }}>
                <span>12-Week Setup Wizard</span>
                <span className="badge-plus">+</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Theme Switcher */}
        <div className="sidebar-footer">
          <div className="theme-selector">
            <button
              type="button"
              onClick={() => toggleTheme("light")}
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
            >
              <SunIcon size={14} />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => toggleTheme("dark")}
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
            >
              <MoonIcon size={14} />
              <span>Dark</span>
            </button>
          </div>

          <button type="button" onClick={() => logout()} className="logout-btn">
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
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>Sign Out</span>
          </button>
          
          <div className="status-indicator">
            <div className="status-dot pulse" />
            <span className="status-text">v1.0.0-beta • Connected</span>
          </div>
        </div>
      </aside>

      {/* Main Layout Container */}
      <div className="main-layout">
        {/* Top Header */}
        <header className="header">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="menu-btn"
              aria-label="Open menu"
            >
              <MenuIcon size={18} />
            </button>
            
            <div className="header-status">
              <span className="header-status-title">
                System Status
              </span>
              <span className="header-status-value">
                Ready for Deployment
              </span>
            </div>
          </div>

          <div className="header-right">
            {/* Global Workflow & Connections Guide Trigger */}
            <button
              type="button"
              onClick={openGuideModal}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.42rem 0.85rem",
                borderRadius: "999px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                color: "var(--foreground)",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <span aria-hidden="true">🧭</span>
              <span>Workflow Guide</span>
            </button>

            {/* System Date Indicator */}
            <div className="date-badge">
              <span className="date-dot" />
              <span>{getFormattedDate()}</span>
            </div>

            {/* Profile Badge */}
            <Link
              href="/settings"
              className="profile-avatar"
              aria-label={userName ? `Account settings for ${userName}` : "Account Settings"}
              style={{ textDecoration: "none" }}
            >
              {getUserInitials()}
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="viewport">
          <div className="viewport-content">
            {/* Contextual Module Connection Disclosure on Sub-Pages */}
            {activeConnection && (
              <details className="module-connection-details" open>
                <summary className="module-connection-summary">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "800",
                        padding: "0.18rem 0.5rem",
                        borderRadius: "0.35rem",
                        backgroundColor: "rgba(99, 102, 241, 0.16)",
                        color: "var(--accent)",
                      }}
                    >
                      {activeConnection.pipelineBadge}
                    </span>
                    <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--foreground)" }}>
                      {activeConnection.flowChain.map((node, i) => (
                        <React.Fragment key={node.path}>
                          <span
                            style={{
                              color: node.current ? "var(--accent)" : "var(--muted)",
                              fontWeight: node.current ? "800" : "600",
                              textDecoration: node.current ? "underline" : "none",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            {node.label}
                          </span>
                          {i < activeConnection.flowChain.length - 1 && (
                            <span style={{ color: "var(--muted)", margin: "0 0.35rem" }}>→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                </summary>

                <div
                  style={{
                    padding: "0.9rem 1.15rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.78rem", color: "var(--muted)", lineHeight: "1.45", flex: "1 1 380px", margin: 0 }}>
                    {activeConnection.howItConnects}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    {activeConnection.flowChain
                      .filter((n) => !n.current)
                      .map((node) => (
                        <Link
                          key={node.path}
                          href={node.path}
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: "600",
                            padding: "0.38rem 0.65rem",
                            borderRadius: "0.5rem",
                            backgroundColor: "var(--muted-bg)",
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                            textDecoration: "none",
                          }}
                        >
                          {node.label}
                        </Link>
                      ))}
                    <Link
                      href={activeConnection.nextStepPath}
                      style={{
                        fontSize: "0.74rem",
                        fontWeight: "700",
                        padding: "0.42rem 0.8rem",
                        borderRadius: "0.5rem",
                        backgroundColor: "var(--accent)",
                        color: "#ffffff",
                        textDecoration: "none",
                      }}
                    >
                      {activeConnection.nextStepLabel}
                    </Link>
                  </div>
                </div>
              </details>
            )}

            {children}
          </div>
        </main>
      </div>

      {/* Global Native Modal Dialog: System Architecture & Happy Path Guide */}
      <dialog
        ref={guideDialogRef}
        closedby="any"
        className="guide-modal-dialog"
        aria-labelledby="os-guide-modal-title"
      >
        <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "800",
                  color: "var(--accent)",
                  letterSpacing: "0.06em",
                }}
              >
                KASION LIFE OS • ARCHITECTURE &amp; WORKFLOW
              </span>
              <h2 id="os-guide-modal-title" style={{ fontSize: "1.35rem", fontWeight: "800", marginTop: "0.2rem" }}>
                Where to Start &amp; How Modules Connect
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                Follow the daily Happy Path below to keep your goals, tasks, focus sessions, and health vitals in sync.
              </p>
            </div>

            <form method="dialog">
              <button
                type="submit"
                value="close"
                style={{
                  padding: "0.45rem 0.8rem",
                  borderRadius: "0.6rem",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--muted-bg)",
                  color: "var(--foreground)",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </form>
          </div>

          {/* Section 1: Daily Rhythm */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              1. The Daily &ldquo;Happy Path&rdquo; Operating Rhythm
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div style={{ padding: "1rem", borderRadius: "0.875rem", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "800" }}>
                  ☀️ 1. MORNING CALIBRATION
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: "800", marginTop: "0.25rem" }}>
                  Health OS → Planner
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem", lineHeight: "1.4" }}>
                  Log last night&apos;s sleep, morning water &amp; energy in <strong>Health</strong> to get your Readiness Score, then time-block your day in <strong>Planner</strong>.
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "0.875rem", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "800" }}>
                  ⚡ 2. MIDDAY EXECUTION
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: "800", marginTop: "0.25rem" }}>
                  Projects → Lists → Focus
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem", lineHeight: "1.4" }}>
                  Break Projects into Lists &amp; Tasks. Open <strong>Focus Space</strong>, pick a Task from the dropdown, and run 25m Pomodoro sprints while checking off <strong>Habits</strong>.
                </p>
              </div>

              <div style={{ padding: "1rem", borderRadius: "0.875rem", backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#a855f7", fontWeight: "800" }}>
                  🌙 3. EVENING SHUTDOWN
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: "800", marginTop: "0.25rem" }}>
                  Tracker → Daily Journal
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.35rem", lineHeight: "1.4" }}>
                  Check off remaining evening habits in <strong>Tracker</strong> (boosting your 12-Week Score) and write your daily reflection in <strong>Journal</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Module Connection Matrix */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
              2. How Every Module Connects (Click to Jump)
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[
                {
                  from: "🎯 Goals (/goals)",
                  to: "✅ Habit Tracker (/tracker) → 📈 Overview Score",
                  desc: "Attach habits to a 12-Week Goal; daily habit check-offs compute your Weekly Execution %.",
                  href: "/goals",
                },
                {
                  from: "📁 Projects (/projects)",
                  to: "📋 Lists (/lists) → ⏱️ Focus Space (/focus)",
                  desc: "Projects group Task Lists. Incomplete tasks inside Lists automatically populate the Pomodoro Timer.",
                  href: "/projects",
                },
                {
                  from: "🫀 Health OS (/health)",
                  to: "⚡ Readiness Score → 🏠 Overview Health Card",
                  desc: "13 biometric inputs calculate your Daily Readiness (0–100%) and 7-day rolling averages.",
                  href: "/health",
                },
                {
                  from: "📅 Planner (/planner) & ⏳ Countdowns",
                  to: "🏠 Overview Schedule & Upcoming Milestones",
                  desc: "Weekly time blocks and D-Day milestone countdowns surface automatically on Overview.",
                  href: "/planner",
                },
                {
                  from: "📓 Daily Journal (/journal)",
                  to: "📚 Searchable Reflection Logbook & Streak",
                  desc: "Captures evening reflections, word counts, and daily takeaways with instant archive browsing.",
                  href: "/journal",
                },
              ].map((row) => (
                <Link
                  key={row.href}
                  href={row.href}
                  onClick={() => guideDialogRef.current?.close()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    padding: "0.85rem 1rem",
                    borderRadius: "0.85rem",
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    textDecoration: "none",
                    color: "var(--foreground)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: "1 1 320px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: "800" }}>
                      {row.from} <span style={{ color: "var(--accent)" }}>──►</span> {row.to}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--muted)" }}>{row.desc}</div>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                    Open →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Modal Footer CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              Want to auto-configure a Goal, Habits, Project, Task List &amp; Focus Block in 60 seconds?
            </span>
            <Link
              href="/onboarding"
              onClick={() => guideDialogRef.current?.close()}
              style={{
                padding: "0.55rem 1.1rem",
                borderRadius: "0.65rem",
                backgroundColor: "var(--accent)",
                color: "#ffffff",
                fontSize: "0.78rem",
                fontWeight: "700",
                textDecoration: "none",
              }}
            >
              🚀 Run 12-Week Setup Wizard
            </Link>
          </div>
        </div>
      </dialog>
    </div>
  );
}
