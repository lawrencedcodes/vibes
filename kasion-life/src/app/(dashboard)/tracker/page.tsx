import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HabitTracker from "@/components/HabitTracker";

export default async function TrackerPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch the habits and today's logs for this user
  const habits = await db.habit.findMany({
    where: { userId: session.userId },
    include: {
      logs: {
        where: {
          date: today,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Map habits to a clean, serializable format for the client
  const serializedHabits = habits.map((habit) => ({
    id: habit.id,
    title: habit.title,
    type: habit.type,
    dailyTarget: habit.dailyTarget,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    createdAt: habit.createdAt.toISOString(),
    isCompletedToday: habit.logs.length > 0 ? habit.logs[0].isCompleted : false,
    valueToday: habit.logs.length > 0 ? (habit.logs[0].value ?? 0) : 0,
  }));

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Metrics Tracker
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Track daily logs, physical parameters, and mental well-being indexes.
        </p>
      </div>

      {/* Centered Tracker Container */}
      <div style={{ maxWidth: "680px", width: "100%", margin: "0 auto" }}>
        {/* Habit Card (Dynamic Interactive checklist) */}
        <HabitTracker initialHabits={serializedHabits} />
      </div>
    </div>
  );
}

