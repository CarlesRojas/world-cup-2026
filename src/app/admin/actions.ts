"use server";

import { revalidatePath } from "next/cache";
import { MATCH_BY_ID } from "@/data/bracket";
import { matchParticipants } from "@/lib/scoring";
import { getResults, setResult } from "@/lib/db";

/**
 * Server action behind the admin buttons. Records (or clears) a match result.
 * An empty `winner` means "not played". Validates the winner is actually one of
 * the match's current participants before writing.
 */
export async function setResultAction(formData: FormData): Promise<void> {
  const matchId = Number(formData.get("matchId"));
  const raw = String(formData.get("winner") ?? "");
  const match = MATCH_BY_ID[matchId];
  if (!match) throw new Error("Partit desconegut.");

  const winner = raw === "" ? null : raw;
  if (winner) {
    const results = await getResults();
    const [a, b] = matchParticipants(match, results);
    if (winner !== a && winner !== b) {
      throw new Error("Aquest equip no juga aquest partit.");
    }
  }

  await setResult(matchId, winner);

  // Refresh everything that depends on results.
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/persona/[slug]", "page");
}
