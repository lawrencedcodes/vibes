"use client";

import React, { useState, useTransition, useActionState, useEffect, useRef } from "react";
import { createHabit, deleteHabit, toggleHabitLog, updateHabitLogNumeric } from "@/app/actions/habits";

interface SerializedHabit {
  id: string;
  title: string;
  type: string;
  dailyTarget: number | null;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  isCompletedToday: boolean;
  valueToday: number;
}

interface HabitTrackerProps {
  initialHabits: SerializedHabit[];
}

export default function HabitTracker({ initialHabits }: HabitTrackerProps) {
  const [habitsState, setHabitsState] = useState<SerializedHabit[]>(initialHabits);
  const [hoveredHabitId, setHoveredHabitId] = useState<string | null>(null);
  const [habitType, setHabitType] = useState<"BOOLEAN" | "NUMERIC">("BOOLEAN");
  
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

  const handleDelete = async (id: string) => {
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

  return (
    <div className="dashboard-card glass-panel" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Title & Icon */}
      <div className="card-title-row">
        <span className="card-title">Habits Checklist</span>
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
        <div style={{ width: "100%", height: "4px", backgroundColor: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "var(--accent)",
            borderRadius: "2px",
            transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }} />
        </div>
      </div>

      {/* Habits List */}
      {habitsState.length === 0 ? (
        <div style={{ padding: "1rem 0", textAlign: "center", color: "var(--muted)", fontSize: "0.825rem" }}>
          No habits. Add one below!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {habitsState.map((habit) => {
            const isHovered = hoveredHabitId === habit.id;
            return (
              <div
                key={habit.id}
                onMouseEnter={() => setHoveredHabitId(habit.id)}
                onMouseLeave={() => setHoveredHabitId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
                  opacity: isPending ? 0.7 : 1,
                  transition: "opacity 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
                  {habit.type === "BOOLEAN" ? (
                    /* Standard circular toggle button for BOOLEAN habits */
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
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${habit.isCompletedToday ? "var(--accent)" : "var(--border)"}`,
                        backgroundColor: habit.isCompletedToday ? "var(--accent)" : "transparent",
                        color: "var(--background)",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                    >
                      {habit.isCompletedToday && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    /* Plus/minus stepper for NUMERIC habits */
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexShrink: 0 }}>
                      <button
                        onClick={() => handleNumericChange(habit.id, habit.valueToday - 1, habit.dailyTarget || 1)}
                        disabled={isPending || habit.valueToday <= 0}
                        style={{
                          background: "var(--muted-bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.375rem",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--foreground)",
                          opacity: habit.valueToday <= 0 ? 0.3 : 1,
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          transition: "all 0.2s ease",
                        }}
                      >
                        -
                      </button>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          minWidth: "40px",
                          textAlign: "center",
                          fontFamily: "var(--font-mono)",
                          fontWeight: "700",
                          color: habit.isCompletedToday ? "#10b981" : "var(--foreground)",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {habit.valueToday}/{habit.dailyTarget}
                      </span>
                      <button
                        onClick={() => handleNumericChange(habit.id, habit.valueToday + 1, habit.dailyTarget || 1)}
                        disabled={isPending}
                        style={{
                          background: "var(--muted-bg)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.375rem",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--foreground)",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          transition: "all 0.2s ease",
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                  
                  {/* Title and Streak Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", minWidth: 0, flex: 1, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: habit.isCompletedToday ? "var(--muted)" : "var(--foreground)",
                        textDecoration: habit.isCompletedToday ? "line-through" : "none",
                        transition: "color 0.2s ease, text-decoration 0.2s ease",
                        wordBreak: "break-word",
                        fontWeight: "500",
                      }}
                    >
                      {habit.title}
                    </span>
                    {habit.currentStreak > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.2rem",
                          fontSize: "0.725rem",
                          fontWeight: "700",
                          color: "#f97316",
                          backgroundColor: "rgba(249, 115, 22, 0.08)",
                          padding: "1px 5px",
                          borderRadius: "4px",
                          fontFamily: "var(--font-mono)",
                          marginLeft: "0.375rem",
                          flexShrink: 0,
                        }}
                        title={`Current streak: ${habit.currentStreak} days • Longest: ${habit.longestStreak} days`}
                      >
                        🔥 {habit.currentStreak}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(habit.id)}
                  disabled={isPending}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: isHovered ? "#f87171" : "transparent",
                    cursor: "pointer",
                    padding: "2px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                  }}
                  title="Delete Habit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Habit Form inline at bottom of card */}
      <form ref={formRef} action={createAction} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
        <h4 style={{ fontSize: "0.825rem", fontWeight: "600", color: "var(--foreground)" }}>Add New Habit</h4>
        {createState?.error && (
          <div className="error-banner animate-fade-in" style={{ padding: "0.375rem 0.625rem", borderRadius: "0.5rem", fontSize: "0.75rem", display: "flex", gap: "0.25rem", alignItems: "center" }}>
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
              width: "100px",
              backgroundColor: "var(--muted-bg)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              cursor: "pointer"
            }}
          >
            <option value="BOOLEAN">Boolean</option>
            <option value="NUMERIC">Numeric</option>
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
