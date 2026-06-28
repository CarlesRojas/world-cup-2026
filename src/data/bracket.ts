// The 31-match knockout bracket.
//
// Each match has:
//   id      1..31
//   round   round key (points are derived from it)
//   date    ISO datetime in UTC (the real FIFA WC 2026 kickoff, e.g.
//           "2026-06-28T19:00:00Z"). Used to order the carousel and is shown
//           to the viewer in Spain/Catalonia time. UTC ISO strings sort
//           chronologically as plain strings, so ordering is just a sort.
//   slotA / slotB  who plays: either { team } for Round-of-32 matches,
//                  or { winnerOf } referencing the match that feeds this slot.
//
// `nextMatch` (the match this winner advances to) is derived automatically
// from the winnerOf references in deriveNextMatches().

export type Round = "R32" | "R16" | "QF" | "SF" | "F";

export const ROUND_POINTS: Record<Round, number> = {
  R32: 1,
  R16: 2,
  QF: 4,
  SF: 8,
  F: 16,
};

export const ROUND_LABEL: Record<Round, string> = {
  R32: "Setzens de final",
  R16: "Vuitens de final",
  QF: "Quarts de final",
  SF: "Semifinal",
  F: "Final",
};

export type Slot = { team: string } | { winnerOf: number };

export interface Match {
  id: number;
  round: Round;
  date: string;
  slotA: Slot;
  slotB: Slot;
}

export const MATCHES: Match[] = [
  // ---- Round of 32 (matches 1-16, 1 pt) ----
  // Kickoffs (UTC) from the real FIFA World Cup 2026 knockout schedule, per
  // fixture. Sudàfrica–Canadà opens the round on 28 June.
  { id: 1, round: "R32", date: "2026-06-29T20:30:00Z", slotA: { team: "Alemanya" }, slotB: { team: "Paraguai" } },
  { id: 2, round: "R32", date: "2026-06-30T21:00:00Z", slotA: { team: "França" }, slotB: { team: "Suècia" } },
  { id: 3, round: "R32", date: "2026-06-28T19:00:00Z", slotA: { team: "Sudàfrica" }, slotB: { team: "Canadà" } },
  { id: 4, round: "R32", date: "2026-06-30T01:00:00Z", slotA: { team: "Països Baixos" }, slotB: { team: "Marroc" } },
  { id: 5, round: "R32", date: "2026-07-02T23:00:00Z", slotA: { team: "Portugal" }, slotB: { team: "Croàcia" } },
  { id: 6, round: "R32", date: "2026-07-02T19:00:00Z", slotA: { team: "Espanya" }, slotB: { team: "Àustria" } },
  { id: 7, round: "R32", date: "2026-07-02T00:00:00Z", slotA: { team: "Estats Units" }, slotB: { team: "Bòsnia i H." } },
  { id: 8, round: "R32", date: "2026-07-01T20:00:00Z", slotA: { team: "Bèlgica" }, slotB: { team: "Senegal" } },
  { id: 9, round: "R32", date: "2026-06-29T17:00:00Z", slotA: { team: "Brasil" }, slotB: { team: "Japó" } },
  { id: 10, round: "R32", date: "2026-06-30T17:00:00Z", slotA: { team: "Costa d'Ivori" }, slotB: { team: "Noruega" } },
  { id: 11, round: "R32", date: "2026-07-01T01:00:00Z", slotA: { team: "Mèxic" }, slotB: { team: "Ecuador" } },
  { id: 12, round: "R32", date: "2026-07-01T16:00:00Z", slotA: { team: "Anglaterra" }, slotB: { team: "Congo" } },
  { id: 13, round: "R32", date: "2026-07-03T22:00:00Z", slotA: { team: "Argentina" }, slotB: { team: "Cap Verd" } },
  { id: 14, round: "R32", date: "2026-07-03T18:00:00Z", slotA: { team: "Austràlia" }, slotB: { team: "Egipte" } },
  { id: 15, round: "R32", date: "2026-07-03T03:00:00Z", slotA: { team: "Suïssa" }, slotB: { team: "Algèria" } },
  { id: 16, round: "R32", date: "2026-07-04T01:30:00Z", slotA: { team: "Colòmbia" }, slotB: { team: "Ghana" } },

  // ---- Round of 16 (matches 17-24, 2 pts) ----
  // The porra bracket wiring matches the real FIFA bracket exactly, so each of
  // these slots has a fixed real date/venue regardless of who advances. Dates
  // are the real kickoffs (UTC). FIFA match number in brackets.
  { id: 17, round: "R16", date: "2026-07-04T21:00:00Z", slotA: { winnerOf: 1 }, slotB: { winnerOf: 2 } },  // #89, Philadelphia
  { id: 18, round: "R16", date: "2026-07-04T17:00:00Z", slotA: { winnerOf: 3 }, slotB: { winnerOf: 4 } },  // #90, Houston
  { id: 19, round: "R16", date: "2026-07-06T19:00:00Z", slotA: { winnerOf: 5 }, slotB: { winnerOf: 6 } },  // #93, Dallas
  { id: 20, round: "R16", date: "2026-07-07T00:00:00Z", slotA: { winnerOf: 7 }, slotB: { winnerOf: 8 } },  // #94, Seattle
  { id: 21, round: "R16", date: "2026-07-05T20:00:00Z", slotA: { winnerOf: 9 }, slotB: { winnerOf: 10 } }, // #91, New York/New Jersey
  { id: 22, round: "R16", date: "2026-07-06T00:00:00Z", slotA: { winnerOf: 11 }, slotB: { winnerOf: 12 } }, // #92, Mexico City
  { id: 23, round: "R16", date: "2026-07-07T16:00:00Z", slotA: { winnerOf: 13 }, slotB: { winnerOf: 14 } }, // #95, Atlanta
  { id: 24, round: "R16", date: "2026-07-07T20:00:00Z", slotA: { winnerOf: 15 }, slotB: { winnerOf: 16 } }, // #96, Vancouver

  // ---- Quarterfinals (matches 25-28, 4 pts) ----
  { id: 25, round: "QF", date: "2026-07-09T20:00:00Z", slotA: { winnerOf: 17 }, slotB: { winnerOf: 18 } }, // #97, Boston
  { id: 26, round: "QF", date: "2026-07-10T19:00:00Z", slotA: { winnerOf: 19 }, slotB: { winnerOf: 20 } }, // #98, Los Angeles
  { id: 27, round: "QF", date: "2026-07-11T21:00:00Z", slotA: { winnerOf: 21 }, slotB: { winnerOf: 22 } }, // #99, Miami
  { id: 28, round: "QF", date: "2026-07-12T01:00:00Z", slotA: { winnerOf: 23 }, slotB: { winnerOf: 24 } }, // #100, Kansas City

  // ---- Semifinals (matches 29-30, 8 pts) ----
  { id: 29, round: "SF", date: "2026-07-14T19:00:00Z", slotA: { winnerOf: 25 }, slotB: { winnerOf: 26 } }, // #101, Arlington (Dallas)
  { id: 30, round: "SF", date: "2026-07-15T19:00:00Z", slotA: { winnerOf: 27 }, slotB: { winnerOf: 28 } }, // #102, Atlanta

  // ---- Final (match 31, 16 pts) ----
  { id: 31, round: "F", date: "2026-07-19T19:00:00Z", slotA: { winnerOf: 29 }, slotB: { winnerOf: 30 } },  // #104, New York/New Jersey
];

export const MATCH_BY_ID: Record<number, Match> = Object.fromEntries(
  MATCHES.map((m) => [m.id, m]),
);

export function matchPoints(m: Match): number {
  return ROUND_POINTS[m.round];
}

// For each match, the match its winner advances to (or null for the final).
// Derived by scanning every slot that references `winnerOf`.
export const NEXT_MATCH: Record<number, number | null> = (() => {
  const next: Record<number, number | null> = {};
  for (const m of MATCHES) next[m.id] = null;
  for (const m of MATCHES) {
    for (const slot of [m.slotA, m.slotB]) {
      if ("winnerOf" in slot) next[slot.winnerOf] = m.id;
    }
  }
  return next;
})();
