"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface WorkflowStats {
  goalsCount: number;
  habitsCount: number;
  linkedHabitsCount: number;
  habitsCompletedToday: number;
  projectsCount: number;
  listsCount: number;
  activeTodosCount: number;
  completedTodosCount: number;
  hasHealthLogToday: boolean;
  eventsTodayCount: number;
  focusSessionsTodayCount: number;
  focusMinutesToday: number;
  hasJournalToday: boolean;
  countdownsCount: number;
}

interface WorkflowBlueprintProps {
  stats: WorkflowStats;
}

export default function WorkflowBlueprint({ stats }: WorkflowBlueprintProps) {
  const [activeTab, setActiveTab] = useState<"happy-path" | "connections" | "quickstart">("happy-path");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const savedCollapse = localStorage.getItem("kasion-workflow-collapsed");
    if (savedCollapse === "true") {
      setIsCollapsed(true);
    }
    const savedTab = localStorage.getItem("kasion-workflow-tab") as
      | "happy-path"
      | "connections"
      | "quickstart"
      | null;
    if (savedTab && ["happy-path", "connections", "quickstart"].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("kasion-workflow-collapsed", String(next));
  };

  const handleSelectTab = (tab: "happy-path" | "connections" | "quickstart") => {
    setActiveTab(tab);
    setIsCollapsed(false);
    localStorage.setItem("kasion-workflow-collapsed", "false");
    localStorage.setItem("kasion-workflow-tab", tab);
  };

  // Evaluate the 5 Happy Path steps dynamically from the user's real data
  const step1Done = stats.goalsCount > 0 && stats.habitsCount > 0;
  const step2Done = stats.projectsCount > 0 && (stats.activeTodosCount > 0 || stats.completedTodosCount > 0);
  const step3Done = stats.hasHealthLogToday || stats.eventsTodayCount > 0;
  const step4Done = stats.focusSessionsTodayCount > 0 || stats.habitsCompletedToday > 0;
  const step5Done = stats.hasJournalToday;

  const happyPathSteps = [
    {
      num: 1,
      phase: "FOUNDATION",
      title: "Set 12-Week Goal & Link Daily Habits",
      done: step1Done,
      summary:
        "Define your flagship 12-Week Goal and attach recurring Daily Habits to it. Checking off habits automatically powers your 12-Week Year Execution Score.",
      statusText: step1Done
        ? `${stats.goalsCount} Goal${stats.goalsCount === 1 ? "" : "s"} • ${stats.habitsCount} Habit${stats.habitsCount === 1 ? "" : "s"} Active`
        : "Not configured yet",
      primaryLink: stats.habitsCount === 0 ? "/onboarding" : "/goals",
      primaryLabel: stats.habitsCount === 0 ? "Run 60s Setup Wizard →" : "Manage Goals & Habits →",
      secondaryLink: "/tracker",
      secondaryLabel: "Open Habit Tracker",
      modules: ["Goals", "Habit Tracker", "Overview Score"],
    },
    {
      num: 2,
      phase: "PIPELINE",
      title: "Build Project → List → Actionable Tasks",
      done: step2Done,
      summary:
        "Create a high-level Project, group work into Task Lists, and add specific Todo items. Active Tasks automatically feed the Focus Space Pomodoro selector.",
      statusText: step2Done
        ? `${stats.projectsCount} Project${stats.projectsCount === 1 ? "" : "s"} • ${stats.activeTodosCount} Open Task${stats.activeTodosCount === 1 ? "" : "s"}`
        : "Create your first Project & Task List",
      primaryLink: "/projects",
      primaryLabel: "Open Projects →",
      secondaryLink: "/lists",
      secondaryLabel: "View Task Lists",
      modules: ["Projects", "Lists", "Focus Space"],
    },
    {
      num: 3,
      phase: "MORNING",
      title: "Calibrate Biometrics & Time-Block Your Day",
      done: step3Done,
      summary:
        "Start your morning by logging last night's sleep, hydration, and energy in Health OS (to compute your Readiness Score) and blocking deep work hours in Planner.",
      statusText:
        stats.hasHealthLogToday && stats.eventsTodayCount > 0
          ? `Vitals Logged & ${stats.eventsTodayCount} Event${stats.eventsTodayCount === 1 ? "" : "s"} Scheduled`
          : stats.hasHealthLogToday
          ? "Vitals Logged • No time blocks yet"
          : stats.eventsTodayCount > 0
          ? `${stats.eventsTodayCount} Event${stats.eventsTodayCount === 1 ? "" : "s"} Scheduled • Log Vitals`
          : "Log morning sleep/water & check schedule",
      primaryLink: !stats.hasHealthLogToday ? "/health" : "/planner",
      primaryLabel: !stats.hasHealthLogToday ? "Log Morning Vitals →" : "Time-Block Planner →",
      secondaryLink: !stats.hasHealthLogToday ? "/planner" : "/health",
      secondaryLabel: !stats.hasHealthLogToday ? "Open Planner" : "Open Health OS",
      modules: ["Health & Wellness", "Planner", "Countdowns"],
    },
    {
      num: 4,
      phase: "MIDDAY",
      title: "Execute 25m Focus Sprints & Check Off Habits",
      done: step4Done,
      summary:
        "Launch Focus Space, pick an active Task from your Lists, and run an uninterrupted 25-minute Pomodoro. Check off your daily habits as you complete them.",
      statusText: step4Done
        ? `${stats.focusMinutesToday}m Focused • ${stats.habitsCompletedToday}/${stats.habitsCount} Habits Done`
        : "0m focused & 0 habits checked today",
      primaryLink: "/focus",
      primaryLabel: "Start 25m Focus Sprint →",
      secondaryLink: "/tracker",
      secondaryLabel: "Check Off Habits",
      modules: ["Focus Space", "Habit Tracker"],
    },
    {
      num: 5,
      phase: "EVENING",
      title: "Evening Reflection & Daily Shutdown Log",
      done: step5Done,
      summary:
        "Close out your day in Daily Journal. Capture key wins, lessons learned, and mental clarity—your entry is permanently indexed in your searchable archive.",
      statusText: step5Done ? "Today's reflection saved ✓" : "Evening reflection pending",
      primaryLink: "/journal",
      primaryLabel: step5Done ? "Review Today's Journal →" : "Write Evening Reflection →",
      secondaryLink: "/health",
      secondaryLabel: "Update Evening Vitals",
      modules: ["Daily Journal", "Health & Wellness"],
    },
  ];

  const completedStepsCount = happyPathSteps.filter((s) => s.done).length;
  const progressPercentage = Math.round((completedStepsCount / happyPathSteps.length) * 100);

  // Recommend the immediate next step for the user
  const nextRecommendedStep = happyPathSteps.find((s) => !s.done) || happyPathSteps[0];

  return (
    <section
      aria-label="Kasion Life OS Workflow and System Connections Guide"
      className="glass-panel"
      style={{
        padding: "1.5rem",
        borderRadius: "1.25rem",
        border: "1px solid rgba(99, 102, 241, 0.28)",
        background:
          "linear-gradient(135deg, rgba(99, 102, 241, 0.07) 0%, rgba(16, 185, 129, 0.04) 50%, rgba(139, 92, 246, 0.06) 100%)",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <style>{`
        .wf-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .wf-tab-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          background: var(--muted-bg);
          padding: 0.3rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
        }
        .wf-tab-btn {
          padding: 0.45rem 0.85rem;
          border-radius: 0.55rem;
          border: none;
          background: transparent;
          color: var(--muted);
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .wf-tab-btn.active {
          background: var(--accent);
          color: #ffffff;
          box-shadow: 0 2px 10px var(--accent-glow);
        }
        .wf-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 0.875rem;
        }
        .wf-step-card {
          min-inline-size: 0;
          padding: 1.1rem;
          border-radius: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.85rem;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .wf-step-card:hover {
          border-color: var(--accent);
          transform: translateY(-1px);
        }
        .wf-step-card.completed {
          border-color: rgba(16, 185, 129, 0.35);
          background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, var(--card-bg) 100%);
        }
        .wf-step-card.next-up {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.25);
        }
        .wf-pipeline-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .wf-pipeline-card {
          padding: 1.15rem 1.25rem;
          border-radius: 1rem;
          background: var(--card-bg);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .wf-nodes-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
          gap: 0.65rem;
          align-items: stretch;
        }
        .wf-node-box {
          min-inline-size: 0;
          padding: 0.8rem 0.95rem;
          border-radius: 0.75rem;
          background: var(--muted-bg);
          border: 1px solid var(--border);
          text-decoration: none;
          color: var(--foreground);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .wf-node-box:hover {
          border-color: var(--accent);
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header Row */}
      <div className="wf-top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "0.75rem",
              backgroundColor: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            🧭
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.05rem", fontWeight: "800", letterSpacing: "-0.01em" }}>
                Kasion OS Blueprint &amp; Happy Path Workflow
              </h2>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  padding: "0.18rem 0.55rem",
                  borderRadius: "999px",
                  backgroundColor:
                    completedStepsCount === 5
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(99, 102, 241, 0.15)",
                  color: completedStepsCount === 5 ? "#10b981" : "var(--accent)",
                }}
              >
                {completedStepsCount}/5 DAILY STEPS COMPLETE ({progressPercentage}%)
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.15rem" }}>
              Recommended Next Action:{" "}
              <strong style={{ color: "var(--foreground)" }}>
                Step {nextRecommendedStep.num} — {nextRecommendedStep.title}
              </strong>
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <div className="wf-tab-group" role="tablist" aria-label="Workflow Guide Views">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "happy-path"}
              onClick={() => handleSelectTab("happy-path")}
              className={`wf-tab-btn ${activeTab === "happy-path" ? "active" : ""}`}
            >
              <span>☀️ Happy Path (5 Steps)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "connections"}
              onClick={() => handleSelectTab("connections")}
              className={`wf-tab-btn ${activeTab === "connections" ? "active" : ""}`}
            >
              <span>🔗 How Modules Connect</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "quickstart"}
              onClick={() => handleSelectTab("quickstart")}
              className={`wf-tab-btn ${activeTab === "quickstart" ? "active" : ""}`}
            >
              <span>🚀 Where to Start</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleCollapse}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "0.6rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--muted-bg)",
              color: "var(--muted)",
              fontSize: "0.72rem",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {isCollapsed ? "Expand Guide ▼" : "Minimize ▲"}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "var(--border)",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--accent), #10b981)",
            transition: "width 0.35s ease",
          }}
        />
      </div>

      {/* Collapsible Body */}
      {!isCollapsed && (
        <div className="animate-fade-in">
          {/* TAB 1: HAPPY PATH DAILY WORKFLOW */}
          {activeTab === "happy-path" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="wf-steps-grid">
                {happyPathSteps.map((step) => {
                  const isNext = !step.done && step.num === nextRecommendedStep.num;
                  return (
                    <div
                      key={step.num}
                      className={`wf-step-card ${step.done ? "completed" : ""} ${isNext ? "next-up" : ""}`}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontFamily: "var(--font-mono)",
                              fontWeight: "800",
                              letterSpacing: "0.06em",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.375rem",
                              backgroundColor: step.done
                                ? "rgba(16, 185, 129, 0.15)"
                                : isNext
                                ? "rgba(99, 102, 241, 0.18)"
                                : "var(--muted-bg)",
                              color: step.done
                                ? "#10b981"
                                : isNext
                                ? "var(--accent)"
                                : "var(--muted)",
                            }}
                          >
                            STEP {step.num} • {step.phase}
                          </span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: "800",
                              color: step.done ? "#10b981" : isNext ? "var(--accent)" : "var(--muted)",
                            }}
                          >
                            {step.done ? "✓ Completed" : isNext ? "★ Start Here" : "Pending"}
                          </span>
                        </div>

                        <h3 style={{ fontSize: "0.92rem", fontWeight: "800", color: "var(--foreground)" }}>
                          {step.title}
                        </h3>

                        <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: "1.45" }}>
                          {step.summary}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {/* Connected module pills */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                          {step.modules.map((mod, idx) => (
                            <React.Fragment key={mod}>
                              <span
                                style={{
                                  fontSize: "0.62rem",
                                  fontFamily: "var(--font-mono)",
                                  padding: "0.15rem 0.45rem",
                                  borderRadius: "0.35rem",
                                  backgroundColor: "var(--muted-bg)",
                                  border: "1px solid var(--border)",
                                  color: "var(--foreground)",
                                }}
                              >
                                {mod}
                              </span>
                              {idx < step.modules.length - 1 && (
                                <span style={{ fontSize: "0.65rem", color: "var(--muted)", alignSelf: "center" }}>
                                  →
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <div
                          style={{
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-mono)",
                            color: step.done ? "#10b981" : "var(--muted)",
                            paddingTop: "0.35rem",
                            borderTop: "1px solid var(--border)",
                          }}
                        >
                          Status: {step.statusText}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <Link
                            href={step.primaryLink}
                            style={{
                              flex: 1,
                              textAlign: "center",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "0.6rem",
                              backgroundColor: isNext ? "var(--accent)" : "var(--muted-bg)",
                              color: isNext ? "#ffffff" : "var(--foreground)",
                              border: isNext ? "none" : "1px solid var(--border)",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              textDecoration: "none",
                            }}
                          >
                            {step.primaryLabel}
                          </Link>
                          <Link
                            href={step.secondaryLink}
                            style={{
                              padding: "0.5rem 0.65rem",
                              borderRadius: "0.6rem",
                              backgroundColor: "transparent",
                              color: "var(--muted)",
                              border: "1px solid var(--border)",
                              fontSize: "0.72rem",
                              fontWeight: "600",
                              textDecoration: "none",
                            }}
                          >
                            {step.secondaryLabel}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HOW MODULES CONNECT (ARCHITECTURE & DATA FLOW) */}
          {activeTab === "connections" && (
            <div className="wf-pipeline-list">
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: "1.5" }}>
                Kasion Life OS is not a collection of isolated tools—every module feeds data into the next. Here are the{" "}
                <strong style={{ color: "var(--foreground)" }}>3 Core Data Pipelines</strong> that connect your workspace:
              </p>

              {/* Pipeline 1 */}
              <div className="wf-pipeline-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "800",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "0.4rem",
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                        color: "var(--accent)",
                      }}
                    >
                      PIPELINE 1
                    </span>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: "800" }}>
                      The 12-Week Execution Engine (Goals ↔ Habits ↔ Weekly Score)
                    </h3>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {stats.linkedHabitsCount}/{stats.habitsCount} habits linked to goals
                  </span>
                </div>

                <div className="wf-nodes-row">
                  <Link href="/goals" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
                      1. DEFINE TARGET
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>🎯 Active Goals (/goals)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Create a 12-Week Year objective and attach supporting daily habits to it.
                    </span>
                  </Link>

                  <Link href="/tracker" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "700" }}>
                      2. DAILY CONSISTENCY
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>✅ Habit Tracker (/tracker)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Check off boolean or numeric habits daily to build streaks and fill your 365-day heatmap.
                    </span>
                  </Link>

                  <Link href="/" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#a855f7", fontWeight: "700" }}>
                      3. LIVE FEEDBACK
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>📈 Execution Score (Overview)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Your 7-day habit completion rate automatically drives both your Goal Score and Overview Ring.
                    </span>
                  </Link>
                </div>
              </div>

              {/* Pipeline 2 */}
              <div className="wf-pipeline-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "800",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "0.4rem",
                        backgroundColor: "rgba(16, 185, 129, 0.15)",
                        color: "#10b981",
                      }}
                    >
                      PIPELINE 2
                    </span>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: "800" }}>
                      The Deep Work Delivery Chain (Projects → Lists → Tasks → Focus Timer)
                    </h3>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {stats.activeTodosCount} tasks ready for Focus Timer
                  </span>
                </div>

                <div className="wf-nodes-row">
                  <Link href="/projects" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
                      1. WORKSPACE
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>📁 Projects (/projects)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Create high-level workspaces (e.g., &ldquo;Q4 Product Launch&rdquo;) that house related task lists.
                    </span>
                  </Link>

                  <Link href="/lists" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "700" }}>
                      2. BREAKDOWN
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>📋 Lists &amp; Tasks (/lists)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Open any List to add actionable Tasks and Subtasks. Incomplete tasks sync to Focus Space.
                    </span>
                  </Link>

                  <Link href="/focus" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#f59e0b", fontWeight: "700" }}>
                      3. POMODORO SPRINT
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>⏱️ Focus Space (/focus)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Select a Task from the dropdown and run a 25m timer. Completed sessions log to your Timeline &amp; Overview.
                    </span>
                  </Link>
                </div>
              </div>

              {/* Pipeline 3 */}
              <div className="wf-pipeline-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        fontWeight: "800",
                        padding: "0.2rem 0.55rem",
                        borderRadius: "0.4rem",
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        color: "#f59e0b",
                      }}
                    >
                      PIPELINE 3
                    </span>
                    <h3 style={{ fontSize: "0.92rem", fontWeight: "800" }}>
                      Bio-Rhythm, Time Architecture &amp; Reflection (Health + Planner + Journal)
                    </h3>
                  </div>
                </div>

                <div className="wf-nodes-row">
                  <Link href="/health" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "700" }}>
                      MORNING &amp; ALL DAY
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>🫀 Health OS (/health)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Log sleep, water, energy, macros &amp; workouts to compute your Daily Readiness Score and Overview vitals.
                    </span>
                  </Link>

                  <Link href="/planner" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "700" }}>
                      TIME BLOCKING
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>📅 Planner &amp; Countdowns</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Schedule weekly time slots in Planner and track D-Day deadlines in Countdowns—both feed your Overview.
                    </span>
                  </Link>

                  <Link href="/journal" className="wf-node-box">
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#a855f7", fontWeight: "700" }}>
                      EVENING SHUTDOWN
                    </span>
                    <span style={{ fontSize: "0.88rem", fontWeight: "800" }}>📓 Daily Journal (/journal)</span>
                    <span style={{ fontSize: "0.73rem", color: "var(--muted)" }}>
                      Synthesize daily takeaways and reflections into a permanent, searchable logbook with streak tracking.
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WHERE TO START (QUICK-START PATHS) */}
          {activeTab === "quickstart" && (
            <div className="wf-steps-grid">
              <div className="wf-step-card next-up">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: "800" }}>
                    FASTEST WAY TO START (60 SECONDS)
                  </span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800" }}>
                    🚀 Run the 12-Week Year Setup Wizard
                  </h3>
                  <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: "1.45" }}>
                    New to Kasion Life? The Setup Wizard pre-populates your entire connected workspace in one click:
                    a 12-Week Goal, linked Daily Habits, Baseline Health Vitals, a Milestone Countdown, a Starter Project,
                    a Week 1 Task List, and Today&apos;s Focus Block.
                  </p>
                </div>
                <Link
                  href="/onboarding"
                  style={{
                    textAlign: "center",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.65rem",
                    backgroundColor: "var(--accent)",
                    color: "#ffffff",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    textDecoration: "none",
                  }}
                >
                  Launch 12-Week Setup Wizard →
                </Link>
              </div>

              <div className="wf-step-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#10b981", fontWeight: "800" }}>
                    FOR DEEP WORK &amp; EXECUTION
                  </span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800" }}>
                    ⚡ Set Up Your Task-to-Pomodoro Loop
                  </h3>
                  <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: "1.45" }}>
                    1. Create a workspace in <strong>Projects</strong>.<br />
                    2. Add a <strong>List</strong> inside that project and add 3 <strong>Tasks</strong>.<br />
                    3. Open <strong>Focus Space</strong>, pick one of those tasks from the dropdown, and start a 25-minute timer.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href="/projects"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.65rem",
                      backgroundColor: "var(--muted-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    1. Projects →
                  </Link>
                  <Link
                    href="/focus"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.65rem",
                      backgroundColor: "var(--muted-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    2. Focus Timer →
                  </Link>
                </div>
              </div>

              <div className="wf-step-card">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "#a855f7", fontWeight: "800" }}>
                    FOR DAILY HABITS &amp; BIO-TRACKING
                  </span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800" }}>
                    🫀 Calibrate Health, Habits &amp; Reflection
                  </h3>
                  <p style={{ fontSize: "0.76rem", color: "var(--muted)", lineHeight: "1.45" }}>
                    1. Log sleep, water &amp; energy in <strong>Health OS</strong>.<br />
                    2. Check off your recurring routines in <strong>Habit Tracker</strong>.<br />
                    3. End the day by recording wins in <strong>Daily Journal</strong>.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href="/health"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.65rem",
                      backgroundColor: "var(--muted-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    1. Health OS →
                  </Link>
                  <Link
                    href="/journal"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "0.65rem",
                      backgroundColor: "var(--muted-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    2. Journal →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
