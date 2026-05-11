import { createClient } from "@/lib/supabase/client";

export async function dismissMealReminder(reminderId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("reminders")
    .update({ completed: true })
    .eq("id", reminderId);

  if (error) {
    throw new Error(error.message);
  }
}
