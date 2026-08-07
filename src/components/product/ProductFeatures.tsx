import type { SVGProps } from "react";

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        d="M12 20s-7-4.4-9.5-8.6C.7 8 2.3 4.8 5.6 4.2c2-.4 3.9.5 4.9 2.1 1-1.6 2.9-2.5 4.9-2.1 3.3.6 4.9 3.8 3.1 7.2C19 15.6 12 20 12 20z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = [StarIcon, ShieldIcon, HeartIcon, SparkleIcon];

function pickIcon(text: string, index: number) {
  const t = text.toLowerCase();
  if (t.includes("mano") || t.includes("artesan")) return HeartIcon;
  if (t.includes("cuero") || t.includes("resist") || t.includes("durad")) return ShieldIcon;
  if (t.includes("detalle") || t.includes("acabado") || t.includes("costura")) return SparkleIcon;
  return ICONS[index % ICONS.length];
}

export function ProductFeatures({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = pickIcon(item, i);
        return (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icon className="h-4 w-4" />
            </span>
            <span className="pt-1.5 text-sm text-brand-800">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}
