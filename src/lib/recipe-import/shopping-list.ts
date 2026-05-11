import type { RecipeShoppingList } from "@/lib/types/imported-recipe";

export const shoppingListCategories = [
  { key: "produce", label: "PRODUCE" },
  { key: "proteins", label: "PROTEINS" },
  { key: "dairy", label: "DAIRY" },
  { key: "pantry", label: "PANTRY" },
  { key: "spices", label: "SPICES" },
] as const satisfies ReadonlyArray<{
  key: keyof RecipeShoppingList;
  label: string;
}>;

export function hasShoppingListItems(shoppingList: RecipeShoppingList) {
  return shoppingListCategories.some(
    (category) => shoppingList[category.key].length > 0,
  );
}
