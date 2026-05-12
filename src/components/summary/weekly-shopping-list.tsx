"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { WeeklyShoppingListGroup } from "@/lib/meal-plan/compile-weekly-shopping-list";
import { cn } from "@/lib/utils";

interface WeeklyShoppingListProps {
  weekStart: string;
  groups: WeeklyShoppingListGroup[];
  initialCheckedByItemKey: Record<string, boolean>;
}

export function WeeklyShoppingList({
  weekStart,
  groups,
  initialCheckedByItemKey,
}: WeeklyShoppingListProps) {
  const [checkedByItemKey, setCheckedByItemKey] = useState(
    initialCheckedByItemKey,
  );
  const [pendingItemKeys, setPendingItemKeys] = useState<Set<string>>(
    new Set(),
  );

  async function handleToggle(itemKey: string, checked: boolean) {
    setCheckedByItemKey((current) => ({
      ...current,
      [itemKey]: checked,
    }));
    setPendingItemKeys((current) => new Set(current).add(itemKey));

    try {
      const supabase = createClient();
      const { error } = await supabase.from("shopping_list_checks").upsert(
        {
          week_start: weekStart,
          item_key: itemKey,
          checked,
        },
        { onConflict: "week_start,item_key" },
      );

      if (error) {
        throw error;
      }
    } catch {
      setCheckedByItemKey((current) => ({
        ...current,
        [itemKey]: !checked,
      }));
    } finally {
      setPendingItemKeys((current) => {
        const next = new Set(current);
        next.delete(itemKey);
        return next;
      });
    }
  }

  if (groups.length === 0) {
    return (
      <p className="editorial-muted-surface px-5 py-6 text-sm leading-6 text-muted-foreground">
        No shopping list items for this week&apos;s plan yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section
          key={group.key}
          aria-label={group.label}
          className="editorial-card px-5 py-5"
        >
          <h3 className="editorial-section-label text-muted-foreground">
            {group.label}
          </h3>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => {
              const checked = checkedByItemKey[item.itemKey] ?? false;
              const isPending = pendingItemKeys.has(item.itemKey);

              return (
                <li key={item.itemKey}>
                  <label
                    className={cn(
                      "flex items-start gap-3 rounded-md bg-background/80 px-3 py-2 text-sm transition-colors",
                      checked && "text-muted-foreground",
                      isPending && "opacity-70",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isPending}
                      onChange={(event) =>
                        handleToggle(item.itemKey, event.target.checked)
                      }
                      className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
                    />
                    <span className={cn(checked && "line-through")}>
                      {item.label}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
