"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { Bell, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveMealReminder } from "@/lib/meal-plan/save-meal-reminder";
import { cn } from "@/lib/utils";

interface MealReminderButtonProps {
  mealPlanId: string;
  mealDate: string;
  className?: string;
}

export function MealReminderButton({
  mealPlanId,
  mealDate,
  className,
}: MealReminderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setIsSaving(true);
    setError(null);

    try {
      await saveMealReminder({
        mealPlanId,
        message,
        mealDate,
      });
      setMessage("");
      setOpen(false);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this reminder.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={cn(
          "shrink-0 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary",
          className,
        )}
        aria-label="Add reminder"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setError(null);
          setOpen(true);
        }}
      >
        <Bell className="size-4" aria-hidden="true" />
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 supports-backdrop-filter:backdrop-blur-xs" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(100%-2rem,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border/70 bg-card p-5 shadow-2xl">
            <div className="space-y-4">
              <div className="space-y-2">
                <Dialog.Title className="text-base font-semibold text-foreground">
                  Add reminder
                </Dialog.Title>
                <Dialog.Description className="text-sm leading-6 text-muted-foreground">
                  Add a prep or defrost note for this meal.
                </Dialog.Description>
              </div>

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={isSaving}
                placeholder="Take chicken out of freezer tonight"
                className="min-h-28 w-full rounded-2xl border border-input bg-background/80 px-4 py-3 text-sm leading-6 transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-2xl"
                  onClick={() => setOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="rounded-2xl"
                  onClick={handleSave}
                  disabled={isSaving || !message.trim()}
                >
                  {isSaving ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Saving
                    </>
                  ) : (
                    "Save reminder"
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
