# MinimSleep

A minimalist sleep analysis web app — quiet, honest, science-grounded.

- **Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Auth.js (NextAuth v5) · Prisma · SQLite
- **Architecture**: split between a public landing surface and a signed-in app surface (dashboard, quiz, result, profile)
- **Modes**: guest (results in `localStorage`) and authenticated (results in the database)

## Getting started

```bash
# 1. Install
npm install

# 2. Configure env (copy .env.example → .env, fill secrets)
cp .env.example .env

# 3. Run the database migrations
npx prisma migrate dev

# 4. Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma datasource (defaults to local SQLite) |
| `AUTH_SECRET` | Auth.js JWT/session secret. Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `true` when running behind a proxy / on a deployment platform |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials. Optional — when unset, the Google sign-in button is hidden but the app still works in guest mode |

### Project layout

```
src/
  app/
    page.tsx                # Landing
    layout.tsx              # Root layout
    quiz/page.tsx           # Onboarding flow
    result/page.tsx         # Result screen
    (app)/                  # Auth shell (top bar + bottom nav)
      layout.tsx
      dashboard/page.tsx
      profile/page.tsx
    api/
      auth/[...nextauth]/   # Auth.js handlers
      results/              # GET / POST history
        [id]/               # GET single result
  components/
    landing/                # Hero, HowItWorks, WhySleepMatters, CtaBand, Site*
    quiz/                   # QuizFlow + step types (slider, choice, toggle, time)
    result/ResultScreen.tsx
    app/                    # Dashboard, Profile, AppShell, RecommendationCard
    ui/                     # Button, GlassCard, MetricCard, ScoreRing, Aurora
  lib/
    auth.ts                 # NextAuth config + handlers
    prisma.ts               # Singleton Prisma client
    questions.ts            # Quiz schema
    sleep-score.ts          # Score + recommendations engine
    storage.ts              # localStorage helpers
    tips.ts                 # Tip of the day
prisma/
  schema.prisma             # Models: User, Account, Session, VerificationToken, SleepResult
```

## Scripts

- `npm run dev` — Next.js dev server (Turbopack)
- `npm run build` — production build
- `npm run lint` — eslint
- `npx prisma migrate dev` — create / apply migrations
- `npx prisma studio` — open DB UI

## License

MIT — built quietly by night.
