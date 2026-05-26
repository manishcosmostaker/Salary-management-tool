import { EmploymentType } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import {
  buildFullName,
  type RandomFn,
} from "@/lib/seed/name-generator";

type CountryProfile = {
  code: string;
  currency: string;
  salaryMin: number;
  salaryMax: number;
};

const COUNTRY_PROFILES: CountryProfile[] = [
  { code: "US", currency: "USD", salaryMin: 4_000_000, salaryMax: 20_000_000 },
  { code: "GB", currency: "GBP", salaryMin: 3_200_000, salaryMax: 16_000_000 },
  { code: "DE", currency: "EUR", salaryMin: 3_600_000, salaryMax: 18_000_000 },
  { code: "IN", currency: "INR", salaryMin: 800_000, salaryMax: 6_000_000 },
  { code: "CA", currency: "CAD", salaryMin: 3_800_000, salaryMax: 17_000_000 },
  { code: "AU", currency: "AUD", salaryMin: 3_900_000, salaryMax: 17_500_000 },
  { code: "FR", currency: "EUR", salaryMin: 3_500_000, salaryMax: 17_000_000 },
  { code: "SG", currency: "SGD", salaryMin: 4_200_000, salaryMax: 19_000_000 },
];

const JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Product Manager",
  "HR Manager",
  "Recruiter",
  "Financial Analyst",
  "Accountant",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Data Analyst",
  "Data Scientist",
  "Customer Success Manager",
  "Operations Manager",
] as const;

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
  "Customer Success",
] as const;

const EMPLOYMENT_TYPES = [
  EmploymentType.FULL_TIME,
  EmploymentType.FULL_TIME,
  EmploymentType.FULL_TIME,
  EmploymentType.PART_TIME,
  EmploymentType.CONTRACT,
] as const;

function pick<T>(items: readonly T[], random: RandomFn): T {
  return items[Math.floor(random() * items.length)] as T;
}

function randomInt(min: number, max: number, random: RandomFn) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ".");
}

export function generateEmployees(options: {
  count: number;
  startIndex?: number;
  firstNames: string[];
  lastNames: string[];
  random: RandomFn;
}): Prisma.EmployeeCreateManyInput[] {
  const startIndex = options.startIndex ?? 0;

  return Array.from({ length: options.count }, (_, offset) => {
    const index = startIndex + offset;
    const fullName = buildFullName(
      options.firstNames,
      options.lastNames,
      options.random,
    );
    const country = pick(COUNTRY_PROFILES, options.random);
    const jobTitle = pick(JOB_TITLES, options.random);
    const department = pick(DEPARTMENTS, options.random);
    const employmentType = pick(EMPLOYMENT_TYPES, options.random);
    const salary = randomInt(
      country.salaryMin,
      country.salaryMax,
      options.random,
    );
    const hireDate = new Date(
      Date.UTC(
        randomInt(2014, 2025, options.random),
        randomInt(0, 11, options.random),
        randomInt(1, 28, options.random),
      ),
    );

    const [firstName, lastName] = fullName.split(" ");

    return {
      fullName,
      jobTitle,
      country: country.code,
      salary,
      currency: country.currency,
      department,
      employmentType,
      email: `${slugify(firstName)}.${slugify(lastName)}.${index}@employee.local`,
      hireDate,
    };
  });
}
