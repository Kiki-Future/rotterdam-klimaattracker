import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, LOCALES } from "@/lib/i18n";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Bold, slightly playful font for headings and big numbers.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Only /en and /nl exist. Any other first part of the address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.meta.title, description: dict.meta.description };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/* Hidden until you press Tab: lets keyboard and screen reader users skip the menu. */}
        <a
          href="#main"
          className="sr-only rounded-full bg-foreground px-5 py-3 font-bold text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          {dict.nav.skip}
        </a>
        {children}
        <footer className="mt-auto bg-brand-solid text-on-brand">
          <p className="mx-auto w-full max-w-5xl px-6 py-8 text-base">{dict.footer}</p>
        </footer>
      </body>
    </html>
  );
}
