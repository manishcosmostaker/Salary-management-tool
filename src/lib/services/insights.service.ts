import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db";
import type {
  CountryJobTitleSalaryInsights,
  CountrySalaryInsights,
} from "@/lib/services/insights.types";

function normalizeCountry(country: string) {
  return country.trim().toUpperCase();
}

function roundAverage(value: number | null) {
  return value === null ? null : Math.round(value);
}

export function createInsightsService(db: PrismaClient) {
  return {
    async getCountrySalaryInsights(
      country: string,
    ): Promise<CountrySalaryInsights> {
      const normalizedCountry = normalizeCountry(country);
      const result = await db.employee.aggregate({
        where: { country: normalizedCountry },
        _min: { salary: true },
        _max: { salary: true },
        _avg: { salary: true },
        _count: { _all: true },
      });

      return {
        country: normalizedCountry,
        minSalary: result._min.salary,
        maxSalary: result._max.salary,
        averageSalary: roundAverage(result._avg.salary),
        employeeCount: result._count._all,
      };
    },

    async getCountryJobTitleSalaryInsights(
      country: string,
      jobTitle: string,
    ): Promise<CountryJobTitleSalaryInsights> {
      const normalizedCountry = normalizeCountry(country);
      const normalizedJobTitle = jobTitle.trim();

      const result = await db.employee.aggregate({
        where: {
          country: normalizedCountry,
          jobTitle: normalizedJobTitle,
        },
        _min: { salary: true },
        _max: { salary: true },
        _avg: { salary: true },
        _count: { _all: true },
      });

      return {
        country: normalizedCountry,
        jobTitle: normalizedJobTitle,
        minSalary: result._min.salary,
        maxSalary: result._max.salary,
        averageSalary: roundAverage(result._avg.salary),
        employeeCount: result._count._all,
      };
    },
  };
}

export const insightsService = createInsightsService(prisma);
