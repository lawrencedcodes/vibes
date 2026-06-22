"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { createFocusSession } from "@/app/actions/focus";

interface TodoSummary {
  id: string;
  content: string;
}

interface TimerWidgetProps {
  activeTodos: TodoSummary[];
}

export default function TimerWidget({ activeTodos }: TimerWidgetProps) {
  const TOTAL_SECONDS = 25 * 60; // 25 minutes
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string>("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  const [isSaving, startSavingTransition] = useTransition();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // SVG Circular progress constants
  const radius = 90;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = secondsLeft / TOTAL_SECONDS;
  const strokeDashoffset = circumference - progressPercent * circumference;

  // Synthesize a chime when the timer finishes using Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Play a two-tone pleasant notification chime
      const playTone = (freq: number, startDelay: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + startDelay);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + startDelay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + duration);
      };

      playTone(523.25, 0, 0.8);      // C5 Note
      playTone(659.25, 0.15, 1.2);   // E5 Note
      playTone(783.99, 0.3, 1.5);    // G5 Note
    } catch (error) {
      console.error("Web Audio alarm failed:", error);
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (!startTime) {
        setStartTime(new Date());
      }
      
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Timer reached 0!
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playChime();

    const end = new Date();
    const start = startTime || new Date(end.getTime() - 25 * 60 * 1000);

    startSavingTransition(async () => {
      try {
        await createFocusSession({
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          duration: 25,
          todoId: selectedTodoId || null,
        });
        
        // Reset timer
        setSecondsLeft(TOTAL_SECONDS);
        setStartTime(null);
        alert("🎉 Excellent focus! Your 25-minute focus session has been completed and logged successfully.");
      } catch (error) {
        console.error("Failed to save focus session:", error);
        alert("Failed to log focus session to database.");
      }
    });
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to stop and reset the current timer? Progress will not be logged.")) {
      setIsRunning(false);
      setSecondsLeft(TOTAL_SECONDS);
      setStartTime(null);
    }
  };

  // Format MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="dashboard-card glass-panel" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 2rem",
      borderRadius: "1.5rem",
      gap: "2rem",
      textAlign: "center"
    }}>
      {/* Visual Timer Ring */}
      <div style={{ position: "relative", width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: "rotate(-90deg)" }}>
          {/* Background Ring */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress countdown ring */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="var(--accent)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
        </svg>
        
        {/* Time Text */}
        <div style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          alignItems: "center"
        }}>
          <span style={{
            fontSize: "3rem",
            fontWeight: "800",
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.02em",
            color: isRunning ? "var(--foreground)" : "var(--muted)"
          }}>
            {formatTime(secondsLeft)}
          </span>
          <span style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            textTransform: "uppercase",
            fontWeight: "600",
            letterSpacing: "0.1em"
          }}>
            {isRunning ? "Focusing" : "Paused"}
          </span>
        </div>
      </div>

      {/* Task association dropdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", maxWidth: "320px" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Target Task Focus (Optional)
        </label>
        <select
          value={selectedTodoId}
          onChange={(e) => setSelectedTodoId(e.target.value)}
          disabled={isRunning || isSaving}
          className="login-input"
          style={{
            cursor: isRunning ? "not-allowed" : "pointer",
            textAlign: "center"
          }}
        >
          <option value="">-- Select a Task --</option>
          {activeTodos.map((todo) => (
            <option key={todo.id} value={todo.id}>
              {todo.content}
            </option>
          ))}
        </select>
      </div>

      {/* Timer Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={handleStartPause}
          disabled={isSaving}
          style={{
            backgroundColor: isRunning ? "var(--muted-bg)" : "var(--accent)",
            color: isRunning ? "var(--foreground)" : "var(--accent-foreground)",
            border: isRunning ? "1px solid var(--border)" : "none",
            borderRadius: "0.75rem",
            padding: "0.75rem 1.75rem",
            fontSize: "0.875rem",
            fontWeight: "700",
            cursor: "pointer",
            minWidth: "100px",
            transition: "all 0.2s ease"
          }}
          className="hover-accent-bg"
        >
          {isSaving ? "Saving..." : isRunning ? "Pause" : "Start"}
        </button>

        {(secondsLeft < TOTAL_SECONDS || isRunning) && (
          <button
            onClick={handleReset}
            disabled={isSaving}
            style={{
              backgroundColor: "transparent",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.75rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title="Reset timer"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
