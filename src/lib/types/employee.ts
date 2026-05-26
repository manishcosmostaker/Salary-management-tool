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

export type PaginatedEmployeesResponse = {
  data: EmployeeRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
