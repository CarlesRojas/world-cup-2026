# Admin & results database

Match **results** are the only thing stored in a database. Predictions, the
bracket and the teams all stay in code. Everything else (ranking, points,
points-at-risk, brackets) is computed from those results.

- **Admin page:** `/admin` — no password. Each match has three options:
  **No jugat** (default), **{team A} guanya**, **{team B} guanya**.
- If no database is configured the app falls back to `src/data/results.ts`, so
  it keeps working locally. The admin page will warn that changes won't be saved.

## Create the database from Vercel (Neon)

1. Open your project on **vercel.com** → **Storage** tab.
2. Click **Create Database** → choose **Postgres (Neon)** → **Continue**.
3. Pick a name and region (closest to your users) → **Create**.
4. When asked, **Connect** the database to this project for the
   **Production**, **Preview** and **Development** environments. Vercel adds the
   connection environment variables automatically (including `DATABASE_URL`).
5. **Redeploy** the project (Deployments → ⋯ → Redeploy) so the new env vars are
   picked up.
6. Open **`/admin`** and set the results. The `match_results` table is created
   automatically on first use — no SQL needed.

That's it. Setting a result updates the live site immediately (the ranking,
podium, match cards and every person page).

### Local development

Create a `.env.local` with the connection string from Vercel
(Storage → your database → `.env.local` snippet), e.g.:

```
DATABASE_URL="postgres://...neon.tech/...?sslmode=require"
```

Then `npm run dev`. Without it, the app uses `src/data/results.ts`.

### Notes

- "No jugat" clears the result (removes the row).
- The buttons for a future match are disabled until both teams are known (i.e.
  the feeding matches have results).
- If you change or clear an earlier-round result, later rounds that depended on
  it may need to be reviewed.
