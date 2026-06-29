import "server-only";
import { neon } from "@neondatabase/serverless";
import { RESULTS as STATIC_RESULTS, type Results } from "@/data/results";

// Only the match RESULTS live in the database. Everything else (predictions,
// bracket, teams) stays in code. The connection string is provided by the
// Vercel Postgres / Neon integration; we accept any of the common env names.
function connectionString(): string | null {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    null
  );
}

let tableEnsured = false;

async function getSql() {
  const cs = connectionString();
  if (!cs) return null;
  const sql = neon(cs);
  if (!tableEnsured) {
    await sql`CREATE TABLE IF NOT EXISTS match_results (
      match_id integer PRIMARY KEY,
      winner   text NOT NULL
    )`;
    tableEnsured = true;
  }
  return sql;
}

/** Whether a database is configured for this deployment. */
export function isDbConfigured(): boolean {
  return connectionString() !== null;
}

/**
 * All recorded results. Reads from the database; if no database is configured
 * (e.g. local dev before setup) it falls back to the static results.ts file so
 * the app still works.
 */
export async function getResults(): Promise<Results> {
  let sql;
  try {
    sql = await getSql();
  } catch (e) {
    console.error("DB connection failed, using static results:", e);
    return STATIC_RESULTS;
  }
  if (!sql) return STATIC_RESULTS;
  try {
    const rows = (await sql`SELECT match_id, winner FROM match_results`) as {
      match_id: number;
      winner: string;
    }[];
    const out: Results = {};
    for (const r of rows) out[r.match_id] = r.winner;
    return out;
  } catch (e) {
    console.error("Reading results failed, using static results:", e);
    return STATIC_RESULTS;
  }
}

/**
 * Record (or clear) a match result. `winner === null` means "not played" and
 * removes the row. Requires a configured database.
 */
export async function setResult(matchId: number, winner: string | null): Promise<void> {
  const sql = await getSql();
  if (!sql) throw new Error("No hi ha cap base de dades configurada.");
  if (winner) {
    await sql`
      INSERT INTO match_results (match_id, winner)
      VALUES (${matchId}, ${winner})
      ON CONFLICT (match_id) DO UPDATE SET winner = EXCLUDED.winner`;
  } else {
    await sql`DELETE FROM match_results WHERE match_id = ${matchId}`;
  }
}
