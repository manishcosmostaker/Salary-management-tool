import { EmploymentType } from "@prisma/client";
import { z } from "zod";

const employmentTypeSchema = z.nativeEnum(EmploymentType);

const employeeFieldsSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  country: z
    .string()
    .trim()
    .length(2, "Country must be a 2-letter ISO code")
    .toUpperCase(),
  salary: z.number().int().positive("Salary must be a positive integer"),
  currency: z
    .string()
    .trim()
    .length(3, "Currency must be a 3-letter ISO code")
    .toUpperCase(),
  department: z.string().trim().min(1, "Department is required"),
  employmentType: employmentTypeSchema,
  email: z.string().trim().email("Invalid email address"),
  hireDate: z.coerce.date(),
});

export const createEmployeeSchema = employeeFieldsSchema.extend({
  currency: employeeFieldsSchema.shape.currency.default("USD"),
  employmentType: employmentTypeSchema.default(EmploymentType.FULL_TIME),
});

export const updateEmployeeSchema = employeeFieldsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().trim().min(1).optional(),
  country: z.string().trim().length(2).optional(),
  jobTitle: z.string().trim().min(1).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type ListEmployeesQuery = z.infer<typeof listEmployeesQuerySchema>;
