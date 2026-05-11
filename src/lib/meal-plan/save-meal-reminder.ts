import { createClient } from "@/lib/supabase/client";

interface SaveMealReminderInput {
  mealPlanId: string;
  message: string;
  mealDate: string;
}

function getRemindAt(mealDate: string) {
  const [year, month, day] = mealDate.split("-").map(Number);
  return new Date(year, month - 1, day, 9, 0, 0).toISOString();
}

export async function saveMealReminder({
  mealPlanId,
  message,
  mealDate,
}: SaveMealReminderInput) {
  const supabase = createClient();
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error("Enter a reminder note to continue.");
  }

  const { error } = await supabase.from("reminders").insert({
    meal_plan_id: mealPlanId,
    message: trimmedMessage,
    remind_at: getRemindAt(mealDate),
    completed: false,
  });

  if (error) {
    throw new Error(error.message);
  }
}
