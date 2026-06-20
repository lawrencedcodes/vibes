"use server";

import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export type AuthState = {
  error?: string;
  success?: boolean;
} | undefined;

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    // Check if database is empty. If so, seed the default user.
    const userCount = await db.user.count();
    if (userCount === 0) {
      // Auto-seed default user: admin@kasionlife.com / password123
      const defaultPasswordHash = await bcrypt.hash("password123", 10);
      await db.user.create({
        data: {
          email: "admin@kasionlife.com",
          passwordHash: defaultPasswordHash,
          name: "Kasion",
        },
      });
      console.log("Database seeded with default user: admin@kasionlife.com");
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password." };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Invalid email or password." };
    }

    // Create session
    await createSession(user.id);
  } catch (error: any) {
    console.error("Login server error:", error);
    return { error: "An unexpected server error occurred." };
  }

  // Redirect on success
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
