"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type SubtaskActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createSubtask(
  todoId: string,
  listId: string,
  state: SubtaskActionState,
  formData: FormData
): Promise<SubtaskActionState> {
  const content = formData.get("content") as string;

  if (!content || content.trim() === "") {
    return { error: "Please enter subtask content." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify subtasks." };
  }

  try {
    // Verify parent todo/list ownership
    const todo = await db.todo.findUnique({
      where: { id: todoId },
      include: {
        list: true,
      },
    });

    if (!todo || todo.list.userId !== session.userId) {
      return { error: "Todo not found or access denied." };
    }

    await db.subtask.create({
      data: {
        todoId,
        content: content.trim(),
        isCompleted: false,
      },
    });
  } catch (error: any) {
    console.error("Failed to create subtask database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath(`/lists/${listId}`);
  return { success: true };
}

export async function toggleSubtask(subtaskId: string, isCompleted: boolean, listId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify parent todo/list ownership
    const subtask = await db.subtask.findUnique({
      where: { id: subtaskId },
      include: {
        todo: {
          include: {
            list: true,
          },
        },
      },
    });

    if (!subtask || subtask.todo.list.userId !== session.userId) {
      throw new Error("Unauthorized or subtask not found.");
    }

    await db.subtask.update({
      where: { id: subtaskId },
      data: { isCompleted },
    });
  } catch (error: any) {
    console.error("Failed to toggle subtask status:", error);
    throw error;
  }

  revalidatePath(`/lists/${listId}`);
}
