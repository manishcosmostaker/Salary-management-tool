import type {
  CountryJobTitleSalaryInsights,
  CountrySalaryInsights,
} from "@/lib/services/insights.types";

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data?.error === "string" ? data.error : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function getCountryInsights(
  country: string,
  signal?: AbortSignal,
): Promise<CountrySalaryInsights> {
  const response = await fetch(
    `/api/insights/country/${encodeURIComponent(country)}`,
    { signal },
  );
  return parseJson<CountrySalaryInsights>(response);
}

export async function getCountryJobTitleInsights(
  country: string,
  jobTitle: string,
  signal?: AbortSignal,
): Promise<CountryJobTitleSalaryInsights> {
  const response = await fetch(
    `/api/insights/country/${encodeURIComponent(country)}/job-title/${encodeURIComponent(jobTitle)}`,
    { signal },
  );
  return parseJson<CountryJobTitleSalaryInsights>(response);
}
