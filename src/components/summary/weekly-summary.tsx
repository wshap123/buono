import Link from "next/link";

import { WeeklyReminders } from "@/components/summary/weekly-reminders";
import { WeeklyShoppingList } from "@/components/summary/weekly-shopping-list";
import { getWeeklyShoppingList } from "@/lib/meal-plan/compile-weekly-shopping-list";
import { getWeeklyMealPlan } from "@/lib/meal-plan/get-weekly-meal-plan";
import { getWeeklyReminders } from "@/lib/meal-plan/get-weekly-reminders";
import { getShoppingListChecks } from "@/lib/meal-plan/get-shopping-list-checks";

export async function WeeklySummary() {
  const [{ weekRange, days }, { weekStart, groups }, reminders] =
    await Promise.all([
      getWeeklyMealPlan(),
      getWeeklyShoppingList(),
      getWeeklyReminders(),
    ]);
  const checkedByItemKey = await getShoppingListChecks(weekStart);
  const plannedDays = days.filter((day) => day.dinner.recipe);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pt-6 pb-10 sm:px-6">
      <header className="space-y-2">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Buono
        </p>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground">{weekRange}</p>
        </div>
      </header>

      <section aria-label="Reminders" className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Reminders</h2>
        <WeeklyReminders reminders={reminders} />
      </section>

      <section aria-label="Weekly meal summary" className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">This week</h2>
        {plannedDays.length > 0 ? (
          <div className="space-y-2">
            {plannedDays.map((day) => (
              <article
                key={day.date}
                className="rounded-3xl border border-border/70 bg-card/90 px-4 py-3 shadow-sm"
              >
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {day.weekday}
                </h3>
                <Link
                  href={`/recipes/${day.dinner.recipe!.id}`}
                  className="mt-2 block rounded-2xl bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary/5"
                >
                  {day.dinner.recipe!.name}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-border/80 bg-card/80 px-4 py-5 text-sm leading-6 text-muted-foreground">
            No meals are planned for this week yet.
          </p>
        )}
      </section>

      <section aria-label="This week's shopping list" className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">
          This Week&apos;s Shopping List
        </h2>
        <WeeklyShoppingList
          weekStart={weekStart}
          groups={groups}
          initialCheckedByItemKey={checkedByItemKey}
        />
      </section>
    </div>
  );
}
