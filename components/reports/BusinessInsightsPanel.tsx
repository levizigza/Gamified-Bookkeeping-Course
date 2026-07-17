import type { BusinessInsightsReport } from "@/lib/accounting/financialStatements";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { ExplanationCard } from "@/components/reports/ExplanationCard";

type BusinessInsightsPanelProps = {
  report: BusinessInsightsReport;
  explanation: string;
};

export function BusinessInsightsPanel({
  report,
  explanation,
}: BusinessInsightsPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {report.insights.map((insight) => (
          <Card key={insight.id} padding="md">
            <p className="text-sm font-semibold text-ledger-500">{insight.question}</p>
            <CardTitle className="mt-1 text-lg">{insight.answer}</CardTitle>
            <CardDescription className="mt-2 text-sm leading-relaxed text-ledger-700">
              {insight.detail}
            </CardDescription>
          </Card>
        ))}
      </div>
      <ExplanationCard title="Turn reports into decisions">{explanation}</ExplanationCard>
    </div>
  );
}
