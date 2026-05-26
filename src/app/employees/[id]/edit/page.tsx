"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { EmployeeForm } from "@/components/employees/employee-form";
import { getEmployee, updateEmployee } from "@/lib/api/employees";
import type { UpdateEmployeeInput } from "@/lib/validations/employee";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const employeeId = params.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployee(employeeId),
  });

  async function handleSubmit(values: UpdateEmployeeInput) {
    await updateEmployee(employeeId, values);
    router.push(`/employees/${employeeId}`);
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-destructive">
        {(error as Error)?.message ?? "Employee not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Edit employee</h1>
      <p className="mt-1 mb-6 text-muted-foreground">{data.fullName}</p>
      <EmployeeForm
        initial={data}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
