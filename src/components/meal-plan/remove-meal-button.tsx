"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { removeMealFromPlan } from "@/lib/meal-plan/remove-meal-from-plan";
import { cn } from "@/lib/utils";

interface RemoveMealButtonProps {
  mealPlanId: string;
  recipeName: string;
  className?: string;
}

export function RemoveMealButton({
  mealPlanId,
  recipeName,
  className,
}: RemoveMealButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsRemoving(true);
    setError(null);

    try {
      await removeMealFromPlan(mealPlanId);
      setOpen(false);
      router.refresh();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Could not remove this meal from your plan.",
      );
    } finally {
      setIsRemoving(false);
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
        aria-label={`Remove ${recipeName} from plan`}
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
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border/70 bg-card p-5 shadow-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Dialog.Title className="text-base font-semibold text-foreground">
                  Remove from plan?
                </Dialog.Title>
                <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                  {recipeName} will be removed from this day. The recipe stays in
                  your library.
                </Dialog.Description>
              </div>

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-md"
                  onClick={() => setOpen(false)}
                  disabled={isRemoving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-md"
                  onClick={handleConfirm}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Removing
                    </>
                  ) : (
                    "Remove"
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
