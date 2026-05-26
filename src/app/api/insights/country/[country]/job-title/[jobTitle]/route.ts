import { jsonData, validationError } from "@/lib/api/response";
import { insightsService } from "@/lib/services/insights.service";
import {
  countryParamSchema,
  jobTitleParamSchema,
} from "@/lib/validations/insights";

type RouteContext = {
  params: Promise<{ country: string; jobTitle: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { country, jobTitle } = await context.params;
  const parsedCountry = countryParamSchema.safeParse(country);
  const parsedJobTitle = jobTitleParamSchema.safeParse(
    decodeURIComponent(jobTitle),
  );

  if (!parsedCountry.success) {
    return validationError(parsedCountry.error);
  }

  if (!parsedJobTitle.success) {
    return validationError(parsedJobTitle.error);
  }

  const insights = await insightsService.getCountryJobTitleSalaryInsights(
    parsedCountry.data,
    parsedJobTitle.data,
  );

  return jsonData(insights);
}
