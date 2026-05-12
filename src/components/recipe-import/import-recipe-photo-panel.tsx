"use client";

import { useRef } from "react";
import { ImageUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImportRecipePhotoPanelProps {
  selectedFiles: File[];
  onSelectedFilesChange: (files: File[]) => void;
  isImporting: boolean;
  onImport: () => void;
  inputId: string;
}

const maxFiles = 5;

export function ImportRecipePhotoPanel({
  selectedFiles,
  onSelectedFilesChange,
  isImporting,
  onImport,
  inputId,
}: ImportRecipePhotoPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
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
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`
              : "Upload up to 5 photos or PDFs"}
          </span>
          <span className="block text-sm text-muted-foreground">
            JPG, PNG, WEBP, GIF, or PDF
          </span>
        </span>
      </button>

      {selectedFiles.length > 0 ? (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {selectedFiles.map((file) => (
            <li key={`${file.name}-${file.lastModified}`} className="truncate">
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        multiple
        className="sr-only"
        disabled={isImporting}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []).slice(0, maxFiles);
          onSelectedFilesChange(files);
          event.target.value = "";
        }}
      />

      <Button
        type="button"
        className="h-11 w-full rounded-md"
        onClick={onImport}
        disabled={isImporting || selectedFiles.length === 0}
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
