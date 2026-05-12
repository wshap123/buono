import { asShoppingList } from "@/lib/recipe-import/parse-recipe-response";
import {
  getShoppingListDedupeKey,
  isBlockedShoppingListItem,
} from "@/lib/recipe-import/shopping-list-blocklist";
import { shoppingListCategories } from "@/lib/recipe-import/shopping-list";
import { getCurrentWeekDays, toDateKey } from "@/lib/meal-plan/week";
import { createClient } from "@/lib/supabase/server";
import type { RecipeShoppingList } from "@/lib/types/imported-recipe";

export interface WeeklyShoppingListItem {
  itemKey: string;
  label: string;
}

export interface WeeklyShoppingListGroup {
  key: keyof RecipeShoppingList;
  label: string;
  items: WeeklyShoppingListItem[];
}

interface MealPlanShoppingListRow {
  recipe:
    | {
        shopping_list: unknown;
      }
    | {
        shopping_list: unknown;
      }[]
    | null;
}

function getRecipeFromRow(recipe: MealPlanShoppingListRow["recipe"]) {
  if (!recipe) {
    return null;
  }

  return Array.isArray(recipe) ? (recipe[0] ?? null) : recipe;
}

export function compileWeeklyShoppingList(
  lists: RecipeShoppingList[],
): WeeklyShoppingListGroup[] {
  const seenByCategory = new Map<keyof RecipeShoppingList, Set<string>>();
  const itemsByCategory = new Map<
    keyof RecipeShoppingList,
    WeeklyShoppingListItem[]
  >();

  for (const category of shoppingListCategories) {
    seenByCategory.set(category.key, new Set());
    itemsByCategory.set(category.key, []);
  }

  for (const list of lists) {
    for (const category of shoppingListCategories) {
      const seen = seenByCategory.get(category.key)!;
      const items = itemsByCategory.get(category.key)!;

      for (const item of list[category.key]) {
        const label = item.trim();

        if (!label || isBlockedShoppingListItem(label)) {
          continue;
        }

        const dedupeKey = getShoppingListDedupeKey(label);

        if (!dedupeKey || seen.has(dedupeKey)) {
          continue;
        }

        seen.add(dedupeKey);
        items.push({
          itemKey: `${category.key}:${dedupeKey}`,
          label,
        });
      }
    }
  }

  return shoppingListCategories
    .map((category) => ({
      key: category.key,
      label: category.label,
      items: itemsByCategory.get(category.key) ?? [],
    }))
    .filter((group) => group.items.length > 0);
}

export async function getWeeklyShoppingList() {
  const weekDays = getCurrentWeekDays();
  const weekStart = toDateKey(weekDays[0]);
  const weekEnd = toDateKey(weekDays[6]);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plan")
    .select(
      `
        recipe:recipes (
          shopping_list
        )
      `,
    )
    .eq("meal_type", "dinner")
    .gte("date", weekStart)
    .lte("date", weekEnd)
    .not("recipe_id", "is", null);

  if (error) {
    throw new Error(error.message);
  }

  const shoppingLists = ((data ?? []) as MealPlanShoppingListRow[])
    .map((row) => getRecipeFromRow(row.recipe))
    .filter((recipe): recipe is NonNullable<typeof recipe> => recipe !== null)
    .map((recipe) => asShoppingList(recipe.shopping_list));

  return {
    weekStart,
    groups: compileWeeklyShoppingList(shoppingLists),
  };
}
