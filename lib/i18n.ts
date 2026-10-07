// All fixed wording on the site, in English and Dutch, side by side.
// The actions themselves come from the data files, not from here.
//
// The Dutch dictionary must have exactly the same shape as the English
// one, so a missing translation is a type error, not a blank on the page.

import type { Condition } from "./types";

export const LOCALES = ["en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type PageKey = "home" | "checked";

/** The web address of each page in each language. */
export function pagePath(lang: Locale, page: PageKey): string {
  if (page === "home") return `/${lang}`;
  return lang === "nl" ? "/nl/hoe-het-gecontroleerd-is" : "/en/how-its-checked";
}

type Level = "good" | "moderate" | "high" | "extreme" | "unknown";

const en = {
  langName: "English",
  decimal: ".",
  meta: {
    title: "Rotterdam Climate Tracker",
    description: "Heat, air and rain in Rotterdam right now, and local climate actions to match.",
    checkedTitle: "How it's checked · Rotterdam Climate Tracker",
  },
  country: "The Netherlands",
  siteTitle: "Rotterdam Climate Tracker",
  tagline: "What the heat, the air and the rain are doing in Rotterdam right now, and what you can do about it today.",
  nav: { home: "Today", checked: "How it's checked", switchTo: "Nederlands", skip: "Skip to content", language: "Language" },
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  levels: { good: "Good", moderate: "Moderate", high: "High", extreme: "Extreme", unknown: "Unavailable" } satisfies Record<Level, string>,
  conditions: {
    any: "Anytime",
    "heat-high": "When it's hot",
    "heat-extreme": "Extreme heat",
    "cold-extreme": "Extreme cold",
    "air-moderate": "When air is moderate",
    "air-high": "When air is poor",
    "rain-heavy": "Rainy days",
    "flood-risk": "Flood risk",
  } satisfies Record<Condition, string>,

  panels: {
    readingFrom: "Reading from",
    noReading: "No reading available",
    unavailable: "Unavailable",
    heat: {
      label: "Heat",
      unit: "°C feels like",
      unavailable: "Feels-like temperature unavailable right now.",
      comfortable: "Comfortable", hot: "Hot", warning: "Heat warning territory", extreme: "Extreme heat", cold: "Extreme cold",
      detail: (actual: string, peak: string) => `Actual ${actual}°C. Today's peak feels like ${peak}°C.`,
    },
    air: {
      label: "Air",
      unit: "European AQI",
      unavailable: "Air quality unavailable right now.",
      good: "Good", fair: "Fair", moderate: "Moderate", poor: "Poor", veryPoor: "Very poor", extremelyPoor: "Extremely poor",
      detail: (pm25: string) => `Fine particles (PM2.5) at ${pm25} µg/m³.`,
    },
    rain: {
      label: "Rain and flood",
      unit: "mm today",
      unavailable: "Rain and river data unavailable right now.",
      dry: "Dry", light: "Light rain", rainy: "Rain today", heavy: "Heavy rain", veryHeavy: "Very heavy rain",
      riverHigh: "River above normal", riverFar: "River far above normal",
      forecast: "Forecast total for today.",
      noForecast: "Rain forecast unavailable.",
      chance: (pct: number) => ` ${pct}% chance of rain.`,
      river: (ratio: string, place: string) => ` River flow ${ratio}× normal for today (${place}).`,
      noRiver: " River data unavailable.",
    },
    riverPlace: "Merwede near Gorinchem, upstream of Rotterdam",
  },

  today: {
    heading: "Today",
    sourceNote: "Live data from Open-Meteo: weather forecast, air quality model and the GloFAS river model. Readings refresh about every hour (river every six hours).",
  },

  todo: {
    heading: "What to do today",
    matchedIntro: "These match today's readings in Rotterdam.",
    noneMatched: "Nothing out of the ordinary today, so nothing urgent. Here are a few things that are always worth doing.",
    because: "Because of today:",
    anytimeHeading: "Useful anytime",
  },

  card: {
    sources: "Sources",
    checked: "Checked",
  },

  browser: {
    heading: "All actions",
    intro: "Every verified action for Rotterdam. Filter by topic or search.",
    all: "All",
    searchLabel: "Search actions",
    searchPlaceholder: "Search, for example: subsidy, bike, water",
    showing: "Showing {shown} of {total}",
    empty: "No actions match. Try another word or topic.",
  },

  summary: {
    text: (passed: number, flagged: number) =>
      `${passed} actions passed all three checks. ${flagged} were flagged and are not shown as advice.`,
    link: "How it's checked",
  },

  checked: {
    heading: "How it's checked",
    intro: "Every action on this site was researched and then checked before it went live. Here is what that means, where the live data comes from, and what didn't make it.",
    passed: "passed all three checks",
    flagged: "flagged and not shown as advice",
    checksHeading: "The three checks",
    checks: [
      { name: "Format", text: "Each action has every required part: a title, a short summary, steps, when it applies, at least one source and a check date. The site also refuses to build if an entry is broken." },
      { name: "Spot check", text: "The source page was opened and it says what the action says: the program exists, it's for Rotterdam, and the details match." },
      { name: "Freshness check", text: "The program is still running now. Offers that ended, closed sign-ups and pages that only mention past years fail this check." },
    ],
    lastChecked: (date: string) => `All actions were last checked on ${date}. Programs change, so check the source before you rely on one.`,
    levelsHeading: "How the levels are set",
    levels: [
      { name: "Heat", text: "Feels-like temperature, using the higher of now and today's peak. Hot from 30°C, heat warning from 35°C, extreme from 40°C." },
      { name: "Air", text: "European Air Quality Index. Good or fair up to 40, moderate up to 60, poor up to 80, very poor above that." },
      { name: "Rain and flood", text: "Today's forecast rain: rainy from 5 mm, heavy from 25 mm, very heavy from 50 mm. River flow at 2× normal counts as high, 5× as extreme." },
    ],
    dataHeading: "Where the live data comes from",
    dataIntro: "All three feeds are free, need no account, and are read on the server, not in your browser.",
    data: [
      { panel: "Heat", source: "Open-Meteo forecast: current and feels-like temperature, today's peak", refresh: "Every hour" },
      { panel: "Air", source: "Open-Meteo air quality (CAMS Europe model): European AQI and PM2.5", refresh: "Every hour" },
      { panel: "Rain and flood", source: "Open-Meteo forecast (today's rain) and flood API (GloFAS river model)", refresh: "Rain every hour, river every six hours" },
    ],
    dataTable: { panel: "Panel", source: "Source", refresh: "Refreshes" },
    riverNote: "Why upstream? The river model doesn't follow the Nieuwe Maas through the city, so we read the Merwede near Gorinchem, one of the big rivers that carries water into the Rotterdam delta.",
    flaggedHeading: "Flagged entries",
    flaggedIntro: "These failed at least one check. They are listed here for transparency and are never shown as advice.",
    reason: "Why it was flagged",
    noFlagged: "Nothing was flagged.",
    back: "Back to today",
  },

  footer: "No AI runs on this site. AI helped research the actions and write the code; the site itself just shows live data and checked actions.",
};

export type Dictionary = typeof en;

const nl: Dictionary = {
  langName: "Nederlands",
  decimal: ",",
  meta: {
    title: "Rotterdam Klimaattracker",
    description: "Hitte, lucht en regen in Rotterdam op dit moment, met lokale klimaatacties die erbij passen.",
    checkedTitle: "Hoe het gecontroleerd is · Rotterdam Klimaattracker",
  },
  country: "Nederland",
  siteTitle: "Rotterdam Klimaattracker",
  tagline: "Wat de hitte, de lucht en de regen nu doen in Rotterdam, en wat je er vandaag aan kunt doen.",
  nav: { home: "Vandaag", checked: "Hoe het gecontroleerd is", switchTo: "English", skip: "Naar de inhoud", language: "Taal" },
  months: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],

  levels: { good: "Goed", moderate: "Matig", high: "Hoog", extreme: "Extreem", unknown: "Niet beschikbaar" },
  conditions: {
    any: "Altijd",
    "heat-high": "Bij warm weer",
    "heat-extreme": "Extreme hitte",
    "cold-extreme": "Extreme kou",
    "air-moderate": "Bij matige lucht",
    "air-high": "Bij slechte lucht",
    "rain-heavy": "Regenachtige dagen",
    "flood-risk": "Kans op wateroverlast",
  },

  panels: {
    readingFrom: "Meting van",
    noReading: "Geen meting beschikbaar",
    unavailable: "Niet beschikbaar",
    heat: {
      label: "Hitte",
      unit: "°C gevoelstemperatuur",
      unavailable: "Gevoelstemperatuur is nu niet beschikbaar.",
      comfortable: "Aangenaam", hot: "Warm", warning: "Hittewaarschuwing", extreme: "Extreme hitte", cold: "Extreme kou",
      detail: (actual, peak) => `Werkelijk ${actual}°C. Vandaag voelt het tot ${peak}°C.`,
    },
    air: {
      label: "Lucht",
      unit: "Europese AQI",
      unavailable: "Luchtkwaliteit is nu niet beschikbaar.",
      good: "Goed", fair: "Redelijk", moderate: "Matig", poor: "Slecht", veryPoor: "Zeer slecht", extremelyPoor: "Extreem slecht",
      detail: (pm25) => `Fijnstof (PM2,5): ${pm25} µg/m³.`,
    },
    rain: {
      label: "Regen en water",
      unit: "mm vandaag",
      unavailable: "Regen- en rivierdata zijn nu niet beschikbaar.",
      dry: "Droog", light: "Lichte regen", rainy: "Regen vandaag", heavy: "Zware regen", veryHeavy: "Zeer zware regen",
      riverHigh: "Rivier boven normaal", riverFar: "Rivier ver boven normaal",
      forecast: "Verwachte hoeveelheid voor vandaag.",
      noForecast: "Regenverwachting niet beschikbaar.",
      chance: (pct) => ` ${pct}% kans op regen.`,
      river: (ratio, place) => ` Rivierafvoer ${ratio}× normaal voor vandaag (${place}).`,
      noRiver: " Rivierdata niet beschikbaar.",
    },
    riverPlace: "Merwede bij Gorinchem, stroomopwaarts van Rotterdam",
  },

  today: {
    heading: "Vandaag",
    sourceNote: "Live data van Open-Meteo: weersverwachting, luchtkwaliteitsmodel en het GloFAS-riviermodel. Metingen worden ongeveer elk uur ververst (de rivier elke zes uur).",
  },

  todo: {
    heading: "Wat je vandaag kunt doen",
    matchedIntro: "Deze passen bij de metingen van vandaag in Rotterdam.",
    noneMatched: "Vandaag is er niets bijzonders, dus niets dringends. Hier zijn een paar dingen die altijd de moeite waard zijn.",
    because: "Vanwege vandaag:",
    anytimeHeading: "Altijd nuttig",
  },

  card: {
    sources: "Bronnen",
    checked: "Gecontroleerd",
  },

  browser: {
    heading: "Alle acties",
    intro: "Alle gecontroleerde acties voor Rotterdam. Filter op onderwerp of zoek.",
    all: "Alles",
    searchLabel: "Acties zoeken",
    searchPlaceholder: "Zoek, bijvoorbeeld: subsidie, fiets, water",
    showing: "{shown} van {total} acties",
    empty: "Geen acties gevonden. Probeer een ander woord of onderwerp.",
  },

  summary: {
    text: (passed, flagged) =>
      `${passed} acties zijn door alle drie de controles gekomen. ${flagged} zijn afgekeurd en worden niet als advies getoond.`,
    link: "Hoe het gecontroleerd is",
  },

  checked: {
    heading: "Hoe het gecontroleerd is",
    intro: "Elke actie op deze site is eerst onderzocht en daarna gecontroleerd voordat hij online kwam. Hier lees je wat dat betekent, waar de live data vandaan komt en wat het niet gehaald heeft.",
    passed: "door alle drie de controles",
    flagged: "afgekeurd en niet als advies getoond",
    checksHeading: "De drie controles",
    checks: [
      { name: "Vorm", text: "Elke actie heeft alle verplichte onderdelen: een titel, een korte samenvatting, stappen, wanneer hij geldt, minstens één bron en een controledatum. De site weigert ook te bouwen als een actie niet klopt." },
      { name: "Spotcheck", text: "De bronpagina is geopend en zegt hetzelfde als de actie: de regeling bestaat, is voor Rotterdam en de details kloppen." },
      { name: "Versheidscheck", text: "De regeling loopt nu nog. Afgelopen aanbiedingen, gesloten inschrijvingen en pagina's die alleen over eerdere jaren gaan, vallen af." },
    ],
    lastChecked: (date) => `Alle acties zijn voor het laatst gecontroleerd op ${date}. Regelingen veranderen, dus kijk bij de bron voordat je erop vertrouwt.`,
    levelsHeading: "Hoe de niveaus worden bepaald",
    levels: [
      { name: "Hitte", text: "Gevoelstemperatuur, de hoogste van nu en de piek van vandaag. Warm vanaf 30°C, hittewaarschuwing vanaf 35°C, extreem vanaf 40°C." },
      { name: "Lucht", text: "Europese luchtkwaliteitsindex (AQI). Goed of redelijk tot 40, matig tot 60, slecht tot 80, daarboven zeer slecht." },
      { name: "Regen en water", text: "Verwachte regen voor vandaag: regenachtig vanaf 5 mm, zwaar vanaf 25 mm, zeer zwaar vanaf 50 mm. Een rivierafvoer van 2× normaal telt als hoog, 5× als extreem." },
    ],
    dataHeading: "Waar de live data vandaan komt",
    dataIntro: "Alle drie de bronnen zijn gratis, vragen geen account en worden op de server opgehaald, niet in je browser.",
    data: [
      { panel: "Hitte", source: "Open-Meteo weersverwachting: huidige en gevoelstemperatuur, piek van vandaag", refresh: "Elk uur" },
      { panel: "Lucht", source: "Open-Meteo luchtkwaliteit (CAMS Europa-model): Europese AQI en PM2,5", refresh: "Elk uur" },
      { panel: "Regen en water", source: "Open-Meteo weersverwachting (regen vandaag) en flood API (GloFAS-riviermodel)", refresh: "Regen elk uur, rivier elke zes uur" },
    ],
    dataTable: { panel: "Paneel", source: "Bron", refresh: "Ververst" },
    riverNote: "Waarom stroomopwaarts? Het riviermodel volgt de Nieuwe Maas niet goed door de stad, dus meten we de Merwede bij Gorinchem, een van de grote rivieren die water naar de Rotterdamse delta brengt.",
    flaggedHeading: "Afgekeurde acties",
    flaggedIntro: "Deze zijn voor minstens één controle gezakt. Ze staan hier voor de volledigheid en worden nooit als advies getoond.",
    reason: "Waarom afgekeurd",
    noFlagged: "Er is niets afgekeurd.",
    back: "Terug naar vandaag",
  },

  footer: "Op deze site draait geen AI. AI hielp bij het onderzoek naar de acties en bij het schrijven van de code; de site zelf toont alleen live data en gecontroleerde acties.",
};

const dictionaries: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/** "1 Oct 2026" or "1 okt 2026" from "2026-10-01". */
export function formatDate(date: string, months: string[]): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

/**
 * "1 Oct, 10:30" from an Open-Meteo local time like "2026-10-01T10:30".
 * Read straight from the string so the server's own time zone can't
 * shift it. A date-only value becomes "1 Oct".
 */
export function formatReadingTime(iso: string, dict: Dictionary): string {
  const [date, time] = iso.split("T");
  const [, month, day] = date.split("-").map(Number);
  const d = `${day} ${dict.months[month - 1]}`;
  return time ? `${d}, ${time.slice(0, 5)}` : d;
}
