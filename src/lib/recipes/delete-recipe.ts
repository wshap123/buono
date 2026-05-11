import { createClient } from "@/lib/supabase/client";

export async function deleteRecipe(recipeId: string) {
  const supabase = createClient();

  const { error: mealPlanError } = await supabase
    .from("meal_plan")
    .delete()
    .eq("recipe_id", recipeId);

  if (mealPlanError) {
    throw new Error(mealPlanError.message);
  }

  const { error: notesError } = await supabase
    .from("recipe_notes")
    .delete()
    .eq("recipe_id", recipeId);

  if (notesError) {
    throw new Error(notesError.message);
  }

  const { error: recipeError } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId);

  if (recipeError) {
    throw new Error(recipeError.message);
  }
}
