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

describe("EmployeeService.list", () => {
  let db: PrismaClient;

  beforeEach(() => {
    db = createMockDb();
    vi.mocked(db.employee.findMany).mockResolvedValue([mockEmployee]);
    vi.mocked(db.employee.count).mockResolvedValue(42);
  });

  it("returns paginated employees with metadata", async () => {
    const service = createEmployeeService(db);
    const result = await service.list({ page: 2, limit: 10 });

    expect(db.employee.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 10,
      take: 10,
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
    });
    expect(db.employee.count).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({
      data: [mockEmployee],
      total: 42,
      page: 2,
      limit: 10,
      totalPages: 5,
    });
  });

  it("applies country and search filters", async () => {
    const service = createEmployeeService(db);
    await service.list({ country: "gb", search: "ada" });

    expect(db.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          country: "GB",
          OR: [
            { fullName: { contains: "ada", mode: "insensitive" } },
            { email: { contains: "ada", mode: "insensitive" } },
            { jobTitle: { contains: "ada", mode: "insensitive" } },
            { department: { contains: "ada", mode: "insensitive" } },
          ],
        },
      }),
    );
  });
});

describe("EmployeeService.getById, update, delete", () => {
  let db: PrismaClient;

  beforeEach(() => {
    db = createMockDb();
    vi.mocked(db.employee.findUnique).mockResolvedValue(mockEmployee);
    vi.mocked(db.employee.update).mockResolvedValue({
      ...mockEmployee,
      salary: 9000000,
    });
    vi.mocked(db.employee.delete).mockResolvedValue(mockEmployee);
  });

  it("finds an employee by id", async () => {
    const service = createEmployeeService(db);
    const result = await service.getById("emp_1");

    expect(db.employee.findUnique).toHaveBeenCalledWith({
      where: { id: "emp_1" },
    });
    expect(result).toEqual(mockEmployee);
  });

  it("updates an employee", async () => {
    const service = createEmployeeService(db);
    const result = await service.update("emp_1", { salary: 9000000 });

    expect(db.employee.update).toHaveBeenCalledWith({
      where: { id: "emp_1" },
      data: { salary: 9000000 },
    });
    expect(result.salary).toBe(9000000);
  });

  it("deletes an employee", async () => {
    const service = createEmployeeService(db);
    const result = await service.delete("emp_1");

    expect(db.employee.delete).toHaveBeenCalledWith({
      where: { id: "emp_1" },
    });
    expect(result).toEqual(mockEmployee);
  });
});
