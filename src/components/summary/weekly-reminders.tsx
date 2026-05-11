"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dismissMealReminder } from "@/lib/meal-plan/dismiss-meal-reminder";
import type { WeeklyReminder } from "@/lib/meal-plan/get-weekly-reminders";
import { cn } from "@/lib/utils";

interface WeeklyRemindersProps {
  reminders: WeeklyReminder[];
}

export function WeeklyReminders({ reminders }: WeeklyRemindersProps) {
  const router = useRouter();
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDismiss(reminderId: string) {
    setDismissingId(reminderId);
    setError(null);

    try {
      await dismissMealReminder(reminderId);
      router.refresh();
    } catch (dismissError) {
      setError(
        dismissError instanceof Error
          ? dismissError.message
          : "Could not dismiss this reminder.",
      );
    } finally {
      setDismissingId(null);
    }
  }

  if (reminders.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-border/80 bg-card/80 px-4 py-5 text-sm leading-6 text-muted-foreground">
        No reminders for this week yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {reminders.map((reminder) => {
          const isDismissing = dismissingId === reminder.id;

          return (
            <li
              key={reminder.id}
              className="flex items-start gap-3 rounded-3xl border border-border/70 bg-card/90 px-4 py-3 shadow-sm"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-sm text-foreground">{reminder.message}</p>
                <p className="text-xs text-muted-foreground">{reminder.weekday}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(
                  "shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
                  isDismissing && "opacity-70",
                )}
                aria-label="Dismiss reminder"
                disabled={isDismissing}
                onClick={() => handleDismiss(reminder.id)}
              >
                {isDismissing ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <X className="size-4" aria-hidden="true" />
                )}
              </Button>
            </li>
          );
        })}
      </ul>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
