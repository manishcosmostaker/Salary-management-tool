# Stack decisions

## Next.js + App Router

`create-next-app` (current defaults) scaffolds the **App Router** (`app/` directory), not the legacy Pages Router (`pages/`).

| Topic | Decision |
|-------|----------|
| Router | **App Router** (`app/`) |
| API | **Route Handlers** (`app/api/**/route.ts`) |
| Runtime | **Node.js** for Prisma routes (not Edge) |
| Data fetching (UI) | Server Components where static; client + TanStack Query for interactive tables |

App Router is not “automatic magic” — we still design routes, services, and tests explicitly. It **is** the default and recommended path for new Next.js projects.

## Database: Supabase (PostgreSQL)

- Production: Supabase Postgres
- Local dev: Supabase project or Docker Postgres with same schema
- **Pooled connection URL** on Vercel (transaction mode, port 6543) to avoid connection exhaustion

## ORM: Prisma

- Schema in `prisma/schema.prisma`
- Migrations via `prisma migrate`
- Seed via `prisma db seed` → `scripts/seed.ts`

## UI: shadcn/ui

- Copy-in components under `components/ui/`
- Tailwind for layout
- React Query for request orchestration, caching, and cancellation
- Server-side pagination (25 rows/page default) for employee list scalability

## Testing

| Layer | Tool |
|-------|------|
| Unit | Vitest |
| Integration | Vitest + test database / mocked Prisma |
| E2E (minimal) | Playwright (optional, late phase) |

## Deploy

| Service | Host |
|---------|------|
| Next.js app | Vercel |
| PostgreSQL | Supabase |
| Env vars | `DATABASE_URL` (pooled), `DIRECT_URL` (migrations) |

See [TDD_COMMIT_PLAN.md](./TDD_COMMIT_PLAN.md) for implementation order.
