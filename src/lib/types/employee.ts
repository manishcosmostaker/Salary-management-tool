import type { EmploymentType } from "@prisma/client";

export type EmployeeRecord = {
  id: string;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  currency: string;
  department: string;
  employmentType: EmploymentType;
  email: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeListItem = Pick<
  EmployeeRecord,
  | "id"
  | "fullName"
  | "jobTitle"
  | "country"
  | "salary"
  | "currency"
  | "department"
  | "email"
>;

export type PaginatedEmployeesResponse = {
  data: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
