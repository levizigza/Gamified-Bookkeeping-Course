"use client";

import { useMemo, useState } from "react";
import {
  calculateHomeOfficeUse,
  formatPercentDisplay,
  parseDollarsToCents,
  type HomeOfficeResult,
} from "@/lib/accounting/yearEndCalculators";
import { formatCentsForMessage } from "@/lib/accounting/journalValidation";
import {
  CalculatorErrors,
  CalculatorField,
  CalculatorResults,
  CalculatorTextInput,
  SamplePresetButton,
} from "@/components/calculators/CalculatorFormParts";
import { JournalEntryPreview } from "@/components/calculators/JournalEntryPreview";
import { Button } from "@/components/ui/Button";

export function HomeOfficeCalculatorPanel() {
  const [officeArea, setOfficeArea] = useState("150");
  const [totalHomeArea, setTotalHomeArea] = useState("1500");
  const [eligibleCosts, setEligibleCosts] = useState("35850");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<HomeOfficeResult | null>(null);

  const output = useMemo(() => {
    const office = Number(officeArea);
    const total = Number(totalHomeArea);
    const costsCents = parseDollarsToCents(eligibleCosts);
    if (!Number.isFinite(office) || !Number.isFinite(total) || costsCents === null) {
      return null;
    }

    const calculated = calculateHomeOfficeUse({
      officeArea: office,
      totalHomeArea: total,
      eligibleHomeCostsCents: costsCents,
    });
    return calculated.ok ? calculated.value : null;
  }, [officeArea, totalHomeArea, eligibleCosts]);

  const loadSample = () => {
    setOfficeArea("150");
    setTotalHomeArea("1500");
    setEligibleCosts("35850");
    setErrors([]);
    setResult(null);
  };

  const handleCalculate = () => {
    const office = Number(officeArea);
    const total = Number(totalHomeArea);
    const costsCents = parseDollarsToCents(eligibleCosts);

    if (costsCents === null) {
      setErrors(["Enter valid eligible home costs in dollars."]);
      setResult(null);
      return;
    }

    const calculated = calculateHomeOfficeUse({
      officeArea: office,
      totalHomeArea: total,
      eligibleHomeCostsCents: costsCents,
    });

    if (!calculated.ok) {
      setErrors(calculated.errors.map((e) => e.message));
      setResult(null);
      return;
    }

    setErrors([]);
    setResult(calculated.value);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-ledger-600">
        Allocate a business-use share of home costs based on office space. The
        suggested entry records the expense and credits Shareholder Loan when
        personal funds paid the underlying costs.
      </p>

      <SamplePresetButton label="Load course sample" onClick={loadSample} />

      <div className="grid gap-4 sm:grid-cols-3">
        <CalculatorField id="ho-office" label="Office area" hint="Square feet or square metres — be consistent">
          <CalculatorTextInput
            id="ho-office"
            value={officeArea}
            onChange={setOfficeArea}
            placeholder="150"
            inputMode="numeric"
          />
        </CalculatorField>
        <CalculatorField id="ho-total" label="Total home area">
          <CalculatorTextInput
            id="ho-total"
            value={totalHomeArea}
            onChange={setTotalHomeArea}
            placeholder="1500"
            inputMode="numeric"
          />
        </CalculatorField>
        <CalculatorField id="ho-costs" label="Eligible home costs ($)" hint="Rent, utilities, insurance, etc.">
          <CalculatorTextInput
            id="ho-costs"
            value={eligibleCosts}
            onChange={setEligibleCosts}
            placeholder="35850"
            inputMode="decimal"
          />
        </CalculatorField>
      </div>

      <Button onClick={handleCalculate}>Calculate</Button>
      <CalculatorErrors messages={errors} />

      {(result ?? output) && (
        <div className="space-y-4">
          <CalculatorResults
            rows={[
              {
                label: "Business-use percentage",
                value: formatPercentDisplay((result ?? output)!.businessUsePercent),
              },
              {
                label: "Claim amount",
                value: formatCentsForMessage((result ?? output)!.claimAmountCents),
              },
            ]}
          />
          <JournalEntryPreview entry={(result ?? output)!.journalEntry} />
        </div>
      )}
    </div>
  );
}
