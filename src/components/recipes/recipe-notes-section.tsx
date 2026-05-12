"use client";

import { useEffect, useRef, useState } from "react";

import { saveRecipeNote } from "@/lib/recipes/save-recipe-note";
import { cn } from "@/lib/utils";

interface RecipeNotesSectionProps {
  recipeId: string;
  initialNote: string;
  initialNoteId: string | null;
}

export function RecipeNotesSection({
  recipeId,
  initialNote,
  initialNoteId,
}: RecipeNotesSectionProps) {
  const [note, setNote] = useState(initialNote);
  const [noteId, setNoteId] = useState(initialNoteId);
  const [savedNote, setSavedNote] = useState(initialNote);
  const [showSaved, setShowSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setNote(initialNote);
    setNoteId(initialNoteId);
    setSavedNote(initialNote);
  }, [initialNote, initialNoteId, recipeId]);

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (note.trim() === savedNote.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setError(null);

        try {
          const nextNoteId = await saveRecipeNote({
            recipeId,
            noteId,
            note,
          });
          setNoteId(nextNoteId);
          setSavedNote(note);
          setShowSaved(true);

          if (savedTimeoutRef.current) {
            clearTimeout(savedTimeoutRef.current);
          }

          savedTimeoutRef.current = window.setTimeout(() => {
            setShowSaved(false);
          }, 2000);
        } catch (saveError) {
          setError(
            saveError instanceof Error
              ? saveError.message
              : "Could not save your notes.",
          );
        }
      })();
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [note, noteId, recipeId, savedNote]);

  return (
    <section className="editorial-card space-y-2 px-5 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editorial-section-label">My Notes</h2>
        <span
          className={cn(
            "text-xs text-muted-foreground transition-opacity",
            showSaved ? "opacity-100" : "opacity-0",
          )}
          aria-live="polite"
        >
          Saved
        </span>
      </div>
      <textarea
        id={`recipe-notes-${recipeId}`}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Substitutions, how it turned out, tips for next time..."
        className="min-h-32 w-full rounded-md border border-input bg-background/80 px-4 py-3 text-sm leading-6 transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
