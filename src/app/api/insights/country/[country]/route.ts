import { jsonData, validationError } from "@/lib/api/response";
import { insightsService } from "@/lib/services/insights.service";
import { countryParamSchema } from "@/lib/validations/insights";

type RouteContext = {
  params: Promise<{ country: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { country } = await context.params;
  const parsed = countryParamSchema.safeParse(country);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const insights = await insightsService.getCountrySalaryInsights(parsed.data);
  return jsonData(insights);
}
