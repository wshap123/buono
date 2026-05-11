export type MealType = "dinner";

export interface Recipe {
  id: string;
  name: string;
  cookTimeMinutes: number;
}

export interface MealSlot {
  recipe: Recipe | null;
  mealPlanId: string | null;
}

export interface DayPlan {
  date: string;
  weekday: string;
  dayOfMonth: number;
  isToday: boolean;
  dinner: MealSlot;
}

export interface WeeklyMealPlan {
  weekLabel: string;
  weekRange: string;
  days: DayPlan[];
}
