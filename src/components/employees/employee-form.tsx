"use client";

import { EmploymentType } from "@prisma/client";
import { useMemo, useState } from "react";

import {
  EMPLOYEE_COUNTRIES,
  EMPLOYEE_CURRENCIES,
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_JOB_TITLES,
  currencyForCountryCode,
  withCurrentOption,
} from "@/lib/constants/employee-options";
import type { EmployeeRecord } from "@/lib/types/employee";
import type {
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "@/lib/validations/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EmployeeFormProps = {
  initial?: EmployeeRecord;
  submitLabel: string;
  onSubmit: (
    values: CreateEmployeeInput | UpdateEmployeeInput,
  ) => Promise<void>;
};

const EMPLOYMENT_TYPES = Object.values(EmploymentType);

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACT: "Contract",
};

const defaultValues = {
  fullName: "",
  jobTitle: EMPLOYEE_JOB_TITLES[0],
  country: "US",
  salaryMajor: "",
  currency: "USD",
  department: EMPLOYEE_DEPARTMENTS[0],
  employmentType: EmploymentType.FULL_TIME,
  email: "",
  hireDate: new Date().toISOString().slice(0, 10),
};

type FormSelectProps = {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
};

function FormSelect({ id, label, value, onValueChange, options }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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

  const jobTitleOptions = useMemo(
    () =>
      withCurrentOption(EMPLOYEE_JOB_TITLES, initial?.jobTitle).map((title) => ({
        value: title,
        label: title,
      })),
    [initial?.jobTitle],
  );

  const departmentOptions = useMemo(
    () =>
      withCurrentOption(EMPLOYEE_DEPARTMENTS, initial?.department).map(
        (department) => ({
          value: department,
          label: department,
        }),
      ),
    [initial?.department],
  );

  const countryOptions = useMemo(
    () =>
      withCurrentOption(
        EMPLOYEE_COUNTRIES.map((country) => country.code),
        initial?.country,
      ).map((code) => {
        const country = EMPLOYEE_COUNTRIES.find((item) => item.code === code);
        return {
          value: code,
          label: country ? `${country.label} (${code})` : code,
        };
      }),
    [initial?.country],
  );

  const currencyOptions = useMemo(
    () =>
      withCurrentOption(EMPLOYEE_CURRENCIES, initial?.currency).map(
        (currency) => ({
          value: currency,
          label: currency,
        }),
      ),
    [initial?.currency],
  );

  function updateField<K extends keyof typeof values>(
    key: K,
    value: (typeof values)[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleCountryChange(countryCode: string) {
    setValues((current) => ({
      ...current,
      country: countryCode,
      currency: currencyForCountryCode(countryCode),
    }));
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
        <FormSelect
          id="jobTitle"
          label="Job title"
          value={values.jobTitle}
          onValueChange={(jobTitle) => updateField("jobTitle", jobTitle)}
          options={jobTitleOptions}
        />
        <FormSelect
          id="department"
          label="Department"
          value={values.department}
          onValueChange={(department) => updateField("department", department)}
          options={departmentOptions}
        />
        <FormSelect
          id="country"
          label="Country"
          value={values.country}
          onValueChange={handleCountryChange}
          options={countryOptions}
        />
        <FormSelect
          id="currency"
          label="Currency"
          value={values.currency}
          onValueChange={(currency) => updateField("currency", currency)}
          options={currencyOptions}
        />
        <div className="space-y-2">
          <Label htmlFor="salaryMajor">Salary (annual, major units)</Label>
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
        <FormSelect
          id="employmentType"
          label="Employment type"
          value={values.employmentType}
          onValueChange={(type) =>
            updateField("employmentType", type as EmploymentType)
          }
          options={EMPLOYMENT_TYPES.map((type) => ({
            value: type,
            label: EMPLOYMENT_LABELS[type],
          }))}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
