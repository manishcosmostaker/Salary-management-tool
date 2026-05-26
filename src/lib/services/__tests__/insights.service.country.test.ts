import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";

import { createInsightsService } from "@/lib/services/insights.service";

function createMockDb() {
  return {
    employee: {
      aggregate: vi.fn(),
      groupBy: vi.fn(),
    },
  } as unknown as PrismaClient;
}

describe("InsightsService.getCountrySalaryInsights", () => {
  let db: PrismaClient;

  beforeEach(() => {
    db = createMockDb();
    vi.mocked(db.employee.aggregate).mockResolvedValue({
      _min: { salary: 5000000 },
      _max: { salary: 12000000 },
      _avg: { salary: 8500000.6 },
      _count: { _all: 120 },
    });
  });

  it("returns min, max, average salary and count for a country", async () => {
    const service = createInsightsService(db);
    const result = await service.getCountrySalaryInsights("gb");

    expect(db.employee.aggregate).toHaveBeenCalledWith({
      where: { country: "GB" },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: { _all: true },
    });
    expect(result).toEqual({
      country: "GB",
      minSalary: 5000000,
      maxSalary: 12000000,
      averageSalary: 8500001,
      employeeCount: 120,
    });
  });

  it("returns null salary metrics when no employees exist", async () => {
    vi.mocked(db.employee.aggregate).mockResolvedValue({
      _min: { salary: null },
      _max: { salary: null },
      _avg: { salary: null },
      _count: { _all: 0 },
    });

    const service = createInsightsService(db);
    const result = await service.getCountrySalaryInsights("US");

    expect(result.employeeCount).toBe(0);
    expect(result.minSalary).toBeNull();
    expect(result.maxSalary).toBeNull();
    expect(result.averageSalary).toBeNull();
  });
});
