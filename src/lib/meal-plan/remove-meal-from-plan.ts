import { createClient } from "@/lib/supabase/client";

export async function removeMealFromPlan(mealPlanId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("meal_plan")
    .delete()
    .eq("id", mealPlanId);

  if (error) {
    throw new Error(error.message);
  }
}
