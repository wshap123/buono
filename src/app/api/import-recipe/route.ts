import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

import { buildRecipeExtractionPrompt } from "@/lib/recipe-import/extraction-prompt";
import {
  extractJsonFromModelText,
  parseImportedRecipe,
} from "@/lib/recipe-import/parse-recipe-response";

const model = "claude-sonnet-4-5";
const maxContentLength = 150_000;
const maxImageBytes = 5 * 1024 * 1024;
const supportedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function prepareText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, maxContentLength);
}

function estimateBase64Bytes(base64: string) {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

async function getRecipeContent(body: {
  text?: string;
  image?: string;
  media_type?: string;
}) {
  const text = body.text?.trim();
  const image = body.image?.trim();
  const mediaType = body.media_type?.trim();

  if (image) {
    if (!mediaType || !supportedImageTypes.has(mediaType)) {
      throw new Error("Only JPG, PNG, WEBP, and GIF images are supported.");
    }

    if (estimateBase64Bytes(image) > maxImageBytes) {
      throw new Error("Recipe images must be 5 MB or smaller.");
    }

    return {
      kind: "image" as const,
      image,
      mediaType,
    };
  }

  if (text) {
    const content = prepareText(text);

    if (!content) {
      throw new Error("Recipe text is required.");
    }

    return {
      kind: "text" as const,
      content,
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      text?: string;
      image?: string;
      media_type?: string;
    };
    const recipeInput = await getRecipeContent(body);

    if (!recipeInput) {
      return NextResponse.json(
        {
          error: "Pasted recipe text or a recipe image is required.",
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
        "You extract structured recipe data from pasted recipe text or recipe photos. Ignore all non-recipe content. Return only valid JSON with no markdown, commentary, or extra text. In shopping_list, keep the full quantity and unit in every item string.",
      messages: [
        {
          role: "user",
          content:
            recipeInput.kind === "image"
              ? [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: recipeInput.mediaType as
                        | "image/jpeg"
                        | "image/png"
                        | "image/webp"
                        | "image/gif",
                      data: recipeInput.image,
                    },
                  },
                  {
                    type: "text",
                    text: buildRecipeExtractionPrompt("recipe photo"),
                  },
                ]
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

    const recipe = parseImportedRecipe(
      JSON.parse(extractJsonFromModelText(text)),
    );

    return NextResponse.json({ recipe });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to import recipe.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
