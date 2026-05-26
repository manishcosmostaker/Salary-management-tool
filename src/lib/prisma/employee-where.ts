import type { Prisma } from "@prisma/client";

import type { ListEmployeesParams } from "@/lib/services/employee.types";

export function buildEmployeeWhere(
  params: ListEmployeesParams,
): Prisma.EmployeeWhereInput {
  const where: Prisma.EmployeeWhereInput = {};

  if (params.country) {
    where.country = params.country.toUpperCase();
  }

  if (params.jobTitle) {
    where.jobTitle = params.jobTitle;
  }

  if (params.search) {
    const search = params.search.trim();
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}
