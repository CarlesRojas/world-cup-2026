import Link from "next/link";
import type { RankingRow } from "@/lib/scoring";
import { slugify } from "@/lib/people";

interface Step {
  place: 1 | 2 | 3;
  rows: RankingRow[];
}

/**
 * Final podium: the top three score tiers, gold in the centre, silver left,
 * bronze right. Each step holds everyone who shares that score, so draws are
 * handled (a tier can have one name or many).
 */
export default function Podium({ rows }: { rows: RankingRow[] }) {
  const topScores = [...new Set(rows.map((r) => r.current))]
    .sort((a, b) => b - a)
    .slice(0, 3);

  const tiers: Step[] = topScores.map((score, i) => ({
    place: (i + 1) as 1 | 2 | 3,
    rows: rows
      .filter((r) => r.current === score)
      .sort((a, b) => a.person.localeCompare(b.person, "ca")),
  }));

  // Classic arrangement: 2nd · 1st · 3rd, keeping only the tiers that exist.
  const order = [tiers[1], tiers[0], tiers[2]].filter(Boolean) as Step[];

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4">
      {order.map((step) => (
        <PodiumStep key={step.place} step={step} />
      ))}
    </div>
  );
}

const META: Record<
  1 | 2 | 3,
  { label: string; title?: string; height: string; bg: string; text: string }
> = {
  1: {
    label: "1r",
    title: "Guanyadors",
    height: "h-28 sm:h-32",
    bg: "bg-amber-200/45 dark:bg-amber-400/15",
    text: "text-amber-800 dark:text-amber-200",
  },
  2: {
    label: "2n",
    height: "h-20 sm:h-24",
    bg: "bg-zinc-200/80 dark:bg-zinc-400/15",
    text: "text-zinc-600 dark:text-zinc-300",
  },
  3: {
    label: "3r",
    height: "h-16 sm:h-20",
    bg: "bg-orange-200/45 dark:bg-orange-400/10",
    text: "text-orange-900/80 dark:text-orange-300/55",
  },
};

function PodiumStep({ step }: { step: Step }) {
  const meta = META[step.place];
  return (
    <div className="flex w-1/3 max-w-[11rem] flex-col items-center">
      <div className="mb-2 flex flex-wrap justify-center gap-1">
        {step.rows.map((r) => (
          <Link
            key={r.person}
            href={`/persona/${slugify(r.person)}`}
            className="max-w-full truncate rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium text-ink transition hover:bg-bg"
          >
            {r.person}
          </Link>
        ))}
      </div>
      <div
        className={`flex w-full ${meta.height} flex-col items-center justify-center gap-0.5 rounded-t-xl ${meta.bg} ${meta.text}`}
      >
        <span className="text-4xl font-black leading-none tracking-tight sm:text-5xl">
          {meta.label}
        </span>
        {meta.title && (
          <span className="text-[11px] font-semibold uppercase tracking-wide">
            {meta.title}
          </span>
        )}
      </div>
    </div>
  );
}
