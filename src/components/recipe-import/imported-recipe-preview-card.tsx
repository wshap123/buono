import { Clock3, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImportedRecipe } from "@/lib/types/imported-recipe";

interface ImportedRecipePreviewCardProps {
  recipe: ImportedRecipe;
}

function getTotalMinutes(recipe: ImportedRecipe) {
  return (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);
}

export function ImportedRecipePreviewCard({
  recipe,
}: ImportedRecipePreviewCardProps) {
  return (
    <Card className="rounded-3xl border-border/70 bg-background/80 py-0 shadow-sm">
      <CardHeader className="gap-3 border-b border-border/60">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {recipe.title}
        </CardTitle>
        {recipe.description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {recipe.description}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {getTotalMinutes(recipe) > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
              <Clock3 className="size-3.5" aria-hidden="true" />
              {getTotalMinutes(recipe)} min
            </span>
          ) : null}
          {recipe.servings ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
              <Users className="size-3.5" aria-hidden="true" />
              {recipe.servings} servings
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 py-5">
        {recipe.ingredients.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Ingredients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {recipe.ingredients.map((ingredient) => (
                <li
                  key={ingredient}
                  className="rounded-2xl bg-card px-3 py-2"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {recipe.instructions.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Instructions</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={`${index}-${instruction}`}
                  className="rounded-2xl bg-card px-3 py-2"
                >
                  <span className="mr-2 font-medium text-primary">
                    {index + 1}.
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
