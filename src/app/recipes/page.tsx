import { RecipesLibrary } from "@/components/recipes/recipes-library";
import { getRecipes } from "@/lib/recipes/get-recipes";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top,_oklch(0.97_0.02_70)_0%,_var(--background)_42%)]">
      <RecipesLibrary recipes={recipes} />
    </main>
  );
}
