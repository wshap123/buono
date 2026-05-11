import { createClient } from "@/lib/supabase/server";

export interface RecipeMadeLogSummary {
  count: number;
  lastMadeAt: string | null;
}

export async function getRecipeMadeLog(
  recipeId: string,
): Promise<RecipeMadeLogSummary> {
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("made_log")
    .select("made_at", { count: "exact" })
    .eq("recipe_id", recipeId)
    .order("made_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    count: count ?? 0,
    lastMadeAt: data?.[0]?.made_at ?? null,
  };
}
