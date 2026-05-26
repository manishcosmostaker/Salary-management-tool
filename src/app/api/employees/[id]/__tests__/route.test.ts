import { EmploymentType, type Employee } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/employee.service", () => ({
  employeeService: {
    getById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { DELETE, GET, PATCH } from "@/app/api/employees/[id]/route";
import { employeeService } from "@/lib/services/employee.service";

const mockEmployee: Employee = {
  id: "emp_1",
  fullName: "Ada Lovelace",
  jobTitle: "Software Engineer",
  country: "GB",
  salary: 8500000,
  currency: "GBP",
  department: "Engineering",
  employmentType: EmploymentType.FULL_TIME,
  email: "ada.lovelace@example.com",
  hireDate: new Date("2020-01-15"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

const routeContext = { params: Promise.resolve({ id: "emp_1" }) };

describe("/api/employees/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 200 when employee exists", async () => {
    vi.mocked(employeeService.getById).mockResolvedValue(mockEmployee);

    const response = await GET(
      new Request("http://localhost/api/employees/emp_1"),
      routeContext,
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe("emp_1");
  });

  it("GET returns 404 when employee is missing", async () => {
    vi.mocked(employeeService.getById).mockResolvedValue(null);

    const response = await GET(
      new Request("http://localhost/api/employees/emp_1"),
      routeContext,
    );

    expect(response.status).toBe(404);
  });

  it("PATCH returns 200 and updated employee", async () => {
    vi.mocked(employeeService.update).mockResolvedValue({
      ...mockEmployee,
      salary: 9000000,
    });

    const response = await PATCH(
      new Request("http://localhost/api/employees/emp_1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salary: 9000000 }),
      }),
      routeContext,
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.salary).toBe(9000000);
  });

  it("DELETE returns 204 when employee is removed", async () => {
    vi.mocked(employeeService.delete).mockResolvedValue(mockEmployee);

    const response = await DELETE(
      new Request("http://localhost/api/employees/emp_1", {
        method: "DELETE",
      }),
      routeContext,
    );

    expect(response.status).toBe(204);
    expect(employeeService.delete).toHaveBeenCalledWith("emp_1");
  });
});
