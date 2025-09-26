import React from "react";

type Props = {
  text: string | null | undefined;
};

/**
 * Renders recipe description with simple numbered-steps support.
 * - Heuristic: if the text contains at least "1. " and "2. ",
 *   split by /\b\d+\.\s+/ and render as an ordered list.
 * - Otherwise, render paragraphs split by newlines.
 *
 * TODO: Move steps structure or markdown rendering to the backend so
 *       clients can render consistently without heuristics.
 */
export function RecipeDescription({ text }: Props) {
  const raw = (text ?? "").trim();
  if (!raw) return null;

  const hasStep1 = /\b1\.\s+/.test(raw);
  const hasStep2 = /\b2\.\s+/.test(raw);

  if (hasStep1 && hasStep2) {
    const items = raw
      .split(/\b\d+\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    // If the text starts with "1. ", the first split part will be the content of step 1.
    // If it doesn't, fall back to paragraphs.
    if (items.length >= 2 || raw.startsWith("1. ")) {
      return (
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">{it}</li>
          ))}
        </ol>
      );
    }
  }

  const lines = raw.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  return (
    <div className="space-y-2 text-sm">
      {lines.map((l, idx) => (
        <p key={idx} className="leading-relaxed">{l}</p>
      ))}
    </div>
  );
}

