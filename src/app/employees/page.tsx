import Link from "next/link";

import { EmployeesTable } from "@/components/employees/employees-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
          <p className="mt-1 text-muted-foreground">
            Browse and manage employee records.
          </p>
        </div>
        <Link href="/employees/new" className={cn(buttonVariants())}>
          Add employee
        </Link>
      </div>
      <EmployeesTable />
    </div>
  );
}
