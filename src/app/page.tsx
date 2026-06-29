import RankingTable from "@/components/RankingTable";
import RiskCarousel from "@/components/RiskCarousel";
import ThemeToggle from "@/components/ThemeToggle";
import Podium from "@/components/Podium";
import type { MatchCardData } from "@/components/MatchCard";
import type { Results } from "@/data/results";
import { ROUND_LABEL, ROUND_POINTS, type Match } from "@/data/bracket";
import { getResults } from "@/lib/db";
import {
  getRanking,
  matchesByDate,
  matchParticipants,
  nextMatchIndex,
  getActualWinner,
  isDecided,
  risksByTeam,
} from "@/lib/scoring";

// Results come from the database (admin page), so render per request.
export const dynamic = "force-dynamic";

// Kickoff shown in Spain/Catalonia time, e.g. "dg. 28 jun. · 21:00".
function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ca-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(d);
}

function buildCard(m: Match, results: Results): MatchCardData {
  const [teamA, teamB] = matchParticipants(m, results);
  return {
    id: m.id,
    roundLabel: ROUND_LABEL[m.round],
    points: ROUND_POINTS[m.round],
    dateLabel: formatDate(m.date),
    teamA,
    teamB,
    decided: isDecided(m.id, results),
    winner: getActualWinner(m.id, results),
    groups: risksByTeam(m, results),
  };
}

export default async function Home() {
  const results = await getResults();
  const ranking = getRanking(results);
  const ordered = matchesByDate();
  const cards = ordered.map((m) => buildCard(m, results));
  const focusIndex = nextMatchIndex(ordered, results);
  const decidedCount = ordered.filter((m) => isDecided(m.id, results)).length;

  return (
    <main className="py-6 sm:py-10">
      <div className="mx-auto flex max-w-2xl justify-end px-5">
        <ThemeToggle />
      </div>

      <header className="mx-auto mb-12 max-w-2xl px-5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
          Mundial 2026 · Eliminatòries
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Mundial a la Porra
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          {decidedCount} / {ordered.length} partits jugats
        </p>
      </header>

      {/* Podium only once every match has a result. */}
      {decidedCount === ordered.length && (
        <section className="mx-auto mb-12 max-w-2xl px-5">
          <Podium rows={ranking} />
        </section>
      )}

      <section className="mx-auto mb-14 max-w-2xl px-5">
        <RankingTable rows={ranking} />
      </section>

      <section>
        <div className="mx-auto mb-5 max-w-2xl px-5">
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Punts en joc per partit
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Si l&apos;equip que has triat perd, perds aquests punts (inclou tots
            els partits on segueixes amb el mateix equip).
          </p>
        </div>
        <RiskCarousel cards={cards} focusIndex={focusIndex} />
      </section>
    </main>
  );
}
