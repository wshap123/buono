const pantryStaples = [
  "salt",
  "sea salt",
  "kosher salt",
  "pepper",
  "black pepper",
  "ground pepper",
  "white pepper",
  "olive oil",
  "extra-virgin olive oil",
  "extra virgin olive oil",
  "vegetable oil",
  "canola oil",
  "cooking oil",
  "neutral oil",
  "water",
  "butter",
  "unsalted butter",
  "salted butter",
  "flour",
  "all-purpose flour",
  "sugar",
  "granulated sugar",
  "brown sugar",
  "baking powder",
  "baking soda",
  "vanilla extract",
  "garlic powder",
  "onion powder",
  "paprika",
  "cayenne pepper",
  "red pepper flakes",
  "dried oregano",
  "dried basil",
  "dried thyme",
  "ground cinnamon",
  "cinnamon",
  "cornstarch",
  "corn starch",
  "rice vinegar",
  "white vinegar",
  "apple cider vinegar",
  "soy sauce",
  "honey",
  "cooking spray",
];

function normalizeShoppingListLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getShoppingListDedupeKey(label: string) {
  const normalized = normalizeShoppingListLabel(label);
  const withoutQuantity = normalized
    .replace(
      /^(?:\d+(?:\.\d+)?(?:\s*[-/]\s*\d+(?:\.\d+)?)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*/,
      "",
    )
    .replace(
      /^(?:(?:\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s+)?(?:cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|ounce|ounces|oz|pound|pounds|lb|lbs|gram|grams|g|kilogram|kilograms|kg|milliliter|milliliters|ml|liter|liters|l|clove|cloves|can|cans|package|packages|pkg|bunch|bunches|slice|slices|pinch|pinches|dash|dashes|head|heads|stalk|stalks|sprig|sprigs|stick|sticks)\s+/,
      "",
    )
    .replace(/^(?:small|medium|large|extra large|extra-large)\s+/, "")
    .trim();

  return withoutQuantity || normalized;
}

export function isBlockedShoppingListItem(label: string) {
  const normalized = normalizeShoppingListLabel(label);

  if (!normalized) {
    return true;
  }

  return pantryStaples.some((blockedItem) => {
    const normalizedBlockedItem = normalizeShoppingListLabel(blockedItem);

    return (
      normalized === normalizedBlockedItem ||
      normalized.startsWith(`${normalizedBlockedItem} `) ||
      normalized.endsWith(` ${normalizedBlockedItem}`) ||
      normalized.includes(` ${normalizedBlockedItem} `)
    );
  });
}
