export function buildRecipeExtractionPrompt(sourceLabel: string) {
  return `Extract a recipe from the ${sourceLabel} below.

Ignore all image tags, photo captions, ads, navigation text, comments, ratings, and any text unrelated to the recipe itself.

Respond with only a valid raw JSON object. Do not include markdown, backticks, code fences, commentary, or any text before or after the JSON.

Return clean JSON only with exactly these keys:
- title (string; extract the recipe title from the source text or image)
- description (string or null)
- ingredients (array of strings; include quantity and unit when the source provides them)
- instructions (array of step strings)
- prep_time (integer minutes or null)
- cook_time (integer minutes or null)
- servings (integer or null)
- shopping_list (object with keys produce, proteins, dairy, pantry, and spices; each value is an array of deduplicated grocery-store item strings)

Rules:
- Extract only recipe content supported by the source.
- Use null when a value is missing.
- Do not invent ingredients, steps, or shopping-list items.
- Keep ingredients and instructions clean and recipe-focused.
- shopping_list must be deduplicated and formatted for grocery shopping, grouped only into produce, proteins, dairy, pantry, and spices.
- Never include salt, pepper, olive oil, or other generic pantry staples in shopping_list.
- Every shopping_list item must include the full quantity and unit from the recipe when the source provides them. Keep the amount at the start of the string, followed by the ingredient name and any important qualifiers.
- Do not shorten shopping_list items to ingredient names only. Use strings like "4 boneless center-cut pork chops" and "2 large eggs", not "pork chops" or "eggs".
- When the source gives a range, fraction, or written amount, preserve it in the shopping_list item (for example, "1/2 cup olive oil" or "1-2 tablespoons butter").
- Build shopping_list from the recipe ingredients, but rewrite each item for grocery shopping and place it in the correct category.`;
}

export function buildUrlRecipeImportPrompt(
  url: string,
  fetchedContent: string | null,
) {
  const sections = [
    buildRecipeExtractionPrompt("recipe URL"),
    "",
    "Recipe URL:",
    url,
    "",
    "If you recognize this URL from your training knowledge and can reliably reconstruct the recipe, use that knowledge first.",
    "When fetched page content is available below, use it to verify and complete the recipe.",
    "If fetched page content is unavailable or incomplete, rely on recognized knowledge only when you are confident it matches this URL.",
  ];

  if (fetchedContent) {
    sections.push("", "Fetched page content:", fetchedContent);
  } else {
    sections.push(
      "",
      "No usable page content was available from a server-side fetch.",
    );
  }

  return sections.join("\n");
}
