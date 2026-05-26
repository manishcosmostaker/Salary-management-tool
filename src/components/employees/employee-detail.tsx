"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog";
import { getEmployee } from "@/lib/api/employees";
import { formatDate, formatSalary } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type EmployeeDetailProps = {
  employeeId: string;
};

export function EmployeeDetail({ employeeId }: EmployeeDetailProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => getEmployee(employeeId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-destructive">
        {(error as Error)?.message ?? "Employee not found"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {data.fullName}
          </h1>
          <p className="mt-1 text-muted-foreground">{data.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/employees/${data.id}/edit`}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Edit
          </Link>
          <DeleteEmployeeDialog
            employeeId={data.id}
            employeeName={data.fullName}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employment details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Job title" value={data.jobTitle} />
          <DetailItem label="Department" value={data.department} />
          <DetailItem
            label="Country"
            value={<Badge variant="outline">{data.country}</Badge>}
          />
          <DetailItem label="Employment type" value={data.employmentType} />
          <DetailItem
            label="Salary"
            value={formatSalary(data.salary, data.currency)}
          />
          <DetailItem label="Hire date" value={formatDate(data.hireDate)} />
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
