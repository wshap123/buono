import { createClient } from "@/lib/supabase/server";

export async function getRecipeNote(recipeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_notes")
    .select("id, note")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    note: data.note,
  };
}
