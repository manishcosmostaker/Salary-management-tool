# Salary Management Tool

Minimal salary management application for an organization (~10,000 employees). Built for an engineering assessment with **TDD**, **incremental commits**, and **performance** as first-class concerns.

## Stack (locked)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js** (App Router) |
| Language | **TypeScript** |
| Database | **PostgreSQL** (Supabase) |
| ORM | **Prisma** |
| UI | **shadcn/ui** + Tailwind |
| Deploy | **Vercel** (app) + **Supabase** (database) |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (requires `.env`) |

### Employee API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/employees?page&limit&search&country&jobTitle` | Paginated list |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/:id` | Get by id |
| PATCH | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

## Status

Phase 3 complete (employee REST API). Phase 4 (insights) is next — see [TDD commit plan](./docs/TDD_COMMIT_PLAN.md).

## Documentation

- [Stack & deployment](./docs/STACK.md)
- [Module structure](./docs/MODULE_STRUCTURE.md)
- [TDD commit plan](./docs/TDD_COMMIT_PLAN.md)

## License

MIT (adjust if your assessment requires otherwise)
