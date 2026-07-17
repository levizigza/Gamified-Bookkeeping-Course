import { Card, CardDescription, CardTitle } from "@/components/ui/Card";

type ExplanationCardProps = {
  title: string;
  children: string;
};

export function ExplanationCard({ title, children }: ExplanationCardProps) {
  return (
    <Card className="border-ledger-200 bg-ledger-50/80">
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription className="mt-2 text-sm leading-relaxed text-ledger-700">
        {children}
      </CardDescription>
    </Card>
  );
}
