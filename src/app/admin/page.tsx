import Link from "next/link";
import { ROUND_LABEL } from "@/data/bracket";
import { matchParticipants, matchesByDate } from "@/lib/scoring";
import { getResults, isDbConfigured } from "@/lib/db";
import { Flag } from "@/components/TeamBadge";
import ThemeToggle from "@/components/ThemeToggle";
import { setResultAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Mundial a la Porra" };

function formatKickoff(iso: string): string {
  return new Intl.DateTimeFormat("ca-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(iso));
}

export default async function AdminPage() {
  const results = await getResults();
  const dbReady = isDbConfigured();
  // Chronological order (by kickoff date and time), like the carousel.
  const matches = matchesByDate();

  return (
    <main className="mx-auto max-w-2xl px-5 py-6 sm:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-ink-muted transition hover:text-ink"
        >
          ← Classificació
        </Link>
        <ThemeToggle />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Administració de resultats
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Marca el guanyador de cada partit. Per defecte tots són «No jugat».
      </p>

      {!dbReady && (
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          No hi ha cap base de dades configurada. Els canvis no es desaran fins
          que afegeixis la base de dades (variable d&apos;entorn{" "}
          <code>DATABASE_URL</code>).
        </p>
      )}

      <div className="mt-6 space-y-2">
        {matches.map((m) => {
          const [a, b] = matchParticipants(m, results);
          const current = results[m.id] ?? null;
          return (
            <div
              key={m.id}
              className="rounded-xl border border-line bg-surface px-4 py-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2 text-xs text-ink-muted">
                <span className="font-semibold text-ink">
                  {ROUND_LABEL[m.round]}
                </span>
                <span>{formatKickoff(m.date)}</span>
              </div>
              <form action={setResultAction} className="flex flex-col gap-2">
                <input type="hidden" name="matchId" value={m.id} />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <OptionButton active={current === null} value="">
                    No jugat
                  </OptionButton>
                  <OptionButton
                    active={current === a}
                    value={a ?? ""}
                    disabled={!a}
                    team={a}
                  >
                    {a ?? "Per determinar"}
                  </OptionButton>
                  <OptionButton
                    active={current === b}
                    value={b ?? ""}
                    disabled={!b}
                    team={b}
                  >
                    {b ?? "Per determinar"}
                  </OptionButton>
                </div>
              </form>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function OptionButton({
  active,
  value,
  disabled = false,
  team,
  children,
}: {
  active: boolean;
  value: string;
  disabled?: boolean;
  team?: string | null;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      name="winner"
      value={value}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "border-ink bg-ink text-bg"
          : "border-line text-ink hover:bg-bg"
      }`}
    >
      {team && <Flag team={team} width={18} height={12} />}
      <span className="truncate">{children}</span>
    </button>
  );
}
