// Turns raw readings into levels and conditions that the page and the
// action data both understand. Thresholds are kept simple and written
// down here so they're easy to change. The wording comes from lib/i18n.ts.

import type { AirReading, FloodReading, WeatherReading } from "./feeds";
import type { Dictionary } from "./i18n";
import type { Action, Condition } from "./types";

export type Level = "good" | "moderate" | "high" | "extreme" | "unknown";

export interface Panel {
  key: "heat" | "air" | "rain";
  label: string;
  value: string; // the big number
  unit: string;
  level: Level;
  headline: string; // short plain-language read
  detail: string; // one line of context
  conditions: Condition[]; // conditions this reading switches on
  observedAt: string | null; // ISO time or YYYY-MM-DD date
}

// Heat: "feels like" temperature in °C. Public-health services generally
// start advising caution around 30 and issue warnings around 35. We use
// the higher of "now" and "today's peak" so a hot afternoon counts in
// the morning too.
export function heatPanel(w: WeatherReading | null, dict: Dictionary): Panel {
  const t = dict.panels.heat;
  if (!w) return unavailable("heat", t.label, t.unavailable, dict);
  const feels = Math.max(w.feelsLike, w.feelsLikeMaxToday);
  let level: Level = "good";
  let headline = t.comfortable;
  let conditions: Condition[] = [];
  if (feels >= 40) {
    level = "extreme"; headline = t.extreme; conditions = ["heat-extreme", "heat-high"];
  } else if (feels >= 35) {
    level = "high"; headline = t.warning; conditions = ["heat-high"];
  } else if (feels >= 30) {
    level = "moderate"; headline = t.hot; conditions = ["heat-high"];
  } else if (w.feelsLike <= -15) {
    level = "high"; headline = t.cold; conditions = ["cold-extreme"];
  }
  return {
    key: "heat", label: t.label, value: formatNum(w.feelsLike, dict), unit: t.unit, level, headline,
    detail: t.detail(formatNum(w.temperature, dict), formatNum(w.feelsLikeMaxToday, dict)),
    conditions, observedAt: w.time,
  };
}

// Air: European Air Quality Index (0 and up, lower is better). Its own
// bands are 0–20 good, 20–40 fair, 40–60 moderate, 60–80 poor,
// 80–100 very poor, 100+ extremely poor. We group them into our four levels.
export function airPanel(a: AirReading | null, dict: Dictionary): Panel {
  const t = dict.panels.air;
  if (!a) return unavailable("air", t.label, t.unavailable, dict);
  const aqi = a.europeanAqi;
  let level: Level = "good";
  let headline = aqi <= 20 ? t.good : t.fair;
  let conditions: Condition[] = [];
  if (aqi > 80) {
    level = "extreme"; headline = aqi > 100 ? t.extremelyPoor : t.veryPoor; conditions = ["air-high", "air-moderate"];
  } else if (aqi > 60) {
    level = "high"; headline = t.poor; conditions = ["air-high", "air-moderate"];
  } else if (aqi > 40) {
    level = "moderate"; headline = t.moderate; conditions = ["air-moderate"];
  }
  return {
    key: "air", label: t.label, value: String(aqi), unit: t.unit, level, headline,
    detail: t.detail(formatNum(a.pm25, dict)),
    conditions, observedAt: a.time,
  };
}

// Rain and flood. Rain is today's forecast total in mm: 5+ is a rainy
// day, 25+ is heavy, 50+ is the kind of day that floods basements and
// streets. River flow is compared with the long-term normal for today:
// 2× is well above normal, 5× is flood territory.
export function rainPanel(w: WeatherReading | null, f: FloodReading | null, dict: Dictionary): Panel {
  const t = dict.panels.rain;
  if (!w && !f) return unavailable("rain", t.label, t.unavailable, dict);
  const mm = w?.rainTodayMm ?? 0;
  const ratio = f && f.dischargeMean > 0 ? f.discharge / f.dischargeMean : null;
  let level: Level = "good";
  let headline = t.dry;
  const conditions: Condition[] = [];
  if (mm >= 50 || (ratio !== null && ratio >= 5)) {
    level = "extreme"; headline = ratio !== null && ratio >= 5 ? t.riverFar : t.veryHeavy;
    conditions.push("rain-heavy", "flood-risk");
  } else if (mm >= 25 || (ratio !== null && ratio >= 2)) {
    level = "high"; headline = ratio !== null && ratio >= 2 ? t.riverHigh : t.heavy;
    conditions.push("rain-heavy", "flood-risk");
  } else if (mm >= 5) {
    level = "moderate"; headline = t.rainy; conditions.push("rain-heavy");
  } else if (mm > 0) {
    headline = t.light;
  }
  const rain = w ? t.forecast : t.noForecast;
  const chance = w?.rainChanceMax != null ? t.chance(w.rainChanceMax) : "";
  const river = ratio !== null ? t.river(ratio.toFixed(1).replace(".", dict.decimal), dict.panels.riverPlace) : t.noRiver;
  return {
    key: "rain", label: t.label, value: w ? formatNum(mm, dict) : "–", unit: w ? t.unit : "", level, headline,
    detail: `${rain}${chance}${river}`,
    conditions, observedAt: w?.time ?? (f ? f.date : null),
  };
}

/** Every condition switched on by today's readings, plus "any". */
export function activeConditions(panels: Panel[]): Condition[] {
  const set = new Set<Condition>(["any"]);
  panels.forEach((p) => p.conditions.forEach((c) => set.add(c)));
  return [...set];
}

/**
 * Splits actions for "What to do today": the ones that match a live
 * condition right now (not just "any"), then a few anytime picks, each
 * from a different category.
 */
export function actionsForToday(actions: Action[], active: Condition[], anytimeCount = 3) {
  const live: Condition[] = active.filter((c) => c !== "any");
  const matched = actions
    .map((a) => ({ action: a, because: a.when.filter((w) => live.includes(w)) }))
    .filter((m) => m.because.length > 0);
  const matchedIds = new Set(matched.map((m) => m.action.id));
  const seenCategories = new Set<string>();
  const anytime: Action[] = [];
  for (const a of actions) {
    if (anytime.length >= anytimeCount) break;
    if (matchedIds.has(a.id) || !a.when.includes("any") || seenCategories.has(a.category)) continue;
    seenCategories.add(a.category);
    anytime.push(a);
  }
  return { matched, anytime };
}

function unavailable(key: Panel["key"], label: string, detail: string, dict: Dictionary): Panel {
  return { key, label, value: "–", unit: "", level: "unknown", headline: dict.panels.unavailable, detail, conditions: [], observedAt: null };
}

/** 19.6 in English, 19,6 in Dutch. */
function formatNum(n: number, dict: Dictionary): string {
  return (Number.isInteger(n) ? String(n) : n.toFixed(1)).replace(".", dict.decimal);
}
