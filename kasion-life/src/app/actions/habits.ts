"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type HabitActionState = {
  error?: string;
  success?: boolean;
} | undefined;

// Streak calculation helper
async function recalculateStreak(habitId: string) {
  // Fetch all completed logs for this habit sorted by date descending
  const allLogs = await db.habitLog.findMany({
    where: { habitId, isCompleted: true },
    orderBy: { date: "desc" },
  });

  let currentStreak = 0;

  if (allLogs.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayStr = yesterday.toDateString();

    const mostRecentDateStr = allLogs[0].date.toDateString();

    // A streak is active only if the most recent completed log is today or yesterday
    if (mostRecentDateStr === todayStr || mostRecentDateStr === yesterdayStr) {
      currentStreak = 1;
      for (let i = 1; i < allLogs.length; i++) {
        const prevDate = new Date(allLogs[i - 1].date);
        prevDate.setDate(prevDate.getDate() - 1);
        
        const expectedDateStr = prevDate.toDateString();
        const actualDateStr = allLogs[i].date.toDateString();

        if (actualDateStr === expectedDateStr) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  const habit = await db.habit.findUnique({
    where: { id: habitId },
  });

  const longestStreak = Math.max(habit?.longestStreak || 0, currentStreak);

  await db.habit.update({
    where: { id: habitId },
    data: {
      currentStreak,
      longestStreak,
    },
  });
}

export async function createHabit(
  state: HabitActionState,
  formData: FormData
): Promise<HabitActionState> {
  const title = formData.get("title") as string;
  const type = (formData.get("type") as string) || "BOOLEAN";
  const dailyTargetStr = formData.get("dailyTarget") as string;
  const dailyTarget = dailyTargetStr ? parseInt(dailyTargetStr, 10) : null;
  const routine = (formData.get("routine") as string) || "ANYTIME";

  if (!title || title.trim() === "") {
    return { error: "Please enter a habit title." };
  }

  if (type !== "BOOLEAN" && type !== "NUMERIC") {
    return { error: "Invalid habit type selected." };
  }

  if (type === "NUMERIC" && (dailyTarget === null || isNaN(dailyTarget) || dailyTarget <= 0)) {
    return { error: "Numeric habits require a valid daily target greater than 0." };
  }

  const validRoutines = ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"];
  if (!validRoutines.includes(routine)) {
    return { error: "Invalid routine selected." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify habits." };
  }

  try {
    await db.habit.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        type,
        dailyTarget: type === "NUMERIC" ? dailyTarget : null,
        routine,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  } catch (error: any) {
    console.error("Failed to create habit database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath("/tracker");
  return { success: true };
}

export async function deleteHabit(habitId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the habit belongs to the authenticated user
    const habit = await db.habit.findFirst({
      where: { id: habitId, userId: session.userId },
    });

    if (!habit) {
      throw new Error("Unauthorized or habit not found.");
    }

    await db.habit.delete({
      where: { id: habitId },
    });
  } catch (error: any) {
    console.error("Failed to delete habit:", error);
    throw error;
  }

  revalidatePath("/tracker");
}

export async function toggleHabitLog(habitId: string, isCompleted: boolean) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the habit belongs to the authenticated user
    const habit = await db.habit.findFirst({
      where: { id: habitId, userId: session.userId },
    });

    if (!habit) {
      throw new Error("Unauthorized or habit not found.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingLog = await db.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today,
        },
      },
    });

    if (existingLog) {
      await db.habitLog.update({
        where: { id: existingLog.id },
        data: {
          isCompleted,
          value: isCompleted ? (habit.dailyTarget || 1) : 0,
        },
      });
    } else {
      await db.habitLog.create({
        data: {
          habitId,
          date: today,
          isCompleted,
          value: isCompleted ? (habit.dailyTarget || 1) : 0,
        },
      });
    }

    // Update streak statistics
    await recalculateStreak(habitId);
  } catch (error: any) {
    console.error("Failed to toggle habit log status:", error);
    throw error;
  }

  revalidatePath("/tracker");
}

export async function updateHabitLogNumeric(habitId: string, value: number) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the habit belongs to the authenticated user
    const habit = await db.habit.findFirst({
      where: { id: habitId, userId: session.userId },
    });

    if (!habit) {
      throw new Error("Unauthorized or habit not found.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // A habit is considered completed if the value is >= dailyTarget (or defaults to 1)
    const isCompleted = value >= (habit.dailyTarget || 1);

    const existingLog = await db.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today,
        },
      },
    });

    if (existingLog) {
      await db.habitLog.update({
        where: { id: existingLog.id },
        data: {
          value,
          isCompleted,
        },
      });
    } else {
      await db.habitLog.create({
        data: {
          habitId,
          date: today,
          value,
          isCompleted,
        },
      });
    }

    // Update streak statistics
    await recalculateStreak(habitId);
  } catch (error: any) {
    console.error("Failed to update habit log numeric status:", error);
    throw error;
  }

  revalidatePath("/tracker");
}
