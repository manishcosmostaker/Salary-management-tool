import type { Employee } from "@prisma/client";

export type ListEmployeesParams = {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  jobTitle?: string;
};

export type EmployeeListItem = Pick<
  Employee,
  | "id"
  | "fullName"
  | "jobTitle"
  | "country"
  | "salary"
  | "currency"
  | "department"
  | "email"
>;

export type PaginatedEmployees = {
  data: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
