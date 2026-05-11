import { createClient } from "@/lib/supabase/client";

export async function logRecipeMade(recipeId: string) {
  const supabase = createClient();
  const madeAt = new Date().toISOString();
  const { error } = await supabase.from("made_log").insert({
    recipe_id: recipeId,
    made_at: madeAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return madeAt;
}
