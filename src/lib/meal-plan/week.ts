import type { MealType } from "@/lib/types/meal-plan";

export const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getCurrentWeekDays(referenceDate = new Date()) {
  const start = startOfWeek(referenceDate);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function formatWeekRange(weekDays: Date[]) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(weekDays[0])} – ${formatter.format(weekDays[6])}`;
}

export function formatDayHeading(dateKey: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(parseDateKey(dateKey));
}

function startOfWeek(referenceDate: Date) {
  const date = new Date(referenceDate);
  date.setHours(12, 0, 0, 0);

  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);

  return date;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}
