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

describe("InsightsService.getCountryJobTitleSalaryInsights", () => {
  let db: PrismaClient;

  beforeEach(() => {
    db = createMockDb();
    vi.mocked(db.employee.aggregate).mockResolvedValue({
      _min: { salary: 7000000 },
      _max: { salary: 11000000 },
      _avg: { salary: 9000000.2 },
      _count: { _all: 35 },
    });
  });

  it("returns average salary for a job title within a country", async () => {
    const service = createInsightsService(db);
    const result = await service.getCountryJobTitleSalaryInsights(
      "gb",
      "Software Engineer",
    );

    expect(db.employee.aggregate).toHaveBeenCalledWith({
      where: { country: "GB", jobTitle: "Software Engineer" },
      _min: { salary: true },
      _max: { salary: true },
      _avg: { salary: true },
      _count: { _all: true },
    });
    expect(result).toEqual({
      country: "GB",
      jobTitle: "Software Engineer",
      minSalary: 7000000,
      maxSalary: 11000000,
      averageSalary: 9000000,
      employeeCount: 35,
    });
  });
});
