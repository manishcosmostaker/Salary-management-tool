import { EmploymentType, type Employee } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/services/employee.service", () => ({
  employeeService: {
    list: vi.fn(),
  },
}));

import { GET } from "@/app/api/employees/route";
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

describe("GET /api/employees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated employees", async () => {
    vi.mocked(employeeService.list).mockResolvedValue({
      data: [mockEmployee],
      total: 1,
      page: 2,
      limit: 10,
      totalPages: 1,
    });

    const response = await GET(
      new Request("http://localhost/api/employees?page=2&limit=10&country=gb"),
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(employeeService.list).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      country: "gb",
      jobTitle: undefined,
      search: undefined,
    });
    expect(data.data).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("returns 400 for invalid query parameters", async () => {
    const response = await GET(
      new Request("http://localhost/api/employees?page=0"),
    );

    expect(response.status).toBe(400);
    expect(employeeService.list).not.toHaveBeenCalled();
  });
});
