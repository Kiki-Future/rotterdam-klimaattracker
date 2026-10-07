import Link from "next/link";
import { notFound } from "next/navigation";
import ActionBrowser from "@/components/ActionBrowser";
import ActionCard, { type CardLabels } from "@/components/ActionCard";
import ConditionPanel from "@/components/ConditionPanel";
import SiteHeader from "@/components/SiteHeader";
import cityData from "@/data/city.json";
import { categoriesOf, getActions } from "@/lib/actions";
import { actionsForToday, activeConditions, airPanel, heatPanel, rainPanel } from "@/lib/conditions";
import { fetchAir, fetchFlood, fetchWeather } from "@/lib/feeds";
import { getDictionary, hasLocale, pagePath } from "@/lib/i18n";
import type { City } from "@/lib/types";

const city = cityData as City;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { verified, flagged } = getActions(lang);

  // The three feeds run at the same time, not one after another.
  const [weather, air, flood] = await Promise.all([
    fetchWeather(city),
    fetchAir(city),
    fetchFlood(city),
  ]);
  const panels = [heatPanel(weather, dict), airPanel(air, dict), rainPanel(weather, flood, dict)];
  const { matched, anytime } = actionsForToday(verified, activeConditions(panels));

  const cardLabels: CardLabels = {
    conditions: dict.conditions,
    sources: dict.card.sources,
    checked: dict.card.checked,
    because: dict.todo.because,
    months: dict.months,
  };

  return (
    <>
      <SiteHeader lang={lang} page="home" dict={dict} />
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-14">
        <section className="flex flex-col gap-3">
          <p className="w-fit rounded-full bg-brand-soft px-4 py-1 text-base font-bold text-brand">
            {city.name}, {dict.country}
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">{dict.siteTitle}</h1>
          <p className="max-w-2xl text-xl text-muted">{dict.tagline}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{dict.today.heading}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {panels.map((p) => (
              <ConditionPanel key={p.key} panel={p} dict={dict} />
            ))}
          </div>
          <p className="text-base text-muted">{dict.today.sourceNote}</p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{dict.todo.heading}</h2>
          {matched.length > 0 ? (
            <>
              <p className="text-base text-muted">{dict.todo.matchedIntro}</p>
              <div className="grid gap-6 md:grid-cols-2">
                {matched.map((m) => (
                  <ActionCard key={m.action.id} action={m.action} labels={cardLabels} because={m.because} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-base text-muted">{dict.todo.noneMatched}</p>
          )}
          {anytime.length > 0 && (
            <>
              <h3 className="pt-6 font-display text-2xl font-bold">{dict.todo.anytimeHeading}</h3>
              <div className="grid gap-6 md:grid-cols-3">
                {anytime.map((a) => (
                  <ActionCard key={a.id} action={a} labels={cardLabels} />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="flex flex-col gap-4" id="all-actions">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{dict.browser.heading}</h2>
          <p className="text-base text-muted">{dict.browser.intro}</p>
          <ActionBrowser
            actions={verified}
            categories={categoriesOf(verified)}
            labels={dict.browser}
            cardLabels={cardLabels}
          />
        </section>

        <section className="flex flex-col gap-3 rounded-3xl bg-brand-solid p-7 text-on-brand shadow-sticker">
          <p className="font-display text-xl font-bold">{dict.summary.text(verified.length, flagged.length)}</p>
          <Link href={pagePath(lang, "checked")} className="w-fit rounded-full bg-on-brand px-5 py-2 font-bold text-brand-solid hover:-translate-y-0.5 focus-visible:outline-on-brand motion-safe:transition-transform">
            {dict.summary.link} →
          </Link>
        </section>
      </main>
    </>
  );
}
