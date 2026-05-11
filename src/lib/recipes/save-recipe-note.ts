import { createClient } from "@/lib/supabase/client";

interface SaveRecipeNoteInput {
  recipeId: string;
  noteId: string | null;
  note: string;
}

export async function saveRecipeNote({
  recipeId,
  noteId,
  note,
}: SaveRecipeNoteInput) {
  const supabase = createClient();
  const trimmedNote = note.trim();

  if (!trimmedNote) {
    if (!noteId) {
      return null;
    }

    const { error } = await supabase
      .from("recipe_notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      throw new Error(error.message);
    }

    return null;
  }

  if (noteId) {
    const { data, error } = await supabase
      .from("recipe_notes")
      .update({ note: trimmedNote })
      .eq("id", noteId)
      .select("id")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data.id;
  }

  const { data, error } = await supabase
    .from("recipe_notes")
    .insert({
      recipe_id: recipeId,
      note: trimmedNote,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}
