import type { Level, Panel } from "@/lib/conditions";
import { formatReadingTime, type Dictionary } from "@/lib/i18n";
import { DropIcon, SunIcon, WindIcon } from "./Icons";

// Full class names written out so Tailwind can find them.
const LEVEL_STYLES: Record<Level, { badge: string; bar: string; icon: string }> = {
  good: { badge: "bg-level-good-soft text-level-good", bar: "bg-level-good-bar", icon: "bg-level-good-soft text-level-good" },
  moderate: { badge: "bg-level-moderate-soft text-level-moderate", bar: "bg-level-moderate-bar", icon: "bg-level-moderate-soft text-level-moderate" },
  high: { badge: "bg-level-high-soft text-level-high", bar: "bg-level-high-bar", icon: "bg-level-high-soft text-level-high" },
  extreme: { badge: "bg-level-extreme-soft text-level-extreme", bar: "bg-level-extreme-bar", icon: "bg-level-extreme-soft text-level-extreme" },
  unknown: { badge: "bg-level-unknown-soft text-level-unknown", bar: "bg-level-unknown-bar", icon: "bg-level-unknown-soft text-level-unknown" },
};

const ICONS: Record<Panel["key"], () => React.JSX.Element> = {
  heat: SunIcon,
  air: WindIcon,
  rain: DropIcon,
};

export default function ConditionPanel({ panel, dict }: { panel: Panel; dict: Dictionary }) {
  const style = LEVEL_STYLES[panel.level];
  const Icon = ICONS[panel.key];
  return (
    <section className="flex flex-col overflow-hidden rounded-3xl border-2 border-outline bg-card shadow-sticker">
      <div className={`h-3 ${style.bar}`} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-3 font-display text-lg font-bold uppercase tracking-wide">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${style.icon}`}>
              <Icon />
            </span>
            {panel.label}
          </h3>
          <span className={`rounded-full border-2 border-current px-3 py-0.5 text-base font-bold ${style.badge}`}>
            {dict.levels[panel.level]}
          </span>
        </div>
        <p className="flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="font-display text-6xl font-extrabold tracking-tight">{panel.value}</span>
          <span className="text-base text-muted">{panel.unit}</span>
        </p>
        <p className="font-display text-2xl font-bold">{panel.headline}</p>
        <p className="text-base text-muted">{panel.detail}</p>
        <p className="mt-auto pt-2 text-base text-muted">
          {panel.observedAt
            ? `${dict.panels.readingFrom} ${formatReadingTime(panel.observedAt, dict)}`
            : dict.panels.noReading}
        </p>
      </div>
    </section>
  );
}
