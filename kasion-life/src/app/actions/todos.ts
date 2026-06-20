"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type TodoActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createTodo(
  listId: string,
  state: TodoActionState,
  formData: FormData
): Promise<TodoActionState> {
  const content = formData.get("content") as string;
  
  if (!content || content.trim() === "") {
    return { error: "Please enter todo content." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify todos." };
  }

  try {
    // Verify the target list belongs to this authenticated user
    const list = await db.list.findFirst({
      where: { id: listId, userId: session.userId },
    });

    if (!list) {
      return { error: "List not found or access denied." };
    }

    await db.todo.create({
      data: {
        listId,
        content: content.trim(),
        isCompleted: false,
      },
    });
  } catch (error: any) {
    console.error("Failed to create todo database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath(`/lists/${listId}`);
  return { success: true };
}

export async function toggleTodo(todoId: string, isCompleted: boolean, listId: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Verify the todo's list belongs to the authenticated user
    const todo = await db.todo.findUnique({
      where: { id: todoId },
      include: {
        list: true,
      },
    });

    if (!todo || todo.list.userId !== session.userId) {
      throw new Error("Unauthorized or todo not found.");
    }

    await db.todo.update({
      where: { id: todoId },
      data: { isCompleted },
    });
  } catch (error: any) {
    console.error("Failed to toggle todo status:", error);
    throw error;
  }

  revalidatePath(`/lists/${listId}`);
}
