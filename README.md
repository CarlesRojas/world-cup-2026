# Porra Mundial 2026

Website for our World Cup 2026 knockout-stage prediction pool. Shows a live
**ranking** and the **points at risk** in each match. Built with Next.js +
Tailwind, deployed on Vercel.

## How it works

- Everyone's predictions for all 31 knockout matches live in
  `src/data/predictions.ts` (extracted from the original PDF).
- The bracket structure, points per round and match dates live in
  `src/data/bracket.ts`.
- All the scoring math lives in `src/lib/scoring.ts` — each calculation is a
  small, commented function you can audit.

### Points per round

| Round | Catalan | Points |
|-------|---------|--------|
| Round of 32 | Setzens de final | 1 |
| Round of 16 | Vuitens de final | 2 |
| Quarterfinals | Quarts de final | 4 |
| Semifinals | Semifinal | 8 |
| Final | Final | 16 |

### The two ranking columns

- **Punts actuals** — points already earned (your pick won a played match).
- **Punts potencials** — the maximum you can still finish with: current points
  plus every future match whose picked team is still alive. Once a team you
  picked is eliminated, those points drop off your potential automatically.

### Points at risk (carousel)

For each match, if the team you picked loses, you don't just lose that match's
point — you lose **every later match where you kept picking that same team**.
The carousel shows this per person, centered on the next match to be played.

## Recording who won a match

This is the **only** thing you need to do during the tournament:

1. Open `src/data/results.ts`.
2. Uncomment the line for the match and set it to the **exact** Catalan team
   name that won, e.g. `9: "Brasil",`.
3. Commit and push. Vercel redeploys automatically (~1 min) and the ranking
   and potential points update.

## Fixing a prediction

If a prediction was transcribed wrong, edit the person's array in
`src/data/predictions.ts` (index 0 = match 1 … index 30 = match 31), using the
exact Catalan team name.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Deploy to Vercel

Import the repo in Vercel and deploy — no environment variables, no database.
Every push to the branch triggers a redeploy.
