"use client";

import React, { useState, useTransition, useActionState, useEffect, useRef } from "react";
import { createHabit, deleteHabit, toggleHabitLog, updateHabitLogNumeric } from "@/app/actions/habits";
import HabitHeatmap from "./HabitHeatmap";

interface SerializedHabit {
  id: string;
  title: string;
  type: string;
  dailyTarget: number | null;
  currentStreak: number;
  longestStreak: number;
  routine: string;
  createdAt: string;
  isCompletedToday: boolean;
  valueToday: number;
  logs: {
    date: string;
    isCompleted: boolean;
    value: number | null;
  }[];
}

interface HabitTrackerProps {
  initialHabits: SerializedHabit[];
}

export default function HabitTracker({ initialHabits }: HabitTrackerProps) {
  const [habitsState, setHabitsState] = useState<SerializedHabit[]>(initialHabits);
  const [hoveredHabitId, setHoveredHabitId] = useState<string | null>(null);
  const [habitType, setHabitType] = useState<"BOOLEAN" | "NUMERIC">("BOOLEAN");
  const [expandedHabits, setExpandedHabits] = useState<Record<string, boolean>>({});
  
  // Sync state with incoming server-validated props
  useEffect(() => {
    setHabitsState(initialHabits);
  }, [initialHabits]);

  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    const nextState = !currentlyCompleted;
    
    // Optimistic UI update for boolean habit
    setHabitsState(prev =>
      prev.map(h => (h.id === id ? { ...h, isCompletedToday: nextState, valueToday: nextState ? 1 : 0 } : h))
    );

    startTransition(async () => {
      try {
        await toggleHabitLog(id, nextState);
      } catch (error) {
        // Revert UI update on failure
        setHabitsState(prev =>
          prev.map(h => (h.id === id ? { ...h, isCompletedToday: currentlyCompleted, valueToday: currentlyCompleted ? 1 : 0 } : h))
        );
        console.error("Failed to toggle habit log state:", error);
      }
    });
  };

  const handleNumericChange = (id: string, newValue: number, dailyTarget: number) => {
    if (newValue < 0) return;
    const isCompleted = newValue >= dailyTarget;
    
    const originalHabits = habitsState;
    // Optimistic UI update for numeric habit
    setHabitsState(prev =>
      prev.map(h => (h.id === id ? { ...h, valueToday: newValue, isCompletedToday: isCompleted } : h))
    );

    startTransition(async () => {
      try {
        await updateHabitLogNumeric(id, newValue);
      } catch (error) {
        // Revert UI update on failure
        setHabitsState(originalHabits);
        console.error("Failed to update numeric habit log state:", error);
      }
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this habit? All history for this habit will be lost.")) return;

    const original = habitsState;
    // Optimistic UI delete
    setHabitsState(prev => prev.filter(h => h.id !== id));

    startTransition(async () => {
      try {
        await deleteHabit(id);
      } catch (error) {
        // Revert on error
        setHabitsState(original);
        console.error("Failed to delete habit:", error);
      }
    });
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (habit: SerializedHabit, e: React.MouseEvent) => {
    // If the target is a button, select, input, or inside heatmap, ignore card click
    if ((e.target as HTMLElement).closest("button, select, input, .heatmap-container")) {
      return;
    }
    if (habit.type === "BOOLEAN") {
      handleToggle(habit.id, habit.isCompletedToday);
    } else {
      // Standard click increments numeric habit
      handleNumericChange(habit.id, habit.valueToday + 1, habit.dailyTarget || 1);
    }
  };

  // Setup form action state using useActionState for React 19 compatibility
  const [createState, createAction, isCreatingPending] = useActionState(createHabit, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear input once a habit is successfully created
  useEffect(() => {
    if (createState?.success && formRef.current) {
      formRef.current.reset();
      setHabitType("BOOLEAN"); // reset select state
    }
  }, [createState]);

  // Compute metrics
  const totalCount = habitsState.length;
  const completedCount = habitsState.filter(h => h.isCompletedToday).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group habits by routine
  const routinesList = ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"] as const;

  const routineMetadata: Record<typeof routinesList[number], { label: string; icon: string; accentColor: string; shadowColor: string; gradient: string }> = {
    MORNING: {
      label: "Morning Routine",
      icon: "☀️",
      accentColor: "#f59e0b",
      shadowColor: "rgba(245, 158, 11, 0.15)",
      gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.01))",
    },
    AFTERNOON: {
      label: "Afternoon Routine",
      icon: "🌤️",
      accentColor: "#0ea5e9",
      shadowColor: "rgba(14, 165, 233, 0.15)",
      gradient: "linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(14, 165, 233, 0.01))",
    },
    EVENING: {
      label: "Evening Routine",
      icon: "🌙",
      accentColor: "#6366f1",
      shadowColor: "rgba(99, 102, 241, 0.15)",
      gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(99, 102, 241, 0.01))",
    },
    ANYTIME: {
      label: "Anytime Routine",
      icon: "✨",
      accentColor: "#10b981",
      shadowColor: "rgba(16, 185, 129, 0.15)",
      gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.01))",
    },
  };

  return (
    <div className="dashboard-card glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1.5rem" }}>
      <style>{`
        .bento-habits-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .bento-habits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .routine-block {
          border-radius: 1.25rem;
          border: 1px solid var(--border);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background-color: rgba(255, 255, 255, 0.01);
          transition: border-color 0.2s ease;
        }
        .routine-block:hover {
          border-color: rgba(255, 255, 255, 0.12);
        }
        .habit-bento-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.875rem;
          border: 1px solid var(--border);
          background-color: var(--muted-bg);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .habit-bento-card:hover {
          transform: translateY(-2px);
        }
        .habit-bento-card:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>

      {/* Title & Icon */}
      <div className="card-title-row">
        <span className="card-title">Habits Bento Planner</span>
        <span className="card-icon-wrapper" style={{ color: "var(--accent)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </span>
      </div>

      {/* Progress Bar inside the card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
          <span style={{ color: "var(--muted)" }}>Today's progress</span>
          <span style={{ fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
            {completedCount}/{totalCount} ({percentage}%)
          </span>
        </div>
        <div style={{ width: "100%", height: "5px", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "var(--accent)",
            borderRadius: "3px",
            transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>
      </div>

      {/* Bento Grid grouped by Routine */}
      <div className="bento-habits-grid">
        {routinesList.map(routine => {
          const meta = routineMetadata[routine];
          const routineHabits = habitsState.filter(h => h.routine === routine);
          const totalRoutine = routineHabits.length;
          const completedRoutine = routineHabits.filter(h => h.isCompletedToday).length;

          return (
            <div 
              key={routine} 
              className="routine-block" 
              style={{ 
                background: meta.gradient,
              }}
            >
              {/* Routine Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>{meta.icon}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--foreground)" }}>
                    {meta.label}
                  </span>
                </div>
                {totalRoutine > 0 && (
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: meta.accentColor }}>
                    {completedRoutine}/{totalRoutine}
                  </span>
                )}
              </div>

              {/* Habit Cards Grid inside Routine Block */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {routineHabits.length === 0 ? (
                  <div style={{ 
                    padding: "1.25rem 0", 
                    textAlign: "center", 
                    color: "var(--muted)", 
                    fontSize: "0.75rem", 
                    border: "1px dashed rgba(255,255,255,0.04)", 
                    borderRadius: "0.75rem",
                    backgroundColor: "rgba(0,0,0,0.08)"
                  }}>
                    No {meta.label.toLowerCase()}s
                  </div>
                ) : (
                  routineHabits.map(habit => {
                    const isHovered = hoveredHabitId === habit.id;
                    const isExpanded = !!expandedHabits[habit.id];

                    return (
                      <div
                        key={habit.id}
                        onClick={(e) => handleCardClick(habit, e)}
                        onMouseEnter={() => setHoveredHabitId(habit.id)}
                        onMouseLeave={() => setHoveredHabitId(null)}
                        className="habit-bento-card"
                        style={{
                          opacity: isPending ? 0.7 : 1,
                          borderColor: habit.isCompletedToday 
                            ? "rgba(255, 255, 255, 0.04)" 
                            : isHovered 
                              ? meta.accentColor 
                              : "var(--border)",
                          backgroundColor: habit.isCompletedToday 
                            ? "rgba(255, 255, 255, 0.02)" 
                            : "var(--muted-bg)",
                          boxShadow: isHovered ? `0 6px 16px -3px ${meta.shadowColor}` : "none",
                        }}
                      >
                        {/* Upper row: Actions, Title, Metrics */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                            {habit.type === "BOOLEAN" ? (
                              <button
                                onClick={() => handleToggle(habit.id, habit.isCompletedToday)}
                                disabled={isPending}
                                style={{
                                  background: "transparent",
                                  cursor: isPending ? "not-allowed" : "pointer",
                                  padding: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  border: `1.5px solid ${habit.isCompletedToday ? meta.accentColor : "var(--border)"}`,
                                  backgroundColor: habit.isCompletedToday ? meta.accentColor : "transparent",
                                  color: "var(--background)",
                                  transition: "all 0.2s ease",
                                  flexShrink: 0,
                                }}
                              >
                                {habit.isCompletedToday && (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </button>
                            ) : (
                              /* Plus/minus stepper for NUMERIC habits */
                              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNumericChange(habit.id, habit.valueToday - 1, habit.dailyTarget || 1);
                                  }}
                                  disabled={isPending || habit.valueToday <= 0}
                                  style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "0.375rem",
                                    width: "22px",
                                    height: "22px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    color: "var(--foreground)",
                                    opacity: habit.valueToday <= 0 ? 0.3 : 1,
                                    fontSize: "0.875rem",
                                    fontWeight: "bold",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  -
                                </button>
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    minWidth: "35px",
                                    textAlign: "center",
                                    fontFamily: "var(--font-mono)",
                                    fontWeight: "700",
                                    color: habit.isCompletedToday ? meta.accentColor : "var(--foreground)",
                                  }}
                                >
                                  {habit.valueToday}/{habit.dailyTarget}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNumericChange(habit.id, habit.valueToday + 1, habit.dailyTarget || 1);
                                  }}
                                  disabled={isPending}
                                  style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "0.375rem",
                                    width: "22px",
                                    height: "22px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    color: "var(--foreground)",
                                    fontSize: "0.875rem",
                                    fontWeight: "bold",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Habit Title */}
                            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                              <span style={{
                                fontSize: "0.825rem",
                                fontWeight: "600",
                                color: habit.isCompletedToday ? "var(--muted)" : "var(--foreground)",
                                textDecoration: habit.isCompletedToday ? "line-through" : "none",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}>
                                {habit.title}
                              </span>
                            </div>
                          </div>

                          {/* Right elements: Streak & Toggle Heatmap & Delete */}
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                            {habit.currentStreak > 0 && (
                              <span 
                                style={{
                                  fontSize: "0.7rem",
                                  fontWeight: "700",
                                  color: "#f97316",
                                  backgroundColor: "rgba(249, 115, 22, 0.06)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontFamily: "var(--font-mono)",
                                }}
                                title={`Current streak: ${habit.currentStreak} days`}
                              >
                                🔥 {habit.currentStreak}
                              </span>
                            )}
                            
                            {/* Toggle heatmap button */}
                            <button
                              onClick={(e) => toggleExpand(habit.id, e)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: isExpanded ? meta.accentColor : "var(--muted)",
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease",
                              }}
                              title="Toggle Year Heatmap"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 17v-6M13 17v-4M17 17v-9" />
                              </svg>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={(e) => handleDelete(habit.id, e)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "var(--muted)",
                                opacity: isHovered ? 0.8 : 0,
                                cursor: "pointer",
                                padding: "4px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "opacity 0.2s ease, color 0.2s ease",
                              }}
                              className="delete-habit-btn"
                              title="Delete Habit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Heatmap view */}
                        {isExpanded && (
                          <div 
                            style={{ 
                              marginTop: "0.5rem", 
                              borderTop: "1px solid rgba(255,255,255,0.03)", 
                              paddingTop: "0.5rem" 
                            }}
                            className="heatmap-container"
                          >
                            <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                              365-Day Activity Log
                            </span>
                            <HabitHeatmap logs={habit.logs} type={habit.type} dailyTarget={habit.dailyTarget || 1} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Habit Form inline at bottom of card */}
      <form ref={formRef} action={createAction} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
        <h4 style={{ fontSize: "0.825rem", fontWeight: "600", color: "var(--foreground)" }}>Add New Habit</h4>
        {createState?.error && (
          <div className="error-banner animate-fade-in" style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", display: "flex", gap: "0.25rem", alignItems: "center" }}>
            <span>{createState.error}</span>
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {/* Selector for BOOLEAN vs NUMERIC */}
          <select
            name="type"
            value={habitType}
            onChange={(e) => setHabitType(e.target.value as any)}
            className="login-input"
            style={{
              padding: "0.375rem 0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.815rem",
              width: "95px",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              cursor: "pointer"
            }}
          >
            <option value="BOOLEAN">Boolean</option>
            <option value="NUMERIC">Numeric</option>
          </select>

          {/* Selector for Routine */}
          <select
            name="routine"
            defaultValue="ANYTIME"
            className="login-input"
            style={{
              padding: "0.375rem 0.5rem",
              borderRadius: "0.5rem",
              fontSize: "0.815rem",
              width: "105px",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              cursor: "pointer"
            }}
          >
            <option value="ANYTIME">✨ Anytime</option>
            <option value="MORNING">☀️ Morning</option>
            <option value="AFTERNOON">🌤️ Afternoon</option>
            <option value="EVENING">🌙 Evening</option>
          </select>

          <input
            name="title"
            placeholder={habitType === "BOOLEAN" ? "Read, Hydrate..." : "Pushups, Running (km)..."}
            required
            disabled={isCreatingPending}
            className="login-input"
            style={{ padding: "0.375rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.815rem", flex: 1, minWidth: "120px" }}
          />

          {habitType === "NUMERIC" && (
            <input
              type="number"
              name="dailyTarget"
              placeholder="Target"
              required
              min="1"
              disabled={isCreatingPending}
              className="login-input"
              style={{ padding: "0.375rem 0.5rem", borderRadius: "0.5rem", fontSize: "0.815rem", width: "80px" }}
            />
          )}

          <button
            type="submit"
            disabled={isCreatingPending}
            className="login-btn"
            style={{
              width: "auto",
              padding: "0.375rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.815rem",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            {isCreatingPending ? "..." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
