import type { SuggestedJournalEntry } from "@/lib/accounting/yearEndCalculators";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

type JournalEntryPreviewProps = {
  entry: SuggestedJournalEntry;
};

export function JournalEntryPreview({ entry }: JournalEntryPreviewProps) {
  return (
    <Card padding="md" className="bg-ledger-50/80">
      <CardTitle className="text-base">Suggested journal entry</CardTitle>
      <CardDescription className="mt-1">{entry.memo}</CardDescription>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-ledger-200 text-left text-ledger-600">
            <th className="pb-2 font-semibold">Account</th>
            <th className="pb-2 text-right font-semibold">Debit</th>
            <th className="pb-2 text-right font-semibold">Credit</th>
          </tr>
        </thead>
        <tbody>
          {entry.lines.map((line) => (
            <tr key={`${line.side}-${line.accountLabel}`} className="border-b border-ledger-100">
              <td className="py-2 pr-4 text-ledger-900">{line.accountLabel}</td>
              <td className="py-2 text-right tabular-nums text-ledger-900">
                {line.side === "debit" ? formatCentsForMessage(line.amountCents) : "—"}
              </td>
              <td className="py-2 text-right tabular-nums text-ledger-900">
                {line.side === "credit" ? formatCentsForMessage(line.amountCents) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
