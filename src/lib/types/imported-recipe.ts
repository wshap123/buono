export interface RecipeShoppingList {
  produce: string[];
  proteins: string[];
  dairy: string[];
  pantry: string[];
  spices: string[];
}

export interface ImportedRecipe {
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  shopping_list: RecipeShoppingList;
}
