"use server";

import { db } from "@/lib/db";
import { createSession, deleteSession, decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export type AuthState = {
  error?: string;
  success?: boolean;
  message?: string;
} | undefined;

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const rawEmail = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!rawEmail || !password) {
    return { error: "Please enter both email and password." };
  }

  const email = rawEmail.trim().toLowerCase();

  try {
    // Ensure default demo account exists if logging in as admin@kasionlife.com on a fresh DB
    if (email === "admin@kasionlife.com") {
      const existingAdmin = await db.user.findUnique({ where: { email } });
      if (!existingAdmin) {
        const defaultPasswordHash = await bcrypt.hash("password123", 10);
        await db.user.create({
          data: {
            email: "admin@kasionlife.com",
            passwordHash: defaultPasswordHash,
            name: "Kasion Demo",
          },
        });
      }
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

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const rawName = (formData.get("name") as string) || "";
  const rawEmail = (formData.get("email") as string) || "";
  const password = (formData.get("new-password") as string) || (formData.get("password") as string) || "";
  const selectedPlan = (formData.get("selectedPlan") as string) || "free";
  const selectedBilling = (formData.get("selectedBilling") as string) || "annual";

  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();

  if (name.length < 2) {
    return { error: "Please enter your name (at least 2 characters)." };
  }

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "An account with this email already exists. Try signing in instead." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const isProSelection = selectedPlan === "pro";
    const isLifetimeSelection = selectedPlan === "lifetime";
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const newUser = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        plan: isLifetimeSelection ? "LIFETIME" : isProSelection ? "PRO" : "FREE",
        billingInterval: isLifetimeSelection
          ? "lifetime"
          : isProSelection
          ? selectedBilling === "monthly"
            ? "monthly"
            : "annual"
          : null,
        subscriptionStatus: isLifetimeSelection
          ? "active"
          : isProSelection
          ? "trialing"
          : null,
        stripeCurrentPeriodEnd: isProSelection ? trialEnd : null,
      },
    });

    await createSession(newUser.id);
  } catch (error: any) {
    console.error("Signup server error:", error);
    return { error: "An unexpected server error occurred while creating your account." };
  }

  redirect("/onboarding");
}

export async function loginDemo() {
  try {
    const email = "admin@kasionlife.com";
    let demoUser = await db.user.findUnique({ where: { email } });

    if (!demoUser) {
      const defaultPasswordHash = await bcrypt.hash("password123", 10);
      demoUser = await db.user.create({
        data: {
          email,
          passwordHash: defaultPasswordHash,
          name: "Kasion Demo",
        },
      });
    }

    await createSession(demoUser.id);
  } catch (error) {
    console.error("Demo login error:", error);
    redirect("/login");
  }

  redirect("/");
}

export async function updateProfile(state: AuthState, formData: FormData): Promise<AuthState> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    return { error: "You must be signed in to update your profile." };
  }

  const rawName = (formData.get("name") as string) || "";
  const name = rawName.trim();

  if (name.length < 2) {
    return { error: "Display name must be at least 2 characters." };
  }

  try {
    await db.user.update({
      where: { id: session.userId },
      data: { name },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile." };
  }

  revalidatePath("/");
  revalidatePath("/settings");
  return { success: true, message: "Profile updated." };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
