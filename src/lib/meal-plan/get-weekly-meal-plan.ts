import {
  formatWeekRange,
  getCurrentWeekDays,
  toDateKey,
} from "@/lib/meal-plan/week";
import { createClient } from "@/lib/supabase/server";
import type { WeeklyMealPlan } from "@/lib/types/meal-plan";

interface MealPlanRecipeRow {
  id: string;
  title: string;
  cook_time: number | null;
  prep_time: number | null;
}

interface MealPlanRow {
  id: string;
  date: string;
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
        id,
        date,
        recipe:recipes (
          id,
          title,
          cook_time,
          prep_time
        )
      `,
    )
    .eq("meal_type", "dinner")
    .gte("date", weekStart)
    .lte("date", weekEnd)
    .order("date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const dinnerByDate = new Map<
    string,
    {
      mealPlanId: string;
      recipe: MealPlanRecipeRow | null;
    }
  >();

  for (const row of (data ?? []) as MealPlanRow[]) {
    dinnerByDate.set(row.date, {
      mealPlanId: row.id,
      recipe: getRecipeFromRow(row.recipe),
    });
  }

  return {
    weekLabel: "This week",
    weekRange: formatWeekRange(weekDays),
    days: weekDays.map((date) => {
      const dateKey = toDateKey(date);
      const dinner = dinnerByDate.get(dateKey) ?? null;
      const recipe = dinner?.recipe ?? null;

      return {
        date: dateKey,
        weekday: weekdayFormatter.format(date),
        dayOfMonth: date.getDate(),
        isToday: dateKey === todayKey,
        dinner: {
          mealPlanId: dinner?.mealPlanId ?? null,
          recipe: recipe
            ? {
                id: recipe.id,
                name: recipe.title,
                cookTimeMinutes: getCookTimeMinutes(recipe),
              }
            : null,
        },
      };
    }),
  };
}
