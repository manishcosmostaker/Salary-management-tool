"use client";

import { EmploymentType } from "@prisma/client";
import { useState } from "react";

import type { EmployeeRecord } from "@/lib/types/employee";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EmployeeFormProps = {
  initial?: EmployeeRecord;
  submitLabel: string;
  onSubmit: (
    values: CreateEmployeeInput | UpdateEmployeeInput,
  ) => Promise<void>;
};

const EMPLOYMENT_TYPES = Object.values(EmploymentType);

const defaultValues = {
  fullName: "",
  jobTitle: "",
  country: "US",
  salaryMajor: "",
  currency: "USD",
  department: "",
  employmentType: EmploymentType.FULL_TIME,
  email: "",
  hireDate: new Date().toISOString().slice(0, 10),
};

export function EmployeeForm({
  initial,
  submitLabel,
  onSubmit,
}: EmployeeFormProps) {
  const [values, setValues] = useState({
    fullName: initial?.fullName ?? defaultValues.fullName,
    jobTitle: initial?.jobTitle ?? defaultValues.jobTitle,
    country: initial?.country ?? defaultValues.country,
    salaryMajor: initial
      ? String(initial.salary / 100)
      : defaultValues.salaryMajor,
    currency: initial?.currency ?? defaultValues.currency,
    department: initial?.department ?? defaultValues.department,
    employmentType: initial?.employmentType ?? defaultValues.employmentType,
    email: initial?.email ?? defaultValues.email,
    hireDate: initial
      ? initial.hireDate.slice(0, 10)
      : defaultValues.hireDate,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const salary = Math.round(Number(values.salaryMajor) * 100);

    try {
      await onSubmit({
        fullName: values.fullName.trim(),
        jobTitle: values.jobTitle.trim(),
        country: values.country.trim().toUpperCase(),
        salary,
        currency: values.currency.trim().toUpperCase(),
        department: values.department.trim(),
        employmentType: values.employmentType,
        email: values.email.trim(),
        hireDate: new Date(`${values.hireDate}T00:00:00.000Z`),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            required
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hireDate">Hire date</Label>
          <Input
            id="hireDate"
            type="date"
            required
            value={values.hireDate}
            onChange={(event) => updateField("hireDate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job title</Label>
          <Input
            id="jobTitle"
            required
            value={values.jobTitle}
            onChange={(event) => updateField("jobTitle", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            required
            value={values.department}
            onChange={(event) => updateField("department", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country (ISO)</Label>
          <Input
            id="country"
            required
            maxLength={2}
            value={values.country}
            onChange={(event) =>
              updateField("country", event.target.value.toUpperCase())
            }
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency (ISO)</Label>
          <Input
            id="currency"
            required
            maxLength={3}
            value={values.currency}
            onChange={(event) =>
              updateField("currency", event.target.value.toUpperCase())
            }
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMajor">Salary (major units)</Label>
          <Input
            id="salaryMajor"
            type="number"
            min="1"
            step="1"
            required
            value={values.salaryMajor}
            onChange={(event) => updateField("salaryMajor", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employmentType">Employment type</Label>
          <select
            id="employmentType"
            className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
            value={values.employmentType}
            onChange={(event) =>
              updateField(
                "employmentType",
                event.target.value as EmploymentType,
              )
            }
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
