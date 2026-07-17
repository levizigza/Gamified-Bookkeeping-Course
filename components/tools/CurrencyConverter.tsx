"use client";

import { useState, useMemo } from "react";
import type { ExchangeRates } from "@/lib/api/currency";
import { CURRENCY_LABELS, convertAmount } from "@/lib/api/currency";

type CurrencyConverterProps = {
  rates: ExchangeRates;
};

export function CurrencyConverter({ rates }: CurrencyConverterProps) {
  const [amountStr, setAmountStr] = useState("1000.00");
  const [targetCurrency, setTargetCurrency] = useState("USD");

  const amountCents = useMemo(() => {
    const parsed = parseFloat(amountStr);
    return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
  }, [amountStr]);

  const rate = rates.rates[targetCurrency] ?? 1;
  const convertedCents = convertAmount(amountCents, rate);

  const formatCurrency = (cents: number, currency: string) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);

  const allTargets = Object.keys(rates.rates).sort();

  return (
    <div className="card-surface p-6">
      <h3 className="mb-1 text-lg font-bold text-ledger-900">
        Currency Converter
      </h3>
      <p className="mb-5 text-sm text-ledger-600">
        See how Bright Path Consulting&apos;s Canadian dollars convert to other
        currencies. Useful when invoicing international clients or recording
        foreign transactions.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="conv-amount"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ledger-500"
          >
            Amount (CAD)
          </label>
          <input
            id="conv-amount"
            type="number"
            min="0"
            step="0.01"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="w-full rounded-lg border border-ledger-300 px-3 py-2 text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-1 focus:ring-ledger-500"
          />
        </div>

        <div>
          <label
            htmlFor="conv-target"
            className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ledger-500"
          >
            Convert to
          </label>
          <select
            id="conv-target"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="w-full rounded-lg border border-ledger-300 px-3 py-2 text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-1 focus:ring-ledger-500"
          >
            {allTargets.map((code) => (
              <option key={code} value={code}>
                {code} — {CURRENCY_LABELS[code] ?? code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-xs font-semibold uppercase tracking-wider text-ledger-500">
            Result
          </p>
          <p className="mt-1 text-2xl font-bold text-ledger-900">
            {formatCurrency(convertedCents, targetCurrency)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-ledger-200 bg-ledger-50/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ledger-500">
          All rates from CAD · {rates.date}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
          {allTargets.map((code) => (
            <div key={code} className="flex justify-between">
              <span className="font-medium text-ledger-700">{code}</span>
              <span className="tabular-nums text-ledger-600">
                {rates.rates[code].toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <p className="text-xs font-semibold text-amber-800">
          Bookkeeping tip
        </p>
        <p className="mt-1 text-sm text-amber-700">
          When recording a foreign payment, convert to CAD at the transaction
          date&apos;s rate. Any difference from the original invoice creates an
          exchange gain or loss — a separate line in your journal entry.
        </p>
      </div>
    </div>
  );
}
