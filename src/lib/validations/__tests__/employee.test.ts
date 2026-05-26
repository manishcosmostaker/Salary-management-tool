import { describe, expect, it } from "vitest";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/lib/validations/employee";

const validEmployee = {
  fullName: "Ada Lovelace",
  jobTitle: "Software Engineer",
  country: "GB",
  salary: 8500000,
  currency: "GBP",
  department: "Engineering",
  employmentType: "FULL_TIME",
  email: "ada.lovelace@example.com",
  hireDate: "2020-01-15T00:00:00.000Z",
};

describe("createEmployeeSchema", () => {
  it("accepts a valid employee payload", () => {
    const result = createEmployeeSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = createEmployeeSchema.safeParse({
      fullName: "Ada Lovelace",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = createEmployeeSchema.safeParse({
      ...validEmployee,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive salary", () => {
    const result = createEmployeeSchema.safeParse({
      ...validEmployee,
      salary: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid employment type", () => {
    const result = createEmployeeSchema.safeParse({
      ...validEmployee,
      employmentType: "INTERN",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateEmployeeSchema", () => {
  it("accepts partial updates", () => {
    const result = updateEmployeeSchema.safeParse({ salary: 9000000 });
    expect(result.success).toBe(true);
  });

  it("rejects empty update object", () => {
    const result = updateEmployeeSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid partial fields", () => {
    const result = updateEmployeeSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });
});
