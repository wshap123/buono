import Link from "next/link";

import { WeeklyShoppingList } from "@/components/summary/weekly-shopping-list";
import { getWeeklyShoppingList } from "@/lib/meal-plan/compile-weekly-shopping-list";
import { getWeeklyMealPlan } from "@/lib/meal-plan/get-weekly-meal-plan";
import { getShoppingListChecks } from "@/lib/meal-plan/get-shopping-list-checks";

export async function WeeklySummary() {
  const [{ weekRange, days }, { weekStart, groups }] = await Promise.all([
    getWeeklyMealPlan(),
    getWeeklyShoppingList(),
  ]);
  const checkedByItemKey = await getShoppingListChecks(weekStart);
  const plannedDays = days
    .map((day) => ({
      ...day,
      meals: day.meals.filter((meal) => meal.recipe),
    }))
    .filter((day) => day.meals.length > 0);

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
                <ul className="mt-2 space-y-1.5">
                  {day.meals.map((meal) => (
                    <li key={`${day.date}-${meal.type}`}>
                      <Link
                        href={`/recipes/${meal.recipe!.id}`}
                        className="block rounded-2xl bg-background/80 px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary/5"
                      >
                        {meal.recipe!.name}
                      </Link>
                    </li>
                  ))}
                </ul>
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
