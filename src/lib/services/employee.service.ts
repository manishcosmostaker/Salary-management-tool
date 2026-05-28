import type { Employee, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db";
import { buildEmployeeWhere } from "@/lib/prisma/employee-where";
import type {
  ListEmployeesParams,
  PaginatedEmployees,
} from "@/lib/services/employee.types";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";

export type { ListEmployeesParams, PaginatedEmployees };

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
          select: {
            id: true,
            fullName: true,
            jobTitle: true,
            country: true,
            salary: true,
            currency: true,
            department: true,
            email: true,
          },
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

export const employeeService = createEmployeeService(prisma);
