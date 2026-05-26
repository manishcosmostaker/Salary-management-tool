const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  IN: "INR",
  CA: "CAD",
  AU: "AUD",
  FR: "EUR",
  SG: "SGD",
};

export function currencyForCountry(countryCode: string) {
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? "USD";
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
