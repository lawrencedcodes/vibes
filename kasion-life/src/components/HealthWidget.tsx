"use client";

import React, { useState, useEffect, useTransition } from "react";
import { updateHealthLog, HealthLogUpdatePayload } from "@/app/actions/health";

export interface SerializedHealthLog {
  id: string;
  date: string;
  sleepHours: number;
  sleepQuality: number;
  waterIntake: number;
  energyLevel: number;
  steps: number;
  workoutMinutes: number;
  workoutType: string;
  mood: string;
  stressLevel: number;
  calories: number;
  proteinGrams: number;
  caffeineCups: number;
  weightLbs: number | null;
  restingHeartRate: number | null;
  mindfulnessMinutes: number;
  sunlightMinutes: number;
  supplementsTaken: string;
  notes: string;
}

interface HealthWidgetProps {
  initialTodayLog: SerializedHealthLog;
  initialHistoryLogs: SerializedHealthLog[];
}

const WORKOUT_TYPES = [
  { id: "NONE", label: "Rest / None", icon: "🛌" },
  { id: "STRENGTH", label: "Strength", icon: "🏋️" },
  { id: "CARDIO", label: "Cardio / Run", icon: "🏃" },
  { id: "HIIT", label: "HIIT", icon: "🔥" },
  { id: "YOGA", label: "Yoga / Mobility", icon: "🧘" },
  { id: "CYCLING", label: "Cycling", icon: "🚴" },
  { id: "WALK", label: "Brisk Walk", icon: "🚶" },
  { id: "SPORTS", label: "Sports", icon: "🎾" },
];

const MOOD_OPTIONS = [
  { id: "ENERGIZED", label: "Energized", icon: "⚡" },
  { id: "FOCUSED", label: "Focused", icon: "🎯" },
  { id: "CALM", label: "Calm", icon: "🌿" },
  { id: "GRATEFUL", label: "Grateful", icon: "✨" },
  { id: "TIRED", label: "Tired", icon: "🌙" },
  { id: "STRESSED", label: "Overloaded", icon: "🌊" },
];

const SUPPLEMENT_OPTIONS = [
  "Multivitamin",
  "Vitamin D3",
  "Omega-3",
  "Creatine (5g)",
  "Magnesium",
  "Electrolytes",
  "Probiotics",
  "Cold Exposure",
];

const SLEEP_QUALITY_LABELS: Record<number, string> = {
  1: "Restless",
  2: "Light",
  3: "Fair",
  4: "Restorative",
  5: "Deep Recovery",
};

export function computeWellnessScore(log: {
  sleepHours: number;
  sleepQuality: number;
  waterIntake: number;
  energyLevel: number;
  steps: number;
  workoutMinutes: number;
  stressLevel: number;
  mindfulnessMinutes: number;
  sunlightMinutes: number;
}): number {
  const sleepDurationScore = Math.min(18, (log.sleepHours / 8) * 18);
  const sleepQualityScore = (log.sleepQuality / 5) * 7;
  const waterScore = Math.min(15, (log.waterIntake / 8) * 15);
  const energyScore = (log.energyLevel / 10) * 12;
  const stressPenalty = Math.max(0, 8 - ((log.stressLevel - 1) / 9) * 8);
  const stepsScore = Math.min(13, (log.steps / 10000) * 13);
  const workoutScore = Math.min(12, (log.workoutMinutes / 30) * 12);
  const mindScore = Math.min(8, (log.mindfulnessMinutes / 10) * 8);
  const sunScore = Math.min(7, (log.sunlightMinutes / 15) * 7);

  return Math.round(
    Math.min(
      100,
      sleepDurationScore +
        sleepQualityScore +
        waterScore +
        energyScore +
        stressPenalty +
        stepsScore +
        workoutScore +
        mindScore +
        sunScore
    )
  );
}

export default function HealthWidget({
  initialTodayLog,
  initialHistoryLogs = [],
}: HealthWidgetProps) {
  const [activeLog, setActiveLog] = useState<SerializedHealthLog>(initialTodayLog);
  const [historyLogs, setHistoryLogs] = useState<SerializedHealthLog[]>(initialHistoryLogs);
  const [isPending, startTransition] = useTransition();
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Box breathing interactive coach state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(60);
  const [breathingPhase, setBreathingPhase] = useState<
    "Inhale (4s)" | "Hold (4s)" | "Exhale (4s)" | "Hold Empty (4s)"
  >("Inhale (4s)");

  // Sync changes to database and update local history list
  const persistChange = (patch: HealthLogUpdatePayload) => {
    const nextState: SerializedHealthLog = {
      ...activeLog,
      ...(patch.sleepHours !== undefined && { sleepHours: patch.sleepHours }),
      ...(patch.sleepQuality !== undefined && { sleepQuality: patch.sleepQuality }),
      ...(patch.waterIntake !== undefined && { waterIntake: patch.waterIntake }),
      ...(patch.energyLevel !== undefined && { energyLevel: patch.energyLevel }),
      ...(patch.steps !== undefined && { steps: patch.steps }),
      ...(patch.workoutMinutes !== undefined && { workoutMinutes: patch.workoutMinutes }),
      ...(patch.workoutType !== undefined && { workoutType: patch.workoutType }),
      ...(patch.mood !== undefined && { mood: patch.mood }),
      ...(patch.stressLevel !== undefined && { stressLevel: patch.stressLevel }),
      ...(patch.calories !== undefined && { calories: patch.calories }),
      ...(patch.proteinGrams !== undefined && { proteinGrams: patch.proteinGrams }),
      ...(patch.caffeineCups !== undefined && { caffeineCups: patch.caffeineCups }),
      ...(patch.weightLbs !== undefined && { weightLbs: patch.weightLbs }),
      ...(patch.restingHeartRate !== undefined && { restingHeartRate: patch.restingHeartRate }),
      ...(patch.mindfulnessMinutes !== undefined && { mindfulnessMinutes: patch.mindfulnessMinutes }),
      ...(patch.sunlightMinutes !== undefined && { sunlightMinutes: patch.sunlightMinutes }),
      ...(patch.supplementsTaken !== undefined && { supplementsTaken: patch.supplementsTaken }),
      ...(patch.notes !== undefined && { notes: patch.notes }),
    };

    setActiveLog(nextState);

    startTransition(async () => {
      try {
        const saved = await updateHealthLog({
          ...patch,
          dateIso: activeLog.date,
        });
        setHistoryLogs((prev) => {
          const exists = prev.some(
            (l) => l.date.slice(0, 10) === saved.date.slice(0, 10)
          );
          if (exists) {
            return prev.map((l) =>
              l.date.slice(0, 10) === saved.date.slice(0, 10) ? saved : l
            );
          }
          return [saved, ...prev];
        });
        setLastSavedTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })
        );
      } catch (err) {
        console.error("Failed to save health metric:", err);
      }
    });
  };

  // 60-second Box Breathing Timer Effect
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingSecondsLeft((prev) => {
        if (prev <= 1) {
          setBreathingActive(false);
          const nextMindfulness = activeLog.mindfulnessMinutes + 1;
          persistChange({ mindfulnessMinutes: nextMindfulness });
          return 60;
        }
        const elapsed = 60 - (prev - 1);
        const cycleSec = elapsed % 16;
        if (cycleSec < 4) setBreathingPhase("Inhale (4s)");
        else if (cycleSec < 8) setBreathingPhase("Hold (4s)");
        else if (cycleSec < 12) setBreathingPhase("Exhale (4s)");
        else setBreathingPhase("Hold Empty (4s)");
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, activeLog.mindfulnessMinutes]);

  const supplementsArray = activeLog.supplementsTaken
    ? activeLog.supplementsTaken.split(",").filter(Boolean)
    : [];

  const toggleSupplement = (name: string) => {
    const next = supplementsArray.includes(name)
      ? supplementsArray.filter((item) => item !== name)
      : [...supplementsArray, name];
    persistChange({ supplementsTaken: next.join(",") });
  };

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return "Exhausted";
    if (level <= 4) return "Low Energy";
    if (level <= 6) return "Balanced";
    if (level <= 8) return "High Energy";
    return "Peak Performance";
  };

  const getStressLabel = (level: number) => {
    if (level <= 2) return "Deeply Relaxed";
    if (level <= 4) return "Low Stress";
    if (level <= 6) return "Moderate Load";
    if (level <= 8) return "Elevated Stress";
    return "High Burnout Risk";
  };

  const getRhrZone = (bpm: number | null) => {
    if (!bpm) return "Not logged";
    if (bpm < 55) return "Athletic Recovery";
    if (bpm <= 65) return "Optimal Baseline";
    if (bpm <= 75) return "Normal Range";
    return "Elevated (Prioritize Rest)";
  };

  const wellnessScore = computeWellnessScore(activeLog);
  const recommendedProtein = activeLog.weightLbs
    ? Math.round(activeLog.weightLbs * 0.8)
    : 130;

  // Compute 7-day rolling averages
  const recentLogs = historyLogs.slice(0, 7);
  const avgSleep =
    recentLogs.length > 0
      ? (
          recentLogs.reduce((acc, l) => acc + l.sleepHours, 0) / recentLogs.length
        ).toFixed(1)
      : activeLog.sleepHours.toFixed(1);
  const avgWater =
    recentLogs.length > 0
      ? (
          recentLogs.reduce((acc, l) => acc + l.waterIntake, 0) / recentLogs.length
        ).toFixed(1)
      : String(activeLog.waterIntake);
  const avgSteps =
    recentLogs.length > 0
      ? Math.round(
          recentLogs.reduce((acc, l) => acc + l.steps, 0) / recentLogs.length
        )
      : activeLog.steps;
  const totalWeeklyWorkoutMins = recentLogs.reduce(
    (acc, l) => acc + l.workoutMinutes,
    0
  );
  const avgWellnessScore =
    recentLogs.length > 0
      ? Math.round(
          recentLogs.reduce((acc, l) => acc + computeWellnessScore(l), 0) /
            recentLogs.length
        )
      : wellnessScore;

  const formatDateDisplay = (isoStr: string) => {
    const d = new Date(isoStr);
    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    const formatted = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return isToday ? `Today (${formatted})` : formatted;
  };

  const energyProgressPct = ((activeLog.energyLevel - 1) / 9) * 100;
  const stressProgressPct = ((activeLog.stressLevel - 1) / 9) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", inlineSize: "100%" }}>
      <style>{`
        .health-bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          inline-size: 100%;
        }
        @media (min-width: 860px) {
          .health-bento-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .health-subcard-pair {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
          gap: 1rem;
          inline-size: 100%;
        }
        .health-metric-box {
          min-inline-size: 0;
          padding: 1rem 1.15rem;
          border-radius: 0.875rem;
          background-color: var(--muted-bg);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .health-stepper-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          inline-size: 100%;
        }
        .health-pill-row {
          display: flex;
          flex-wrap: wrap;
          flex-wrap: balance;
          gap: 0.5rem;
        }
        .health-round-btn {
          flex-shrink: 0;
          inline-size: 36px;
          block-size: 36px;
          border-radius: 0.65rem;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--foreground);
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .health-round-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        /* Brand-Consistent Range Sliders (WebKit and Firefox declared separately) */
        input[type="range"].wellness-slider {
          --slider-track-size: 0.45rem;
          --slider-thumb-size: 1.15rem;
          --slider-track-radius: 999px;
          --slider-thumb-radius: 50%;
          --slider-track-color: rgba(255, 255, 255, 0.12);
          --slider-fill-color: var(--accent);
          --slider-thumb-color: var(--slider-fill-color);
          --slider-direction: to right;
          appearance: none;
          inline-size: 100%;
          block-size: 2rem;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          accent-color: var(--accent);
        }
        input[type="range"].wellness-slider:dir(rtl) {
          --slider-direction: to left;
        }
        input[type="range"].wellness-slider:focus-visible {
          outline: 2px solid var(--slider-fill-color);
          outline-offset: 4px;
        }
        input[type="range"].wellness-slider::-webkit-slider-runnable-track {
          block-size: var(--slider-track-size);
          border: 0;
          border-radius: var(--slider-track-radius);
          background: linear-gradient(
            var(--slider-direction),
            var(--slider-fill-color) var(--slider-progress, 50%),
            var(--slider-track-color) var(--slider-progress, 50%)
          );
        }
        input[type="range"].wellness-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          inline-size: var(--slider-thumb-size);
          block-size: var(--slider-thumb-size);
          margin-block-start: calc((var(--slider-track-size) - var(--slider-thumb-size)) / 2);
          border: 0;
          border-radius: var(--slider-thumb-radius);
          background: var(--slider-thumb-color);
        }
        input[type="range"].wellness-slider::-moz-range-track {
          block-size: var(--slider-track-size);
          border: 0;
          border-radius: var(--slider-track-radius);
          background: var(--slider-track-color);
        }
        input[type="range"].wellness-slider::-moz-range-progress {
          block-size: var(--slider-track-size);
          border-radius: var(--slider-track-radius);
          background: var(--slider-fill-color);
        }
        input[type="range"].wellness-slider::-moz-range-thumb {
          inline-size: var(--slider-thumb-size);
          block-size: var(--slider-thumb-size);
          border: 0;
          border-radius: var(--slider-thumb-radius);
          background: var(--slider-thumb-color);
        }
      `}</style>

      {/* Top Status & Active Date Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "safe center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--foreground)" }}>
            Logging Date: {formatDateDisplay(activeLog.date)}
          </span>
          {activeLog.date.slice(0, 10) !== initialTodayLog.date.slice(0, 10) && (
            <button
              type="button"
              onClick={() => setActiveLog(initialTodayLog)}
              style={{
                padding: "0.25rem 0.65rem",
                borderRadius: "999px",
                border: "1px solid var(--accent)",
                backgroundColor: "rgba(99, 102, 241, 0.14)",
                color: "var(--accent)",
                fontSize: "0.725rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Return to Today →
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "700",
              fontFamily: "var(--font-mono)",
              color: isPending ? "var(--accent)" : "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {isPending
              ? "Syncing Biometrics..."
              : lastSavedTime
              ? `Synced at ${lastSavedTime}`
              : "All Vitals Synced"}
          </span>
          <div
            style={{
              blockSize: "8px",
              inlineSize: "8px",
              borderRadius: "50%",
              backgroundColor: isPending ? "var(--accent)" : "#10b981",
              animation: isPending ? "pulse-animation 1.5s infinite" : "none",
            }}
          />
        </div>
      </div>

      {/* FEATURE 1 & 10: Daily Readiness Radial Score + 7-Day Rolling Averages Banner */}
      <div
        className="glass-panel"
        style={{
          padding: "1.75rem",
          borderRadius: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          backgroundColor: "var(--card-bg)",
        }}
      >
        {/* Top Row: Readiness Score Gauge + Explanation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="112"
              height="112"
              viewBox="0 0 120 120"
              style={{ transform: "rotate(-90deg)", display: "block" }}
            >
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="transparent"
                stroke="rgba(129, 140, 248, 0.14)"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="transparent"
                stroke={
                  wellnessScore >= 80
                    ? "#10b981"
                    : wellnessScore >= 55
                    ? "var(--accent)"
                    : "#f59e0b"
                }
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={
                  2 * Math.PI * 48 - (wellnessScore / 100) * 2 * Math.PI * 48
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "1.55rem",
                  fontWeight: "900",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {wellnessScore}
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Readiness
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              flex: "1 1 260px",
              minInlineSize: 0,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                color: "var(--accent)",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              Composite Biometric Index
            </span>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>
              {wellnessScore >= 80
                ? "Peak Daily Readiness"
                : wellnessScore >= 60
                ? "Solid Recovery Baseline"
                : "Recovery & Hydration Needed"}
            </h2>
            <p
              style={{
                fontSize: "0.825rem",
                color: "var(--muted)",
                lineHeight: "1.5",
              }}
            >
              Calculated live from your sleep duration &amp; quality, hydration, movement, stress load, and recovery habits.
            </p>
          </div>
        </div>

        {/* Bottom Row: 7-Day Rolling Averages Strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderRadius: "1rem",
            backgroundColor: "var(--muted-bg)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              7d Avg Score
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {avgWellnessScore}/100
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              7d Avg Sleep
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {avgSleep} hrs
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              7d Avg Water
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {avgWater} gl
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              7d Avg Steps
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
              {avgSteps.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              7d Exercise
            </div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-mono)", marginTop: "0.2rem", color: "#10b981" }}>
              {totalWeeklyWorkoutMins} mins
            </div>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN BENTO GRID OF HEALTH MODULES */}
      <div className="health-bento-grid">
        {/* CARD 1: Hydration & Sleep Architecture (Duration + Sleep Quality Rating) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.25rem",
            minInlineSize: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
              1. Hydration &amp; Sleep Architecture
            </span>
            <span style={{ fontSize: "0.725rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Target: 8 gl • 8 hrs
            </span>
          </div>

          <div className="health-subcard-pair">
            {/* Water Intake Control Box */}
            <div className="health-metric-box">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                  💧 Water Intake
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                  {Math.min(100, Math.round((activeLog.waterIntake / 8) * 100))}%
                </span>
              </div>

              <div className="health-stepper-row">
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      waterIntake: Math.max(0, activeLog.waterIntake - 1),
                    })
                  }
                  className="health-round-btn"
                  aria-label="Decrease water intake"
                >
                  −
                </button>
                <div style={{ textAlign: "center", minInlineSize: 0 }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: "900", fontFamily: "var(--font-mono)", lineHeight: "1.1" }}>
                    {activeLog.waterIntake}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                    {activeLog.waterIntake === 1 ? "glass" : "glasses"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    persistChange({ waterIntake: activeLog.waterIntake + 1 })
                  }
                  className="health-round-btn"
                  aria-label="Increase water intake"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sleep Duration Control Box */}
            <div className="health-metric-box">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                  😴 Sleep Hours
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                  {Math.min(100, Math.round((activeLog.sleepHours / 8) * 100))}%
                </span>
              </div>

              <div className="health-stepper-row">
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      sleepHours: Math.max(0, activeLog.sleepHours - 0.5),
                    })
                  }
                  className="health-round-btn"
                  aria-label="Decrease sleep hours"
                >
                  −
                </button>
                <div style={{ textAlign: "center", minInlineSize: 0 }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: "900", fontFamily: "var(--font-mono)", lineHeight: "1.1" }}>
                    {activeLog.sleepHours}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                    hours
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      sleepHours: Math.min(24, activeLog.sleepHours + 0.5),
                    })
                  }
                  className="health-round-btn"
                  aria-label="Increase sleep hours"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Feature 2: Sleep Quality 1-5 Rating */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
                Sleep Quality Rating
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {activeLog.sleepQuality}/5 • {SLEEP_QUALITY_LABELS[activeLog.sleepQuality] || "Fair"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "0.4rem" }}>
              {[1, 2, 3, 4, 5].map((rating) => {
                const selected = activeLog.sleepQuality === rating;
                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => persistChange({ sleepQuality: rating })}
                    style={{
                      padding: "0.45rem 0.2rem",
                      borderRadius: "0.5rem",
                      border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: selected ? "rgba(99, 102, 241, 0.16)" : "var(--muted-bg)",
                      color: selected ? "var(--accent)" : "var(--foreground)",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {rating}★
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 2: Daily Steps & Active Workout Logger (Features 3 & 4) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.25rem",
            minInlineSize: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
              2. Movement, Steps &amp; Exercise
            </span>
            <span style={{ fontSize: "0.725rem", color: "#10b981", fontFamily: "var(--font-mono)", fontWeight: "700" }}>
              {Math.min(100, Math.round((activeLog.steps / 10000) * 100))}% Step Goal
            </span>
          </div>

          {/* Daily Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <span style={{ fontSize: "1.65rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                  {activeLog.steps.toLocaleString()}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginLeft: "0.4rem" }}>
                  / 10,000 steps
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <button
                  type="button"
                  onClick={() => persistChange({ steps: Math.max(0, activeLog.steps - 1000) })}
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--muted-bg)",
                    color: "var(--foreground)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  −1k
                </button>
                <button
                  type="button"
                  onClick={() => persistChange({ steps: activeLog.steps + 1000 })}
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--muted-bg)",
                    color: "var(--foreground)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  +1k
                </button>
                <button
                  type="button"
                  onClick={() => persistChange({ steps: activeLog.steps + 2500 })}
                  style={{
                    padding: "0.35rem 0.65rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--accent)",
                    backgroundColor: "rgba(99, 102, 241, 0.14)",
                    color: "var(--accent)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  +2.5k
                </button>
              </div>
            </div>

            <div style={{ inlineSize: "100%", blockSize: "6px", backgroundColor: "var(--muted-bg)", borderRadius: "999px", overflow: "hidden" }}>
              <div
                style={{
                  inlineSize: `${Math.min(100, (activeLog.steps / 10000) * 100)}%`,
                  blockSize: "100%",
                  backgroundColor: "#10b981",
                  transition: "inline-size 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Workout Minutes & Modality */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
                Active Exercise Duration
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => persistChange({ workoutMinutes: Math.max(0, activeLog.workoutMinutes - 10) })}
                  className="health-round-btn"
                  style={{ inlineSize: "30px", blockSize: "30px", fontSize: "0.95rem" }}
                >
                  −
                </button>
                <span style={{ fontSize: "0.95rem", fontWeight: "800", fontFamily: "var(--font-mono)", minInlineSize: "48px", textAlign: "center" }}>
                  {activeLog.workoutMinutes}m
                </span>
                <button
                  type="button"
                  onClick={() => persistChange({ workoutMinutes: activeLog.workoutMinutes + 15 })}
                  className="health-round-btn"
                  style={{ inlineSize: "30px", blockSize: "30px", fontSize: "0.95rem" }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="health-pill-row">
              {WORKOUT_TYPES.map((w) => {
                const active = activeLog.workoutType === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => persistChange({ workoutType: w.id })}
                    style={{
                      padding: "0.35rem 0.65rem",
                      borderRadius: "0.55rem",
                      border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: active ? "rgba(99, 102, 241, 0.16)" : "var(--muted-bg)",
                      color: active ? "var(--accent)" : "var(--foreground)",
                      fontSize: "0.725rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>{w.icon}</span>
                    <span>{w.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 3: Energy, Mood & Stress Load (Feature 5) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.25rem",
            minInlineSize: 0,
          }}
        >
          <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
            3. Energy, Mood &amp; Stress Load
          </span>

          {/* Energy Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="energy-range-slider" style={{ fontSize: "0.775rem", fontWeight: "600", color: "var(--muted)" }}>
                ⚡ Physical Energy
              </label>
              <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {activeLog.energyLevel}/10 • {getEnergyLabel(activeLog.energyLevel)}
              </span>
            </div>
            <input
              id="energy-range-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={activeLog.energyLevel}
              aria-valuetext={`${activeLog.energyLevel} out of 10, ${getEnergyLabel(activeLog.energyLevel)}`}
              onChange={(e) => setActiveLog({ ...activeLog, energyLevel: parseInt(e.target.value, 10) })}
              onMouseUp={() => persistChange({ energyLevel: activeLog.energyLevel })}
              onTouchEnd={() => persistChange({ energyLevel: activeLog.energyLevel })}
              onKeyUp={() => persistChange({ energyLevel: activeLog.energyLevel })}
              className="wellness-slider"
              style={
                {
                  "--slider-progress": `${energyProgressPct}%`,
                } as React.CSSProperties
              }
            />
          </div>

          {/* Stress Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="stress-range-slider" style={{ fontSize: "0.775rem", fontWeight: "600", color: "var(--muted)" }}>
                🧠 Nervous System Stress
              </label>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  color: activeLog.stressLevel >= 7 ? "#ef4444" : "#10b981",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {activeLog.stressLevel}/10 • {getStressLabel(activeLog.stressLevel)}
              </span>
            </div>
            <input
              id="stress-range-slider"
              type="range"
              min="1"
              max="10"
              step="1"
              value={activeLog.stressLevel}
              aria-valuetext={`${activeLog.stressLevel} out of 10, ${getStressLabel(activeLog.stressLevel)}`}
              onChange={(e) => setActiveLog({ ...activeLog, stressLevel: parseInt(e.target.value, 10) })}
              onMouseUp={() => persistChange({ stressLevel: activeLog.stressLevel })}
              onTouchEnd={() => persistChange({ stressLevel: activeLog.stressLevel })}
              onKeyUp={() => persistChange({ stressLevel: activeLog.stressLevel })}
              className="wellness-slider"
              style={
                {
                  "--slider-progress": `${stressProgressPct}%`,
                  "--slider-fill-color": activeLog.stressLevel >= 7 ? "#ef4444" : "#10b981",
                } as React.CSSProperties
              }
            />
          </div>

          {/* Mood Selector Pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
              Dominant Mental State
            </span>
            <div className="health-pill-row">
              {MOOD_OPTIONS.map((m) => {
                const selected = activeLog.mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => persistChange({ mood: m.id })}
                    style={{
                      padding: "0.35rem 0.65rem",
                      borderRadius: "0.55rem",
                      border: selected ? "1px solid var(--accent)" : "1px solid var(--border)",
                      backgroundColor: selected ? "rgba(99, 102, 241, 0.16)" : "var(--muted-bg)",
                      color: selected ? "var(--accent)" : "var(--foreground)",
                      fontSize: "0.725rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 4: Nutrition, Protein & Caffeine Tracker (Feature 6) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.15rem",
            minInlineSize: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
              4. Nutrition, Protein &amp; Caffeine
            </span>
            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
              Goal: ~{recommendedProtein}g Protein
            </span>
          </div>

          <div className="health-subcard-pair">
            {/* Protein Stepper */}
            <div className="health-metric-box">
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                🥩 Protein (g)
              </span>
              <div style={{ fontSize: "1.55rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                {activeLog.proteinGrams}g
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => persistChange({ proteinGrams: Math.max(0, activeLog.proteinGrams - 15) })}
                  style={{
                    flex: 1,
                    padding: "0.35rem",
                    borderRadius: "0.45rem",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  −15g
                </button>
                <button
                  type="button"
                  onClick={() => persistChange({ proteinGrams: activeLog.proteinGrams + 25 })}
                  style={{
                    flex: 1,
                    padding: "0.35rem",
                    borderRadius: "0.45rem",
                    border: "1px solid var(--accent)",
                    backgroundColor: "rgba(99, 102, 241, 0.14)",
                    color: "var(--accent)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  +25g
                </button>
              </div>
            </div>

            {/* Calories Stepper */}
            <div className="health-metric-box">
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                🔥 Calories (kcal)
              </span>
              <div style={{ fontSize: "1.55rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                {activeLog.calories}
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => persistChange({ calories: Math.max(0, activeLog.calories - 250) })}
                  style={{
                    flex: 1,
                    padding: "0.35rem",
                    borderRadius: "0.45rem",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  −250
                </button>
                <button
                  type="button"
                  onClick={() => persistChange({ calories: activeLog.calories + 400 })}
                  style={{
                    flex: 1,
                    padding: "0.35rem",
                    borderRadius: "0.45rem",
                    border: "1px solid var(--accent)",
                    backgroundColor: "rgba(99, 102, 241, 0.14)",
                    color: "var(--accent)",
                    fontSize: "0.725rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  +400
                </button>
              </div>
            </div>
          </div>

          {/* Caffeine Intake */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              padding: "0.8rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: "var(--muted-bg)",
              border: activeLog.caffeineCups > 3 ? "1px solid rgba(245, 158, 11, 0.45)" : "1px solid var(--border)",
            }}
          >
            <div style={{ minInlineSize: 0 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                ☕ Caffeine Intake ({activeLog.caffeineCups} {activeLog.caffeineCups === 1 ? "cup" : "cups"})
              </div>
              <div style={{ fontSize: "0.7rem", color: activeLog.caffeineCups > 3 ? "#f59e0b" : "var(--muted)" }}>
                {activeLog.caffeineCups > 3
                  ? "⚠️ High caffeine may delay deep sleep onset"
                  : "~95mg per cup • Cut off 8h before sleep"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => persistChange({ caffeineCups: Math.max(0, activeLog.caffeineCups - 1) })}
                className="health-round-btn"
                style={{ inlineSize: "30px", blockSize: "30px", fontSize: "0.95rem" }}
              >
                −
              </button>
              <button
                type="button"
                onClick={() => persistChange({ caffeineCups: activeLog.caffeineCups + 1 })}
                className="health-round-btn"
                style={{ inlineSize: "30px", blockSize: "30px", fontSize: "0.95rem" }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* CARD 5: Body Biometrics & Cardiovascular Recovery (Feature 7) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.15rem",
            minInlineSize: 0,
          }}
        >
          <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
            5. Body Biometrics &amp; Heart Recovery
          </span>

          <div className="health-subcard-pair">
            {/* Weight Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", minInlineSize: 0 }}>
              <label htmlFor="weight-input" style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
                ⚖️ Body Weight (lbs)
              </label>
              <input
                id="weight-input"
                type="number"
                step="0.2"
                min="50"
                max="500"
                placeholder="e.g. 168.5"
                value={activeLog.weightLbs ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? null : parseFloat(e.target.value);
                  setActiveLog({ ...activeLog, weightLbs: val });
                }}
                onBlur={() => persistChange({ weightLbs: activeLog.weightLbs })}
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.65rem",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--muted-bg)",
                  color: "var(--foreground)",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  inlineSize: "100%",
                  minInlineSize: 0,
                }}
              />
            </div>

            {/* Resting Heart Rate Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", minInlineSize: 0 }}>
              <label htmlFor="rhr-input" style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)" }}>
                ❤️ Resting HR (BPM)
              </label>
              <input
                id="rhr-input"
                type="number"
                step="1"
                min="30"
                max="160"
                placeholder="e.g. 58"
                value={activeLog.restingHeartRate ?? ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? null : parseInt(e.target.value, 10);
                  setActiveLog({ ...activeLog, restingHeartRate: val });
                }}
                onBlur={() => persistChange({ restingHeartRate: activeLog.restingHeartRate })}
                style={{
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.65rem",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--muted-bg)",
                  color: "var(--foreground)",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  fontFamily: "var(--font-mono)",
                  inlineSize: "100%",
                  minInlineSize: 0,
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "0.75rem",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
              fontSize: "0.775rem",
            }}
          >
            <span style={{ color: "var(--muted)" }}>Cardio Recovery Zone:</span>
            <span style={{ fontWeight: "700", fontFamily: "var(--font-mono)", color: "#10b981" }}>
              {getRhrZone(activeLog.restingHeartRate)}
            </span>
          </div>
        </div>

        {/* CARD 6: Mindfulness, Sunlight & Interactive Box Breathing Coach (Feature 8) */}
        <div
          className="glass-panel"
          style={{
            padding: "1.5rem",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "1.15rem",
            minInlineSize: 0,
          }}
        >
          <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
            6. Mindfulness, Sunlight &amp; Breathwork
          </span>

          <div className="health-subcard-pair">
            {/* Mindfulness Minutes */}
            <div className="health-metric-box">
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                🧘 Mindfulness
              </span>
              <div className="health-stepper-row">
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      mindfulnessMinutes: Math.max(0, activeLog.mindfulnessMinutes - 5),
                    })
                  }
                  className="health-round-btn"
                >
                  −
                </button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.45rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                    {activeLog.mindfulnessMinutes}m
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>logged</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      mindfulnessMinutes: activeLog.mindfulnessMinutes + 5,
                    })
                  }
                  className="health-round-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Morning Sunlight Minutes */}
            <div className="health-metric-box">
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--muted)", fontWeight: "700", textTransform: "uppercase" }}>
                ☀️ Sunlight
              </span>
              <div className="health-stepper-row">
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      sunlightMinutes: Math.max(0, activeLog.sunlightMinutes - 5),
                    })
                  }
                  className="health-round-btn"
                >
                  −
                </button>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.45rem", fontWeight: "900", fontFamily: "var(--font-mono)" }}>
                    {activeLog.sunlightMinutes}m
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>outdoor</div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    persistChange({
                      sunlightMinutes: activeLog.sunlightMinutes + 10,
                    })
                  }
                  className="health-round-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Interactive 1-Minute Box Breathing Coach */}
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "0.875rem",
              backgroundColor: breathingActive ? "rgba(99, 102, 241, 0.14)" : "var(--muted-bg)",
              border: breathingActive ? "1px solid var(--accent)" : "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div style={{ minInlineSize: 0 }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "700", color: breathingActive ? "var(--accent)" : "var(--foreground)" }}>
                {breathingActive ? `🌬️ ${breathingPhase} • ${breathingSecondsLeft}s` : "🌬️ 60s Box Breathing Reset"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                {breathingActive
                  ? "Follow the 4-4-4-4 cadence to lower cortisol"
                  : "Auto-logs +1m mindfulness when completed"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBreathingSecondsLeft(60);
                setBreathingPhase("Inhale (4s)");
                setBreathingActive((prev) => !prev);
              }}
              style={{
                flexShrink: 0,
                padding: "0.45rem 0.9rem",
                borderRadius: "0.55rem",
                border: "none",
                backgroundColor: breathingActive ? "#ef4444" : "var(--accent)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {breathingActive ? "Stop" : "Start 60s"}
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 9: Daily Supplement & Recovery Stack Checklist + Daily Physical Notes */}
      <div
        className="glass-panel"
        style={{
          padding: "1.5rem",
          borderRadius: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Supplement Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}>
              7. Daily Supplement &amp; Recovery Stack
            </span>
            <span style={{ fontSize: "0.725rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
              {supplementsArray.length}/{SUPPLEMENT_OPTIONS.length} Checked
            </span>
          </div>

          <div className="health-pill-row">
            {SUPPLEMENT_OPTIONS.map((supp) => {
              const checked = supplementsArray.includes(supp);
              return (
                <button
                  key={supp}
                  type="button"
                  onClick={() => toggleSupplement(supp)}
                  style={{
                    padding: "0.45rem 0.8rem",
                    borderRadius: "0.65rem",
                    border: checked ? "1px solid #10b981" : "1px solid var(--border)",
                    backgroundColor: checked ? "rgba(16, 185, 129, 0.14)" : "var(--muted-bg)",
                    color: checked ? "#10b981" : "var(--foreground)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span>{checked ? "✓" : "○"}</span>
                  <span>{supp}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Recovery / Symptom Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <label
            htmlFor="health-notes-input"
            style={{ fontSize: "0.725rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)", textTransform: "uppercase" }}
          >
            8. Daily Physical &amp; Recovery Notes
          </label>
          <textarea
            id="health-notes-input"
            rows={3}
            value={activeLog.notes}
            onChange={(e) => setActiveLog({ ...activeLog, notes: e.target.value })}
            onBlur={() => persistChange({ notes: activeLog.notes })}
            placeholder="Record workout PRs, muscle soreness, meal notes, or sleep observations (auto-saves on blur)..."
            style={{
              inlineSize: "100%",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              backgroundColor: "var(--muted-bg)",
              color: "var(--foreground)",
              fontSize: "0.825rem",
              lineHeight: "1.5",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* FEATURE 10: Interactive Multi-Day Biometric History Log */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>
            Saved Health &amp; Biometric Logs
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Click any day below to inspect or edit that day&apos;s metrics
          </span>
        </div>

        {historyLogs.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", fontStyle: "italic" }}>
            No health logs recorded yet. Adjust any metric above to save today&apos;s log!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {historyLogs.map((log) => {
              const score = computeWellnessScore(log);
              const isSelected = log.date.slice(0, 10) === activeLog.date.slice(0, 10);
              const supps = log.supplementsTaken
                ? log.supplementsTaken.split(",").filter(Boolean)
                : [];

              return (
                <div
                  key={log.id}
                  onClick={() => {
                    setActiveLog(log);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="glass-panel"
                  style={{
                    padding: "1.15rem 1.35rem",
                    borderRadius: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                    cursor: "pointer",
                    border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
                    backgroundColor: "var(--card-bg)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: isSelected ? "var(--accent)" : "var(--foreground)" }}>
                        {formatDateDisplay(log.date)}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontFamily: "var(--font-mono)",
                          fontWeight: "700",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          backgroundColor: score >= 80 ? "rgba(16, 185, 129, 0.14)" : "rgba(99, 102, 241, 0.14)",
                          color: score >= 80 ? "#10b981" : "var(--accent)",
                        }}
                      >
                        Readiness: {score}/100
                      </span>
                    </div>

                    <span style={{ fontSize: "0.725rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                      {isSelected ? "● Active in Editor" : "Click to Load →"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "var(--foreground)" }}>
                    <span>💧 <strong>{log.waterIntake}</strong> gl</span>
                    <span>😴 <strong>{log.sleepHours}h</strong> ({log.sleepQuality}★)</span>
                    <span>⚡ <strong>{log.energyLevel}</strong>/10</span>
                    <span>🧠 Stress: <strong>{log.stressLevel}</strong>/10</span>
                    <span>👟 <strong>{log.steps.toLocaleString()}</strong> steps</span>
                    {log.workoutMinutes > 0 && (
                      <span>🏋️ <strong>{log.workoutMinutes}m</strong> ({log.workoutType})</span>
                    )}
                    {log.proteinGrams > 0 && (
                      <span>🥩 <strong>{log.proteinGrams}g</strong> protein</span>
                    )}
                    {log.calories > 0 && (
                      <span>🔥 <strong>{log.calories}</strong> kcal</span>
                    )}
                    {log.weightLbs && (
                      <span>⚖️ <strong>{log.weightLbs}</strong> lbs</span>
                    )}
                    {log.restingHeartRate && (
                      <span>❤️ <strong>{log.restingHeartRate}</strong> bpm</span>
                    )}
                    {supps.length > 0 && (
                      <span>💊 <strong>{supps.length}</strong> supplements</span>
                    )}
                  </div>

                  {log.notes && (
                    <div style={{ fontSize: "0.775rem", color: "var(--muted)", fontStyle: "italic" }}>
                      &ldquo;{log.notes}&rdquo;
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
