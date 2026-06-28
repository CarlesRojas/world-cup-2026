// All 32 teams in the knockout bracket.
// `name` is the Catalan name used everywhere (predictions, results, bracket).
// `flag` is the flag-icons code used to render the bundled SVG crest
//   (e.g. "de", "gb-eng"). See https://github.com/lipis/flag-icons

export interface Team {
  name: string;
  flag: string;
}

export const TEAMS: Record<string, Team> = {
  "Alemanya": { name: "Alemanya", flag: "de" },
  "Paraguai": { name: "Paraguai", flag: "py" },
  "França": { name: "França", flag: "fr" },
  "Suècia": { name: "Suècia", flag: "se" },
  "Sudàfrica": { name: "Sudàfrica", flag: "za" },
  "Canadà": { name: "Canadà", flag: "ca" },
  "Països Baixos": { name: "Països Baixos", flag: "nl" },
  "Marroc": { name: "Marroc", flag: "ma" },
  "Portugal": { name: "Portugal", flag: "pt" },
  "Croàcia": { name: "Croàcia", flag: "hr" },
  "Espanya": { name: "Espanya", flag: "es" },
  "Àustria": { name: "Àustria", flag: "at" },
  "Estats Units": { name: "Estats Units", flag: "us" },
  "Bòsnia i H.": { name: "Bòsnia i H.", flag: "ba" },
  "Bèlgica": { name: "Bèlgica", flag: "be" },
  "Senegal": { name: "Senegal", flag: "sn" },
  "Brasil": { name: "Brasil", flag: "br" },
  "Japó": { name: "Japó", flag: "jp" },
  "Costa d'Ivori": { name: "Costa d'Ivori", flag: "ci" },
  "Noruega": { name: "Noruega", flag: "no" },
  "Mèxic": { name: "Mèxic", flag: "mx" },
  "Ecuador": { name: "Ecuador", flag: "ec" },
  "Anglaterra": { name: "Anglaterra", flag: "gb-eng" },
  "Congo": { name: "Congo", flag: "cg" },
  "Argentina": { name: "Argentina", flag: "ar" },
  "Cap Verd": { name: "Cap Verd", flag: "cv" },
  "Austràlia": { name: "Austràlia", flag: "au" },
  "Egipte": { name: "Egipte", flag: "eg" },
  "Suïssa": { name: "Suïssa", flag: "ch" },
  "Algèria": { name: "Algèria", flag: "dz" },
  "Colòmbia": { name: "Colòmbia", flag: "co" },
  "Ghana": { name: "Ghana", flag: "gh" },
};

/** The flag-icons CSS code for a team (e.g. "de", "gb-eng"), or "" if unknown. */
export function flagCode(teamName: string): string {
  return TEAMS[teamName]?.flag ?? "";
}
