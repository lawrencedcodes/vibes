"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateHealthLog(data: {
  sleepHours?: number;
  waterIntake?: number;
  energyLevel?: number;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await db.healthLog.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date: today,
        },
      },
      update: {
        ...(data.sleepHours !== undefined && { sleepHours: data.sleepHours }),
        ...(data.waterIntake !== undefined && { waterIntake: data.waterIntake }),
        ...(data.energyLevel !== undefined && { energyLevel: data.energyLevel }),
      },
      create: {
        userId: session.userId,
        date: today,
        sleepHours: data.sleepHours ?? 0,
        waterIntake: data.waterIntake ?? 0,
        energyLevel: data.energyLevel ?? 5,
      },
    });
  } catch (error: any) {
    console.error("Failed to upsert health log database write error:", error);
    throw error;
  }

  revalidatePath("/health");
}
