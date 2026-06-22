"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type CountdownActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createCountdown(state: CountdownActionState, formData: FormData): Promise<CountdownActionState> {
  const title = formData.get("title") as string;
  const targetDateStr = formData.get("targetDate") as string;

  if (!title || title.trim() === "") {
    return { error: "Please enter a countdown title." };
  }

  if (!targetDateStr) {
    return { error: "Please select a target date." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to create a countdown." };
  }

  try {
    await db.countdown.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        targetDate: new Date(targetDateStr),
      },
    });
  } catch (error: any) {
    console.error("Failed to create countdown database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath("/countdowns");
  return { success: true };
}

export async function deleteCountdown(id: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.countdown.delete({
      where: {
        id,
        userId: session.userId,
      },
    });
  } catch (error: any) {
    console.error("Failed to delete countdown database error:", error);
    throw error;
  }

  revalidatePath("/countdowns");
}
