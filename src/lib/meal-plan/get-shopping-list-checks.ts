import { createClient } from "@/lib/supabase/server";

export async function getShoppingListChecks(weekStart: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shopping_list_checks")
    .select("item_key, checked")
    .eq("week_start", weekStart);

  if (error) {
    throw new Error(error.message);
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [row.item_key, Boolean(row.checked)]),
  ) as Record<string, boolean>;
}
