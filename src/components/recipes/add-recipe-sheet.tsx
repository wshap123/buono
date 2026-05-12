"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  FileText,
  Link2,
  Loader2,
} from "lucide-react";

import { ImportedRecipePreviewCard } from "@/components/recipe-import/imported-recipe-preview-card";
import { ImportRecipePhotoPanel } from "@/components/recipe-import/import-recipe-photo-panel";
import { PasteRecipeLinkPanel } from "@/components/recipe-import/paste-recipe-link-panel";
import { PasteRecipeTextPanel } from "@/components/recipe-import/paste-recipe-text-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { filesToImportMedia, importRecipe } from "@/lib/recipe-import/import-recipe";
import { saveImportedRecipe } from "@/lib/recipes/save-imported-recipe";
import type { ImportedRecipe } from "@/lib/types/imported-recipe";
import { cn } from "@/lib/utils";

type AddRecipeStep =
  | "options"
  | "paste-text"
  | "paste-link"
  | "import-photo"
  | "preview";
type ImportSource = "paste-text" | "paste-link" | "import-photo";

const addRecipeOptions = [
  {
    id: "paste-text",
    title: "Paste recipe text",
    description: "Paste copied text from a recipe page or cookbook.",
    icon: FileText,
    step: "paste-text" as const,
  },
  {
    id: "paste-link",
    title: "Paste a link",
    description: "Import a recipe from a recipe website URL.",
    icon: Link2,
    step: "paste-link" as const,
  },
  {
    id: "import-photo",
    title: "Import from photo or PDF",
    description: "Upload up to 5 cookbook pages, screenshots, or PDFs.",
    icon: Camera,
    step: "import-photo" as const,
  },
] as const;

interface AddRecipeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRecipeSheet({ open, onOpenChange }: AddRecipeSheetProps) {
  const router = useRouter();
  const [step, setStep] = useState<AddRecipeStep>("options");
  const [importSource, setImportSource] = useState<ImportSource>("paste-text");
  const [recipeText, setRecipeText] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [importedRecipe, setImportedRecipe] = useState<ImportedRecipe | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("options");
      setImportSource("paste-text");
      setRecipeText("");
      setRecipeUrl("");
      setSelectedFiles([]);
      setImportedRecipe(null);
      setError(null);
      setIsImporting(false);
      setIsSaving(false);
    }
  }, [open]);

  async function handleImportText() {
    const trimmedText = recipeText.trim();

    if (!trimmedText) {
      setError("Paste recipe text to continue.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const recipe = await importRecipe({ text: trimmedText });
      setImportSource("paste-text");
      setImportedRecipe(recipe);
      setStep("preview");
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Could not import that recipe.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleImportLink() {
    const trimmedUrl = recipeUrl.trim();

    if (!trimmedUrl) {
      setError("Paste a recipe URL to continue.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const recipe = await importRecipe({ url: trimmedUrl });
      setImportSource("paste-link");
      setImportedRecipe(recipe);
      setStep("preview");
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Could not import that recipe.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleImportPhoto() {
    if (selectedFiles.length === 0) {
      setError("Choose at least one recipe photo or PDF to continue.");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const media = await filesToImportMedia(selectedFiles);
      const recipe = await importRecipe({ media });
      setImportSource("import-photo");
      setImportedRecipe(recipe);
      setStep("preview");
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Could not import that recipe.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSave() {
    if (!importedRecipe) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveImportedRecipe({
        recipe: importedRecipe,
        sourceUrl: importSource === "paste-link" ? recipeUrl.trim() : null,
      });

      onOpenChange(false);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this recipe.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    setError(null);

    if (step === "preview") {
      setStep(importSource);
      return;
    }

    setStep("options");
  }

  const stepTitle =
    step === "preview"
      ? "Review recipe"
      : step === "paste-text"
        ? "Paste recipe text"
        : step === "paste-link"
          ? "Paste a link"
        : step === "import-photo"
          ? "Import from photo or PDF"
          : "Add recipe";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "flex max-h-[85vh] flex-col gap-0 rounded-t-[2rem] border-border/70 bg-card px-0 pt-3 shadow-2xl",
          step === "preview"
            ? "pb-0"
            : "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
        )}
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-1 h-1.5 w-14 rounded-full bg-border/80"
        />

        <SheetHeader className="shrink-0 gap-1.5 px-5 pt-2 text-left">
          <div className="flex items-center gap-2">
            {step !== "options" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 rounded-full"
                onClick={handleBack}
                disabled={isImporting || isSaving}
                aria-label="Go back"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Button>
            ) : null}
            <div className="min-w-0 space-y-1">
              <SheetTitle className="text-xl font-semibold tracking-tight">
                {stepTitle}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Save a recipe to your library without adding it to the meal plan.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {step === "preview" && importedRecipe ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-4">
              <ImportedRecipePreviewCard recipe={importedRecipe} />
              {error ? (
                <p className="pt-4 text-sm text-destructive">{error}</p>
              ) : null}
            </div>

            <div className="shrink-0 border-t border-border/70 bg-card px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <Button
                type="button"
                className="h-11 w-full rounded-md"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Saving recipe
                  </>
                ) : (
                  "Save recipe"
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="px-5 pt-5">
            {step === "options" ? (
              <div className="flex flex-col gap-3">
                {addRecipeOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-4 rounded-md border border-border/70 bg-background/80 px-4 py-4 text-left transition-colors",
                        "hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      )}
                      onClick={() => {
                        setError(null);
                        setStep(option.step);
                      }}
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1 space-y-1">
                        <span className="block text-sm font-medium text-foreground">
                          {option.title}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                      <ChevronRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}

            {step === "paste-text" ? (
              <PasteRecipeTextPanel
                recipeText={recipeText}
                onRecipeTextChange={setRecipeText}
                isImporting={isImporting}
                onImport={handleImportText}
                textInputId="library-recipe-text"
              />
            ) : null}

            {step === "paste-link" ? (
              <PasteRecipeLinkPanel
                recipeUrl={recipeUrl}
                onRecipeUrlChange={setRecipeUrl}
                isImporting={isImporting}
                onImport={handleImportLink}
                inputId="library-recipe-url"
              />
            ) : null}

            {step === "import-photo" ? (
              <ImportRecipePhotoPanel
                selectedFiles={selectedFiles}
                onSelectedFilesChange={setSelectedFiles}
                isImporting={isImporting}
                onImport={handleImportPhoto}
                inputId="library-recipe-photo"
              />
            ) : null}

            {error ? (
              <p className="pt-4 text-sm text-destructive">{error}</p>
            ) : null}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
