import { YEAR_END_EDUCATIONAL_DISCLAIMER } from "@/lib/accounting/yearEndCalculators";

export function EducationalDisclaimer() {
  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
      role="note"
    >
      <p className="font-semibold">Educational simulation — not tax advice</p>
      <p className="mt-1">{YEAR_END_EDUCATIONAL_DISCLAIMER}</p>
    </div>
  );
}
