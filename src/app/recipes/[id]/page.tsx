import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RecipeDetailHeader } from "@/components/recipes/recipe-detail-header";
import { RecipeNotesSection } from "@/components/recipes/recipe-notes-section";
import { RecipeTagsSection } from "@/components/recipes/recipe-tags-section";
import { getRecipeMadeLog } from "@/lib/recipes/get-recipe-made-log";
import { getRecipeNote } from "@/lib/recipes/get-recipe-note";
import { asRecipeTags } from "@/lib/recipes/normalize-recipe-tags";
import { createClient } from "@/lib/supabase/server";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe, error } = await supabase
    .from("recipes")
    .select(
      "id, title, description, cook_time, prep_time, servings, ingredients, instructions, is_favorite, rating, tags",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!recipe) {
    notFound();
  }

  const cookTimeMinutes = (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);
  const ingredients = asStringArray(recipe.ingredients);
  const instructions = asStringArray(recipe.instructions);
  const tags = asRecipeTags(recipe.tags);
  const [recipeNote, madeLog] = await Promise.all([
    getRecipeNote(recipe.id),
    getRecipeMadeLog(recipe.id),
  ]);
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-10 pt-6 sm:px-6">
      <Link
        href="/recipes"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to recipes
      </Link>

      <RecipeDetailHeader
        recipeId={recipe.id}
        title={recipe.title}
        description={recipe.description}
        cookTimeMinutes={cookTimeMinutes}
        servings={recipe.servings}
        isFavorite={recipe.is_favorite}
        rating={recipe.rating}
        madeCount={madeLog.count}
        lastMadeAt={madeLog.lastMadeAt}
      />

      <section className="space-y-5 rounded-3xl border border-border/70 bg-card/90 px-4 py-5 shadow-sm">
        {ingredients.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Ingredients</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {ingredients.map((ingredient) => (
                <li key={ingredient} className="rounded-2xl bg-background/80 px-3 py-2">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {instructions.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-foreground">Instructions</h2>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {instructions.map((instruction, index) => (
                <li
                  key={`${index}-${instruction}`}
                  className="rounded-2xl bg-background/80 px-3 py-2"
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
      </section>

      <RecipeTagsSection recipeId={recipe.id} initialTags={tags} />

      <RecipeNotesSection
        recipeId={recipe.id}
        initialNote={recipeNote?.note ?? ""}
        initialNoteId={recipeNote?.id ?? null}
      />
    </div>
  );
}
