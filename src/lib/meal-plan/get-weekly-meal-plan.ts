import {
  formatWeekRange,
  getCurrentWeekDays,
  mealTypes,
  toDateKey,
} from "@/lib/meal-plan/week";
import { createClient } from "@/lib/supabase/server";
import type { MealType, WeeklyMealPlan } from "@/lib/types/meal-plan";

interface MealPlanRecipeRow {
  id: string;
  title: string;
  cook_time: number | null;
  prep_time: number | null;
}

interface MealPlanRow {
  date: string;
  meal_type: MealType;
  recipe: MealPlanRecipeRow | MealPlanRecipeRow[] | null;
}

function getRecipeFromRow(recipe: MealPlanRow["recipe"]) {
  if (!recipe) {
    return null;
  }

  return Array.isArray(recipe) ? (recipe[0] ?? null) : recipe;
}

function getCookTimeMinutes(recipe: MealPlanRecipeRow) {
  return (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);
}

export async function getWeeklyMealPlan(): Promise<WeeklyMealPlan> {
  const weekDays = getCurrentWeekDays();
  const weekStart = toDateKey(weekDays[0]);
  const weekEnd = toDateKey(weekDays[6]);
  const todayKey = toDateKey(new Date());
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plan")
    .select(
      `
        date,
        meal_type,
        recipe:recipes (
          id,
          title,
          cook_time,
          prep_time
        )
      `,
    )
    .gte("date", weekStart)
    .lte("date", weekEnd)
    .order("date", { ascending: true })
    .order("meal_type", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const mealsByDate = new Map<string, Map<MealType, MealPlanRecipeRow | null>>();

  for (const row of (data ?? []) as MealPlanRow[]) {
    const recipe = getRecipeFromRow(row.recipe);
    const mealsForDate =
      mealsByDate.get(row.date) ?? new Map<MealType, MealPlanRecipeRow | null>();

    mealsForDate.set(row.meal_type, recipe);
    mealsByDate.set(row.date, mealsForDate);
  }

  return {
    weekLabel: "This week",
    weekRange: formatWeekRange(weekDays),
    days: weekDays.map((date) => {
      const dateKey = toDateKey(date);
      const mealsForDate = mealsByDate.get(dateKey);

      return {
        date: dateKey,
        weekday: weekdayFormatter.format(date),
        dayOfMonth: date.getDate(),
        isToday: dateKey === todayKey,
        meals: mealTypes.map((type) => {
          const recipe = mealsForDate?.get(type) ?? null;

          return {
            type,
            recipe: recipe
              ? {
                  id: recipe.id,
                  name: recipe.title,
                  cookTimeMinutes: getCookTimeMinutes(recipe),
                }
              : null,
          };
        }),
      };
    }),
  };
}
