import path from "node:path";
import { performance } from "node:perf_hooks";

import { PrismaClient } from "@prisma/client";

import { generateEmployees } from "../src/lib/seed/employee-factory";
import {
  createSeededRandom,
  loadNameList,
} from "../src/lib/seed/name-generator";

const DEFAULT_COUNT = 10_000;
const DEFAULT_BATCH_SIZE = 500;
const DEFAULT_SEED = 42;

type SeedOptions = {
  count: number;
  batchSize: number;
  reset: boolean;
  seed: number;
};

function parseArgs(argv: string[]): SeedOptions {
  const options: SeedOptions = {
    count: DEFAULT_COUNT,
    batchSize: DEFAULT_BATCH_SIZE,
    reset: false,
    seed: DEFAULT_SEED,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--reset") {
      options.reset = true;
      continue;
    }

    if (arg === "--count") {
      options.count = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--batch-size") {
      options.batchSize = Number(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--seed") {
      options.seed = Number(argv[index + 1]);
      index += 1;
    }
  }

  if (!Number.isInteger(options.count) || options.count <= 0) {
    throw new Error("--count must be a positive integer");
  }

  if (!Number.isInteger(options.batchSize) || options.batchSize <= 0) {
    throw new Error("--batch-size must be a positive integer");
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();
  const startedAt = performance.now();

  const firstNames = loadNameList(
    path.join(process.cwd(), "data", "first_names.txt"),
  );
  const lastNames = loadNameList(
    path.join(process.cwd(), "data", "last_names.txt"),
  );
  const random = createSeededRandom(options.seed);

  try {
    if (options.reset) {
      const deleted = await prisma.employee.deleteMany();
      console.log(`Cleared ${deleted.count} existing employees.`);
    }

    let inserted = 0;

    for (let offset = 0; offset < options.count; offset += options.batchSize) {
      const batchCount = Math.min(options.batchSize, options.count - offset);
      const batch = generateEmployees({
        count: batchCount,
        startIndex: offset,
        firstNames,
        lastNames,
        random,
      });

      const result = await prisma.employee.createMany({
        data: batch,
        skipDuplicates: true,
      });

      inserted += result.count;
      console.log(
        `Inserted batch ${Math.floor(offset / options.batchSize) + 1}: ${result.count} employees`,
      );
    }

    const elapsedMs = Math.round(performance.now() - startedAt);
    const total = await prisma.employee.count();

    console.log(
      `Seed complete: ${inserted} inserted, ${total} total employees in ${elapsedMs}ms`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
