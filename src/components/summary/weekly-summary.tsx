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
        <p className="editorial-eyebrow">Buono</p>
        <div className="space-y-1.5">
          <h1 className="editorial-page-title">Overview</h1>
          <p className="text-sm text-muted-foreground">{weekRange}</p>
        </div>
      </header>

      <section aria-label="Reminders" className="space-y-3">
        <h2 className="editorial-section-label">Reminders</h2>
        <WeeklyReminders reminders={reminders} />
      </section>

      <section aria-label="Weekly meal summary" className="space-y-3">
        <h2 className="editorial-section-label">This week</h2>
        {plannedDays.length > 0 ? (
          <div className="space-y-2">
            {plannedDays.map((day) => (
              <article
                key={day.date}
                className="editorial-card px-5 py-4"
              >
                <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                  {day.weekday}
                </h3>
                <Link
                  href={`/recipes/${day.dinner.recipe!.id}`}
                  className="mt-2 block rounded-md bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary/5"
                >
                  {day.dinner.recipe!.name}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="editorial-muted-surface px-5 py-6 text-sm leading-6 text-muted-foreground">
            No meals are planned for this week yet.
          </p>
        )}
      </section>

      <section aria-label="This week's shopping list" className="space-y-3">
        <h2 className="editorial-section-label">
          This Week&apos;s Shopping List
        </h2>
        <WeeklyShoppingList
          key={weekStart}
          weekStart={weekStart}
          groups={groups}
          initialCheckedByItemKey={checkedByItemKey}
        />
      </section>
    </div>
  );
}
