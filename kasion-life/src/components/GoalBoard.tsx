"use client";

import React, { useState, useTransition, useActionState, useEffect, useRef } from "react";
import { createGoal, toggleGoal, deleteGoal } from "@/app/actions/goals";

interface HabitSummary {
  id: string;
  title: string;
  type: string;
}

interface SerializedGoal {
  id: string;
  title: string;
  description: string | null;
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
  habits: HabitSummary[];
  weeklyScore: number;
}

interface GoalBoardProps {
  initialGoals: SerializedGoal[];
  allHabits: HabitSummary[];
  weeklyExecutionScore: number;
}

export default function GoalBoard({ initialGoals, allHabits, weeklyExecutionScore }: GoalBoardProps) {
  const [goalsState, setGoalsState] = useState<SerializedGoal[]>(initialGoals);
  const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);
  
  // Sync state with incoming server-validated props
  useEffect(() => {
    setGoalsState(initialGoals);
  }, [initialGoals]);

  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    const nextState = !currentlyCompleted;
    
    // Optimistic UI update
    setGoalsState(prev =>
      prev.map(g => (g.id === id ? { ...g, isCompleted: nextState } : g))
    );

    startTransition(async () => {
      try {
        await toggleGoal(id, nextState);
      } catch (error) {
        // Revert on error
        setGoalsState(prev =>
          prev.map(g => (g.id === id ? { ...g, isCompleted: currentlyCompleted } : g))
        );
        console.error("Failed to toggle goal:", error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal? Any linked habits will be unlinked.")) return;

    const original = goalsState;
    // Optimistic UI delete
    setGoalsState(prev => prev.filter(g => g.id !== id));

    startTransition(async () => {
      try {
        await deleteGoal(id);
      } catch (error) {
        // Revert on error
        setGoalsState(original);
        console.error("Failed to delete goal:", error);
      }
    });
  };

  // Setup form action state using useActionState for React 19 compatibility
  const [createState, createAction, isCreatingPending] = useActionState(createGoal, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear inputs once a goal is successfully created
  useEffect(() => {
    if (createState?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [createState]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const isOverdue = (dateStr: string, isCompleted: boolean) => {
    if (isCompleted) return false;
    const target = new Date(dateStr);
    target.setHours(23, 59, 59, 999);
    return new Date() > target;
  };

  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (weeklyExecutionScore / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Weekly Execution Score Circular Progress Panel */}
      <div className="glass-panel" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem 2rem",
        borderRadius: "1.25rem",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(139, 92, 246, 0.04))",
        border: "1px solid var(--card-border)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Weekly Performance</span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.01em" }}>Weekly Execution Score</h2>
          <p style={{ fontSize: "0.825rem", color: "var(--muted)" }}>Calculated from habits completion up to today</p>
        </div>
        
        <div style={{ position: "relative", width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: "rotate(-90deg)" }}>
            {/* Background Ring */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="var(--border)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="var(--accent)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </svg>
          <div style={{ position: "absolute", fontSize: "1.125rem", fontWeight: "800", fontFamily: "var(--font-mono)", color: "var(--foreground)" }}>
            {weeklyExecutionScore}%
          </div>
        </div>
      </div>

      {/* Target Progress Bar Summary */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Milestone Progress</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Aggregate completion score across all core active milestones.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", flex: 1, height: "8px", backgroundColor: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{
              width: `${goalsState.length > 0 ? Math.round((goalsState.filter(g => g.isCompleted).length / goalsState.length) * 100) : 0}%`,
              height: "100%",
              backgroundColor: "var(--accent)",
              borderRadius: "4px",
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
            {goalsState.length > 0 ? Math.round((goalsState.filter(g => g.isCompleted).length / goalsState.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Grid of Goals */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Active Milestones</h3>
        
        {goalsState.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", borderRadius: "1.25rem", textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
            No goals configured. Create one below to kick off your focus areas!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            {goalsState.map((goal) => {
              const isHovered = hoveredGoalId === goal.id;
              const overdue = isOverdue(goal.targetDate, goal.isCompleted);
              return (
                <div
                  key={goal.id}
                  onMouseEnter={() => setHoveredGoalId(goal.id)}
                  onMouseLeave={() => setHoveredGoalId(null)}
                  className="glass-panel animate-fade-in"
                  style={{
                    padding: "1.25rem",
                    borderRadius: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1.5rem",
                    border: `1px solid ${goal.isCompleted ? "rgba(16, 185, 129, 0.15)" : overdue ? "rgba(239, 68, 68, 0.15)" : "var(--border)"}`,
                    backgroundColor: goal.isCompleted ? "rgba(16, 185, 129, 0.02)" : overdue ? "rgba(239, 68, 68, 0.02)" : "var(--card-bg)",
                    opacity: isPending ? 0.7 : 1,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggle(goal.id, goal.isCompleted)}
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
                        borderRadius: "4px",
                        border: `2px solid ${goal.isCompleted ? "#10b981" : overdue ? "#ef4444" : "var(--border)"}`,
                        backgroundColor: goal.isCompleted ? "#10b981" : "transparent",
                        color: "#ffffff",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {goal.isCompleted && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <h4
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: goal.isCompleted ? "var(--muted)" : "var(--foreground)",
                            textDecoration: goal.isCompleted ? "line-through" : "none",
                            transition: "all 0.2s ease",
                            wordBreak: "break-word",
                          }}
                        >
                          {goal.title}
                        </h4>
                        
                        {/* Overdue Tag */}
                        {overdue && (
                          <span style={{ fontSize: "10px", fontWeight: "700", color: "#f87171", backgroundColor: "rgba(239,68,68,0.1)", padding: "1px 5px", borderRadius: "4px" }}>
                            OVERDUE
                          </span>
                        )}
                      </div>

                      {goal.description && (
                        <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "0.15rem", wordBreak: "break-word" }}>
                          {goal.description}
                        </p>
                      )}

                      {/* Display Associated Habits */}
                      {goal.habits.length > 0 && (
                        <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.375rem", alignItems: "center" }}>
                          <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600" }}>Habits:</span>
                          {goal.habits.map(habit => (
                            <span key={habit.id} style={{
                              fontSize: "10px",
                              padding: "1px 5px",
                              borderRadius: "4px",
                              backgroundColor: "rgba(99, 102, 241, 0.08)",
                              border: "1px solid rgba(99, 102, 241, 0.15)",
                              color: "var(--accent)"
                            }}>
                              {habit.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Goal Weekly Execution Score Progress Indicator */}
                      {goal.habits.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                          <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Goal Weekly Score</span>
                          <div style={{ width: "80px", height: "6px", backgroundColor: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{
                              width: `${goal.weeklyScore}%`,
                              height: "100%",
                              backgroundColor: goal.weeklyScore >= 80 ? "#10b981" : goal.weeklyScore >= 50 ? "var(--accent)" : "#f59e0b",
                              borderRadius: "3px",
                              transition: "width 0.4s ease"
                            }} />
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: "700", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                            {goal.weeklyScore}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                    {/* Target Date Display */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                      <span style={{ fontSize: "10px", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase" }}>Target Date</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: goal.isCompleted ? "var(--muted)" : overdue ? "#ef4444" : "var(--accent)", fontFamily: "var(--font-mono)" }}>
                        {formatDate(goal.targetDate)}
                      </span>
                    </div>

                    {/* Completion Status Badge or Trash Button */}
                    <div style={{ width: "80px", display: "flex", justifyContent: "flex-end" }}>
                      {isHovered ? (
                        <button
                          onClick={() => handleDelete(goal.id)}
                          disabled={isPending}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#f87171",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                          }}
                          className="hover-accent-bg"
                          title="Delete Goal"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: goal.isCompleted ? "#10b981" : "var(--accent)",
                            fontWeight: "600",
                            fontFamily: "var(--font-mono)",
                            textTransform: "uppercase",
                          }}
                        >
                          {goal.isCompleted ? "COMPLETED" : "IN PROGRESS"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Goal Creation Form */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "700" }}>Define New Goal</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.15rem" }}>
            Set a target date, write a description, and select existing habits to link them to this goal.
          </p>
        </div>

        <form ref={formRef} action={createAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "640px" }}>
          {createState?.error && (
            <div className="error-banner animate-fade-in" style={{ padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <span>{createState.error}</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Goal Title</label>
              <input
                name="title"
                placeholder="e.g. Master React 19, Run a Half Marathon..."
                required
                disabled={isCreatingPending}
                className="login-input"
                style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem" }}
              />
            </div>

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Description</label>
              <textarea
                name="description"
                placeholder="Core steps, motivation, or specifications (optional)..."
                disabled={isCreatingPending}
                className="login-input"
                style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem", minHeight: "80px", resize: "vertical" }}
              />
            </div>

            {/* Target Date */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Target Date</label>
              <input
                type="date"
                name="targetDate"
                required
                disabled={isCreatingPending}
                className="login-input"
                style={{ padding: "0.625rem 1rem", borderRadius: "0.75rem", color: "var(--foreground)" }}
              />
            </div>

            {/* Habits Multi-Select Checkboxes */}
            {allHabits.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Link Existing Habits</label>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "0.625rem",
                  padding: "0.75rem",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  backgroundColor: "rgba(255,255,255,0.01)"
                }}>
                  {allHabits.map((habit) => (
                    <label
                      key={habit.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.825rem",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    >
                      <input
                        type="checkbox"
                        name="habitIds"
                        value={habit.id}
                        disabled={isCreatingPending}
                        style={{ accentColor: "var(--accent)" }}
                      />
                      <span>{habit.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreatingPending}
              className="login-btn"
              style={{
                width: "auto",
                alignSelf: "flex-start",
                padding: "0.625rem 1.25rem",
                borderRadius: "0.75rem",
                fontSize: "0.825rem",
                marginTop: "0.5rem"
              }}
            >
              {isCreatingPending ? "Defining..." : "Define Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
