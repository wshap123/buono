"use client";

import { useRef } from "react";
import { ImageUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportRecipePhotoPanelProps {
  selectedFile: File | null;
  onSelectedFileChange: (file: File | null) => void;
  isImporting: boolean;
  onImport: () => void;
  inputId: string;
}

export function ImportRecipePhotoPanel({
  selectedFile,
  onSelectedFileChange,
  isImporting,
  onImport,
  inputId,
}: ImportRecipePhotoPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          Recipe photo
        </label>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isImporting}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/80 bg-background/80 px-4 py-8 text-center transition-colors",
            "hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ImageUp className="size-5" aria-hidden="true" />
          </span>
          <span className="space-y-1">
            <span className="block text-sm font-medium text-foreground">
              {selectedFile ? selectedFile.name : "Upload a cookbook page or screenshot"}
            </span>
            <span className="block text-sm text-muted-foreground">
              JPG, PNG, WEBP, or GIF
            </span>
          </span>
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={isImporting}
          onChange={(event) => {
            onSelectedFileChange(event.target.files?.[0] ?? null);
          }}
        />
      </div>

      <Button
        type="button"
        className="h-11 w-full rounded-md"
        onClick={onImport}
        disabled={isImporting || !selectedFile}
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
