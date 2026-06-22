"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createFocusSession(data: {
  startTime: string;
  endTime: string;
  duration: number;
  todoId?: string | null;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    await db.focusSession.create({
      data: {
        userId: session.userId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        duration: data.duration,
        status: "COMPLETED",
        todoId: data.todoId || null,
      },
    });
  } catch (error: any) {
    console.error("Failed to save focus session:", error);
    throw error;
  }

  revalidatePath("/focus");
}
