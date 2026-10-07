// Small line icons for the three panels. They use the current text
// colour, so they follow the level colour of the panel they sit in.

const common = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SunIcon() {
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
  );
}

export function WindIcon() {
  return (
    <svg {...common}>
      <path d="M3 8h11a3 3 0 1 0-3-3" />
      <path d="M3 12h16a3 3 0 1 1-3 3" />
      <path d="M3 16h7" />
    </svg>
  );
}

export function DropIcon() {
  return (
    <svg {...common}>
      <path d="M12 2.5s6.5 7.2 6.5 11.8a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.5 12 2.5Z" />
      <path d="M9 15a3 3 0 0 0 3 3" />
    </svg>
  );
}
