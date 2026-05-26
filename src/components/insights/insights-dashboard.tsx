"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  getCountryInsights,
  getCountryJobTitleInsights,
} from "@/lib/api/insights";
import { currencyForCountry, formatSalary } from "@/lib/format/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const QUICK_COUNTRIES = ["US", "GB", "DE", "IN", "CA", "AU", "FR", "SG"];

export function InsightsDashboard() {
  const [country, setCountry] = useState("US");
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [submittedCountry, setSubmittedCountry] = useState("US");
  const [submittedJobTitle, setSubmittedJobTitle] = useState(
    "Software Engineer",
  );

  const countryQuery = useQuery({
    queryKey: ["insights-country", submittedCountry],
    queryFn: () => getCountryInsights(submittedCountry),
    enabled: submittedCountry.length === 2,
  });

  const jobTitleQuery = useQuery({
    queryKey: [
      "insights-job-title",
      submittedCountry,
      submittedJobTitle,
    ],
    queryFn: () =>
      getCountryJobTitleInsights(submittedCountry, submittedJobTitle),
    enabled:
      submittedCountry.length === 2 && submittedJobTitle.trim().length > 0,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedCountry(country.trim().toUpperCase());
    setSubmittedJobTitle(jobTitle.trim());
  }

  const countryData = countryQuery.data;
  const jobData = jobTitleQuery.data;
  const displayCurrency = currencyForCountry(submittedCountry);

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="insights-country">Country (ISO)</Label>
          <Input
            id="insights-country"
            maxLength={2}
            value={country}
            onChange={(event) =>
              setCountry(event.target.value.toUpperCase())
            }
            className="w-24 uppercase"
          />
          <div className="flex flex-wrap gap-1">
            {QUICK_COUNTRIES.map((code) => (
              <Button
                key={code}
                type="button"
                size="xs"
                variant="outline"
                onClick={() => setCountry(code)}
              >
                {code}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="insights-job-title">Job title (optional)</Label>
          <Input
            id="insights-job-title"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="Software Engineer"
          />
        </div>
        <Button type="submit">Load insights</Button>
      </form>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Country overview</h2>
          <Badge variant="outline">{submittedCountry}</Badge>
        </div>

        {countryQuery.isLoading && <MetricsSkeleton />}

        {countryQuery.isError && (
          <p className="text-sm text-destructive">
            {(countryQuery.error as Error).message}
          </p>
        )}

        {countryData && (
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
        )}
      </section>

      {submittedJobTitle && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Role in country</h2>
            <Badge variant="outline">{submittedJobTitle}</Badge>
          </div>

          {jobTitleQuery.isLoading && <MetricsSkeleton columns={3} />}

          {jobTitleQuery.isError && (
            <p className="text-sm text-destructive">
              {(jobTitleQuery.error as Error).message}
            </p>
          )}

          {jobData && (
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
          )}
        </section>
      )}
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
