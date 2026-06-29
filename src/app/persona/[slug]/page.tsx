import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PEOPLE } from "@/data/predictions";
import { RESULTS } from "@/data/results";
import { getRanking } from "@/lib/scoring";
import { personBySlug, slugify } from "@/lib/people";
import ThemeToggle from "@/components/ThemeToggle";
import PredictionBracket from "@/components/PredictionBracket";

export const dynamic = "force-static";

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: slugify(p) }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const person = personBySlug(params.slug);
  return { title: person ? `${person} · Mundial a la Porra` : "Mundial a la Porra" };
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const person = personBySlug(params.slug);
  if (!person) notFound();

  const ranking = getRanking(RESULTS);
  const row = ranking.find((r) => r.person === person)!;

  const drawnText =
    row.tiedWith > 0
      ? `Empatat amb ${row.tiedWith} ${
          row.tiedWith === 1 ? "persona" : "persones"
        }.`
      : "En solitari en aquesta posició.";

  return (
    <main className="py-6 sm:py-10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-sm text-ink-muted transition hover:text-ink"
        >
          ← Classificació
        </Link>
        <ThemeToggle />
      </div>

      <header className="mx-auto mb-8 mt-4 max-w-3xl px-5">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {person}
        </h1>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Posició" value={`#${row.position}`} />
          <Stat label="Punts actuals" value={row.current} />
          <Stat label="Punts potencials" value={row.potential} danger={row.eliminated} />
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          {drawnText}
          {row.eliminated && (
            <span className="font-medium text-rose-600 dark:text-rose-400">
              {" "}
              Ja no pot guanyar la porra.
            </span>
          )}
        </p>
      </header>

      <section className="mx-auto max-w-5xl px-5">
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-ink">
          Les seves prediccions
        </h2>
        <p className="mb-4 text-sm text-ink-muted">
          El guanyador que va triar per a cada partit.
        </p>
        <PredictionBracket person={person} />
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3 text-center">
      <div
        className={`text-2xl font-bold tabular-nums ${
          danger ? "text-rose-600 dark:text-rose-400" : "text-ink"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-ink-muted">{label}</div>
    </div>
  );
}
