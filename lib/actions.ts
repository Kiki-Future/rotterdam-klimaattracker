// Loads the action files from Cowork and checks every entry against the
// format in lib/types.ts. If anything is wrong, this throws, so the site
// refuses to build rather than showing broken advice.
//
// English: data/verified.json and data/flagged.json
// Dutch:   data/verified.nl.json and data/flagged.nl.json

import flaggedEn from "@/data/flagged.json";
import flaggedNl from "@/data/flagged.nl.json";
import verifiedEn from "@/data/verified.json";
import verifiedNl from "@/data/verified.nl.json";
import type { Locale } from "./i18n";
import type { Action, Condition } from "./types";

const CONDITIONS: Condition[] = [
  "any", "heat-high", "heat-extreme", "cold-extreme",
  "air-moderate", "air-high", "rain-heavy", "flood-risk",
];

function isText(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Returns a list of problems. An empty list means every entry is fine. */
export function checkActions(entries: unknown, file: string, status: "verified" | "flagged"): string[] {
  if (!Array.isArray(entries)) return [`${file}: should be a list of actions`];
  const problems: string[] = [];
  const ids = new Set<string>();
  entries.forEach((a, i) => {
    const where = `${file} #${i + 1} (${a?.id ?? "no id"})`;
    for (const key of ["id", "city", "category", "title", "summary"]) {
      if (!isText(a?.[key])) problems.push(`${where}: "${key}" is missing or empty`);
    }
    if (ids.has(a?.id)) problems.push(`${where}: id is used twice`);
    ids.add(a?.id);
    // Verified actions need real steps. Flagged ones only need context.
    const minDetails = status === "verified" ? 2 : 1;
    if (!Array.isArray(a?.details) || a.details.length < minDetails || !a.details.every(isText)) {
      problems.push(`${where}: "details" needs at least ${minDetails} non-empty line(s)`);
    }
    if (!Array.isArray(a?.when) || a.when.length === 0) {
      problems.push(`${where}: "when" is missing or empty`);
    } else {
      for (const w of a.when) if (!CONDITIONS.includes(w)) problems.push(`${where}: unknown "when" value "${w}"`);
    }
    if (!Array.isArray(a?.sources) || a.sources.length === 0) {
      problems.push(`${where}: needs at least one source`);
    } else {
      a.sources.forEach((s: { title?: unknown; url?: unknown }, j: number) => {
        if (!isText(s?.title)) problems.push(`${where}: source ${j + 1} has no title`);
        if (!isText(s?.url) || !s.url.startsWith("https://")) problems.push(`${where}: source ${j + 1} needs an https:// link`);
      });
    }
    const v = a?.verification;
    if (v?.status !== status) problems.push(`${where}: status should be "${status}"`);
    if (!isText(v?.lastChecked) || !/^\d{4}-\d{2}-\d{2}$/.test(v.lastChecked)) {
      problems.push(`${where}: "lastChecked" should be a date like 2026-10-01`);
    }
    if (!isText(v?.method)) problems.push(`${where}: "method" is missing`);
    if (status === "flagged" && !isText(v?.flag_reason)) problems.push(`${where}: flagged entry needs a "flag_reason"`);
  });
  return problems;
}

/** The English and Dutch files must hold the same actions in the same order. */
function checkSameIds(en: { id: string }[], nl: { id: string }[], name: string): string[] {
  const a = en.map((x) => x.id).join(",");
  const b = nl.map((x) => x.id).join(",");
  return a === b ? [] : [`${name}: the English and Dutch files don't list the same actions`];
}

const problems = [
  ...checkActions(verifiedEn, "verified.json", "verified"),
  ...checkActions(flaggedEn, "flagged.json", "flagged"),
  ...checkActions(verifiedNl, "verified.nl.json", "verified"),
  ...checkActions(flaggedNl, "flagged.nl.json", "flagged"),
];
if (problems.length === 0) {
  problems.push(
    ...checkSameIds(verifiedEn, verifiedNl, "verified"),
    ...checkSameIds(flaggedEn, flaggedNl, "flagged"),
  );
}
if (problems.length > 0) {
  throw new Error(`The action data has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
}

const DATA: Record<Locale, { verified: Action[]; flagged: Action[] }> = {
  en: { verified: verifiedEn as Action[], flagged: flaggedEn as Action[] },
  nl: { verified: verifiedNl as Action[], flagged: flaggedNl as Action[] },
};

export function getActions(lang: Locale) {
  return DATA[lang];
}

/** Categories in the order they first appear in the file. */
export function categoriesOf(actions: Action[]): string[] {
  return [...new Set(actions.map((a) => a.category))];
}

/** The most recent check date across all actions, as YYYY-MM-DD. */
export function latestCheck(actions: Action[]): string | null {
  return actions.map((a) => a.verification.lastChecked).sort().at(-1) ?? null;
}
