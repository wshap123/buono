import { asRecipeTags } from "@/lib/recipes/normalize-recipe-tags";
import { createClient } from "@/lib/supabase/client";
import type { RecipeListItem } from "@/lib/types/recipe";

interface RecipeRow {
  id: string;
  title: string;
  description: string | null;
  is_favorite: boolean;
  rating: number | null;
  tags: string[] | null;
  prep_time: number | null;
  cook_time: number | null;
}

export async function fetchRecipesClient(): Promise<RecipeListItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, description, is_favorite, rating, tags, prep_time, cook_time")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RecipeRow[]).map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    isFavorite: recipe.is_favorite,
    rating: recipe.rating,
    tags: asRecipeTags(recipe.tags),
    cookTimeMinutes: (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0),
  }));
}
