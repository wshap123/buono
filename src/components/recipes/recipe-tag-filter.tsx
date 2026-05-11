"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeTagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
}

export function RecipeTagFilter({
  availableTags,
  selectedTags,
  onSelectedTagsChange,
}: RecipeTagFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  const label = useMemo(() => {
    if (selectedTags.length === 0) {
      return "Filter by tags";
    }

    if (selectedTags.length === 1) {
      return selectedTags[0];
    }

    return `${selectedTags.length} tags selected`;
  }, [selectedTags]);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter((selected) => selected !== tag));
      return;
    }

    onSelectedTagsChange([...selectedTags, tag]);
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "h-11 w-full justify-between rounded-2xl border-border/70 bg-card/80 px-4 text-base font-normal",
          selectedTags.length > 0 && "border-primary/30 bg-primary/5 text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          <Tag className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </Button>

      {open ? (
        <div className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-20 rounded-2xl border border-border/70 bg-card p-2 shadow-lg">
          {availableTags.length > 0 ? (
            <ul className="max-h-56 space-y-1 overflow-y-auto" role="listbox">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <li key={tag}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-background/80",
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      <span>{tag}</span>
                      {isSelected ? (
                        <Check className="size-4 shrink-0" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No tags yet. Add tags from a recipe detail page.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
