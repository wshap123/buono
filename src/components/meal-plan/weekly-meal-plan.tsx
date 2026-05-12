import { DayPlanCard } from "@/components/meal-plan/day-plan-card";
import { getWeeklyMealPlan } from "@/lib/meal-plan/get-weekly-meal-plan";

export async function WeeklyMealPlan() {
  const { weekLabel, weekRange, days } = await getWeeklyMealPlan();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 pb-10 pt-6 sm:px-6">
      <header className="space-y-2">
        <p className="editorial-eyebrow">Buono</p>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="editorial-page-title">{weekLabel}</h1>
            <p className="text-sm text-muted-foreground">{weekRange}</p>
          </div>
          <p className="rounded-sm border border-border/80 bg-card px-3 py-1 text-[0.65rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            7 days
          </p>
        </div>
      </header>

      <section aria-label="Weekly meal plan" className="space-y-4">
        {days.map((day) => (
          <DayPlanCard key={day.date} day={day} />
        ))}
      </section>
    </div>
  );
}
