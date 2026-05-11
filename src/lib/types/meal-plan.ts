export type MealType = "breakfast" | "lunch" | "dinner";

export interface Recipe {
  id: string;
  name: string;
  cookTimeMinutes: number;
}

export interface MealSlot {
  type: MealType;
  recipe: Recipe | null;
}

export interface DayPlan {
  date: string;
  weekday: string;
  dayOfMonth: number;
  isToday: boolean;
  meals: MealSlot[];
}

export interface WeeklyMealPlan {
  weekLabel: string;
  weekRange: string;
  days: DayPlan[];
}
