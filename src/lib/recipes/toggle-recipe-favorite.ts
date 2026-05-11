import { createClient } from "@/lib/supabase/client";

export async function setRecipeFavorite(
  recipeId: string,
  isFavorite: boolean,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ is_favorite: isFavorite })
    .eq("id", recipeId);

  if (error) {
    throw new Error(error.message);
  }
}
