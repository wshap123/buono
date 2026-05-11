export interface RecipeListItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  cookTimeMinutes: number;
}
