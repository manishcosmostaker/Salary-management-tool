# Module structure

Single **Next.js** repository with clear boundaries for API, UI, domain logic, and operations.

```
salary-management-tool/
├── .github/workflows/
│   ├── ci.yml
│   └── seed-production.yml
├── data/
│   ├── first_names.txt
│   └── last_names.txt
├── docs/
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── employees/
│   │   │   └── insights/
│   │   ├── employees/
│   │   ├── insights/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── employees/
│   │   ├── insights/
│   │   ├── layout/
│   │   ├── providers/
│   │   └── ui/
│   └── lib/
│       ├── api/
│       ├── constants/
│       ├── format/
│       ├── prisma/
│       ├── seed/
│       ├── services/
│       ├── types/
│       ├── validations/
│       └── db.ts
├── README.md
└── package.json
```

## Responsibility boundaries

| Module | Responsibility | Tests |
|--------|----------------|-------|
| `lib/validations` | Input rules (Zod) | Unit |
| `lib/services` | CRUD + insight calculations orchestration | Unit (mock DB) |
| `app/api/*` | HTTP, status codes, parse body | Integration |
| `app/employees/*` | Employee pages (list/detail/edit/create) | UI + route-level behavior |
| `app/insights/*` | Insights dashboard page | UI |
| `scripts/seed.ts` | Fast bulk insert | Script smoke / timing note in docs |
| `lib/constants` | Shared country/job title/department option lists | Unit/integration behavior |
| `.github/workflows` | CI and manual production seed | Operational checks |
| `prisma` | Schema and indexes | Migration/apply validation |

## Data flow

```
Browser → Route Handler → Service → Prisma → PostgreSQL
                ↓
           Zod validation
```

Insights use **SQL aggregates** in the service layer, never load all 10k rows into memory.

## Indexes (Prisma)

- `country`
- `(country, jobTitle)`
- Optional: `salary` for global min/max

## Employee fields (implemented)

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
