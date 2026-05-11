"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { setRecipeRating } from "@/lib/recipes/set-recipe-rating";
import { cn } from "@/lib/utils";

const ratingValues = [1, 2, 3, 4, 5] as const;

interface RecipeRatingProps {
  recipeId?: string;
  rating: number | null;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

export function RecipeRating({
  recipeId,
  rating,
  onRatingChange,
  interactive = false,
  className,
}: RecipeRatingProps) {
  const router = useRouter();
  const [currentRating, setCurrentRating] = useState(rating);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentRating(rating);
  }, [rating, recipeId]);

  async function handleSelect(value: number) {
    if (!interactive || !recipeId || isSaving) {
      return;
    }

    const previousRating = currentRating;
    setCurrentRating(value);
    onRatingChange?.(value);
    setIsSaving(true);
    setError(null);

    try {
      await setRecipeRating(recipeId, value);
      router.refresh();
    } catch (saveError) {
      setCurrentRating(previousRating);
      if (previousRating !== null) {
        onRatingChange?.(previousRating);
      }
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this rating.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <div
        role={interactive ? "group" : undefined}
        aria-label={interactive ? "Recipe rating" : undefined}
        className="flex items-center gap-1"
      >
        {ratingValues.map((value) => {
          const isFilled = currentRating !== null && value <= currentRating;

          if (interactive) {
            return (
              <button
                key={value}
                type="button"
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                aria-label={`Rate ${value} out of 5`}
                disabled={isSaving}
                onClick={() => handleSelect(value)}
              >
                <Star
                  className={cn(
                    "size-5",
                    isFilled && "fill-primary text-primary",
                  )}
                  strokeWidth={isFilled ? 0 : 2}
                  aria-hidden="true"
                />
              </button>
            );
          }

          return (
            <Star
              key={value}
              className={cn(
                "size-4",
                isFilled ? "fill-primary text-primary" : "text-muted-foreground/50",
              )}
              strokeWidth={isFilled ? 0 : 2}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
