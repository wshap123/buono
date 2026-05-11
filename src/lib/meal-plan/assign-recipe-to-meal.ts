import { createClient } from "@/lib/supabase/client";
import { DEFAULT_MEAL_TYPE } from "@/lib/meal-plan/week";

interface AssignRecipeToMealInput {
  recipeId: string;
  date: string;
}

export async function assignRecipeToMeal({
  recipeId,
  date,
}: AssignRecipeToMealInput) {
  const supabase = createClient();
  const { error } = await supabase.from("meal_plan").upsert(
    {
      date,
      meal_type: DEFAULT_MEAL_TYPE,
      recipe_id: recipeId,
    },
    { onConflict: "date,meal_type" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
