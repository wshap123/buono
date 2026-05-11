export interface RecipeListItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  rating: number | null;
  cookTimeMinutes: number;
}
