import type {
  ImportedRecipe,
  RecipeShoppingList,
} from "@/lib/types/imported-recipe";

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

const shoppingListCategories = [
  "produce",
  "proteins",
  "dairy",
  "pantry",
  "spices",
] as const;

export function asShoppingList(value: unknown): RecipeShoppingList {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return shoppingListCategories.reduce<RecipeShoppingList>((shoppingList, category) => {
    shoppingList[category] = asStringArray(source[category]);
    return shoppingList;
  }, {
    produce: [],
    proteins: [],
    dairy: [],
    pantry: [],
    spices: [],
  });
}

function asNullableNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
  }

  return null;
}

export function parseImportedRecipe(value: unknown): ImportedRecipe {
  if (!value || typeof value !== "object") {
    throw new Error("Recipe response was not a JSON object.");
  }

  const recipe = value as Record<string, unknown>;
  const title = typeof recipe.title === "string" ? recipe.title.trim() : "";

  if (!title) {
    throw new Error("Recipe response was missing a title.");
  }

  return {
    title,
    description:
      typeof recipe.description === "string" ? recipe.description.trim() || null : null,
    ingredients: asStringArray(recipe.ingredients),
    instructions: asStringArray(recipe.instructions),
    prep_time: asNullableNumber(recipe.prep_time),
    cook_time: asNullableNumber(recipe.cook_time),
    servings: asNullableNumber(recipe.servings),
    shopping_list: asShoppingList(recipe.shopping_list),
  };
}

export function extractJsonFromModelText(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Recipe response did not include JSON.");
  }

  return trimmed.slice(firstBrace, lastBrace + 1);
}
