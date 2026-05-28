"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";

import { DeleteEmployeeDialog } from "@/components/employees/delete-employee-dialog";
import { listEmployees } from "@/lib/api/employees";
import { formatSalary } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 25;
const FILTER_DEBOUNCE_MS = 500;

function isAbortLikeError(error: unknown): boolean {
  return (
    error instanceof DOMException ||
    (error instanceof Error &&
      (error.name === "AbortError" || error.name === "CanceledError"))
  );
}

export function EmployeesTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleDebounced, setJobTitleDebounced] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
    }, FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [country]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setJobTitleDebounced(jobTitle.trim());
      setPage(1);
    }, FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [jobTitle]);

  const effectiveSearch = search;
  const effectiveCountry =
    country.length === 0 || country.length === 2 ? country : "";
  const effectiveJobTitle = jobTitleDebounced;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "employees",
      page,
      effectiveSearch,
      effectiveCountry,
      effectiveJobTitle,
    ],
    queryFn: ({ signal }) =>
      listEmployees(
        {
          page,
          limit: PAGE_SIZE,
          search: effectiveSearch || undefined,
          country: effectiveCountry || undefined,
          jobTitle: effectiveJobTitle || undefined,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium" htmlFor="search">
            Search
          </label>
          <Input
            id="search"
            placeholder="Name, email, title, department..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium mb-0" htmlFor="country">
            Country
          </label>
          <Input
            id="country"
            placeholder="US"
            maxLength={2}
            value={country}
            onChange={(event) => {
              setCountry(event.target.value.toUpperCase());
            }}
            className="w-24 uppercase"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium" htmlFor="jobTitle">
            Job title
          </label>
          <Input
            id="jobTitle"
            placeholder="Software Engineer"
            value={jobTitle}
            onChange={(event) => {
              setJobTitle(event.target.value);
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Job title</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Salary</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {isError && !isAbortLikeError(error) && (
              <TableRow>
                <TableCell colSpan={6} className="text-destructive">
                  {(error as Error).message}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              data?.data.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="font-medium">{employee.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {employee.email}
                    </div>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.country}</Badge>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-right">
                    {formatSalary(employee.salary, employee.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/employees/${employee.id}`}
                        prefetch={false}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                        )}
                      >
                        View
                      </Link>
                      <DeleteEmployeeDialog
                        employeeId={employee.id}
                        employeeName={employee.fullName}
                        triggerVariant="outline"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && !isError && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {data.total === 0
              ? "Showing 0-0 of 0 employees"
              : `Showing ${(data.page - 1) * data.limit + 1}-${Math.min(
                  data.page * data.limit,
                  data.total,
                )} of ${data.total} employees`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {data.page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
