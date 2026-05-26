import type { Employee } from "@prisma/client";

export type ListEmployeesParams = {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  jobTitle?: string;
};

export type PaginatedEmployees = {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
