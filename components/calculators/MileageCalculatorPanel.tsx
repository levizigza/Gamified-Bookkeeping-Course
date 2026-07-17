"use client";

import { useMemo, useState } from "react";
import {
  calculateMileageClaim,
  parseRatePerKmToCents,
  type MileageResult,
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

export function MileageCalculatorPanel() {
  const [totalKm, setTotalKm] = useState("35000");
  const [businessKm, setBusinessKm] = useState("25000");
  const [tierLimit, setTierLimit] = useState("5000");
  const [rateFirst, setRateFirst] = useState("0.68");
  const [rateRemaining, setRateRemaining] = useState("0.61");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<MileageResult | null>(null);

  const output = useMemo(() => {
    const total = Number(totalKm);
    const business = Number(businessKm);
    const limit = Number(tierLimit);
    const firstCents = parseRatePerKmToCents(rateFirst);
    const remainingCents = parseRatePerKmToCents(rateRemaining);
    if (
      !Number.isFinite(total) ||
      !Number.isFinite(business) ||
      !Number.isFinite(limit) ||
      firstCents === null ||
      remainingCents === null
    ) {
      return null;
    }

    const calculated = calculateMileageClaim({
      totalKilometers: total,
      businessKilometers: business,
      tierOneLimitKm: limit,
      rateFirstTierCentsPerKm: firstCents,
      rateRemainingTierCentsPerKm: remainingCents,
    });
    return calculated.ok ? calculated.value : null;
  }, [totalKm, businessKm, tierLimit, rateFirst, rateRemaining]);

  const loadSample = () => {
    setTotalKm("35000");
    setBusinessKm("25000");
    setTierLimit("5000");
    setRateFirst("0.68");
    setRateRemaining("0.61");
    setErrors([]);
    setResult(null);
  };

  const handleCalculate = () => {
    const total = Number(totalKm);
    const business = Number(businessKm);
    const limit = Number(tierLimit);
    const firstCents = parseRatePerKmToCents(rateFirst);
    const remainingCents = parseRatePerKmToCents(rateRemaining);

    if (firstCents === null || remainingCents === null) {
      setErrors(["Enter valid per-km rates (e.g. 0.68)."]);
      setResult(null);
      return;
    }

    const calculated = calculateMileageClaim({
      totalKilometers: total,
      businessKilometers: business,
      tierOneLimitKm: limit,
      rateFirstTierCentsPerKm: firstCents,
      rateRemainingTierCentsPerKm: remainingCents,
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
        Claim business kilometres using a two-tier per-km rate. Rates are editable
        because CRA allowance amounts change — always verify current published rates.
      </p>

      <SamplePresetButton label="Load course sample (25,000 business km)" onClick={loadSample} />

      <div className="grid gap-4 sm:grid-cols-2">
        <CalculatorField id="mi-total" label="Total kilometers (year)">
          <CalculatorTextInput
            id="mi-total"
            value={totalKm}
            onChange={setTotalKm}
            placeholder="30000"
            inputMode="numeric"
          />
        </CalculatorField>
        <CalculatorField id="mi-business" label="Business kilometers">
          <CalculatorTextInput
            id="mi-business"
            value={businessKm}
            onChange={setBusinessKm}
            placeholder="25000"
            inputMode="numeric"
          />
        </CalculatorField>
        <CalculatorField id="mi-limit" label="First-tier km limit" hint="Often 5,000 km in CRA examples">
          <CalculatorTextInput
            id="mi-limit"
            value={tierLimit}
            onChange={setTierLimit}
            placeholder="5000"
            inputMode="numeric"
          />
        </CalculatorField>
        <CalculatorField id="mi-rate-first" label="Rate — first tier ($/km)" hint="Editable; verify current CRA rates">
          <CalculatorTextInput
            id="mi-rate-first"
            value={rateFirst}
            onChange={setRateFirst}
            placeholder="0.68"
            inputMode="decimal"
          />
        </CalculatorField>
        <CalculatorField id="mi-rate-rest" label="Rate — remaining km ($/km)" hint="Editable; verify current CRA rates">
          <CalculatorTextInput
            id="mi-rate-rest"
            value={rateRemaining}
            onChange={setRateRemaining}
            placeholder="0.61"
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
                label: "First-tier amount",
                value: formatCentsForMessage((result ?? output)!.tierOneAmountCents),
              },
              {
                label: "Remaining km amount",
                value: formatCentsForMessage((result ?? output)!.remainingAmountCents),
              },
              {
                label: "Total mileage claim",
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
