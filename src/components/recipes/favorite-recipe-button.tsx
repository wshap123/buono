"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setRecipeFavorite } from "@/lib/recipes/toggle-recipe-favorite";
import { cn } from "@/lib/utils";

interface FavoriteRecipeButtonProps {
  recipeId: string;
  isFavorite: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  className?: string;
}

export function FavoriteRecipeButton({
  recipeId,
  isFavorite,
  onFavoriteChange,
  className,
}: FavoriteRecipeButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite, recipeId]);

  async function handleToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const previousFavorite = favorite;
    const nextFavorite = !favorite;
    setFavorite(nextFavorite);
    onFavoriteChange?.(nextFavorite);
    setIsPending(true);

    try {
      await setRecipeFavorite(recipeId, nextFavorite);
      router.refresh();
    } catch {
      setFavorite(previousFavorite);
      onFavoriteChange?.(previousFavorite);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "size-9 shrink-0 rounded-full border-border/70 bg-background/90 shadow-sm hover:bg-primary/5",
        favorite && "border-primary/30 bg-primary/10",
        className,
      )}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      disabled={isPending}
      onClick={handleToggle}
    >
      <Heart
        className={cn(
          "size-5",
          favorite
            ? "fill-primary text-primary"
            : "text-muted-foreground",
        )}
        strokeWidth={favorite ? 0 : 2}
        aria-hidden="true"
      />
    </Button>
  );
}
