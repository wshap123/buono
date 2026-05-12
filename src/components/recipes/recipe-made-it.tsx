"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logRecipeMade } from "@/lib/recipes/log-recipe-made";

interface RecipeMadeItProps {
  recipeId: string;
  initialCount: number;
  initialLastMadeAt: string | null;
}

function formatMadeDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMadeCount(count: number) {
  return count === 1 ? "Made 1 time" : `Made ${count} times`;
}

export function RecipeMadeIt({
  recipeId,
  initialCount,
  initialLastMadeAt,
}: RecipeMadeItProps) {
  const router = useRouter();
  const [count, setCount] = useState(initialCount);
  const [lastMadeAt, setLastMadeAt] = useState(initialLastMadeAt);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogMade() {
    setIsLogging(true);
    setError(null);

    try {
      const madeAt = await logRecipeMade(recipeId);
      setCount((current) => current + 1);
      setLastMadeAt(madeAt);
      router.refresh();
    } catch (logError) {
      setError(
        logError instanceof Error
          ? logError.message
          : "Could not log this recipe.",
      );
    } finally {
      setIsLogging(false);
    }
  }

  return (
    <div className="editorial-card space-y-3 px-5 py-5">
      <Button
        type="button"
        className="h-11 w-full rounded-md"
        onClick={handleLogMade}
        disabled={isLogging}
      >
        {isLogging ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Saving
          </>
        ) : count > 0 ? (
          "Made it again"
        ) : (
          "Mark as made"
        )}
      </Button>

      {count > 0 && lastMadeAt ? (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{formatMadeCount(count)}</p>
          <p>Last made {formatMadeDate(lastMadeAt)}</p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
