// ============================================================================
//  SCORING LOGIC  —  every calculation lives here, as a small named function
//  with a comment explaining exactly what it computes, so the logic can be
//  audited later.
// ============================================================================

import {
  MATCHES,
  MATCH_BY_ID,
  NEXT_MATCH,
  matchPoints,
  type Match,
  type Slot,
} from "@/data/bracket";
import { PREDICTIONS, PEOPLE } from "@/data/predictions";
import type { Results } from "@/data/results";

// ---------------------------------------------------------------------------
//  Bracket helpers
// ---------------------------------------------------------------------------

/**
 * The pick a person made for a given match (the team they predicted to WIN it).
 * Predictions are stored as a 31-long array; match `id` maps to index `id - 1`.
 */
export function pickFor(person: string, matchId: number): string {
  return PREDICTIONS[person][matchId - 1];
}

/** Whether a match has a recorded result yet. */
export function isDecided(matchId: number, results: Results): boolean {
  return Boolean(results[matchId]);
}

/** The actual winner of a match, or null if it hasn't been played/recorded. */
export function getActualWinner(matchId: number, results: Results): string | null {
  return results[matchId] ?? null;
}

/**
 * The chain of matches a winner travels through, starting AT `matchId` and
 * walking up to the Final. e.g. match 1 -> [1, 17, 25, 29, 31].
 * Used for cascades (a team that loses here is gone from every later match).
 */
export function getMatchPath(matchId: number): number[] {
  const path: number[] = [];
  let cur: number | null = matchId;
  while (cur !== null) {
    path.push(cur);
    cur = NEXT_MATCH[cur];
  }
  return path;
}

/**
 * The list of matches a TEAM could play, from the round it enters up to the
 * Final. This is just the match-path that starts at the team's entry match.
 */
export function getTeamPath(teamName: string): number[] {
  const entry = MATCHES.find(
    (m) =>
      ("team" in m.slotA && m.slotA.team === teamName) ||
      ("team" in m.slotB && m.slotB.team === teamName),
  );
  if (!entry) return [];
  return getMatchPath(entry.id);
}

/**
 * A team is ELIMINATED if, anywhere along its path, there is a DECIDED match
 * whose recorded winner is NOT this team. (i.e. it played and lost, or it
 * never reached a match someone else won on its line.)
 *
 * If a team has only won-or-unplayed matches on its path, it is still alive.
 */
export function isTeamEliminated(teamName: string, results: Results): boolean {
  for (const matchId of getTeamPath(teamName)) {
    const winner = getActualWinner(matchId, results);
    if (winner !== null && winner !== teamName) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
//  Points
// ---------------------------------------------------------------------------

/**
 * CURRENT POINTS = points already earned.
 * For every DECIDED match, if the person's pick equals the actual winner,
 * add that match's points.
 */
export function currentPoints(person: string, results: Results): number {
  let total = 0;
  for (const m of MATCHES) {
    const winner = getActualWinner(m.id, results);
    if (winner !== null && pickFor(person, m.id) === winner) {
      total += matchPoints(m);
    }
  }
  return total;
}

/**
 * POTENTIAL POINTS = the maximum points a person can still finish with.
 *
 *   current points
 * + for every UNDECIDED match, its points IF the team they picked there is
 *   still alive (not eliminated) and can therefore still win it.
 *
 * Picks on already-eliminated teams contribute nothing — those points are
 * gone forever and are correctly excluded.
 */
export function potentialPoints(person: string, results: Results): number {
  let total = currentPoints(person, results);
  for (const m of MATCHES) {
    if (isDecided(m.id, results)) continue; // decided matches already counted
    const pick = pickFor(person, m.id);
    if (!isTeamEliminated(pick, results)) {
      total += matchPoints(m);
    }
  }
  return total;
}

/**
 * POINTS AT RISK for a person at a specific (undecided) match.
 *
 * If their pick for this match LOSES here, that team is eliminated and every
 * later pick of the SAME team also dies. So the risk is the sum of points of
 * every still-undecided match, from `matchId` up the path to the Final, where
 * the person again picked that same team.
 *
 * Example: picked Canadà in the R32 (1 pt) AND as their QF winner (4 pts).
 * If Canadà loses the R32 match, they lose 1 + 4 = 5 points.
 */
export function pointsAtRisk(person: string, matchId: number, results: Results): number {
  const team = pickFor(person, matchId);
  let risk = 0;
  for (const downstreamId of getMatchPath(matchId)) {
    if (isDecided(downstreamId, results)) continue;
    if (pickFor(person, downstreamId) === team) {
      risk += matchPoints(MATCH_BY_ID[downstreamId]);
    }
  }
  return risk;
}

/**
 * POINTS AT STAKE for a person on a match — what hinged on this match's result.
 *
 * Identical to pointsAtRisk, except it ALWAYS counts this match's own points,
 * even after it has been played. That lets a decided card keep showing the
 * stakes: the people who backed the loser see what they lost, the people who
 * backed the winner see what they kept. Downstream matches are still only
 * counted while undecided (those are settled on their own cards).
 */
export function pointsAtStake(person: string, matchId: number, results: Results): number {
  const team = pickFor(person, matchId);
  let total = 0;
  for (const downstreamId of getMatchPath(matchId)) {
    if (downstreamId !== matchId && isDecided(downstreamId, results)) continue;
    if (pickFor(person, downstreamId) === team) {
      total += matchPoints(MATCH_BY_ID[downstreamId]);
    }
  }
  return total;
}

// ---------------------------------------------------------------------------
//  Aggregations for the UI
// ---------------------------------------------------------------------------

export interface RankingRow {
  person: string;
  current: number;
  potential: number;
  /** Standing by current points, ties shared (1,1,3,…). */
  position: number;
  /** How many OTHER people share this person's current score. */
  tiedWith: number;
  /**
   * True when this person can no longer win: their best possible final score
   * (potential) is already below someone's guaranteed score (current), so they
   * can never finish on top.
   */
  eliminated: boolean;
}

/**
 * The full ranking, sorted by current points (desc), then potential points
 * (desc) as a tie-breaker, then name for stability.
 *
 * `position` uses standard competition ranking on current points, so everyone
 * with the same current score shares the same position.
 */
export function getRanking(results: Results): RankingRow[] {
  const base = PEOPLE.map((person) => ({
    person,
    current: currentPoints(person, results),
    potential: potentialPoints(person, results),
  }));
  const maxCurrent = Math.max(0, ...base.map((r) => r.current));
  return base
    .map((r) => ({
      ...r,
      position: 1 + base.filter((o) => o.current > r.current).length,
      tiedWith: base.filter(
        (o) => o.person !== r.person && o.current === r.current,
      ).length,
      eliminated: r.potential < maxCurrent,
    }))
    .sort(
      (a, b) =>
        b.current - a.current ||
        b.potential - a.potential ||
        a.person.localeCompare(b.person, "ca"),
    );
}

export interface RiskEntry {
  person: string;
  pick: string;
  risk: number;
}

/**
 * For one match: each person's pick and how many points they'd lose if that
 * pick loses here. Sorted by risk (desc). Only people with risk > 0 included.
 */
export function risksForMatch(matchId: number, results: Results): RiskEntry[] {
  return PEOPLE.map((person) => ({
    person,
    pick: pickFor(person, matchId),
    risk: pointsAtRisk(person, matchId, results),
  }))
    .filter((e) => e.risk > 0)
    .sort((a, b) => b.risk - a.risk || a.person.localeCompare(b.person, "ca"));
}

export interface RiskGroup {
  team: string;
  total: number;
  entries: { person: string; risk: number }[];
}

/**
 * Risk for a match, split into one group per CONFIRMED participant.
 *
 * A side only appears once we actually know who plays there (an R32 fixture, or
 * a later round whose feeder result has been recorded). Until then that side
 * contributes no group — so undecided matches show no points at risk. As soon
 * as a team is slotted in, it appears here with the people who picked it to win
 * this match and how many points each would lose. Slot order (left, then right)
 * is preserved so the card can render the two sides in the same order as the
 * teams above.
 */
export function risksByTeam(m: Match, results: Results): RiskGroup[] {
  const groups: RiskGroup[] = [];
  for (const team of matchParticipants(m, results)) {
    if (!team) continue; // participant not yet known — nothing to show
    const entries = PEOPLE.filter((p) => pickFor(p, m.id) === team)
      .map((p) => ({ person: p, risk: pointsAtStake(p, m.id, results) }))
      .filter((e) => e.risk > 0)
      .sort((x, y) => y.risk - x.risk || x.person.localeCompare(y.person, "ca"));
    groups.push({
      team,
      total: entries.reduce((s, e) => s + e.risk, 0),
      entries,
    });
  }
  return groups;
}

/** Resolve who actually plays in a slot (team name) given recorded results. */
export function resolveSlot(slot: Slot, results: Results): string | null {
  if ("team" in slot) return slot.team;
  return getActualWinner(slot.winnerOf, results);
}

/** The two participants of a match (names or null if not yet known). */
export function matchParticipants(
  m: Match,
  results: Results,
): [string | null, string | null] {
  return [resolveSlot(m.slotA, results), resolveSlot(m.slotB, results)];
}

/**
 * Index (into the date-ordered match list) of the "next" match to focus the
 * carousel on: the first UNDECIDED match in date order. Falls back to the last
 * match if everything is decided.
 */
export function nextMatchIndex(orderedMatches: Match[], results: Results): number {
  const idx = orderedMatches.findIndex((m) => !isDecided(m.id, results));
  return idx === -1 ? orderedMatches.length - 1 : idx;
}

/** All matches ordered by date (then id) — the order used by the carousel. */
export function matchesByDate(): Match[] {
  return [...MATCHES].sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);
}
