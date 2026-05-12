"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasteRecipeLinkPanelProps {
  recipeUrl: string;
  onRecipeUrlChange: (value: string) => void;
  isImporting: boolean;
  onImport: () => void;
  inputId: string;
}

function isLikelyRecipeUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function PasteRecipeLinkPanel({
  recipeUrl,
  onRecipeUrlChange,
  isImporting,
  onImport,
  inputId,
}: PasteRecipeLinkPanelProps) {
  return (
    <div className="space-y-4">
      <Input
        id={inputId}
        type="url"
        inputMode="url"
        value={recipeUrl}
        onChange={(event) => onRecipeUrlChange(event.target.value)}
        disabled={isImporting}
        aria-label="Recipe URL"
        placeholder="https://example.com/recipe"
        className="h-11 rounded-md bg-background/80 px-4 text-base"
      />

      <Button
        type="button"
        className="h-11 w-full rounded-md"
        onClick={onImport}
        disabled={isImporting || !isLikelyRecipeUrl(recipeUrl)}
      >
        {isImporting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Importing recipe
          </>
        ) : (
          "Import"
        )}
      </Button>
    </div>
  );
}
