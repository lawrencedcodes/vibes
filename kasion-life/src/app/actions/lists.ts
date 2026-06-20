"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type ListActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createList(state: ListActionState, formData: FormData): Promise<ListActionState> {
  const title = formData.get("title") as string;
  
  if (!title || title.trim() === "") {
    return { error: "Please enter a list title." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to create a list." };
  }

  try {
    await db.list.create({
      data: {
        userId: session.userId,
        title: title.trim(),
      },
    });
  } catch (error: any) {
    console.error("Failed to create list database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  // Refresh page cache
  revalidatePath("/lists");
  
  return { success: true };
}
