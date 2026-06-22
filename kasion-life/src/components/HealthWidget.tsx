"use client";

import React, { useState, useTransition } from "react";
import { updateHealthLog } from "@/app/actions/health";

interface HealthWidgetProps {
  initialSleep: number;
  initialWater: number;
  initialEnergy: number;
}

export default function HealthWidget({
  initialSleep,
  initialWater,
  initialEnergy,
}: HealthWidgetProps) {
  const [sleep, setSleep] = useState(initialSleep);
  const [water, setWater] = useState(initialWater);
  const [energy, setEnergy] = useState(initialEnergy);
  const [isPending, startTransition] = useTransition();

  const handleWaterChange = (amount: number) => {
    const newValue = Math.max(0, water + amount);
    setWater(newValue);
    startTransition(async () => {
      try {
        await updateHealthLog({ waterIntake: newValue });
      } catch (err) {
        console.error("Failed to save water intake:", err);
      }
    });
  };

  const handleSleepChange = (amount: number) => {
    const newValue = Math.max(0, sleep + amount);
    setSleep(newValue);
    startTransition(async () => {
      try {
        await updateHealthLog({ sleepHours: newValue });
      } catch (err) {
        console.error("Failed to save sleep hours:", err);
      }
    });
  };

  const handleEnergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setEnergy(newValue);
  };

  const handleEnergyCommit = () => {
    startTransition(async () => {
      try {
        await updateHealthLog({ energyLevel: energy });
      } catch (err) {
        console.error("Failed to save energy level:", err);
      }
    });
  };

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return "Exhausted";
    if (level <= 4) return "Low Energy";
    if (level <= 6) return "Balanced";
    if (level <= 8) return "High Energy";
    return "Peak Performance";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
      <style>{`
        .stepper-btn:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .energy-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .energy-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
        .energy-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          transition: transform 0.1s ease;
        }
        .energy-slider::-moz-range-thumb:hover {
          transform: scale(1.25);
        }
      `}</style>

      {/* Visual Header / Sync Indicator */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontWeight: "600" }}>
          Today's Metrics
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontSize: "0.75rem",
            fontWeight: "700",
            fontFamily: "var(--font-mono)",
            color: isPending ? "var(--accent)" : "#10b981",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {isPending ? "Syncing..." : "Synced"}
          </span>
          <div style={{
            height: "8px",
            width: "8px",
            borderRadius: "50%",
            backgroundColor: isPending ? "var(--accent)" : "#10b981",
            animation: isPending ? "pulse-animation 1.5s infinite" : "none",
            transition: "background-color 0.2s ease"
          }} />
        </div>
      </div>

      <div className="glass-panel" style={{
        padding: "2rem",
        borderRadius: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        backgroundColor: "var(--card-bg)",
      }}>
        {/* Row 1: Water and Sleep */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
          {/* Water Intake Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Water Intake
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <button
                onClick={() => handleWaterChange(-1)}
                className="stepper-btn"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                -
              </button>
              <div style={{ display: "flex", flexDirection: "column", minWidth: "80px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--foreground)", lineHeight: "1" }}>
                  {water}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  {water === 1 ? "glass" : "glasses"}
                </span>
              </div>
              <button
                onClick={() => handleWaterChange(1)}
                className="stepper-btn"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Sleep Hours Section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Sleep Duration
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <button
                onClick={() => handleSleepChange(-0.5)}
                className="stepper-btn"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                -
              </button>
              <div style={{ display: "flex", flexDirection: "column", minWidth: "80px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: "800", color: "var(--foreground)", lineHeight: "1" }}>
                  {sleep}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>
                  hours
                </span>
              </div>
              <button
                onClick={() => handleSleepChange(0.5)}
                className="stepper-btn"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", width: "100%" }} />

        {/* Row 2: Energy Level Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Energy Level
            </span>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--accent)" }}>
              {energy} / 10 • {getEnergyLabel(energy)}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={energy}
            onChange={handleEnergyChange}
            onMouseUp={handleEnergyCommit}
            onTouchEnd={handleEnergyCommit}
            className="energy-slider"
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
              background: "rgba(255, 255, 255, 0.1)",
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted)", padding: "0 0.25rem" }}>
            <span>1 - Exhausted</span>
            <span>5 - Balanced</span>
            <span>10 - Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
