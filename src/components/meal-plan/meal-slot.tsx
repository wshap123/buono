"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock3, Plus } from "lucide-react";

import { AddMealSheet } from "@/components/meal-plan/add-meal-sheet";
import { Button } from "@/components/ui/button";
import type { MealSlot as MealSlotType } from "@/lib/types/meal-plan";
import { cn } from "@/lib/utils";

const mealLabels: Record<MealSlotType["type"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

interface MealSlotProps {
  slot: MealSlotType;
  date: string;
  weekday: string;
}

export function MealSlot({ slot, date, weekday }: MealSlotProps) {
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const label = mealLabels[slot.type];

  if (slot.recipe) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <Link
          href={`/recipes/${slot.recipe.id}`}
          className={cn(
            "group flex w-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3.5 text-left shadow-sm transition-colors",
            "hover:border-primary/25 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium text-foreground">
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
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-auto min-h-14 w-full justify-between rounded-2xl border-dashed bg-background/70 px-4 py-3.5 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
          aria-label={`Add ${label.toLowerCase()}`}
          onClick={() => setIsAddMealOpen(true)}
        >
          <span className="text-sm">Add a meal</span>
          <span className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-background">
            <Plus className="size-4" aria-hidden="true" />
          </span>
        </Button>
      </div>

      <AddMealSheet
        open={isAddMealOpen}
        onOpenChange={setIsAddMealOpen}
        date={date}
        weekday={weekday}
        mealType={slot.type}
      />
    </>
  );
}
