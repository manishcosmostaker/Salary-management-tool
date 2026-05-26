import { EmploymentType, type Employee } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/employee.service", () => ({
  employeeService: {
    create: vi.fn(),
  },
}));

import { POST } from "@/app/api/employees/route";
import { employeeService } from "@/lib/services/employee.service";

const validBody = {
  fullName: "Ada Lovelace",
  jobTitle: "Software Engineer",
  country: "GB",
  salary: 8500000,
  currency: "GBP",
  department: "Engineering",
  employmentType: EmploymentType.FULL_TIME,
  email: "ada.lovelace@example.com",
  hireDate: "2020-01-15T00:00:00.000Z",
};

const mockEmployee: Employee = {
  id: "emp_1",
  ...validBody,
  hireDate: new Date(validBody.hireDate),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

function postRequest(body: unknown) {
  return new Request("http://localhost/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/employees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 and the created employee", async () => {
    vi.mocked(employeeService.create).mockResolvedValue(mockEmployee);

    const response = await POST(postRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(employeeService.create).toHaveBeenCalledOnce();
    expect(data.id).toBe("emp_1");
    expect(data.email).toBe(validBody.email);
  });

  it("returns 400 for invalid payload", async () => {
    const response = await POST(postRequest({ fullName: "Ada Lovelace" }));

    expect(response.status).toBe(400);
    expect(employeeService.create).not.toHaveBeenCalled();
  });
});
