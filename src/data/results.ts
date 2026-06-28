// ============================================================================
//  RESULTS — THE ONLY FILE YOU EDIT TO RECORD WHO WON
// ============================================================================
//
//  HOW TO RECORD A WINNER:
//    1. Find the match below and uncomment the line.
//    2. Set the value to the EXACT Catalan team name (as in teams.ts) that won.
//    3. Commit & push. Vercel redeploys in ~1 min and the ranking updates.
//
//  Leave a match commented (or absent) while it hasn't been played.
//  A team only needs to be a valid participant of that match.
//
//  Example:  16: "Espanya",
// ----------------------------------------------------------------------------

export type Results = Record<number, string>;

export const RESULTS: Results = {
  // ----- Setzens de final (Round of 32, 1 pt) -----
  // 1:  "Alemanya",       // Alemanya vs Paraguai
  // 2:  "França",         // França vs Suècia
  // 3:  "Canadà",         // Sudàfrica vs Canadà
  // 4:  "Països Baixos",  // Països Baixos vs Marroc
  // 5:  "Portugal",       // Portugal vs Croàcia
  // 6:  "Espanya",        // Espanya vs Àustria
  // 7:  "Estats Units",   // Estats Units vs Bòsnia i H.
  // 8:  "Bèlgica",        // Bèlgica vs Senegal
  // 9:  "Brasil",         // Brasil vs Japó
  // 10: "Noruega",        // Costa d'Ivori vs Noruega
  // 11: "Mèxic",          // Mèxic vs Ecuador
  // 12: "Anglaterra",     // Anglaterra vs Congo
  // 13: "Argentina",      // Argentina vs Cap Verd
  // 14: "Austràlia",      // Austràlia vs Egipte
  // 15: "Suïssa",         // Suïssa vs Algèria
  // 16: "Colòmbia",       // Colòmbia vs Ghana

  // ----- Vuitens de final (Round of 16, 2 pts) -----
  // 17: "",   // winner(1) vs winner(2)
  // 18: "",   // winner(3) vs winner(4)
  // 19: "",   // winner(5) vs winner(6)
  // 20: "",   // winner(7) vs winner(8)
  // 21: "",   // winner(9) vs winner(10)
  // 22: "",   // winner(11) vs winner(12)
  // 23: "",   // winner(13) vs winner(14)
  // 24: "",   // winner(15) vs winner(16)

  // ----- Quarts de final (Quarterfinals, 4 pts) -----
  // 25: "",   // winner(17) vs winner(18)
  // 26: "",   // winner(19) vs winner(20)
  // 27: "",   // winner(21) vs winner(22)
  // 28: "",   // winner(23) vs winner(24)

  // ----- Semifinals (8 pts) -----
  // 29: "",   // winner(25) vs winner(26)
  // 30: "",   // winner(27) vs winner(28)

  // ----- Final (16 pts) -----
  // 31: "",   // winner(29) vs winner(30)
};
