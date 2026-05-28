"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  getCountryInsights,
  getCountryJobTitleInsights,
} from "@/lib/api/insights";
import {
  INSIGHT_COUNTRIES,
  INSIGHT_JOB_TITLES,
} from "@/lib/constants/insights-options";
import { currencyForCountry, formatSalary } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function isAbortLikeError(error: unknown): boolean {
  return (
    error instanceof DOMException ||
    (error instanceof Error &&
      (error.name === "AbortError" || error.name === "CanceledError"))
  );
}

export function InsightsDashboard() {
  const [country, setCountry] = useState<string>(INSIGHT_COUNTRIES[0].code);
  const [jobTitle, setJobTitle] = useState<string>(INSIGHT_JOB_TITLES[0]);

  const countryQuery = useQuery({
    queryKey: ["insights-country", country],
    queryFn: ({ signal }) => getCountryInsights(country, signal),
    placeholderData: keepPreviousData,
  });

  const jobTitleQuery = useQuery({
    queryKey: ["insights-job-title", country, jobTitle],
    queryFn: ({ signal }) =>
      getCountryJobTitleInsights(country, jobTitle, signal),
    enabled: Boolean(jobTitle),
    placeholderData: keepPreviousData,
  });

  const countryData = countryQuery.data;
  const jobData = jobTitleQuery.data;
  const displayCurrency = currencyForCountry(country);
  const isCountryFetching = countryQuery.isFetching && !countryQuery.isLoading;
  const isJobFetching = jobTitleQuery.isFetching && !jobTitleQuery.isLoading;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="insights-country">Country</Label>
          <Select
            value={country}
            onValueChange={(value) => {
              if (value) setCountry(value);
            }}
          >
            <SelectTrigger id="insights-country" className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {INSIGHT_COUNTRIES.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.label} ({option.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="insights-job-title">Job title</Label>
          <Select
            value={jobTitle}
            onValueChange={(value) => {
              if (value) setJobTitle(value);
            }}
          >
            <SelectTrigger id="insights-job-title" className="w-full">
              <SelectValue placeholder="Select job title" />
            </SelectTrigger>
            <SelectContent>
              {INSIGHT_JOB_TITLES.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Country overview</h2>
          <Badge variant="outline">{country}</Badge>
          {isCountryFetching && (
            <span className="text-xs text-muted-foreground">Updating…</span>
          )}
        </div>

        {countryQuery.isLoading && <MetricsSkeleton />}

        {countryQuery.isError && !isAbortLikeError(countryQuery.error) && (
          <p className="text-sm text-destructive">
            {(countryQuery.error as Error).message}
          </p>
        )}

        {countryData && (
          <div
            className={
              isCountryFetching ? "opacity-60 transition-opacity" : undefined
            }
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Employees"
                value={String(countryData.employeeCount)}
                description="Headcount in country"
              />
              <MetricCard
                title="Average salary"
                value={
                  countryData.averageSalary === null
                    ? "—"
                    : formatSalary(countryData.averageSalary, displayCurrency)
                }
                description="Mean compensation"
              />
              <MetricCard
                title="Minimum salary"
                value={
                  countryData.minSalary === null
                    ? "—"
                    : formatSalary(countryData.minSalary, displayCurrency)
                }
                description="Lowest paid employee"
              />
              <MetricCard
                title="Maximum salary"
                value={
                  countryData.maxSalary === null
                    ? "—"
                    : formatSalary(countryData.maxSalary, displayCurrency)
                }
                description="Highest paid employee"
              />
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Role in country</h2>
          <Badge variant="outline">{jobTitle}</Badge>
          {isJobFetching && (
            <span className="text-xs text-muted-foreground">Updating…</span>
          )}
        </div>

        {jobTitleQuery.isLoading && <MetricsSkeleton columns={3} />}

        {jobTitleQuery.isError && !isAbortLikeError(jobTitleQuery.error) && (
          <p className="text-sm text-destructive">
            {(jobTitleQuery.error as Error).message}
          </p>
        )}

        {jobData && (
          <div
            className={
              isJobFetching ? "opacity-60 transition-opacity" : undefined
            }
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                title="Employees in role"
                value={String(jobData.employeeCount)}
              />
              <MetricCard
                title="Average salary"
                value={
                  jobData.averageSalary === null
                    ? "—"
                    : formatSalary(jobData.averageSalary, displayCurrency)
                }
              />
              <MetricCard
                title="Salary range"
                value={
                  jobData.minSalary === null || jobData.maxSalary === null
                    ? "—"
                    : `${formatSalary(jobData.minSalary, displayCurrency)} – ${formatSalary(jobData.maxSalary, displayCurrency)}`
                }
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {description}
        </CardContent>
      )}
    </Card>
  );
}

function MetricsSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
    </div>
  );
}
