"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeRecipeTag } from "@/lib/recipes/normalize-recipe-tags";
import { saveRecipeTags } from "@/lib/recipes/save-recipe-tags";

interface RecipeTagsSectionProps {
  recipeId: string;
  initialTags: string[];
}

export function RecipeTagsSection({
  recipeId,
  initialTags,
}: RecipeTagsSectionProps) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [draftTag, setDraftTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags, recipeId]);

  async function persistTags(nextTags: string[]) {
    setIsSaving(true);
    setError(null);

    try {
      await saveRecipeTags(recipeId, nextTags);
      setTags(nextTags);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save these tags.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddTag() {
    const normalizedTag = normalizeRecipeTag(draftTag);

    if (!normalizedTag) {
      return;
    }

    const hasTag = tags.some(
      (tag) => tag.toLowerCase() === normalizedTag.toLowerCase(),
    );

    if (hasTag) {
      setDraftTag("");
      return;
    }

    setDraftTag("");
    await persistTags([...tags, normalizedTag]);
  }

  async function handleRemoveTag(tagToRemove: string) {
    await persistTags(tags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <section className="editorial-card space-y-3 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editorial-section-label">Tags</h2>
        {isSaving ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            Saving
          </span>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary"
            >
              {tag}
              <button
                type="button"
                className="rounded-full p-0.5 text-primary/80 transition-colors hover:bg-primary/10 hover:text-primary"
                aria-label={`Remove ${tag} tag`}
                disabled={isSaving}
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Add tags like Italian, Quick, or Weeknight.
        </p>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={draftTag}
          onChange={(event) => setDraftTag(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleAddTag();
            }
          }}
          disabled={isSaving}
          placeholder="Add a tag"
          className="h-11 flex-1 rounded-md bg-background/80 px-4 text-base"
        />
        <Button
          type="button"
          size="icon"
          className="size-11 shrink-0 rounded-md"
          aria-label="Add tag"
          disabled={isSaving || !draftTag.trim()}
          onClick={() => void handleAddTag()}
        >
          <Plus className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
