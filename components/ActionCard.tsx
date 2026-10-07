import { formatDate } from "@/lib/i18n";
import type { Action, Condition } from "@/lib/types";

/** Plain-text labels only, so this card can also be used in the browser-side action list. */
export interface CardLabels {
  conditions: Record<Condition, string>;
  sources: string;
  checked: string;
  because: string;
  months: string[];
}

export default function ActionCard({
  action,
  labels,
  because,
}: {
  action: Action;
  labels: CardLabels;
  /** The live conditions that brought this action up today, if any. */
  because?: Condition[];
}) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border-2 border-outline bg-card p-6 shadow-sticker motion-safe:transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-sticker-lg">
      <p className="w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand">{action.category}</p>
      <h3 className="font-display text-2xl font-bold leading-tight">{action.title}</h3>
      {because && because.length > 0 && (
        <p className="w-fit rounded-xl border-2 border-brand px-3 py-1 text-sm font-bold text-brand">
          {labels.because} {because.map((c) => labels.conditions[c]).join(", ")}
        </p>
      )}
      <p className="text-base">{action.summary}</p>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-base text-muted">
        {action.details.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-2">
        {action.when.map((c) => (
          <li key={c} className="rounded-full border-2 border-border px-3 py-0.5 text-sm font-medium text-muted">
            {labels.conditions[c]}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-1 border-t-2 border-dashed border-border pt-3 text-sm">
        <p className="text-muted">{labels.sources}:</p>
        <ul className="flex flex-col gap-1">
          {action.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-brand decoration-2 underline-offset-4 hover:text-brand">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-muted">
          {labels.checked} {formatDate(action.verification.lastChecked, labels.months)}
        </p>
      </div>
    </article>
  );
}
