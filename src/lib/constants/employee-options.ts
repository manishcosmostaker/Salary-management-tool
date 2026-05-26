/** Shared option lists for forms, filters, and seed data. */

export const EMPLOYEE_COUNTRIES = [
  { code: "US", label: "United States", currency: "USD" },
  { code: "GB", label: "United Kingdom", currency: "GBP" },
  { code: "DE", label: "Germany", currency: "EUR" },
  { code: "IN", label: "India", currency: "INR" },
  { code: "CA", label: "Canada", currency: "CAD" },
  { code: "AU", label: "Australia", currency: "AUD" },
  { code: "FR", label: "France", currency: "EUR" },
  { code: "SG", label: "Singapore", currency: "SGD" },
] as const;

export const EMPLOYEE_JOB_TITLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Engineering Manager",
  "Product Manager",
  "HR Manager",
  "Recruiter",
  "Financial Analyst",
  "Accountant",
  "Sales Representative",
  "Sales Manager",
  "Marketing Specialist",
  "Data Analyst",
  "Data Scientist",
  "Customer Success Manager",
  "Operations Manager",
] as const;

export const EMPLOYEE_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
  "Customer Success",
] as const;

export const EMPLOYEE_CURRENCIES = [
  "USD",
  "GBP",
  "EUR",
  "INR",
  "CAD",
  "AUD",
  "SGD",
] as const;

export function currencyForCountryCode(countryCode: string) {
  return (
    EMPLOYEE_COUNTRIES.find((country) => country.code === countryCode)
      ?.currency ?? "USD"
  );
}

/** Include a current DB value in the list when editing legacy records. */
export function withCurrentOption<T extends string>(
  options: readonly T[],
  current?: string,
): T[] {
  if (current && !options.includes(current as T)) {
    return [current as T, ...options];
  }
  return [...options];
}
