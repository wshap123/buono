"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function saveShoppingListCheck(
  weekStart: string,
  itemKey: string,
  checked: boolean,
) {
  const supabase = await createClient();
  const { error } = await supabase.from("shopping_list_checks").upsert(
    {
      week_start: weekStart,
      item_key: itemKey,
      checked,
    },
    { onConflict: "week_start,item_key" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/overview");
}
