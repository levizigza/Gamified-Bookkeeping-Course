import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import { brightPathJune2024Entries } from "@/lib/data/sampleJournalEntries";
import { sampleBusiness } from "@/lib/data/sampleBusiness";
import { buildFormattedTrialBalance } from "@/lib/accounting/trialBalance";
import { TrialBalanceTable } from "@/components/reports/TrialBalanceTable";

export function TrialBalanceSection() {
  const { formattedRows, trialBalance, explanation } = buildFormattedTrialBalance(
    brightPathJune2024Entries,
    chartOfAccounts,
    sampleBusiness.simulatedMonth.endDate,
  );

  return (
    <TrialBalanceTable
      trialBalance={trialBalance}
      formattedRows={formattedRows}
      explanation={explanation}
      asOfLabel="June 30, 2024"
    />
  );
}
