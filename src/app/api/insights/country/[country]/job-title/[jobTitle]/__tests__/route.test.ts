import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/insights.service", () => ({
  insightsService: {
    getCountrySalaryInsights: vi.fn(),
    getCountryJobTitleSalaryInsights: vi.fn(),
  },
}));

import { GET } from "@/app/api/insights/country/[country]/job-title/[jobTitle]/route";
import { insightsService } from "@/lib/services/insights.service";

describe("GET /api/insights/country/[country]/job-title/[jobTitle]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns job title salary insights for a country", async () => {
    vi.mocked(
      insightsService.getCountryJobTitleSalaryInsights,
    ).mockResolvedValue({
      country: "GB",
      jobTitle: "Software Engineer",
      minSalary: 7000000,
      maxSalary: 11000000,
      averageSalary: 9000000,
      employeeCount: 35,
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({
        country: "gb",
        jobTitle: encodeURIComponent("Software Engineer"),
      }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(insightsService.getCountryJobTitleSalaryInsights).toHaveBeenCalledWith(
      "GB",
      "Software Engineer",
    );
    expect(data.averageSalary).toBe(9000000);
  });
});
