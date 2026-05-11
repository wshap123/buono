export function normalizeRecipeTag(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeRecipeTags(tags: string[]) {
  const seen = new Set<string>();
  const normalizedTags: string[] = [];

  for (const tag of tags) {
    const normalizedTag = normalizeRecipeTag(tag);

    if (!normalizedTag) {
      continue;
    }

    const key = normalizedTag.toLowerCase();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    normalizedTags.push(normalizedTag);
  }

  return normalizedTags;
}

export function asRecipeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return normalizeRecipeTags(
    value.map((tag) => (typeof tag === "string" ? tag : "")),
  );
}
