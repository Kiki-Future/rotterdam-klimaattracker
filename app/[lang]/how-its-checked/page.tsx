import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getActions, latestCheck } from "@/lib/actions";
import { formatDate, getDictionary, hasLocale, pagePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-its-checked">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).meta.checkedTitle };
}

export default async function HowItsChecked({ params }: PageProps<"/[lang]/how-its-checked">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.checked;
  const { verified, flagged } = getActions(lang);
  const checkedOn = latestCheck([...verified, ...flagged]);

  return (
    <>
      <SiteHeader lang={lang} page="checked" dict={dict} />
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-14">
        <section className="flex flex-col gap-3">
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">{t.heading}</h1>
          <p className="max-w-2xl text-xl text-muted">{t.intro}</p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-brand-solid p-6 text-on-brand shadow-sticker">
            <p className="font-display text-7xl font-extrabold">{verified.length}</p>
            <p className="pt-1 text-xl font-bold">{t.passed}</p>
          </div>
          <div className="rounded-3xl border-2 border-outline bg-card p-6 shadow-sticker">
            <p className="font-display text-7xl font-extrabold">{flagged.length}</p>
            <p className="pt-1 text-xl font-bold">{t.flagged}</p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.checksHeading}</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {t.checks.map((c, i) => (
              <li key={c.name} className="flex flex-col gap-3 rounded-3xl border-2 border-outline bg-card p-6 shadow-sticker">
                <p className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-solid font-display text-xl font-extrabold text-on-brand">{i + 1}</p>
                <h3 className="font-display text-2xl font-bold">{c.name}</h3>
                <p className="text-base text-muted">{c.text}</p>
              </li>
            ))}
          </ol>
          {checkedOn && <p className="text-base text-muted">{t.lastChecked(formatDate(checkedOn, dict.months))}</p>}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.dataHeading}</h2>
          <p className="text-base text-muted">{t.dataIntro}</p>
          <div className="overflow-x-auto rounded-3xl border-2 border-outline bg-card">
            <table className="w-full text-left text-base">
              <thead className="bg-brand-soft">
                <tr>
                  <th className="p-4 font-bold">{t.dataTable.panel}</th>
                  <th className="p-4 font-bold">{t.dataTable.source}</th>
                  <th className="p-4 font-bold">{t.dataTable.refresh}</th>
                </tr>
              </thead>
              <tbody>
                {t.data.map((row) => (
                  <tr key={row.panel} className="border-t border-border align-top">
                    <td className="p-4 font-bold">{row.panel}</td>
                    <td className="p-4 text-muted">{row.source}</td>
                    <td className="p-4 text-muted">{row.refresh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-base text-muted">{t.riverNote}</p>
          <p className="text-base">
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
              open-meteo.com
            </a>
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.levelsHeading}</h2>
          <dl className="grid gap-6 md:grid-cols-3">
            {t.levels.map((l) => (
              <div key={l.name} className="flex flex-col gap-2 rounded-3xl border-2 border-outline bg-card p-6 shadow-sticker">
                <dt className="font-display text-2xl font-bold">{l.name}</dt>
                <dd className="text-base text-muted">{l.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.flaggedHeading}</h2>
          <p className="text-base text-muted">{t.flaggedIntro}</p>
          {flagged.length === 0 ? (
            <p className="text-base text-muted">{t.noFlagged}</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {flagged.map((a) => (
                <li key={a.id} className="flex flex-col gap-3 rounded-3xl border-2 border-dashed border-outline bg-card p-6">
                  <p className="w-fit rounded-full bg-level-unknown-soft px-3 py-1 text-sm font-bold text-muted">{a.category}</p>
                  <h3 className="font-display text-2xl font-bold">{a.title}</h3>
                  <p className="text-base text-muted">{a.summary}</p>
                  <p className="rounded-2xl bg-level-high-soft px-4 py-3 text-base text-level-high">
                    <span className="font-semibold">{t.reason}:</span> {a.verification.flag_reason}
                  </p>
                  <p className="text-sm text-muted">
                    {a.sources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && " · "}
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
                          {s.title}
                        </a>
                      </span>
                    ))}
                    {" · "}
                    {dict.card.checked} {formatDate(a.verification.lastChecked, dict.months)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link href={pagePath(lang, "home")} className="w-fit rounded-full bg-brand-solid px-5 py-2 font-bold text-on-brand hover:bg-brand-solid-hover">
          ← {t.back}
        </Link>
      </main>
    </>
  );
}
