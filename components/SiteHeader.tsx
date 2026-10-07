import Link from "next/link";
import { pagePath, type Dictionary, type Locale, type PageKey } from "@/lib/i18n";

export default function SiteHeader({ lang, page, dict }: { lang: Locale; page: PageKey; dict: Dictionary }) {
  const other: Locale = lang === "en" ? "nl" : "en";
  const navLink = (key: PageKey, label: string) => (
    <Link
      href={pagePath(lang, key)}
      aria-current={page === key ? "page" : undefined}
      className={`flex min-h-11 items-center underline-offset-[6px] decoration-2 focus-visible:outline-on-brand ${
        page === key ? "font-bold underline" : "opacity-90 hover:underline hover:opacity-100"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <header>
      <div className="bg-brand-solid text-on-brand">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5">
          <Link href={pagePath(lang, "home")} className="font-display text-2xl font-extrabold tracking-tight focus-visible:outline-on-brand">
            {dict.siteTitle}
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base">
            {navLink("home", dict.nav.home)}
            {navLink("checked", dict.nav.checked)}
            <span className="flex items-center gap-1 rounded-full bg-on-brand/15 p-1 text-base font-bold" role="group" aria-label={dict.nav.language}>
              <span className="flex min-h-10 min-w-12 items-center justify-center rounded-full bg-on-brand px-3 text-brand-solid">
                {lang.toUpperCase()}
              </span>
              <Link
                href={pagePath(other, page)}
                hrefLang={other}
                lang={other}
                aria-label={dict.nav.switchTo}
                className="flex min-h-10 min-w-12 items-center justify-center rounded-full px-3 hover:bg-on-brand/20 focus-visible:outline-on-brand"
              >
                {other.toUpperCase()}
              </Link>
            </span>
          </nav>
        </div>
      </div>
      {/* A nod to the Rotterdam flag: green, white, green. */}
      <div className="h-2 bg-on-brand" aria-hidden="true" />
      <div className="h-2 bg-brand-solid" aria-hidden="true" />
    </header>
  );
}
