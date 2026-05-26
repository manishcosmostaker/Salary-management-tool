import type { Employee, Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";

export type ListEmployeesParams = {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  jobTitle?: string;
};

export type PaginatedEmployees = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export function createEmployeeService(db: PrismaClient) {
  return {
    async create(input: CreateEmployeeInput): Promise<Employee> {
      return db.employee.create({ data: input });
    },

    async list(params: ListEmployeesParams = {}): Promise<PaginatedEmployees> {
      const page = Math.max(1, params.page ?? 1);
      const limit = Math.min(100, Math.max(1, params.limit ?? 25));
      const skip = (page - 1) * limit;
      const where = buildEmployeeWhere(params);

      const [data, total] = await Promise.all([
        db.employee.findMany({
          where,
          skip,
          take: limit,
          orderBy: { fullName: "asc" },
        }),
        db.employee.count({ where }),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    },

    async getById(id: string): Promise<Employee | null> {
      return db.employee.findUnique({ where: { id } });
    },

    async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
      return db.employee.update({
        where: { id },
        data: input,
      });
    },

    async delete(id: string): Promise<Employee> {
      return db.employee.delete({ where: { id } });
    },
  };
}

function buildEmployeeWhere(
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

export const employeeService = createEmployeeService(prisma);
