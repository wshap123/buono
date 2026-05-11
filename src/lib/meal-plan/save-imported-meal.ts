import { createClient } from "@/lib/supabase/client";
import { saveImportedRecipe } from "@/lib/recipes/save-imported-recipe";
import type { ImportedRecipe } from "@/lib/types/imported-recipe";
import { DEFAULT_MEAL_TYPE } from "@/lib/meal-plan/week";

interface SaveImportedMealInput {
  recipe: ImportedRecipe;
  sourceUrl?: string | null;
  date: string;
}

export async function saveImportedMeal({
  recipe,
  sourceUrl,
  date,
}: SaveImportedMealInput) {
  const recipeId = await saveImportedRecipe({ recipe, sourceUrl });
  const supabase = createClient();

  const { error: mealPlanError } = await supabase.from("meal_plan").upsert(
    {
      date,
      meal_type: DEFAULT_MEAL_TYPE,
      recipe_id: recipeId,
    },
    { onConflict: "date,meal_type" },
  );

  if (mealPlanError) {
    throw new Error(mealPlanError.message);
  }
}
