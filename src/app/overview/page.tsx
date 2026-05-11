import { WeeklySummary } from "@/components/summary/weekly-summary";

export default function OverviewPage() {
  return (
    <main className="min-h-full bg-[radial-gradient(circle_at_top,_oklch(0.97_0.02_70)_0%,_var(--background)_42%)]">
      <WeeklySummary />
    </main>
  );
}
