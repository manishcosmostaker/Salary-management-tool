# Seed performance notes

## Command

```bash
npm run seed -- --reset --count 10000
```

Optional flags:

| Flag | Default | Description |
|------|---------|-------------|
| `--count` | `10000` | Number of employees to insert |
| `--batch-size` | `500` | Rows per `createMany` call |
| `--seed` | `42` | RNG seed for reproducible data |
| `--reset` | off | Deletes all employees before seeding |

Prisma shortcut:

```bash
npx prisma db seed
```

## Design choices

1. **Batched `createMany`** — avoids per-row `INSERT` round trips and keeps memory stable.
2. **No ORM nesting** — plain `EmployeeCreateManyInput` objects built in memory per batch.
3. **Unique emails** — `first.last.{index}@employee.local` guarantees uniqueness at scale.
4. **Full names** — combined from `data/first_names.txt` and `data/last_names.txt` via `buildFullName`.
5. **Seeded RNG** — same `--seed` produces the same dataset for debugging and tests.

## Benchmark (local → Supabase, May 2026)

| Metric | Result |
|--------|--------|
| Rows | 10,000 |
| Batch size | 500 |
| Total time | ~20.5s |
| Throughput | ~490 employees/sec |
| Batches | 20 |

Hardware and network latency to Supabase will shift these numbers. For faster reseeds during development, increase `--batch-size` (e.g. `1000`) if your DB connection tolerates larger payloads.

## Regular re-runs

Engineers are expected to run the seed often. Prefer:

```bash
npm run seed -- --reset
```

`--reset` keeps the dataset size predictable and avoids duplicate-email skips from `skipDuplicates`.
