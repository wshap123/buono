import type { ImportedRecipe } from "@/lib/types/imported-recipe";

interface ImportRecipeMediaInput {
  data: string;
  mediaType: string;
}

interface ImportRecipeInput {
  text?: string;
  url?: string;
  image?: string;
  mediaType?: string;
  media?: ImportRecipeMediaInput[];
}

export async function importRecipe({
  text,
  url,
  image,
  mediaType,
  media,
}: ImportRecipeInput) {
  const response = await fetch("/api/import-recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      url,
      image,
      media_type: mediaType,
      media: media?.map((item) => ({
        data: item.data,
        media_type: item.mediaType,
      })),
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

export async function filesToImportMedia(files: File[]) {
  return Promise.all(
    files.map(async (file) => {
      const { data, mediaType } = await fileToBase64(file);

      return {
        data,
        mediaType,
      };
    }),
  );
}
