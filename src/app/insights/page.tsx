import { InsightsDashboard } from "@/components/insights/insights-dashboard";

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Salary insights
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore compensation metrics by country and job title.
        </p>
      </div>
      <InsightsDashboard />
    </div>
  );
}
