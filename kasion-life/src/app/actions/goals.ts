"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type GoalActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createGoal(
  state: GoalActionState,
  formData: FormData
): Promise<GoalActionState> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const targetDateStr = formData.get("targetDate") as string;
  const selectedHabitIds = formData.getAll("habitIds") as string[];

  if (!title || title.trim() === "") {
    return { error: "Please enter a goal title." };
  }

  if (!targetDateStr) {
    return { error: "Please select a target date." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify goals." };
  }

  try {
    const targetDate = new Date(targetDateStr);
    if (isNaN(targetDate.getTime())) {
      return { error: "Invalid target date format." };
    }

    // Create the Goal
    const newGoal = await db.goal.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || null,
        targetDate,
        isCompleted: false,
      },
    });

    // Link habits to the new goal if selected
    if (selectedHabitIds.length > 0) {
      await db.habit.updateMany({
        where: {
          id: { in: selectedHabitIds },
          userId: session.userId,
        },
        data: {
          goalId: newGoal.id,
        },
      });
    }
  } catch (error: any) {
    console.error("Failed to create goal database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath("/goals");
  revalidatePath("/tracker");
  return { success: true };
}

export async function toggleGoal(goalId: string, isCompleted: boolean) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify goal belongs to the user
    const goal = await db.goal.findFirst({
      where: { id: goalId, userId: session.userId },
    });

    if (!goal) {
      throw new Error("Goal not found or access denied.");
    }

    await db.goal.update({
      where: { id: goalId },
      data: { isCompleted },
    });
  } catch (error: any) {
    console.error("Failed to toggle goal completion status:", error);
    throw error;
  }

  revalidatePath("/goals");
}

export async function deleteGoal(goalId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify goal belongs to the user
    const goal = await db.goal.findFirst({
      where: { id: goalId, userId: session.userId },
    });

    if (!goal) {
      throw new Error("Goal not found or access denied.");
    }

    await db.goal.delete({
      where: { id: goalId },
    });
  } catch (error: any) {
    console.error("Failed to delete goal:", error);
    throw error;
  }

  revalidatePath("/goals");
  revalidatePath("/tracker");
}
