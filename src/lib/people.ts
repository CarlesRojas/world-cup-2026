import { PEOPLE } from "@/data/predictions";

/**
 * URL-safe slug for a person's name. NFKD folds accents and the ª in names like
 * "Josep Mª Q" down to plain ASCII, so "Mª Rosa" -> "ma-rosa", "Àlex" -> "alex".
 */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_TO_PERSON: Record<string, string> = Object.fromEntries(
  PEOPLE.map((p) => [slugify(p), p]),
);

/** The person whose slug this is, or null if unknown. */
export function personBySlug(slug: string): string | null {
  return SLUG_TO_PERSON[slug] ?? null;
}
