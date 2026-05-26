import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";
import type {
  EmployeeRecord,
  PaginatedEmployeesResponse,
} from "@/lib/types/employee";

export type ListEmployeesQuery = {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  jobTitle?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string" ? data.error : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function listEmployees(
  query: ListEmployeesQuery = {},
): Promise<PaginatedEmployeesResponse> {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.country) params.set("country", query.country);
  if (query.jobTitle) params.set("jobTitle", query.jobTitle);

  const response = await fetch(`/api/employees?${params.toString()}`);
  return parseJson<PaginatedEmployeesResponse>(response);
}

export async function getEmployee(id: string): Promise<EmployeeRecord> {
  const response = await fetch(`/api/employees/${id}`);
  return parseJson<EmployeeRecord>(response);
}

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<EmployeeRecord> {
  const response = await fetch("/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      hireDate:
        input.hireDate instanceof Date
          ? input.hireDate.toISOString()
          : input.hireDate,
    }),
  });

  return parseJson<EmployeeRecord>(response);
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<EmployeeRecord> {
  const response = await fetch(`/api/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      hireDate:
        input.hireDate instanceof Date
          ? input.hireDate.toISOString()
          : input.hireDate,
    }),
  });

  return parseJson<EmployeeRecord>(response);
}

export async function deleteEmployee(id: string): Promise<void> {
  const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      typeof data?.error === "string" ? data.error : "Delete failed";
    throw new Error(message);
  }
}
