import { createClient } from "@/lib/supabase/client";
import type { MealType } from "@/lib/types/meal-plan";

interface AssignRecipeToMealInput {
  recipeId: string;
  date: string;
  mealType: MealType;
}

export async function assignRecipeToMeal({
  recipeId,
  date,
  mealType,
}: AssignRecipeToMealInput) {
  const supabase = createClient();
  const { error } = await supabase.from("meal_plan").upsert(
    {
      date,
      meal_type: mealType,
      recipe_id: recipeId,
    },
    { onConflict: "date,meal_type" },
  );

  if (error) {
    throw new Error(error.message);
  }
}
