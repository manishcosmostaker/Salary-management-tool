import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/insights.service", () => ({
  insightsService: {
    getCountrySalaryInsights: vi.fn(),
    getCountryJobTitleSalaryInsights: vi.fn(),
  },
}));

import { GET } from "@/app/api/insights/country/[country]/route";
import { insightsService } from "@/lib/services/insights.service";

describe("GET /api/insights/country/[country]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns country salary insights", async () => {
    vi.mocked(insightsService.getCountrySalaryInsights).mockResolvedValue({
      country: "GB",
      minSalary: 5000000,
      maxSalary: 12000000,
      averageSalary: 8500000,
      employeeCount: 120,
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ country: "gb" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(insightsService.getCountrySalaryInsights).toHaveBeenCalledWith("GB");
    expect(data.country).toBe("GB");
    expect(data.employeeCount).toBe(120);
  });

  it("returns 400 for invalid country code", async () => {
    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ country: "GBR" }),
    });

    expect(response.status).toBe(400);
    expect(insightsService.getCountrySalaryInsights).not.toHaveBeenCalled();
  });
});
