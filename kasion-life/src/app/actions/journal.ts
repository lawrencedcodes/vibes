"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveJournalEntry(
  content: string,
  entryId?: string | null
): Promise<{
  id: string;
  date: string;
  content: string;
  createdAt: string;
}> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // 1. If an existing entryId is provided, update that specific entry
    if (entryId) {
      const existing = await db.journalEntry.findFirst({
        where: {
          id: entryId,
          userId: session.userId,
        },
      });

      if (existing) {
        const updated = await db.journalEntry.update({
          where: { id: existing.id },
          data: { content },
        });
        revalidatePath("/journal");
        return {
          id: updated.id,
          date: updated.date.toISOString(),
          content: updated.content,
          createdAt: updated.createdAt.toISOString(),
        };
      }
    }

    // 2. Otherwise create a new journal entry with a unique timestamp
    const now = new Date();
    const created = await db.journalEntry.create({
      data: {
        userId: session.userId,
        date: now,
        content,
      },
    });

    revalidatePath("/journal");
    return {
      id: created.id,
      date: created.date.toISOString(),
      content: created.content,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (error: any) {
    console.error("Failed to save journal entry database write error:", error);
    throw error;
  }
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const existing = await db.journalEntry.findFirst({
    where: {
      id: entryId,
      userId: session.userId,
    },
  });

  if (!existing) {
    throw new Error("Journal entry not found or unauthorized.");
  }

  await db.journalEntry.delete({
    where: { id: existing.id },
  });

  revalidatePath("/journal");
}
