@AGENTS.md

# Rotterdam Climate Tracker

A one-city site that shows what the heat, the air and the rain are doing in Rotterdam, the Netherlands, right now, and matches verified local climate actions to those conditions.

This is Kirsten's Build 2 for Terra Studio. The reference repo is https://github.com/Terra-do/terra-studio-template-build-2. Read files there directly from `https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/<path>` for patterns. Don't clone it or copy files wholesale.

## Stack
- Next.js (App Router) with TypeScript. Tailwind v4 via `@tailwindcss/postcss`. No UI library, no database.
- npm is the package manager.
- Will be hosted on Vercel. Every push to `main` will redeploy.
- Live feeds are fetched on the server in `lib/feeds.ts` and cached with `next: { revalidate }`. Nothing is fetched from the browser.

## Files
- `data/city.json`: the city (name, country, lat/long, timezone, tagline) plus `river`, the upstream point for the flood feed (Rotterdam addition, agreed in step 2).
- `data/verified.json` / `data/verified.nl.json`: actions that passed all three checks, in English and Dutch. The only actions the site shows.
- `data/flagged.json` / `data/flagged.nl.json`: actions that failed a check, with a `flag_reason`. Shown on the "How it's checked" page, never as advice.
- `data/*.en.json`: exact copies of the English files from Cowork. Not used by the site.
- `lib/types.ts`: the data schema, matching the reference repo (plus the optional `river` on City).
- `lib/actions.ts`: loads the four action files and checks every entry. A broken entry, or English and Dutch files that don't match, stops the build.
- `lib/feeds.ts`: one function per live feed (weather incl. rain, European AQI, flood). Each returns `null` on failure. No keys.
- `lib/conditions.ts`: turns readings into levels (good/moderate/high/extreme) and conditions (`heat-high`, `air-high`, `flood-risk`...), and picks the actions for "What to do today". Thresholds are documented there.
- `lib/i18n.ts`: all fixed wording in English and Dutch, the page addresses per language, and date/number formatting.
- `app/[lang]/layout.tsx`: the root layout for each language (`/en`, `/nl`).
- `app/[lang]/page.tsx`: today's readings, "What to do today", all actions, checks summary.
- `app/[lang]/how-its-checked/page.tsx`: the three checks, feed sources, level thresholds, flagged entries. Dutch address `/nl/hoe-het-gecontroleerd-is` via a rewrite in `next.config.ts`.
- `components/`: site header with language switch, condition panel, action card, client-side action browser.

## Languages
- The site is bilingual: English at `/en`, Dutch at `/nl`. `/` redirects to `/en` (set in `next.config.ts`).
- New wording goes into both dictionaries in `lib/i18n.ts`. The Dutch dictionary has the same type as the English one, so a missing translation is a type error.

## Rules
- The default feeds need no keys. If a feed needs one, it lives in `.env.local` (git-ignored) and in Vercel's environment variables. Never in code, never in `NEXT_PUBLIC_*`.
- Feeds are server-side only. A feed that fails must show an "unavailable" panel, never crash the page.
- Don't add a public AI/chat feature. This site has no runtime AI on purpose.
- Style with Tailwind classes only. Colour tokens live in `app/globals.css`; add new ones there rather than hardcoding hex values.
- Keep the level colours (good, moderate, high, extreme) clearly different from each other.
- Keep the schema. If a feature needs a new field, say so and stop.
- Don't research climate actions in Claude Code. They come from the City Climate Tracker skill in Cowork as `verified.json` and `flagged.json`.
- Run `npm run build` before pushing. Vercel runs the same build.

## Local
`npm install`, then `npm run dev` and open http://localhost:3000. Kirsten runs the dev server in her own terminal.

## Learning mode
Kirsten is new to building websites. For the whole build:
- Before each step, say in two or three lines what you're about to do and why, then wait for her to say go.
- After each step, name the files you created or changed, and ask one short question that checks she understood the step. Don't quiz more than once per step.
- If she asks you to just do it, do it, and still name what changed.
- Use plain words. Explain any technical term the first time you use it.
- Use the reference repo for the data schema, the feed pattern and the rules. Write fresh code and let the design differ.
- Tell her the command to start the dev server and let her run it in her own terminal.

## Build steps
1. Set up (done when the starter page shows).
2. Live readings: city, three feeds, three panels.
3. Research the actions in Cowork (outside Claude Code). Use a placeholder with clearly fake actions if needed.
4. Show the actions: "What to do today", plus all actions with category filters and search.
5. How it's checked: second page.
6. Make it yours: colours, type, layout.
7. Ship it: build check, GitHub, Vercel.
