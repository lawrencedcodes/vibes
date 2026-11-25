"use server";

import { db } from "@/lib/db";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface HealthLogUpdatePayload {
  dateIso?: string;
  sleepHours?: number;
  sleepQuality?: number;
  waterIntake?: number;
  energyLevel?: number;
  steps?: number;
  workoutMinutes?: number;
  workoutType?: string;
  mood?: string;
  stressLevel?: number;
  calories?: number;
  proteinGrams?: number;
  caffeineCups?: number;
  weightLbs?: number | null;
  restingHeartRate?: number | null;
  mindfulnessMinutes?: number;
  sunlightMinutes?: number;
  supplementsTaken?: string;
  notes?: string;
}

export async function updateHealthLog(data: HealthLogUpdatePayload) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    throw new Error("Unauthorized");
  }

  const targetDate = data.dateIso ? new Date(data.dateIso) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  try {
    const updated = await db.healthLog.upsert({
      where: {
        userId_date: {
          userId: session.userId,
          date: targetDate,
        },
      },
      update: {
        ...(data.sleepHours !== undefined && { sleepHours: data.sleepHours }),
        ...(data.sleepQuality !== undefined && { sleepQuality: data.sleepQuality }),
        ...(data.waterIntake !== undefined && { waterIntake: data.waterIntake }),
        ...(data.energyLevel !== undefined && { energyLevel: data.energyLevel }),
        ...(data.steps !== undefined && { steps: data.steps }),
        ...(data.workoutMinutes !== undefined && { workoutMinutes: data.workoutMinutes }),
        ...(data.workoutType !== undefined && { workoutType: data.workoutType }),
        ...(data.mood !== undefined && { mood: data.mood }),
        ...(data.stressLevel !== undefined && { stressLevel: data.stressLevel }),
        ...(data.calories !== undefined && { calories: data.calories }),
        ...(data.proteinGrams !== undefined && { proteinGrams: data.proteinGrams }),
        ...(data.caffeineCups !== undefined && { caffeineCups: data.caffeineCups }),
        ...(data.weightLbs !== undefined && { weightLbs: data.weightLbs }),
        ...(data.restingHeartRate !== undefined && { restingHeartRate: data.restingHeartRate }),
        ...(data.mindfulnessMinutes !== undefined && { mindfulnessMinutes: data.mindfulnessMinutes }),
        ...(data.sunlightMinutes !== undefined && { sunlightMinutes: data.sunlightMinutes }),
        ...(data.supplementsTaken !== undefined && { supplementsTaken: data.supplementsTaken }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      create: {
        userId: session.userId,
        date: targetDate,
        sleepHours: data.sleepHours ?? 0,
        sleepQuality: data.sleepQuality ?? 3,
        waterIntake: data.waterIntake ?? 0,
        energyLevel: data.energyLevel ?? 5,
        steps: data.steps ?? 0,
        workoutMinutes: data.workoutMinutes ?? 0,
        workoutType: data.workoutType ?? "NONE",
        mood: data.mood ?? "CALM",
        stressLevel: data.stressLevel ?? 3,
        calories: data.calories ?? 0,
        proteinGrams: data.proteinGrams ?? 0,
        caffeineCups: data.caffeineCups ?? 0,
        weightLbs: data.weightLbs ?? null,
        restingHeartRate: data.restingHeartRate ?? null,
        mindfulnessMinutes: data.mindfulnessMinutes ?? 0,
        sunlightMinutes: data.sunlightMinutes ?? 0,
        supplementsTaken: data.supplementsTaken ?? "",
        notes: data.notes ?? "",
      },
    });

    revalidatePath("/health");
    revalidatePath("/");

    return {
      id: updated.id,
      date: updated.date.toISOString(),
      sleepHours: updated.sleepHours,
      sleepQuality: updated.sleepQuality,
      waterIntake: updated.waterIntake,
      energyLevel: updated.energyLevel,
      steps: updated.steps,
      workoutMinutes: updated.workoutMinutes,
      workoutType: updated.workoutType,
      mood: updated.mood,
      stressLevel: updated.stressLevel,
      calories: updated.calories,
      proteinGrams: updated.proteinGrams,
      caffeineCups: updated.caffeineCups,
      weightLbs: updated.weightLbs,
      restingHeartRate: updated.restingHeartRate,
      mindfulnessMinutes: updated.mindfulnessMinutes,
      sunlightMinutes: updated.sunlightMinutes,
      supplementsTaken: updated.supplementsTaken,
      notes: updated.notes,
    };
  } catch (error: any) {
    console.error("Failed to upsert health log database write error:", error);
    throw error;
  }
}
