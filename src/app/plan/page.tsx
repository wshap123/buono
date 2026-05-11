import { WeeklyMealPlan } from "@/components/meal-plan/weekly-meal-plan";

export default function PlanPage() {
  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top,_oklch(0.97_0.02_70)_0%,_var(--background)_42%)]">
      <WeeklyMealPlan />
    </main>
  );
}
