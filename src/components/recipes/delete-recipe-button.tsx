"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteRecipe } from "@/lib/recipes/delete-recipe";
import { cn } from "@/lib/utils";

interface DeleteRecipeButtonProps {
  recipeId: string;
  redirectToLibrary?: boolean;
  className?: string;
}

export function DeleteRecipeButton({
  recipeId,
  redirectToLibrary = false,
  className,
}: DeleteRecipeButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteRecipe(recipeId);
      setOpen(false);

      if (redirectToLibrary) {
        router.push("/recipes");
      }

      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete this recipe.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          "shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
          className,
        )}
        aria-label="Delete recipe"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setError(null);
          setOpen(true);
        }}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/70 bg-card p-5 shadow-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Dialog.Title className="text-base font-semibold text-foreground">
                  Delete this recipe?
                </Dialog.Title>
                <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                  This will also remove it from your meal plan.
                </Dialog.Description>
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl"
                  onClick={() => setOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-2xl"
                  onClick={handleConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Deleting
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
