import { Flag, TeamColumn } from "./TeamBadge";

export interface RiskGroupData {
  team: string;
  total: number;
  entries: { person: string; risk: number }[];
}

export interface MatchCardData {
  id: number;
  roundLabel: string;
  points: number;
  dateLabel: string;
  teamA: string | null;
  teamB: string | null;
  decided: boolean;
  winner: string | null;
  groups: RiskGroupData[];
}

/**
 * One match: header (round · date · points), the two teams side by side with a
 * "vs" in the middle (flag on top, name underneath), and the points-at-risk
 * split into one column per confirmed participant. The card is an elevated
 * surface (no border) and grows as tall as needed — the page scrolls, the card
 * never does.
 */
export default function MatchCard({
  data,
  focused,
}: {
  data: MatchCardData;
  focused: boolean;
}) {
  const { teamA, teamB, decided, winner, groups } = data;
  const anyRisk = groups.some((g) => g.entries.length > 0);
  return (
    <article
      className={`flex w-[86vw] max-w-[380px] shrink-0 snap-center flex-col self-start overflow-hidden rounded-2xl bg-surface transition ${
        focused ? "shadow-lg ring-1 ring-ink/10" : "shadow-sm"
      }`}
    >
      <header className="flex items-start justify-between gap-2 px-5 pt-4">
        <div className="min-w-0 text-xs">
          <div className="font-semibold text-ink">{data.roundLabel}</div>
          <div className="mt-0.5 text-ink-muted">{data.dateLabel}</div>
        </div>
        <span className="shrink-0 rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-ink-muted">
          {data.points} {data.points === 1 ? "pt" : "pts"}
        </span>
      </header>

      <div className="flex items-center gap-3 px-5 py-5">
        <TeamColumn team={teamA} dimmed={decided && teamA !== winner} />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          vs
        </span>
        <TeamColumn team={teamB} dimmed={decided && teamB !== winner} />
      </div>

      <div className="border-t border-line px-5 py-4">
        {decided ? (
          <p className="flex items-center justify-center gap-2 text-sm text-ink-muted">
            <Flag team={winner} width={18} height={12} />
            Guanya <span className="font-semibold text-ink">{winner}</span>
          </p>
        ) : groups.length === 0 ? (
          <p className="text-center text-sm text-ink-faint">
            Encara no se saben els equips.
          </p>
        ) : !anyRisk ? (
          <p className="text-center text-sm text-ink-faint">
            Ningú té punts en joc aquí.
          </p>
        ) : (
          <>
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
              Punts perduts si perd:
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {groups.slice(0, 2).map((g) => (
                <RiskColumn key={g.team} group={g} />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function RiskColumn({ group }: { group: RiskGroupData }) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-1.5 border-b border-line pb-1.5">
        <Flag team={group.team} width={16} height={11} />
        <span className="truncate text-xs font-semibold text-ink">
          {group.team}
        </span>
      </div>
      {group.entries.length === 0 ? (
        <p className="text-xs text-ink-faint">—</p>
      ) : (
        <ul className="space-y-1">
          {group.entries.map((e) => (
            <li
              key={e.person}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="truncate text-ink-muted">{e.person}</span>
              <span className="shrink-0 font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                −{e.risk}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
