"use client";

// Runs in the visitor's browser so filtering and search are instant.
// It only re-arranges the actions it was given; it never fetches anything.

import { useMemo, useState } from "react";
import ActionCard, { type CardLabels } from "./ActionCard";
import type { Action } from "@/lib/types";

export interface BrowserLabels {
  all: string;
  searchLabel: string;
  searchPlaceholder: string;
  showing: string; // "Showing {shown} of {total}"
  empty: string;
}

export default function ActionBrowser({
  actions,
  categories,
  labels,
  cardLabels,
}: {
  actions: Action[];
  categories: string[];
  labels: BrowserLabels;
  cardLabels: CardLabels;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return actions.filter((a) => {
      if (category && a.category !== category) return false;
      if (words.length === 0) return true;
      const text = [a.title, a.summary, a.category, ...a.details].join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [actions, category, query]);

  const chip = (active: boolean) =>
    `min-h-11 rounded-full border-2 px-4 py-1.5 text-base font-bold motion-safe:transition-colors ${
      active
        ? "border-brand-solid bg-brand-solid text-on-brand"
        : "border-outline bg-card hover:bg-brand-soft"
    }`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2" role="group">
        <button type="button" className={chip(category === null)} aria-pressed={category === null} onClick={() => setCategory(null)}>
          {category === null && <span aria-hidden="true">✓ </span>}
          {labels.all} ({actions.length})
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className={chip(category === c)} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {category === c && <span aria-hidden="true">✓ </span>}
            {c} ({actions.filter((a) => a.category === c).length})
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-base font-bold">{labels.searchLabel}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full max-w-xl rounded-2xl border-2 border-outline bg-card px-4 py-3 text-base placeholder:text-muted focus:border-brand-solid"
        />
      </label>

      <p className="text-base text-muted" aria-live="polite">
        {labels.showing.replace("{shown}", String(shown.length)).replace("{total}", String(actions.length))}
      </p>

      {shown.length === 0 ? (
        <p className="rounded-3xl border-2 border-dashed border-outline p-6 text-base text-muted">{labels.empty}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {shown.map((a) => (
            <ActionCard key={a.id} action={a} labels={cardLabels} />
          ))}
        </div>
      )}
    </div>
  );
}
