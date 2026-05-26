import { currencyForCountryCode } from "@/lib/constants/employee-options";

export function currencyForCountry(countryCode: string) {
  return currencyForCountryCode(countryCode);
}

export function formatSalary(amountMinorUnits: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinorUnits / 100);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
