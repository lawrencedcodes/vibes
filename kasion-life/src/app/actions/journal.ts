"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveJournalEntry(content: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await db.journalEntry.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date: today,
        },
      },
      update: {
        content,
      },
      create: {
        userId: session.userId,
        date: today,
        content,
      },
    });
  } catch (error: any) {
    console.error("Failed to upsert journal entry database write error:", error);
    throw error;
  }

  revalidatePath("/journal");
}
