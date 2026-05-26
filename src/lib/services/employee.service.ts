import type { Employee, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { CreateEmployeeInput } from "@/lib/validations/employee";

export function createEmployeeService(db: PrismaClient) {
  return {
    async create(input: CreateEmployeeInput): Promise<Employee> {
      return db.employee.create({ data: input });
    },
  };
}

export const employeeService = createEmployeeService(prisma);
