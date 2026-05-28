# Deployment and environment setup

This project deploys cleanly as:

- **App**: Vercel (Next.js)
- **Database**: Supabase Postgres

## 1) Create and configure Supabase

1. Create a Supabase project.
2. Copy both connection strings from Supabase:
   - **Transaction pooler** (port `6543`) -> `DATABASE_URL`
   - **Direct/session connection** (port `5432`) -> `DIRECT_URL`
3. URL-encode passwords if they contain reserved characters (`@`, `[`, `]`, `%`, `#`).

## 2) Configure Vercel env vars

In Vercel project settings, add:

- `DATABASE_URL`
- `DIRECT_URL`

Use values from Supabase as above.

## 3) Deploy app

1. Import GitHub repo in Vercel.
2. Set framework preset to **Next.js** (auto-detected).
3. Trigger first deployment.

## 4) Run database sync/migration

Use one of:

- Local (recommended first deploy):
  ```bash
  npm run db:push
  ```
- Or `npm run db:migrate` for migration flow.

## 5) Seed production data

### Option A: local terminal

```bash
npm run seed -- --reset --count 10000
```

### Option B: GitHub Actions (manual)

Run workflow: **Seed Production DB**

Required GitHub environment secrets (`production`):

- `DATABASE_URL`
- `DIRECT_URL`

## 6) Verification checklist

- `/employees` loads and paginates
- Add/edit/delete employee works
- `/insights` country + job title metrics work
- Network tab shows no persistent 4xx/5xx API failures
