"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { completeOnboarding, OnboardingHabitInput } from "@/app/actions/onboarding";

interface FocusTrack {
  id: string;
  badge: string;
  title: string;
  goalTitle: string;
  goalDescription: string;
  milestoneTitle: string;
  recommendedHabits: string[];
}

const FOCUS_TRACKS: FocusTrack[] = [
  {
    id: "maker",
    badge: "🚀 Maker & Founder",
    title: "Ship a Product or SaaS",
    goalTitle: "Launch & monetize flagship product in 12 weeks",
    goalDescription: "Execute daily deep work sprints, ship core features weekly, and validate with real users.",
    milestoneTitle: "12-Week Product Launch Day",
    recommendedHabits: ["Deep Work Sprint (90m)", "Ship 1 Code Commit / Deliverable", "Hydration Target (8 glasses)", "Evening Reflection Log"],
  },
  {
    id: "vitality",
    badge: "💪 Peak Vitality",
    title: "Physical & Mental Fitness",
    goalTitle: "Achieve peak energy, strength, and sleep consistency",
    goalDescription: "Prioritize morning movement, optimal hydration, and restorative sleep every single day.",
    milestoneTitle: "12-Week Vitality Checkpoint",
    recommendedHabits: ["Morning Strength / Mobility", "Hydration Target (8 glasses)", "Zero Screens 1h Before Bed", "Evening Reflection Log"],
  },
  {
    id: "mastery",
    badge: "🧠 Deep Mastery",
    title: "Deep Work & Skill Mastery",
    goalTitle: "Complete 100 hours of deliberate practice & study",
    goalDescription: "Eliminate distractions, time-block study sessions, and synthesize daily learnings.",
    milestoneTitle: "12-Week Mastery Milestone",
    recommendedHabits: ["Deep Work Sprint (90m)", "Read 20 Pages", "Hydration Target (8 glasses)", "Evening Reflection Log"],
  },
  {
    id: "custom",
    badge: "✨ Custom Blueprint",
    title: "Design Your Own 12-Week Year",
    goalTitle: "Execute my top 12-Week Year priority",
    goalDescription: "Stay consistent with daily habits and track weekly execution scores.",
    milestoneTitle: "12-Week Year Finale",
    recommendedHabits: ["Deep Work Sprint (90m)", "Hydration Target (8 glasses)", "Evening Reflection Log"],
  },
];

const STARTER_HABITS_CATALOG: OnboardingHabitInput[] = [
  {
    title: "Deep Work Sprint (90m)",
    type: "BOOLEAN",
    dailyTarget: null,
    routine: "MORNING",
  },
  {
    title: "Hydration Target (8 glasses)",
    type: "NUMERIC",
    dailyTarget: 8,
    routine: "ANYTIME",
  },
  {
    title: "Morning Strength / Mobility",
    type: "BOOLEAN",
    dailyTarget: null,
    routine: "MORNING",
  },
  {
    title: "Ship 1 Code Commit / Deliverable",
    type: "BOOLEAN",
    dailyTarget: null,
    routine: "AFTERNOON",
  },
  {
    title: "Read 20 Pages",
    type: "NUMERIC",
    dailyTarget: 20,
    routine: "EVENING",
  },
  {
    title: "Zero Screens 1h Before Bed",
    type: "BOOLEAN",
    dailyTarget: null,
    routine: "EVENING",
  },
  {
    title: "Evening Reflection Log",
    type: "BOOLEAN",
    dailyTarget: null,
    routine: "EVENING",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTrackId, setSelectedTrackId] = useState<string>("maker");
  const [goalTitle, setGoalTitle] = useState<string>(FOCUS_TRACKS[0].goalTitle);
  const [goalDescription, setGoalDescription] = useState<string>(FOCUS_TRACKS[0].goalDescription);

  const [habitsCatalog, setHabitsCatalog] = useState<OnboardingHabitInput[]>(STARTER_HABITS_CATALOG);
  const [selectedHabitTitles, setSelectedHabitTitles] = useState<string[]>(
    FOCUS_TRACKS[0].recommendedHabits
  );
  const [customHabitTitle, setCustomHabitTitle] = useState<string>("");
  const [customHabitRoutine, setCustomHabitRoutine] = useState<"MORNING" | "AFTERNOON" | "EVENING" | "ANYTIME">("MORNING");

  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [waterIntake, setWaterIntake] = useState<number>(3);
  const [energyLevel, setEnergyLevel] = useState<number>(8);
  const [milestoneTitle, setMilestoneTitle] = useState<string>(FOCUS_TRACKS[0].milestoneTitle);
  const [milestoneDays, setMilestoneDays] = useState<number>(84);
  const [createStarterProject, setCreateStarterProject] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectTrack = (track: FocusTrack) => {
    setSelectedTrackId(track.id);
    setGoalTitle(track.goalTitle);
    setGoalDescription(track.goalDescription);
    setMilestoneTitle(track.milestoneTitle);
    setSelectedHabitTitles(track.recommendedHabits);
  };

  const toggleHabitSelection = (title: string) => {
    setSelectedHabitTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleAddCustomHabit = () => {
    const trimmed = customHabitTitle.trim();
    if (!trimmed) return;
    if (!habitsCatalog.some((h) => h.title.toLowerCase() === trimmed.toLowerCase())) {
      setHabitsCatalog((prev) => [
        ...prev,
        {
          title: trimmed,
          type: "BOOLEAN",
          dailyTarget: null,
          routine: customHabitRoutine,
        },
      ]);
    }
    if (!selectedHabitTitles.includes(trimmed)) {
      setSelectedHabitTitles((prev) => [...prev, trimmed]);
    }
    setCustomHabitTitle("");
  };

  const handleFinishOnboarding = () => {
    setError(null);
    const chosenHabits = habitsCatalog.filter((h) => selectedHabitTitles.includes(h.title));

    startTransition(async () => {
      const result = await completeOnboarding({
        goalTitle,
        goalDescription,
        habits: chosenHabits,
        sleepHours,
        waterIntake,
        energyLevel,
        milestoneTitle,
        milestoneDaysFromNow: milestoneDays,
        createStarterProject,
      });

      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div
      className="login-page-container"
      style={{
        height: "100vh",
        overflowY: "auto",
        alignItems: "flex-start",
        padding: "2.5rem 1.25rem",
      }}
    >
      <div className="login-glow" />
      <div className="login-glow-bottom" />

      <div
        className="glass-panel animate-fade-in"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "680px",
          margin: "auto",
          padding: "2.25rem",
          borderRadius: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Top Bar: Brand + Step Progress + Skip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div className="logo-container">
              <span style={{ fontSize: "0.875rem", fontWeight: "bold", color: "#ffffff" }}>K</span>
            </div>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: "800", letterSpacing: "0.03em" }}>
                WORKSPACE ONBOARDING
              </div>
              <div style={{ fontSize: "0.725rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                STEP {step} OF 3 • 12-WEEK YEAR SETUP
              </div>
            </div>
          </div>

          <Link
            href="/"
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              textDecoration: "none",
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--muted-bg)",
              fontWeight: "600",
            }}
          >
            Skip to Blank Dashboard →
          </Link>
        </div>

        {/* Progress Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {[
            { num: 1, label: "1. 12-Week Goal" },
            { num: 2, label: "2. Daily Habits" },
            { num: 3, label: "3. Vitals & Launch" },
          ].map((item) => {
            const active = step >= item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => setStep(item.num as 1 | 2 | 3)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    height: "5px",
                    width: "100%",
                    borderRadius: "999px",
                    backgroundColor: active ? "var(--accent)" : "var(--border)",
                    transition: "background-color 0.25s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: active ? "700" : "500",
                    color: active ? "var(--foreground)" : "var(--muted)",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Choose Focus Track & 12-Week Goal */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                What is your primary 12-Week focus?
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Pick a template to pre-configure your 12-Week Year goal and recommended daily habits, or customize below.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "0.875rem",
              }}
            >
              {FOCUS_TRACKS.map((track) => {
                const isSelected = selectedTrackId === track.id;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleSelectTrack(track)}
                    style={{
                      textAlign: "left",
                      padding: "1rem 1.125rem",
                      borderRadius: "1rem",
                      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--muted-bg)",
                      border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        color: isSelected ? "var(--accent)" : "var(--muted)",
                        fontWeight: "700",
                      }}
                    >
                      {track.badge}
                    </span>
                    <span style={{ fontSize: "0.95rem", fontWeight: "700" }}>{track.title}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: "1.35" }}>
                      {track.goalTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "0.5rem" }}>
              <div className="login-form-group">
                <label className="login-label" htmlFor="goalTitle">
                  Your 12-Week Goal Headline
                </label>
                <input
                  id="goalTitle"
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="login-input"
                  placeholder="e.g. Launch my SaaS to 100 paying users"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label" htmlFor="goalDescription">
                  Why this matters (Execution Strategy)
                </label>
                <input
                  id="goalDescription"
                  type="text"
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  className="login-input"
                  placeholder="Describe your 12-week execution focus..."
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="login-btn"
                style={{ width: "auto", padding: "0.75rem 1.75rem" }}
              >
                Next: Select Daily Habits →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Starter Habits */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Build your daily habit stack
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Selected habits automatically link to your 12-Week Year execution score and 365-day heatmap.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {habitsCatalog.map((habit) => {
                const isSelected = selectedHabitTitles.includes(habit.title);
                return (
                  <button
                    key={habit.title}
                    type="button"
                    onClick={() => toggleHabitSelection(habit.title)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.875rem 1rem",
                      borderRadius: "0.875rem",
                      backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "var(--muted-bg)",
                      border: isSelected ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "6px",
                          backgroundColor: isSelected ? "var(--accent)" : "transparent",
                          border: isSelected ? "none" : "1.5px solid var(--muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: "800",
                        }}
                      >
                        {isSelected ? "✓" : ""}
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{habit.title}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {habit.type === "NUMERIC" && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontFamily: "var(--font-mono)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "0.375rem",
                            backgroundColor: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            fontWeight: "700",
                          }}
                        >
                          TARGET: {habit.dailyTarget}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontFamily: "var(--font-mono)",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.375rem",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          color: "var(--muted)",
                        }}
                      >
                        {habit.routine}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Habit inline */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                flexWrap: "wrap",
                padding: "0.875rem",
                borderRadius: "0.875rem",
                border: "1px dashed var(--border)",
              }}
            >
              <input
                type="text"
                value={customHabitTitle}
                onChange={(e) => setCustomHabitTitle(e.target.value)}
                placeholder="Add a custom daily habit..."
                className="login-input"
                style={{ flex: 1, minWidth: "180px", padding: "0.55rem 0.875rem" }}
              />
              <select
                value={customHabitRoutine}
                onChange={(e) => setCustomHabitRoutine(e.target.value as any)}
                className="login-input"
                style={{ width: "auto", padding: "0.55rem 0.75rem" }}
              >
                <option value="MORNING">Morning</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="EVENING">Evening</option>
                <option value="ANYTIME">Anytime</option>
              </select>
              <button
                type="button"
                onClick={handleAddCustomHabit}
                style={{
                  padding: "0.55rem 1rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "var(--muted-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="login-btn"
                style={{ width: "auto", padding: "0.75rem 1.75rem" }}
              >
                Next: Baseline Vitals →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Baseline Vitals & Launchpad */}
        {step === 3 && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Calibrate today&apos;s vitals &amp; launchpad
              </h1>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Seed your initial health metrics, milestone countdown, and first deep work task list.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="login-form-group">
                <label className="login-label" htmlFor="sleepHours">
                  😴 Last Night&apos;s Sleep (hrs)
                </label>
                <input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value) || 0)}
                  className="login-input"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label" htmlFor="waterIntake">
                  💧 Water Logged Today (glasses)
                </label>
                <input
                  id="waterIntake"
                  type="number"
                  min="0"
                  max="30"
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(parseInt(e.target.value, 10) || 0)}
                  className="login-input"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label" htmlFor="energyLevel">
                  ⚡ Current Energy (1-10)
                </label>
                <input
                  id="energyLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10) || 5)}
                  className="login-input"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="login-form-group">
                <label className="login-label" htmlFor="milestoneTitle">
                  🎯 First Milestone Countdown
                </label>
                <input
                  id="milestoneTitle"
                  type="text"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="login-input"
                  placeholder="e.g. 12-Week Product Launch"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label" htmlFor="milestoneDays">
                  Days Until Target
                </label>
                <input
                  id="milestoneDays"
                  type="number"
                  min="1"
                  max="365"
                  value={milestoneDays}
                  onChange={(e) => setMilestoneDays(parseInt(e.target.value, 10) || 84)}
                  className="login-input"
                />
              </div>
            </div>

            {/* Starter Project Checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "1rem",
                borderRadius: "0.875rem",
                backgroundColor: "var(--muted-bg)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={createStarterProject}
                onChange={(e) => setCreateStarterProject(e.target.checked)}
                style={{ marginTop: "0.2rem", accentColor: "var(--accent)", width: "16px", height: "16px" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "700" }}>
                  Generate Starter Project, Action List &amp; Today&apos;s Focus Block
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  Pre-populates a Week 1 Todo list for your Pomodoro Focus Timer and schedules a 1-hour kickoff block on your Planner today.
                </span>
              </div>
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isPending}
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinishOnboarding}
                disabled={isPending}
                className="login-btn"
                style={{ width: "auto", padding: "0.75rem 2rem" }}
              >
                {isPending ? "Initializing Personal OS..." : "Launch My Dashboard 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
