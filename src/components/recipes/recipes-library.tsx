"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Clock3, Heart, Plus, Search } from "lucide-react";

import { AddRecipeSheet } from "@/components/recipes/add-recipe-sheet";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { RecipeListItem } from "@/lib/types/recipe";

interface RecipesLibraryProps {
  recipes: RecipeListItem[];
}

export function RecipesLibrary({ recipes }: RecipesLibraryProps) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return recipes.filter((recipe) => {
      if (favoritesOnly && !recipe.isFavorite) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.description?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [favoritesOnly, query, recipes]);

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

          <label className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/80 px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Favorites only</p>
              <p className="text-sm text-muted-foreground">
                Show recipes you have marked as favorites.
              </p>
            </div>
            <Switch
              checked={favoritesOnly}
              onCheckedChange={setFavoritesOnly}
              aria-label="Show favorites only"
            />
          </label>
        </div>

        {filteredRecipes.length > 0 ? (
          <section aria-label="Recipe list" className="space-y-3">
            {filteredRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="flex items-center gap-2 rounded-3xl border border-border/70 bg-card/90 px-4 py-4 shadow-sm transition-colors hover:border-primary/25 hover:bg-primary/5"
              >
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3"
                >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {recipe.title}
                    </p>
                    {recipe.isFavorite ? (
                      <Heart
                        className="size-4 shrink-0 fill-primary text-primary"
                        aria-label="Favorite"
                      />
                    ) : null}
                  </div>
                  {recipe.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {recipe.description}
                    </p>
                  ) : null}
                </div>
                {recipe.cookTimeMinutes > 0 ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {recipe.cookTimeMinutes} min
                  </span>
                ) : null}
                </Link>
                <DeleteRecipeButton recipeId={recipe.id} />
              </article>
            ))}
          </section>
        ) : (
          <p className="rounded-3xl border border-dashed border-border/80 bg-card/80 px-4 py-5 text-sm leading-6 text-muted-foreground">
            {recipes.length === 0
              ? "No recipes saved yet. Tap the plus button to add your first recipe."
              : "No recipes match your search or favorites filter."}
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
