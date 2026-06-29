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
  { medal: string; label: string; height: string; bg: string; text: string }
> = {
  1: {
    medal: "🥇",
    label: "1r",
    height: "h-24 sm:h-28",
    bg: "bg-amber-300",
    text: "text-amber-950",
  },
  2: {
    medal: "🥈",
    label: "2n",
    height: "h-16 sm:h-20",
    bg: "bg-zinc-300",
    text: "text-zinc-800",
  },
  3: {
    medal: "🥉",
    label: "3r",
    height: "h-12 sm:h-16",
    bg: "bg-amber-700",
    text: "text-amber-50",
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
        className={`flex w-full ${meta.height} flex-col items-center justify-start gap-0.5 rounded-t-xl pt-2 ${meta.bg} ${meta.text}`}
      >
        <span className="text-2xl leading-none">{meta.medal}</span>
        <span className="text-xs font-bold">{meta.label}</span>
      </div>
    </div>
  );
}
