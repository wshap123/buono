import { createClient } from "@/lib/supabase/client";
import { saveImportedRecipe } from "@/lib/recipes/save-imported-recipe";
import type { ImportedRecipe } from "@/lib/types/imported-recipe";
import type { MealType } from "@/lib/types/meal-plan";

interface SaveImportedMealInput {
  recipe: ImportedRecipe;
  sourceUrl?: string | null;
  date: string;
  mealType: MealType;
}

export async function saveImportedMeal({
  recipe,
  sourceUrl,
  date,
  mealType,
}: SaveImportedMealInput) {
  const recipeId = await saveImportedRecipe({ recipe, sourceUrl });
  const supabase = createClient();

  const { error: mealPlanError } = await supabase.from("meal_plan").upsert(
    {
      date,
      meal_type: mealType,
      recipe_id: recipeId,
    },
    { onConflict: "date,meal_type" },
  );

  if (mealPlanError) {
    throw new Error(mealPlanError.message);
  }
}
