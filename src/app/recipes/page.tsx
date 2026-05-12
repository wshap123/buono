import { RecipesLibrary } from "@/components/recipes/recipes-library";
import { getRecipes } from "@/lib/recipes/get-recipes";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <main className="min-h-full bg-background">
      <RecipesLibrary recipes={recipes} />
    </main>
  );
}
