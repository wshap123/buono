import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import {
  buildRecipeExtractionPrompt,
  buildUrlRecipeImportPrompt,
} from "@/lib/recipe-import/extraction-prompt";
import {
  fetchRecipeUrlContent,
  parseRecipeUrl,
} from "@/lib/recipe-import/fetch-recipe-url-content";
import { parseImportedRecipeFromModelText } from "@/lib/recipe-import/parse-recipe-response";

const model = "claude-sonnet-4-5";
const maxContentLength = 150_000;
const maxMediaBytes = 5 * 1024 * 1024;
const maxMediaFiles = 5;

const supportedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type AnthropicImageMediaType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

type RecipeMediaInput = {
  data: string;
  media_type: string;
};

type RecipeContent =
  | {
      kind: "text";
      content: string;
    }
  | {
      kind: "media";
      blocks: Array<
        | {
            type: "image";
            source: {
              type: "base64";
              media_type: AnthropicImageMediaType;
              data: string;
            };
          }
        | {
            type: "document";
            source: {
              type: "base64";
              media_type: "application/pdf";
              data: string;
            };
          }
        | {
            type: "text";
            text: string;
          }
      >;
    };

type MediaContentBlock = Extract<RecipeContent, { kind: "media" }>["blocks"][number];

function prepareText(text: string) {
  return text.trim().slice(0, maxContentLength);
}

function estimateBase64Bytes(base64: string) {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function buildMediaBlock(media: RecipeMediaInput) {
  const mediaType = media.media_type.trim();

  if (supportedImageTypes.has(mediaType)) {
    return {
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: mediaType as AnthropicImageMediaType,
        data: media.data,
      },
    };
  }

  if (mediaType === "application/pdf") {
    return {
      type: "document" as const,
      source: {
        type: "base64" as const,
        media_type: "application/pdf" as const,
        data: media.data,
      },
    };
  }

  throw new Error("Only JPG, PNG, WEBP, GIF images, and PDF files are supported.");
}

function getRecipeContent(body: {
  text?: string;
  url?: string;
  image?: string;
  media_type?: string;
  media?: RecipeMediaInput[];
}): RecipeContent | null {
  const mediaItems = Array.isArray(body.media) ? body.media : [];

  if (mediaItems.length > 0) {
    if (mediaItems.length > maxMediaFiles) {
      throw new Error("You can upload up to 5 files at once.");
    }

    const blocks: MediaContentBlock[] = [];

    for (const media of mediaItems) {
      const data = media.data?.trim();
      const mediaType = media.media_type?.trim();

      if (!data || !mediaType) {
        throw new Error("Each uploaded file must include data and a media type.");
      }

      if (estimateBase64Bytes(data) > maxMediaBytes) {
        throw new Error("Each uploaded file must be 5 MB or smaller.");
      }

      blocks.push(buildMediaBlock({ data, media_type: mediaType }));
    }

    blocks.push({
      type: "text",
      text: buildRecipeExtractionPrompt("uploaded recipe files"),
    });

    return {
      kind: "media",
      blocks,
    };
  }

  const legacyImage = body.image?.trim();
  const legacyMediaType = body.media_type?.trim();

  if (legacyImage) {
    if (!legacyMediaType) {
      throw new Error("Uploaded files must include a media type.");
    }

    if (estimateBase64Bytes(legacyImage) > maxMediaBytes) {
      throw new Error("Each uploaded file must be 5 MB or smaller.");
    }

    return {
      kind: "media",
      blocks: [
        buildMediaBlock({ data: legacyImage, media_type: legacyMediaType }),
        {
          type: "text",
          text: buildRecipeExtractionPrompt("uploaded recipe files"),
        },
      ],
    };
  }

  const text = body.text?.trim();

  if (text) {
    const content = prepareText(text);

    if (!content) {
      throw new Error("Recipe text is required.");
    }

    return {
      kind: "text",
      content,
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: string;
      url?: string;
      image?: string;
      media_type?: string;
      media?: RecipeMediaInput[];
    };
    let recipeInput: RecipeContent | null = null;

    if (body.url?.trim()) {
      const url = parseRecipeUrl(body.url);
      const fetchedContent = await fetchRecipeUrlContent(url);

      recipeInput = {
        kind: "text",
        content: buildUrlRecipeImportPrompt(url, fetchedContent),
      };
    } else {
      recipeInput = getRecipeContent(body);
    }

    if (!recipeInput) {
      return NextResponse.json(
        {
          error:
            "Pasted recipe text, a recipe URL, or uploaded recipe files are required.",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const completion = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      temperature: 0,
      system:
        "You extract structured recipe data from pasted recipe text, recipe URLs, recipe photos, or recipe PDFs. Ignore all non-recipe content. Respond with only a valid raw JSON object. Do not include markdown, backticks, code fences, commentary, or any text before or after the JSON. In shopping_list, keep the full quantity and unit in every item string. Never include salt, pepper, olive oil, or other generic pantry staples in shopping_list.",
      messages: [
        {
          role: "user",
          content:
            recipeInput.kind === "media"
              ? recipeInput.blocks
              : [
                  {
                    type: "text",
                    text: `${buildRecipeExtractionPrompt("recipe text")}\n\n${recipeInput.content}`,
                  },
                ],
        },
      ],
    });

    const text = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json(
        { error: "Claude did not return recipe data." },
        { status: 502 },
      );
    }

    let recipe;

    try {
      recipe = parseImportedRecipeFromModelText(text);
    } catch (parseError) {
      const message =
        parseError instanceof Error
          ? parseError.message
          : "Claude returned recipe data in an invalid format.";

      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import recipe.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
