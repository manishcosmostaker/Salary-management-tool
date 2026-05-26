import { EmploymentType, type Employee, type PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CreateEmployeeInput } from "@/lib/validations/employee";
import { createEmployeeService } from "@/lib/services/employee.service";

const createInput: CreateEmployeeInput = {
  fullName: "Ada Lovelace",
  jobTitle: "Software Engineer",
  country: "GB",
  salary: 8500000,
  currency: "GBP",
  department: "Engineering",
  employmentType: EmploymentType.FULL_TIME,
  email: "ada.lovelace@example.com",
  hireDate: new Date("2020-01-15"),
};

const mockEmployee: Employee = {
  id: "emp_1",
  ...createInput,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

function createMockDb() {
  return {
    employee: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient;
}

describe("EmployeeService.create", () => {
  let db: PrismaClient;

  beforeEach(() => {
    db = createMockDb();
    vi.mocked(db.employee.create).mockResolvedValue(mockEmployee);
  });

  it("creates an employee and returns the record", async () => {
    const service = createEmployeeService(db);
    const result = await service.create(createInput);

    expect(db.employee.create).toHaveBeenCalledWith({
      data: createInput,
    });
    expect(result).toEqual(mockEmployee);
  });
});
