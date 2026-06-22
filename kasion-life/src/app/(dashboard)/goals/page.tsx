import React from "react";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GoalBoard from "@/components/GoalBoard";
import { getWeeklyExecutionScore } from "@/lib/scoring";

export default async function GoalsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Fetch the overall weekly execution score for all habits
  const weeklyExecutionScore = await getWeeklyExecutionScore(session.userId);

  // Fetch active goals and their associated habits
  const goals = await db.goal.findMany({
    where: { userId: session.userId },
    include: {
      habits: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all user's habits so they can be associated with goals
  const habits = await db.habit.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      title: true,
      type: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Serialize goals and calculate specific weekly execution scores for linked habits
  const serializedGoals = await Promise.all(
    goals.map(async (goal) => {
      const goalWeeklyScore = await getWeeklyExecutionScore(session.userId, goal.id);
      return {
        id: goal.id,
        title: goal.title,
        description: goal.description,
        targetDate: goal.targetDate.toISOString(),
        isCompleted: goal.isCompleted,
        createdAt: goal.createdAt.toISOString(),
        habits: goal.habits,
        weeklyScore: goalWeeklyScore,
      };
    })
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
          Active Goals
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
          Manage short-term objectives, long-term targets, and milestone progress.
        </p>
      </div>

      {/* Main Goal Board (Checklist layout) */}
      <GoalBoard 
        initialGoals={serializedGoals} 
        allHabits={habits} 
        weeklyExecutionScore={weeklyExecutionScore} 
      />
    </div>
  );
}
