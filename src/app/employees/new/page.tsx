"use client";

import { useRouter } from "next/navigation";

import { EmployeeForm } from "@/components/employees/employee-form";
import { createEmployee } from "@/lib/api/employees";
import type { CreateEmployeeInput } from "@/lib/validations/employee";

export default function NewEmployeePage() {
  const router = useRouter();

  async function handleSubmit(values: CreateEmployeeInput) {
    const employee = await createEmployee(values);
    router.push(`/employees/${employee.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Add employee</h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        Create a new employee record.
      </p>
      <EmployeeForm submitLabel="Create employee" onSubmit={handleSubmit} />
    </div>
  );
}
