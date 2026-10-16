"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface OnboardingHabitInput {
  title: string;
  type: "BOOLEAN" | "NUMERIC";
  dailyTarget: number | null;
  routine: "MORNING" | "AFTERNOON" | "EVENING" | "ANYTIME";
}

export interface OnboardingPayload {
  goalTitle: string;
  goalDescription: string;
  habits: OnboardingHabitInput[];
  sleepHours: number;
  waterIntake: number;
  energyLevel: number;
  milestoneTitle: string;
  milestoneDaysFromNow: number;
  createStarterProject: boolean;
}

export async function completeOnboarding(payload: OnboardingPayload): Promise<{ error?: string }> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "Unauthorized. Please sign in again." };
  }

  const userId = session.userId;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Create the 12-Week Year Goal if provided
    let createdGoalId: string | null = null;
    if (payload.goalTitle && payload.goalTitle.trim() !== "") {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + 84); // 12 weeks = 84 days

      const goal = await db.goal.create({
        data: {
          userId,
          title: payload.goalTitle.trim(),
          description: payload.goalDescription?.trim() || "12-Week Year execution cycle",
          targetDate,
          isCompleted: false,
        },
      });
      createdGoalId = goal.id;
    }

    // 2. Create Selected Starter Habits linked to the 12-Week Goal
    if (Array.isArray(payload.habits) && payload.habits.length > 0) {
      for (const h of payload.habits) {
        if (!h.title || h.title.trim() === "") continue;
        await db.habit.create({
          data: {
            userId,
            title: h.title.trim(),
            type: h.type === "NUMERIC" ? "NUMERIC" : "BOOLEAN",
            dailyTarget: h.type === "NUMERIC" ? (h.dailyTarget || 1) : null,
            routine: h.routine || "ANYTIME",
            currentStreak: 0,
            longestStreak: 0,
            goalId: createdGoalId,
          },
        });
      }
    }

    // 3. Upsert Today's Baseline Health Log
    const sleepHours = Math.max(0, Math.min(24, Number(payload.sleepHours) || 7.5));
    const waterIntake = Math.max(0, Math.min(30, Number(payload.waterIntake) || 2));
    const energyLevel = Math.max(1, Math.min(10, Number(payload.energyLevel) || 8));

    await db.healthLog.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        sleepHours,
        waterIntake,
        energyLevel,
      },
      create: {
        userId,
        date: today,
        sleepHours,
        waterIntake,
        energyLevel,
      },
    });

    // 4. Create Milestone Countdown if provided
    if (payload.milestoneTitle && payload.milestoneTitle.trim() !== "") {
      const days = Math.max(1, Number(payload.milestoneDaysFromNow) || 84);
      const milestoneDate = new Date(today);
      milestoneDate.setDate(today.getDate() + days);

      await db.countdown.create({
        data: {
          userId,
          title: payload.milestoneTitle.trim(),
          targetDate: milestoneDate,
        },
      });
    }

    // 5. Optionally seed a starter Project & Todo List so Focus Timer has tasks ready
    if (payload.createStarterProject) {
      const project = await db.project.create({
        data: {
          userId,
          title: payload.goalTitle?.trim() || "12-Week Sprint Launchpad",
          description: "Core execution milestones and deep work action items.",
        },
      });

      const list = await db.list.create({
        data: {
          userId,
          projectId: project.id,
          title: "Week 1 Action Items",
        },
      });

      const starterTodos = [
        "Complete first 25-minute Pomodoro focus session",
        "Time-block deep work slots in Weekly Planner",
        "Check off today's core habits in Tracker",
      ];

      for (const content of starterTodos) {
        await db.todo.create({
          data: {
            listId: list.id,
            content,
            isCompleted: false,
          },
        });
      }

      // Also add a welcome calendar block for today (+1 hr from now)
      const now = new Date();
      const eventStart = new Date(now);
      eventStart.setMinutes(0, 0, 0);
      eventStart.setHours(now.getHours() + 1);
      const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000);

      await db.event.create({
        data: {
          userId,
          title: "Deep Work: 12-Week Goal Kickoff",
          description: "Initial focus block created during KasionLife onboarding",
          startTime: eventStart,
          endTime: eventEnd,
          isAllDay: false,
        },
      });
    }
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return { error: "Failed to save onboarding configuration. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/tracker");
  revalidatePath("/goals");
  revalidatePath("/projects");
  revalidatePath("/lists");
  revalidatePath("/health");
  revalidatePath("/countdowns");
  revalidatePath("/planner");
  redirect("/");
}
