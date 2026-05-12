import { MealSlot } from "@/components/meal-plan/meal-slot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDayHeading } from "@/lib/meal-plan/week";
import type { DayPlan } from "@/lib/types/meal-plan";
import { cn } from "@/lib/utils";

interface DayPlanCardProps {
  day: DayPlan;
}

export function DayPlanCard({ day }: DayPlanCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "editorial-card",
        day.isToday && "border-primary/35 ring-1 ring-primary/10",
      )}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {day.weekday}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDayHeading(day.date)}
            </p>
          </div>
          {day.isToday ? (
            <Badge className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary hover:bg-primary/10">
              Today
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <MealSlot slot={day.dinner} date={day.date} weekday={day.weekday} />
      </CardContent>
    </Card>
  );
}
