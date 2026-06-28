import type { RankingRow } from "@/lib/scoring";

/**
 * The ranking: Name · Current points · Potential points.
 * Sorted upstream (most points on top). Responsive: comfortable on phones,
 * roomy on desktop.
 */
export default function RankingTable({ rows }: { rows: RankingRow[] }) {
  const maxPotential = Math.max(1, ...rows.map((r) => r.potential));

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/[0.03] backdrop-blur">
      <table className="w-full border-collapse text-sm sm:text-base">
        <thead>
          <tr className="text-left text-white/60">
            <th className="py-3 pl-3 pr-2 font-medium w-10 sm:w-14">#</th>
            <th className="py-3 px-2 font-medium">Nom</th>
            <th className="py-3 px-2 font-medium text-right whitespace-nowrap">
              Punts<span className="hidden sm:inline"> actuals</span>
            </th>
            <th className="py-3 pl-2 pr-3 font-medium text-right whitespace-nowrap">
              Potencials
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const medal = ["🥇", "🥈", "🥉"][i];
            return (
              <tr
                key={r.person}
                className="border-t border-white/[0.06] hover:bg-white/[0.04]"
              >
                <td className="py-2.5 pl-3 pr-2 text-white/50 tabular-nums">
                  {medal ?? i + 1}
                </td>
                <td className="py-2.5 px-2 font-medium">{r.person}</td>
                <td className="py-2.5 px-2 text-right">
                  <span className="inline-block min-w-8 rounded-md bg-emerald-400/15 px-2 py-0.5 font-semibold text-emerald-300 tabular-nums">
                    {r.current}
                  </span>
                </td>
                <td className="py-2.5 pl-2 pr-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className="hidden h-1.5 rounded-full bg-sky-400/40 sm:block"
                      style={{
                        width: `${(r.potential / maxPotential) * 64}px`,
                      }}
                    />
                    <span className="tabular-nums text-white/80">
                      {r.potential}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
