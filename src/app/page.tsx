import RankingTable from "@/components/RankingTable";
import RiskCarousel from "@/components/RiskCarousel";
import type { MatchCardData } from "@/components/MatchCard";
import { RESULTS } from "@/data/results";
import {
  ROUND_LABEL,
  ROUND_POINTS,
  type Match,
} from "@/data/bracket";
import {
  getRanking,
  matchesByDate,
  matchParticipants,
  nextMatchIndex,
  getActualWinner,
  isDecided,
  risksForMatch,
} from "@/lib/scoring";

// Recompute on every request so editing results.ts + redeploy is reflected.
export const dynamic = "force-static";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("ca-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
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
    risks: risksForMatch(m.id, RESULTS),
  };
}

export default function Home() {
  const ranking = getRanking(RESULTS);
  const ordered = matchesByDate();
  const cards = ordered.map(buildCard);
  const focusIndex = nextMatchIndex(ordered, RESULTS);
  const decidedCount = ordered.filter((m) => isDecided(m.id, RESULTS)).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
          Mundial 2026 · Eliminatòries
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          La Porra
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {decidedCount} / {ordered.length} partits jugats
        </p>
      </header>

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-bold">Classificació</h2>
        <RankingTable rows={ranking} />
        <p className="mt-2 text-xs text-white/40">
          <span className="text-emerald-300">Punts actuals</span>: ja guanyats.{" "}
          <span className="text-sky-300">Potencials</span>: màxim que encara es
          pot assolir (descomptant equips ja eliminats).
        </p>
      </section>

      <section className="-mx-4">
        <div className="px-4">
          <h2 className="mb-1 text-lg font-bold">Punts en joc per partit</h2>
          <p className="mb-4 text-sm text-white/50">
            Si l&apos;equip que has triat perd, perds aquests punts (inclou tots
            els partits on segueixes amb el mateix equip).
          </p>
        </div>
        <RiskCarousel cards={cards} focusIndex={focusIndex} />
      </section>

      <footer className="mt-12 text-center text-xs text-white/30">
        Edita <code className="text-white/50">src/data/results.ts</code> per
        registrar els resultats.
      </footer>
    </main>
  );
}
