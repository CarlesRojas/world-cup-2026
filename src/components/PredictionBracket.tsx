import {
  MATCHES,
  ROUND_LABEL,
  ROUND_POINTS,
  type Round,
} from "@/data/bracket";
import { RESULTS } from "@/data/results";
import {
  pickFor,
  isDecided,
  getActualWinner,
  isTeamEliminated,
} from "@/lib/scoring";
import { Flag } from "./TeamBadge";

const ROUND_ORDER: Round[] = ["R32", "R16", "QF", "SF", "F"];

type Status = "correct" | "wrong" | "dead" | "pending";

function statusFor(person: string, matchId: number): Status {
  const pick = pickFor(person, matchId);
  if (isDecided(matchId, RESULTS)) {
    return getActualWinner(matchId, RESULTS) === pick ? "correct" : "wrong";
  }
  return isTeamEliminated(pick, RESULTS) ? "dead" : "pending";
}

/**
 * A person's whole bracket of predictions, one column per round (R32 → final).
 * Each cell is the team they picked to win that match, colour-coded:
 *   green = already correct · red = already wrong ·
 *   struck/faded = can no longer happen (their team is out) · plain = pending.
 * Columns scroll horizontally; `justify-around` spaces each round so it reads
 * like a bracket.
 */
export default function PredictionBracket({ person }: { person: string }) {
  return (
    <div>
      <div className="no-scrollbar overflow-x-auto pb-2">
        {/* Columns grow to fill the width on desktop; on narrow screens the
            min-width kicks in and the row scrolls horizontally. */}
        <div className="flex gap-2 sm:gap-3">
          {ROUND_ORDER.map((round) => {
            const matches = MATCHES.filter((m) => m.round === round);
            // The Round of 32 is grouped into the pairs whose winners meet in
            // the next round, so it's clear which two matches feed each tie.
            const groups =
              round === "R32" ? chunkPairs(matches) : matches.map((m) => [m]);
            return (
              <div key={round} className="flex min-w-[8.5rem] flex-1 flex-col">
                <div className="mb-2 px-1">
                  <div className="text-xs font-semibold text-ink">
                    {ROUND_LABEL[round]}
                  </div>
                  <div className="text-[11px] text-ink-faint">
                    {ROUND_POINTS[round]}{" "}
                    {ROUND_POINTS[round] === 1 ? "pt" : "pts"}
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-around gap-3">
                  {groups.map((group, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      {group.map((m) => (
                        <PickCell
                          key={m.id}
                          team={pickFor(person, m.id)}
                          status={statusFor(person, m.id)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Split a list into consecutive pairs: [a,b,c,d] -> [[a,b],[c,d]]. */
function chunkPairs<T>(arr: T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += 2) out.push(arr.slice(i, i + 2));
  return out;
}

function PickCell({ team, status }: { team: string; status: Status }) {
  const styles: Record<Status, string> = {
    correct:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    wrong: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dead: "border-line bg-surface text-ink-faint line-through opacity-50",
    pending: "border-line bg-surface text-ink",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs ${styles[status]}`}
    >
      <Flag team={team} width={18} height={12} className="shrink-0 no-underline" />
      <span className="truncate">{team}</span>
      {status === "correct" && <span className="ml-auto shrink-0">✓</span>}
      {status === "wrong" && <span className="ml-auto shrink-0">✗</span>}
    </div>
  );
}

