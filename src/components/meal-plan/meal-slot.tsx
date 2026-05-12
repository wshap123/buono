"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock3, Plus } from "lucide-react";

import { AddMealSheet } from "@/components/meal-plan/add-meal-sheet";
import { MealReminderButton } from "@/components/meal-plan/meal-reminder-button";
import { RemoveMealButton } from "@/components/meal-plan/remove-meal-button";
import { Button } from "@/components/ui/button";
import type { MealSlot as MealSlotType } from "@/lib/types/meal-plan";
import { cn } from "@/lib/utils";

interface MealSlotProps {
  slot: MealSlotType;
  date: string;
  weekday: string;
}

export function MealSlot({ slot, date, weekday }: MealSlotProps) {
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);

  if (slot.recipe) {
    return (
      <div className="flex items-stretch gap-2">
        <Link
          href={`/recipes/${slot.recipe.id}`}
          className={cn(
            "group editorial-card flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-4 text-left transition-colors",
            "hover:border-primary/25 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate font-heading text-base font-semibold text-foreground">
              {slot.recipe.name}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
              {slot.recipe.cookTimeMinutes} min
            </p>
          </div>
          <span className="text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            View
          </span>
        </Link>
        {slot.mealPlanId ? (
          <>
            <MealReminderButton
              mealPlanId={slot.mealPlanId}
              mealDate={date}
              className="self-center"
            />
            <RemoveMealButton
              mealPlanId={slot.mealPlanId}
              recipeName={slot.recipe.name}
              className="self-center"
            />
          </>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-auto min-h-14 w-full justify-between rounded-md border-dashed bg-background/70 px-4 py-3.5 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
        aria-label="Add dinner"
        onClick={() => setIsAddMealOpen(true)}
      >
        <span className="text-sm">Add dinner</span>
        <span className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-background">
          <Plus className="size-4" aria-hidden="true" />
        </span>
      </Button>

      <AddMealSheet
        open={isAddMealOpen}
        onOpenChange={setIsAddMealOpen}
        date={date}
        weekday={weekday}
      />
    </>
  );
}
