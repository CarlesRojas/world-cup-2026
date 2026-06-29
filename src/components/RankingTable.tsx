"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RankingRow } from "@/lib/scoring";
import { slugify } from "@/lib/people";

type SortKey = "current" | "potential";
type SortDir = "asc" | "desc";

/**
 * Ranking: Name · Current points · Potential points.
 * Click a point column to sort by it; click it again to flip the direction.
 * The active column shows a chevron pointing the way it's sorted.
 */
export default function RankingTable({ rows }: { rows: RankingRow[] }) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortKey>("current");
  const [dir, setDir] = useState<SortDir>("desc");

  function sortByColumn(key: SortKey) {
    if (key === sortBy) {
      setDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const other: SortKey = sortBy === "current" ? "potential" : "current";
    const base = a[sortBy] - b[sortBy] || a[other] - b[other];
    if (base !== 0) return dir === "desc" ? -base : base;
    return a.person.localeCompare(b.person, "ca");
  });

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink">
        Classificació
      </h2>
      <p className="mb-4 mt-1 text-sm text-ink-muted">
        <span className="font-medium text-ink">Actuals</span>: punts que ja has
        guanyat. <span className="font-medium text-ink">Potencials</span>: el
        màxim que encara pots arribar a fer si tots els teus equips vius guanyen.
      </p>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink-faint">
              <th className="w-10 py-3 pl-4 text-left font-medium">#</th>
              <th className="py-3 px-2 text-left font-medium">Nom</th>
              <SortHeader
                label="Actuals"
                active={sortBy === "current"}
                dir={dir}
                onClick={() => sortByColumn("current")}
              />
              <SortHeader
                label="Potencials"
                active={sortBy === "potential"}
                dir={dir}
                onClick={() => sortByColumn("potential")}
                rightPad
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.person}
                onClick={() => router.push(`/persona/${slugify(r.person)}`)}
                className="cursor-pointer border-t border-line transition last:border-b-0 hover:bg-surface"
              >
                <td className="py-3 pl-4 text-left tabular-nums text-ink-faint">
                  {r.position}
                </td>
                <td className="py-3 px-2 font-medium">
                  <Link
                    href={`/persona/${slugify(r.person)}`}
                    className={`underline-offset-2 transition hover:underline ${
                      r.eliminated
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-ink"
                    }`}
                  >
                    {r.person}
                  </Link>
                </td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`inline-block min-w-[2.25rem] rounded-md px-2 py-0.5 font-semibold tabular-nums ${
                      sortBy === "current" ? "bg-ink text-bg" : "text-ink"
                    }`}
                  >
                    {r.current}
                  </span>
                </td>
                <td className="py-3 pr-4 pl-2 text-center">
                  <span
                    className={`inline-block min-w-[2.25rem] rounded-md px-2 py-0.5 font-semibold tabular-nums ${
                      sortBy === "potential" ? "bg-ink text-bg" : "text-ink-muted"
                    }`}
                  >
                    {r.potential}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
  rightPad = false,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  rightPad?: boolean;
}) {
  return (
    <th className={`py-3 px-2 text-center font-medium ${rightPad ? "pr-4" : ""}`}>
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 uppercase tracking-wide transition ${
          active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
        }`}
      >
        {label}
        <Chevron
          className={`transition ${active ? "opacity-100" : "opacity-0"} ${
            active && dir === "asc" ? "rotate-180" : ""
          }`}
        />
      </button>
    </th>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
