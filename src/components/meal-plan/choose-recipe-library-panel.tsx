"use client";

import { useMemo } from "react";
import { Clock3, Heart, Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { RecipeListItem } from "@/lib/types/recipe";
import { cn } from "@/lib/utils";

interface ChooseRecipeLibraryPanelProps {
  recipes: RecipeListItem[];
  query: string;
  onQueryChange: (value: string) => void;
  isLoading: boolean;
  isAssigning: boolean;
  assigningRecipeId: string | null;
  onSelect: (recipeId: string) => void;
}

export function ChooseRecipeLibraryPanel({
  recipes,
  query,
  onQueryChange,
  isLoading,
  isAssigning,
  assigningRecipeId,
  onSelect,
}: ChooseRecipeLibraryPanelProps) {
  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return recipes;
    }

    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.description?.toLowerCase().includes(normalizedQuery),
    );
  }, [query, recipes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading recipes</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="relative shrink-0">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search recipes"
          disabled={isAssigning}
          className="h-11 rounded-md bg-background/80 pr-4 pl-11 text-base"
        />
      </div>

      {filteredRecipes.length > 0 ? (
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-1">
          {filteredRecipes.map((recipe) => {
            const isSelected = assigningRecipeId === recipe.id;

            return (
              <li key={recipe.id}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-md border border-border/70 bg-background/80 px-4 py-3 text-left transition-colors",
                    "hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isSelected && "border-primary/30 bg-primary/5",
                  )}
                  disabled={isAssigning}
                  onClick={() => onSelect(recipe.id)}
                >
                  <span className="min-w-0 space-y-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {recipe.title}
                      </span>
                      {recipe.isFavorite ? (
                        <Heart
                          className="size-4 shrink-0 fill-primary text-primary"
                          aria-label="Favorite"
                        />
                      ) : null}
                    </span>
                    {recipe.description ? (
                      <span className="line-clamp-2 block text-sm text-muted-foreground">
                        {recipe.description}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Loader2
                      className="size-4 shrink-0 animate-spin text-primary"
                      aria-hidden="true"
                    />
                  ) : recipe.cookTimeMinutes > 0 ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      <Clock3 className="size-3.5" aria-hidden="true" />
                      {recipe.cookTimeMinutes} min
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border/80 bg-card/80 px-4 py-5 text-sm leading-6 text-muted-foreground">
          {recipes.length === 0
            ? "No recipes saved yet. Add recipes from the Recipes tab first."
            : "No recipes match your search."}
        </p>
      )}
    </div>
  );
}
