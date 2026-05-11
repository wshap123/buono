import type { ImportedRecipe } from "@/lib/types/imported-recipe";

interface ImportRecipeInput {
  text?: string;
  image?: string;
  mediaType?: string;
}

export async function importRecipe({
  text,
  image,
  mediaType,
}: ImportRecipeInput) {
  const response = await fetch("/api/import-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      image,
      media_type: mediaType,
    }),
  });

  const payload = (await response.json()) as {
    recipe?: ImportedRecipe;
    error?: string;
  };

  if (!response.ok || !payload.recipe) {
    throw new Error(payload.error ?? "Could not import that recipe.");
  }

  return payload.recipe;
}

export async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return {
    mediaType: file.type,
    data: btoa(binary),
  };
}
