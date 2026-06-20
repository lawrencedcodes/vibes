"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type EventActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createEvent(
  state: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = formData.get("startDate") as string;
  const startTimeVal = formData.get("startTime") as string;
  const endDate = formData.get("endDate") as string;
  const endTimeVal = formData.get("endTime") as string;
  const isAllDay = formData.get("isAllDay") === "on";

  if (!title || title.trim() === "") {
    return { error: "Please enter an event title." };
  }

  if (!startDate) {
    return { error: "Please select a start date." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify events." };
  }

  try {
    // Construct Date objects
    let startIso = `${startDate}T${isAllDay ? "00:00" : startTimeVal || "00:00"}`;
    let endIso = `${endDate || startDate}T${isAllDay ? "23:59" : endTimeVal || "23:59"}`;

    const startTime = new Date(startIso);
    const endTime = new Date(endIso);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { error: "Invalid date or time formats." };
    }

    if (endTime < startTime) {
      return { error: "End time cannot be earlier than start time." };
    }

    await db.event.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || null,
        startTime,
        endTime,
        isAllDay,
      },
    });
  } catch (error: any) {
    console.error("Failed to create event database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath("/planner");
  return { success: true };
}
