"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PasteRecipeTextPanelProps {
  recipeText: string;
  onRecipeTextChange: (value: string) => void;
  isImporting: boolean;
  onImport: () => void;
  textInputId: string;
}

export function PasteRecipeTextPanel({
  recipeText,
  onRecipeTextChange,
  isImporting,
  onImport,
  textInputId,
}: PasteRecipeTextPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor={textInputId}
          className="text-sm font-medium text-foreground"
        >
          Recipe text
        </label>
        <textarea
          id={textInputId}
          value={recipeText}
          onChange={(event) => onRecipeTextChange(event.target.value)}
          disabled={isImporting}
          placeholder="Paste the full recipe text from a website, app, or cookbook."
          className="min-h-56 w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <Button
        type="button"
        className="h-11 w-full rounded-2xl"
        onClick={onImport}
        disabled={isImporting || !recipeText.trim()}
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
