import { createClient } from "@/lib/supabase/client";
import type { ImportedRecipe } from "@/lib/types/imported-recipe";

interface SaveImportedRecipeInput {
  recipe: ImportedRecipe;
  sourceUrl?: string | null;
}

export async function saveImportedRecipe({
  recipe,
  sourceUrl,
}: SaveImportedRecipeInput) {
  const supabase = createClient();

  const { data: savedRecipe, error } = await supabase
    .from("recipes")
    .insert({
      title: recipe.title,
      description: recipe.description,
      source_url: sourceUrl?.trim() || null,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      shopping_list: recipe.shopping_list,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      servings: recipe.servings,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return savedRecipe.id;
}
