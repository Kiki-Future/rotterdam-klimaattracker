# Rotterdam Climate Tracker

What the heat, the air and the rain are doing in Rotterdam right now, and what you can do about it today. In English (`/en`) and Dutch (`/nl`).

Built by Kirsten Eerland as Build 2 for [Terra Studio](https://github.com/Terra-do/terra-studio-template-build-2).

## What's on the site

- **Today:** three live panels (heat, air, rain and flood) with a plain-language level and the time of each reading.
- **What to do today:** local actions that match today's readings come first, then a few that are always useful.
- **All actions:** every verified action, filterable by topic and searchable.
- **How it's checked:** the three checks every action passed, where the live data comes from, how the levels are set, and the actions that were flagged, with reasons.

No AI runs on the site. AI helped research the actions (Cowork) and write the code (Claude Code).

## Live data

| Panel | Source | Key needed |
|---|---|---|
| Heat | [Open-Meteo](https://open-meteo.com/) forecast: feels-like temperature and today's peak | No |
| Air | Open-Meteo air quality (CAMS Europe): European AQI and PM2.5 | No |
| Rain and flood | Open-Meteo forecast (today's rain) and flood API (GloFAS river flow vs normal, read on the Merwede near Gorinchem, upstream of Rotterdam) | No |

Readings are fetched on the server and refreshed about every hour (the river every six hours).

## Run it locally

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Data

The actions are in `data/verified.json` (English) and `data/verified.nl.json` (Dutch); flagged entries are in `data/flagged.json` and `data/flagged.nl.json`. The site checks every entry when it builds and refuses to build if one is broken or if the two languages don't match. All actions were checked against official sources on 1 October 2026. Programs change, so check the source before relying on one.

Accessibility: text contrast meets WCAG AA or better (body text AAA), with visible keyboard focus, a skip link, larger click targets and extra contrast for people who ask their computer for it.
