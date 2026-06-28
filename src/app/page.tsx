import RankingTable from "@/components/RankingTable";
import RiskCarousel from "@/components/RiskCarousel";
import ThemeToggle from "@/components/ThemeToggle";
import type { MatchCardData } from "@/components/MatchCard";
import { RESULTS } from "@/data/results";
import { ROUND_LABEL, ROUND_POINTS, type Match } from "@/data/bracket";
import {
  getRanking,
  matchesByDate,
  matchParticipants,
  nextMatchIndex,
  getActualWinner,
  isDecided,
  risksByTeam,
} from "@/lib/scoring";

// Recompute statically; editing results.ts + redeploy reflects new results.
export const dynamic = "force-static";

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

function buildCard(m: Match): MatchCardData {
  const [teamA, teamB] = matchParticipants(m, RESULTS);
  return {
    id: m.id,
    roundLabel: ROUND_LABEL[m.round],
    points: ROUND_POINTS[m.round],
    dateLabel: formatDate(m.date),
    teamA,
    teamB,
    decided: isDecided(m.id, RESULTS),
    winner: getActualWinner(m.id, RESULTS),
    groups: risksByTeam(m, RESULTS),
  };
}

export default function Home() {
  const ranking = getRanking(RESULTS);
  const ordered = matchesByDate();
  const cards = ordered.map(buildCard);
  const focusIndex = nextMatchIndex(ordered, RESULTS);
  const decidedCount = ordered.filter((m) => isDecided(m.id, RESULTS)).length;

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

      <section className="mx-auto mb-14 max-w-2xl px-5">
        <RankingTable rows={ranking} />
        <p className="mt-3 text-xs text-ink-faint">
          <span className="font-medium text-ink-muted">Actuals</span>: punts ja
          guanyats. <span className="font-medium text-ink-muted">Potencials</span>
          : màxim que encara es pot assolir (descomptant equips eliminats).
        </p>
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
