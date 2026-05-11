import { getCurrentWeekDays, toDateKey } from "@/lib/meal-plan/week";
import { createClient } from "@/lib/supabase/server";
export interface WeeklyReminder {
  id: string;
  message: string;
  date: string;
  weekday: string;
}

interface MealPlanRow {
  id: string;
  date: string;
}

interface ReminderRow {
  id: string;
  message: string;
  meal_plan_id: string;
}

export async function getWeeklyReminders(): Promise<WeeklyReminder[]> {
  const weekDays = getCurrentWeekDays();
  const weekStart = toDateKey(weekDays[0]);
  const weekEnd = toDateKey(weekDays[6]);
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  });
  const weekdayByDate = new Map(
    weekDays.map((date) => [toDateKey(date), weekdayFormatter.format(date)]),
  );
  const supabase = await createClient();
  const { data: mealPlans, error: mealPlanError } = await supabase
    .from("meal_plan")
    .select("id, date, meal_type")
    .eq("meal_type", "dinner")
    .gte("date", weekStart)
    .lte("date", weekEnd);

  if (mealPlanError) {
    throw new Error(mealPlanError.message);
  }

  const mealPlanRows = (mealPlans ?? []) as MealPlanRow[];

  if (mealPlanRows.length === 0) {
    return [];
  }

  const mealPlanById = new Map(
    mealPlanRows.map((mealPlan) => [mealPlan.id, mealPlan]),
  );
  const { data: reminders, error: reminderError } = await supabase
    .from("reminders")
    .select("id, message, meal_plan_id")
    .in(
      "meal_plan_id",
      mealPlanRows.map((mealPlan) => mealPlan.id),
    )
    .eq("completed", false)
    .order("created_at", { ascending: true });

  if (reminderError) {
    throw new Error(reminderError.message);
  }

  return ((reminders ?? []) as ReminderRow[])
    .map((reminder) => {
      const mealPlan = mealPlanById.get(reminder.meal_plan_id);

      if (!mealPlan) {
        return null;
      }

      return {
        id: reminder.id,
        message: reminder.message,
        date: mealPlan.date,
        weekday: weekdayByDate.get(mealPlan.date) ?? mealPlan.date,
      };
    })
    .filter((reminder): reminder is WeeklyReminder => reminder !== null)
    .sort((left, right) => {
      if (left.date === right.date) {
        return left.message.localeCompare(right.message);
      }

      return left.date.localeCompare(right.date);
    });
}
