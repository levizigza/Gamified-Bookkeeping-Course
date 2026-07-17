import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

const reportPlaceholders = [
  {
    title: "Trial Balance",
    description: "Summary of all account balances — debits must equal credits.",
    status: "In progress",
  },
  {
    title: "Profit & Loss",
    description: "Revenue minus expenses for June 2024.",
    status: "Locked",
  },
  {
    title: "Balance Sheet",
    description: "Assets, liabilities, and equity as of June 30, 2024.",
    status: "Locked",
  },
];

export function ReportsOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {reportPlaceholders.map((report) => (
        <Card
          key={report.title}
          className={report.status === "Locked" ? "opacity-60" : ""}
        >
          <CardTitle>{report.title}</CardTitle>
          <CardDescription className="mt-2">{report.description}</CardDescription>
          <span
            className={`mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              report.status === "Locked"
                ? "bg-ledger-100 text-ledger-500"
                : "bg-ledger-100 text-ledger-700"
            }`}
          >
            {report.status}
          </span>
        </Card>
      ))}
    </div>
  );
}
