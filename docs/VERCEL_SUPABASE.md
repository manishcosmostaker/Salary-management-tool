# Vercel + Supabase configuration notes

## Production-safe settings

- Use pooled DB URL for app runtime (`DATABASE_URL`, port 6543).
- Keep `DIRECT_URL` for Prisma operations requiring direct connection (migrate/push).
- Never commit `.env`; use platform secrets.

## GitHub Actions usage

### CI workflow

Workflow: `.github/workflows/ci.yml`

Runs on push/PR:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

### Production seed workflow (manual)

Workflow: `.github/workflows/seed-production.yml`

- Triggered manually via `workflow_dispatch`.
- Supports parameters: `count`, `batch_size`, `reset`, `seed`.
- Reads secrets from GitHub **production** environment.

## Operational recommendation

- Run seed manually only when needed (initial load / controlled refresh).
- Do not auto-run seed during app startup.
- Keep `--reset` explicit for destructive refresh operations.
