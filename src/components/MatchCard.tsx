import TeamBadge, { Flag } from "./TeamBadge";

export interface MatchCardData {
  id: number;
  roundLabel: string;
  points: number;
  dateLabel: string;
  teamA: string | null;
  teamB: string | null;
  decided: boolean;
  winner: string | null;
  risks: { person: string; pick: string; risk: number }[];
}

/**
 * One match in the carousel: round + date header, the two teams (with crests),
 * and the per-person "points at risk" list for this match.
 */
export default function MatchCard({
  data,
  focused,
}: {
  data: MatchCardData;
  focused: boolean;
}) {
  return (
    <article
      className={`flex w-[82vw] max-w-[360px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl ring-1 transition
        ${
          focused
            ? "ring-emerald-400/60 bg-white/[0.06] shadow-lg shadow-emerald-900/30"
            : "ring-white/10 bg-white/[0.03]"
        }`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{data.roundLabel}</div>
          <div className="text-xs text-white/50">{data.dateLabel}</div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-300/15 px-2.5 py-1 text-xs font-semibold text-amber-200">
          {data.points} {data.points === 1 ? "punt" : "punts"}
        </span>
      </header>

      <div className="space-y-1 px-4 py-3">
        <TeamRow team={data.teamA} winner={data.winner} decided={data.decided} />
        <div className="pl-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          vs
        </div>
        <TeamRow team={data.teamB} winner={data.winner} decided={data.decided} />
      </div>

      <div className="mt-auto border-t border-white/10 px-4 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/45">
          {data.decided ? "Resultat registrat" : "Punts en joc"}
        </div>

        {data.decided ? (
          <p className="text-sm text-white/60">
            Guanya{" "}
            <span className="font-semibold text-white">{data.winner}</span>.
          </p>
        ) : data.risks.length === 0 ? (
          <p className="text-sm text-white/50">Ningú té punts en joc aquí.</p>
        ) : (
          <ul className="max-h-56 space-y-1 overflow-y-auto pr-1 no-scrollbar">
            {data.risks.map((r) => (
              <li
                key={r.person}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate">{r.person}</span>
                  <Flag team={r.pick} width={18} height={12} />
                </span>
                <span className="shrink-0 rounded-md bg-rose-400/15 px-1.5 py-0.5 text-xs font-semibold text-rose-300 tabular-nums">
                  −{r.risk}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function TeamRow({
  team,
  winner,
  decided,
}: {
  team: string | null;
  winner: string | null;
  decided: boolean;
}) {
  const isWinner = decided && team !== null && team === winner;
  const isLoser = decided && team !== null && winner !== null && team !== winner;
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
        isWinner ? "bg-emerald-400/10" : ""
      } ${isLoser ? "opacity-40" : ""}`}
    >
      <TeamBadge team={team} size={26} nameClassName="font-medium" />
      {isWinner && <span className="text-emerald-300">✓</span>}
    </div>
  );
}
