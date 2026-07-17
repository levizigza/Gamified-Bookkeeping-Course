"use client";

import { useMemo, useState } from "react";
import {
  calculateDepreciation,
  parseDollarsToCents,
  type DepreciationResult,
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

const PRESETS = [
  { label: "Vehicle (30%)", assetName: "Vehicle", cost: "30000", rate: "30" },
  { label: "Furniture (20%)", assetName: "Furniture", cost: "15000", rate: "20" },
  { label: "Computers (50%)", assetName: "Computers", cost: "5000", rate: "50" },
] as const;

export function DepreciationCalculatorPanel() {
  const [assetName, setAssetName] = useState("Vehicle");
  const [cost, setCost] = useState("30000");
  const [rate, setRate] = useState("30");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<DepreciationResult | null>(null);

  const output = useMemo(() => {
    const costCents = parseDollarsToCents(cost);
    const depreciationRatePercent = Number(rate);
    if (costCents === null || !Number.isFinite(depreciationRatePercent)) return null;

    const calculated = calculateDepreciation({
      assetName,
      costCents,
      depreciationRatePercent,
    });
    return calculated.ok ? calculated.value : null;
  }, [assetName, cost, rate]);

  const handleCalculate = () => {
    const costCents = parseDollarsToCents(cost);
    const depreciationRatePercent = Number(rate);

    if (costCents === null) {
      setErrors(["Enter a valid asset cost in dollars."]);
      setResult(null);
      return;
    }

    const calculated = calculateDepreciation({
      assetName,
      costCents,
      depreciationRatePercent,
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
        Spread asset cost over time with a depreciation rate. This simplified model
        calculates one period&apos;s amortization and the remaining net book value.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <SamplePresetButton
            key={preset.label}
            label={preset.label}
            onClick={() => {
              setAssetName(preset.assetName);
              setCost(preset.cost);
              setRate(preset.rate);
              setErrors([]);
              setResult(null);
            }}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CalculatorField id="dep-asset" label="Asset name">
          <CalculatorTextInput
            id="dep-asset"
            value={assetName}
            onChange={setAssetName}
            placeholder="Vehicle"
          />
        </CalculatorField>
        <CalculatorField id="dep-cost" label="Cost ($)" hint="Original purchase price">
          <CalculatorTextInput
            id="dep-cost"
            value={cost}
            onChange={setCost}
            placeholder="30000"
            inputMode="decimal"
          />
        </CalculatorField>
        <CalculatorField id="dep-rate" label="Depreciation rate (%)" hint="Annual rate for this simulation">
          <CalculatorTextInput
            id="dep-rate"
            value={rate}
            onChange={setRate}
            placeholder="30"
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
                label: "Amortization amount",
                value: formatCentsForMessage((result ?? output)!.amortizationAmountCents),
              },
              {
                label: "Net book value",
                value: formatCentsForMessage((result ?? output)!.netBookValueCents),
              },
            ]}
          />
          <JournalEntryPreview entry={(result ?? output)!.journalEntry} />
        </div>
      )}
    </div>
  );
}
