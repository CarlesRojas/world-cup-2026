"use client";

import { useState } from "react";
import type { RankingRow } from "@/lib/scoring";

type SortKey = "current" | "potential";

/**
 * Ranking: Name · Current points · Potential points.
 * A segmented control switches the sort between current and potential points.
 * Both point columns are centered.
 */
export default function RankingTable({ rows }: { rows: RankingRow[] }) {
  const [sortBy, setSortBy] = useState<SortKey>("current");

  const sorted = [...rows].sort((a, b) => {
    const other: SortKey = sortBy === "current" ? "potential" : "current";
    return (
      b[sortBy] - a[sortBy] ||
      b[other] - a[other] ||
      a.person.localeCompare(b.person, "ca")
    );
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink">
          Classificació
        </h2>
        <Segmented sortBy={sortBy} onChange={setSortBy} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink-faint">
              <th className="w-10 py-3 pl-4 text-left font-medium">#</th>
              <th className="py-3 px-2 text-left font-medium">Nom</th>
              <SortHeader
                label="Actuals"
                active={sortBy === "current"}
                onClick={() => setSortBy("current")}
              />
              <SortHeader
                label="Potencials"
                active={sortBy === "potential"}
                onClick={() => setSortBy("potential")}
                rightPad
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr
                key={r.person}
                className="border-t border-line last:border-b-0"
              >
                <td className="py-3 pl-4 text-left tabular-nums text-ink-faint">
                  {i + 1}
                </td>
                <td className="py-3 px-2 font-medium text-ink">{r.person}</td>
                <td className="py-3 px-2 text-center">
                  <span
                    className={`inline-block min-w-[2.25rem] rounded-md px-2 py-0.5 font-semibold tabular-nums ${
                      sortBy === "current"
                        ? "bg-ink text-bg"
                        : "text-ink"
                    }`}
                  >
                    {r.current}
                  </span>
                </td>
                <td className="py-3 pr-4 pl-2 text-center">
                  <span
                    className={`inline-block min-w-[2.25rem] rounded-md px-2 py-0.5 font-semibold tabular-nums ${
                      sortBy === "potential"
                        ? "bg-ink text-bg"
                        : "text-ink-muted"
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
  onClick,
  rightPad = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  rightPad?: boolean;
}) {
  return (
    <th className={`py-3 px-2 text-center font-medium ${rightPad ? "pr-4" : ""}`}>
      <button
        onClick={onClick}
        className={`uppercase tracking-wide transition ${
          active ? "text-ink" : "text-ink-faint hover:text-ink-muted"
        }`}
      >
        {label}
      </button>
    </th>
  );
}

function Segmented({
  sortBy,
  onChange,
}: {
  sortBy: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const opts: { key: SortKey; label: string }[] = [
    { key: "current", label: "Actuals" },
    { key: "potential", label: "Potencials" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-line p-0.5 text-xs">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-md px-3 py-1.5 font-medium transition ${
            sortBy === o.key
              ? "bg-ink text-bg"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
