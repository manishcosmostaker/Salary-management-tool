# TDD commit plan

Assessment expects **frequent, incremental commits** that show **red → green → refactor** evolution. Each row below is intended as **one commit** (sometimes two if red/green are clearer separate).

> Status: Phases 0–7 completed. Additional hardening commits were added afterward for request optimization and UX stability.

## Phase 0 — Repository (current)

| # | Commit message | Contents |
|---|----------------|----------|
| 0a | `chore: add gitignore` | `.gitignore` |
| 0b | `docs: add readme and assessment overview` | `README.md` |
| 0c | `docs: record stack decisions (Next, Prisma, Supabase)` | `docs/STACK.md` |
| 0d | `docs: define module structure` | `docs/MODULE_STRUCTURE.md` |
| 0e | `docs: add TDD commit plan` | `docs/TDD_COMMIT_PLAN.md` |

## Phase 1 — Scaffold (no business logic yet)

| # | Commit message | TDD step |
|---|----------------|----------|
| 1 | `chore: scaffold Next.js app with TypeScript and App Router` | Tooling |
| 2 | `chore: add Prisma and initial Employee schema` | Schema only |
| 3 | `chore: add Vitest and test scripts` | Test runner |
| 4 | `chore: init shadcn/ui and base layout` | UI shell |

## Phase 2 — Validations & services (unit tests first)

| # | Commit message | TDD step |
|---|----------------|----------|
| 5 | `test: employee validation rejects invalid payload` | 🔴 Red |
| 6 | `feat: add employee Zod schema` | 🟢 Green |
| 7 | `test: employee service create finds record` | 🔴 Red |
| 8 | `feat: implement employee create in service` | 🟢 Green |
| 9 | `test: employee service list paginates` | 🔴 Red |
| 10 | `feat: implement paginated list` | 🟢 Green |
| 11 | `test: employee service update and delete` | 🔴 Red |
| 12 | `feat: implement update and delete` | 🟢 Green |
| 13 | `refactor: extract shared prisma helpers` | 🔵 Refactor |

## Phase 3 — API routes (integration tests)

| # | Commit message | TDD step |
|---|----------------|----------|
| 14 | `test: POST /api/employees returns 201` | 🔴 Red |
| 15 | `feat: add employees POST route` | 🟢 Green |
| 16 | `test: GET /api/employees paginates` | 🔴 Red |
| 17 | `feat: add employees GET route` | 🟢 Green |
| 18 | `test: GET/PATCH/DELETE /api/employees/[id]` | 🔴 Red |
| 19 | `feat: add employee by id routes` | 🟢 Green |

## Phase 4 — Insights

| # | Commit message | TDD step |
|---|----------------|----------|
| 20 | `test: country salary aggregates` | 🔴 Red |
| 21 | `feat: insights service for country` | 🟢 Green |
| 22 | `test: avg salary by job title in country` | 🔴 Red |
| 23 | `feat: insights by country and job title` | 🟢 Green |
| 24 | `feat: insights API routes` | 🟢 Green |

## Phase 5 — Seed & data files

| # | Commit message | TDD step |
|---|----------------|----------|
| 25 | `chore: add first_names and last_names data files` | Data |
| 26 | `test: full name generator combines names` | 🔴 Red |
| 27 | `feat: name generator utility` | 🟢 Green |
| 28 | `feat: batched seed script for 10k employees` | 🟢 Green |
| 29 | `docs: seed performance notes` | Artifact |

## Phase 6 — UI

| # | Commit message | TDD step |
|---|----------------|----------|
| 30 | `feat: employees table with pagination` | UI |
| 31 | `feat: create employee form` | UI |
| 32 | `feat: view and edit employee` | UI |
| 33 | `feat: delete employee with confirmation` | UI |
| 34 | `feat: insights dashboard` | UI |

## Phase 7 — Deploy & CI

| # | Commit message | TDD step |
|---|----------------|----------|
| 35 | `ci: add GitHub Actions test workflow` | CI |
| 36 | `docs: deployment and environment setup` | Artifact |
| 37 | `chore: vercel and supabase configuration notes` | Deploy |

## Rules we follow

1. **One logical change per commit** — easy to review and replay history.
2. **Tests before implementation** when adding behavior (red then green).
3. **Refactor commits** are separate and only after green tests.
4. **No secrets** in commits — `.env` stays local; `.env.example` committed.
5. **Meaningful messages** — prefix: `test:`, `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.

## After Phase 0

Push to **public GitHub** and connect Vercel + Supabase before or during Phase 7 (can create empty GitHub repo after Phase 0 docs are committed).
