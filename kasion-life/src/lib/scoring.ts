import { db } from "@/lib/db";

/**
 * Calculates the weekly execution score (0-100) for a user's habits.
 * Can optionally be filtered by goalId to calculate the score for a specific goal.
 * Calculation is based on the elapsed days of the current week (Monday to today)
 * to avoid penalizing the score for future unlogged days.
 */
export async function getWeeklyExecutionScore(userId: string, goalId?: string | null): Promise<number> {
  const habits = await db.habit.findMany({
    where: { 
      userId,
      ...(goalId ? { goalId } : {})
    },
  });

  if (habits.length === 0) return 0;

  // Calculate Monday of the current week (local time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const day = today.getDay();
  // Sunday is 0, Monday is 1, etc.
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  // Sunday of the current week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Calculate elapsed days up to today (Monday = 1, Sunday = 7)
  const currentDayOfWeek = new Date().getDay(); 
  const elapsedDaysCount = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  // Fetch all logs for this user's habits in the current week
  const logs = await db.habitLog.findMany({
    where: {
      habit: { 
        userId,
        ...(goalId ? { goalId } : {})
      },
      date: {
        gte: monday,
        lte: sunday,
      },
    },
  });

  let totalCompletedPoints = 0;
  const totalPlannedPoints = habits.length * elapsedDaysCount;

  if (totalPlannedPoints === 0) return 0;

  // Group logs by habitId
  const logsByHabit = new Map<string, typeof logs>();
  for (const log of logs) {
    if (!logsByHabit.has(log.habitId)) {
      logsByHabit.set(log.habitId, []);
    }
    logsByHabit.get(log.habitId)!.push(log);
  }

  for (const habit of habits) {
    const habitLogs = logsByHabit.get(habit.id) || [];
    
    // For each elapsed day (Monday to today), calculate completion points
    for (let i = 0; i < elapsedDaysCount; i++) {
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + i);
      const targetDateStr = targetDate.toDateString();

      const log = habitLogs.find(l => l.date.toDateString() === targetDateStr);
      if (log) {
        if (habit.type === "BOOLEAN") {
          if (log.isCompleted) {
            totalCompletedPoints += 1;
          }
        } else {
          const target = habit.dailyTarget || 1;
          const val = log.value ?? 0;
          totalCompletedPoints += Math.min(val, target) / target;
        }
      }
    }
  }

  return Math.round((totalCompletedPoints / totalPlannedPoints) * 100);
}
