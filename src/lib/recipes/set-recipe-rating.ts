import { createClient } from "@/lib/supabase/client";

export async function setRecipeRating(recipeId: string, rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("recipes")
    .update({ rating })
    .eq("id", recipeId);

  if (error) {
    throw new Error(error.message);
  }
}
