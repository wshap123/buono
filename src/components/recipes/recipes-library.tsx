"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock3, Heart, Plus, Search } from "lucide-react";

import { AddRecipeSheet } from "@/components/recipes/add-recipe-sheet";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { FavoriteRecipeButton } from "@/components/recipes/favorite-recipe-button";
import { RecipeRating } from "@/components/recipes/recipe-rating";
import { RecipeTagFilter } from "@/components/recipes/recipe-tag-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RecipeListItem } from "@/lib/types/recipe";
import { cn } from "@/lib/utils";

interface RecipesLibraryProps {
  recipes: RecipeListItem[];
}

export function RecipesLibrary({ recipes }: RecipesLibraryProps) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [favoriteByRecipeId, setFavoriteByRecipeId] = useState<
    Record<string, boolean>
  >(() => Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe.isFavorite])));

  useEffect(() => {
    setFavoriteByRecipeId(
      Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe.isFavorite])),
    );
  }, [recipes]);

  const recipesWithFavorites = useMemo(
    () =>
      recipes.map((recipe) => ({
        ...recipe,
        isFavorite: favoriteByRecipeId[recipe.id] ?? recipe.isFavorite,
      })),
    [favoriteByRecipeId, recipes],
  );

  const availableTags = useMemo(() => {
    const tagMap = new Map<string, string>();

    for (const recipe of recipes) {
      for (const tag of recipe.tags) {
        const key = tag.toLowerCase();

        if (!tagMap.has(key)) {
          tagMap.set(key, tag);
        }
      }
    }

    return Array.from(tagMap.values()).sort((left, right) =>
      left.localeCompare(right),
    );
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recipesWithFavorites.filter((recipe) => {
      if (favoritesOnly && !recipe.isFavorite) {
        return false;
      }

      if (selectedTags.length > 0) {
        const recipeTagKeys = new Set(
          recipe.tags.map((tag) => tag.toLowerCase()),
        );
        const matchesAllSelectedTags = selectedTags.every((tag) =>
          recipeTagKeys.has(tag.toLowerCase()),
        );

        if (!matchesAllSelectedTags) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.description?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [favoritesOnly, query, recipesWithFavorites, selectedTags]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pt-6 sm:px-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
              Buono
            </p>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Recipes
              </h1>
              <p className="text-sm text-muted-foreground">
                {recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="icon"
            className="size-11 shrink-0 rounded-2xl"
            aria-label="Add recipe"
            onClick={() => setIsAddRecipeOpen(true)}
          >
            <Plus className="size-5" aria-hidden="true" />
          </Button>
        </header>

        <div className="space-y-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search recipes"
              className="h-11 rounded-2xl bg-background/80 pr-4 pl-11 text-base"
            />
          </div>

          <RecipeTagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onSelectedTagsChange={setSelectedTags}
          />

          <Button
            type="button"
            variant={favoritesOnly ? "default" : "outline"}
            className={cn(
              "h-11 w-full justify-center gap-2 rounded-2xl",
              !favoritesOnly && "border-border/70 bg-card/80",
            )}
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((current) => !current)}
          >
            <Heart
              className={cn(
                "size-4",
                favoritesOnly ? "fill-current" : "text-muted-foreground",
              )}
              strokeWidth={favoritesOnly ? 0 : 2}
              aria-hidden="true"
            />
            Favorites
          </Button>
        </div>

        {filteredRecipes.length > 0 ? (
          <section aria-label="Recipe list" className="space-y-3">
            {filteredRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="rounded-3xl border border-border/70 bg-card/90 px-4 py-4 shadow-sm transition-colors hover:border-primary/25 hover:bg-primary/5"
              >
                <div className="flex items-start gap-3">
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {recipe.title}
                      </p>
                      {recipe.description ? (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {recipe.description}
                        </p>
                      ) : null}
                      <RecipeRating rating={recipe.rating} />
                    </div>
                    {recipe.cookTimeMinutes > 0 ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        <Clock3 className="size-3.5" aria-hidden="true" />
                        {recipe.cookTimeMinutes} min
                      </span>
                    ) : null}
                  </Link>
                  <div className="flex shrink-0 items-center gap-1">
                    <FavoriteRecipeButton
                      recipeId={recipe.id}
                      isFavorite={recipe.isFavorite}
                      onFavoriteChange={(isFavorite) =>
                        setFavoriteByRecipeId((current) => ({
                          ...current,
                          [recipe.id]: isFavorite,
                        }))
                      }
                    />
                    <DeleteRecipeButton recipeId={recipe.id} />
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <p className="rounded-3xl border border-dashed border-border/80 bg-card/80 px-4 py-5 text-sm leading-6 text-muted-foreground">
            {recipes.length === 0
              ? "No recipes saved yet. Tap the plus button to add your first recipe."
              : "No recipes match your search, tags, or favorites filter."}
          </p>
        )}
      </div>

      <AddRecipeSheet
        open={isAddRecipeOpen}
        onOpenChange={setIsAddRecipeOpen}
      />
    </>
  );
}
