export interface RecipeListItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  rating: number | null;
  tags: string[];
  cookTimeMinutes: number;
}
