# Module structure

Single **Next.js** repository (not git submodules). “Modules” are **logical folders** with clear boundaries for testing and maintenance.

```
salary-management-tool/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout, fonts, providers
│   │   ├── page.tsx              # Home
│   │   ├── employees/            # Employee UI pages
│   │   ├── insights/             # Salary metrics dashboard
│   │   └── api/                  # Route Handlers (REST) — Phase 3+
│   ├── components/
│   │   ├── ui/                   # shadcn primitives
│   │   ├── layout/               # App shell (header, etc.)
│   │   └── employees/            # Feature components (table, forms)
│   └── lib/
│       ├── utils.ts              # shadcn cn helper
│       ├── db.ts                 # Prisma singleton (pooled URL)
│       ├── validations/          # Zod schemas (shared API + forms)
│       └── services/             # Business logic — **unit tested**
│           ├── employee.service.ts
│           └── insights.service.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   └── seed.ts                   # 10k bulk seed (batched)
├── data/
│   ├── first_names.txt           # Provided / committed
│   └── last_names.txt
├── __tests__/                    # Or colocated *.test.ts
│   ├── unit/
│   └── integration/
└── docs/                         # Assessment artifacts
```

## Responsibility boundaries

| Module | Responsibility | Tests |
|--------|----------------|-------|
| `lib/validations` | Input rules (Zod) | Unit |
| `lib/services` | CRUD + insight calculations orchestration | Unit (mock DB) |
| `app/api/*` | HTTP, status codes, parse body | Integration |
| `app/employees/*` | UI, forms, table | Component / E2E (light) |
| `scripts/seed.ts` | Fast bulk insert | Script smoke / timing note in docs |
| `prisma` | Schema, indexes | Migration applies cleanly |

## Data flow

```
Browser → Route Handler → Service → Prisma → PostgreSQL
                ↓
           Zod validation
```

Insights always use **SQL aggregates** in the service/repository layer, never load 10,000 rows into memory.

## Indexes (Prisma)

- `country`
- `(country, jobTitle)`
- Optional: `salary` for global min/max

## Employee fields (planned)

| Field | Purpose |
|-------|---------|
| fullName | Required — seed combines first + last names |
| jobTitle | Required — insights by title + country |
| country | Required — country-level metrics |
| salary | Required (integer minor units, e.g. cents) |
| department | HR filtering |
| employmentType | full-time / contract |
| email | Unique, realistic records |
| hireDate | Tenure / reporting |
| currency | Display with salary |
