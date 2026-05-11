"use client";

import { Clock3, Users } from "lucide-react";

import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { FavoriteRecipeButton } from "@/components/recipes/favorite-recipe-button";

interface RecipeDetailHeaderProps {
  recipeId: string;
  title: string;
  description: string | null;
  cookTimeMinutes: number;
  servings: number | null;
  isFavorite: boolean;
}

export function RecipeDetailHeader({
  recipeId,
  title,
  description,
  cookTimeMinutes,
  servings,
  isFavorite,
}: RecipeDetailHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Recipe
        </p>
        <div className="flex items-center gap-1">
          <FavoriteRecipeButton recipeId={recipeId} isFavorite={isFavorite} />
          <DeleteRecipeButton recipeId={recipeId} redirectToLibrary />
        </div>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {cookTimeMinutes > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {cookTimeMinutes} min
          </span>
        ) : null}
        {servings ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
            <Users className="size-3.5" aria-hidden="true" />
            {servings} servings
          </span>
        ) : null}
      </div>
    </header>
  );
}
