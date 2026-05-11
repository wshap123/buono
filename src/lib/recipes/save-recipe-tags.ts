import { createClient } from "@/lib/supabase/client";

import { normalizeRecipeTags } from "@/lib/recipes/normalize-recipe-tags";

export async function saveRecipeTags(recipeId: string, tags: string[]) {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ tags: normalizeRecipeTags(tags) })
    .eq("id", recipeId);

  if (error) {
    throw new Error(error.message);
  }
}
