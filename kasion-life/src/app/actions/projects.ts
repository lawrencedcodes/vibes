"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type ProjectActionState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function createProject(
  state: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || title.trim() === "") {
    return { error: "Please enter a project title." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify projects." };
  }

  try {
    await db.project.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        description: description?.trim() || null,
      },
    });
  } catch (error: any) {
    console.error("Failed to create project database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function createProjectList(
  projectId: string,
  state: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const title = formData.get("title") as string;

  if (!title || title.trim() === "") {
    return { error: "Please enter a list title." };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be logged in to modify lists." };
  }

  try {
    // Verify target project belongs to this user
    const project = await db.project.findFirst({
      where: { id: projectId, userId: session.userId },
    });

    if (!project) {
      return { error: "Project not found or access denied." };
    }

    await db.list.create({
      data: {
        userId: session.userId,
        projectId: projectId,
        title: title.trim(),
      },
    });
  } catch (error: any) {
    console.error("Failed to create list for project database write error:", error);
    return { error: "An unexpected database error occurred." };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}
