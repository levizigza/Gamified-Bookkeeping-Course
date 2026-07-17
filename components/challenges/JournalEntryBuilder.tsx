"use client";

import { useMemo } from "react";
import { chartOfAccounts } from "@/lib/data/chartOfAccounts";
import {
  calculateCredits,
  calculateDebits,
  formatCentsForMessage,
  isBalanced,
} from "@/lib/accounting/journalValidation";
import type { BuilderJournalLine } from "@/lib/game/journalScoring";
import {
  builderLinesToJournalLines,
  formatCentsToDollarsInput,
  parseDollarsToCents,
} from "@/lib/game/journalScoring";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type JournalEntryBuilderProps = {
  lines: BuilderJournalLine[];
  onChange: (lines: BuilderJournalLine[]) => void;
  disabled?: boolean;
};

const sortedAccounts = [...chartOfAccounts]
  .filter((a) => a.active)
  .sort((a, b) => a.code.localeCompare(b.code));

export function JournalEntryBuilder({
  lines,
  onChange,
  disabled = false,
}: JournalEntryBuilderProps) {
  const journalLines = useMemo(
    () => builderLinesToJournalLines(lines),
    [lines],
  );
  const totalDebits = calculateDebits({ lines: journalLines });
  const totalCredits = calculateCredits({ lines: journalLines });
  const balanced = journalLines.length >= 2 && isBalanced({ lines: journalLines });
  const difference = Math.abs(totalDebits - totalCredits);

  const updateLine = (id: string, patch: Partial<BuilderJournalLine>) => {
    onChange(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id: string) => {
    if (lines.length <= 1) return;
    onChange(lines.filter((l) => l.id !== id));
  };

  const addLine = () => {
    onChange([
      ...lines,
      {
        id: crypto.randomUUID(),
        accountId: "",
        side: "debit",
        amountCents: 0,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ledger-800">Journal lines</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLine}
          disabled={disabled}
        >
          + Add line
        </Button>
      </div>

      <ul className="space-y-3">
        {lines.map((line, index) => (
          <li key={line.id}>
            <Card padding="sm" className="bg-ledger-50/50">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-ledger-500">
                  Line {index + 1}
                </span>
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    disabled={disabled}
                    className="text-xs text-ledger-500 hover:text-red-600 disabled:opacity-50"
                    aria-label={`Remove line ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`account-${line.id}`}
                    className="mb-1 block text-xs font-medium text-ledger-600"
                  >
                    Account
                  </label>
                  <select
                    id={`account-${line.id}`}
                    value={line.accountId}
                    onChange={(e) =>
                      updateLine(line.id, { accountId: e.target.value })
                    }
                    disabled={disabled}
                    className="w-full rounded-lg border border-ledger-300 bg-white px-3 py-2 text-sm focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-500/20 disabled:opacity-50"
                  >
                    <option value="">Select account…</option>
                    {sortedAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} — {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="mb-1 block text-xs font-medium text-ledger-600">
                    Side
                  </span>
                  <div className="flex gap-2">
                    {(["debit", "credit"] as const).map((side) => (
                      <label
                        key={side}
                        className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium capitalize transition-colors ${
                          line.side === side
                            ? "border-ledger-600 bg-ledger-600 text-white"
                            : "border-ledger-200 bg-white text-ledger-700 hover:border-ledger-300"
                        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`side-${line.id}`}
                          value={side}
                          checked={line.side === side}
                          onChange={() => updateLine(line.id, { side })}
                          className="sr-only"
                          disabled={disabled}
                        />
                        {side}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`amount-${line.id}`}
                    className="mb-1 block text-xs font-medium text-ledger-600"
                  >
                    Amount (CAD)
                  </label>
                  <input
                    id={`amount-${line.id}`}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={formatCentsToDollarsInput(line.amountCents)}
                    onChange={(e) =>
                      updateLine(line.id, {
                        amountCents: parseDollarsToCents(e.target.value),
                      })
                    }
                    disabled={disabled}
                    className="w-full rounded-lg border border-ledger-300 bg-white px-3 py-2 text-sm tabular-nums focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-500/20 disabled:opacity-50"
                  />
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {/* Live totals */}
      <BalanceIndicator
        totalDebits={totalDebits}
        totalCredits={totalCredits}
        balanced={balanced}
        difference={difference}
        lineCount={journalLines.length}
      />
    </div>
  );
}

type BalanceIndicatorProps = {
  totalDebits: number;
  totalCredits: number;
  balanced: boolean;
  difference: number;
  lineCount: number;
};

export function BalanceIndicator({
  totalDebits,
  totalCredits,
  balanced,
  difference,
  lineCount,
}: BalanceIndicatorProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        balanced
          ? "border-ledger-400 bg-ledger-50"
          : lineCount >= 2
            ? "border-amber-400 bg-amber-50"
            : "border-ledger-200 bg-white"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-ledger-500">Total debits</span>
            <p className="font-bold tabular-nums text-ledger-900">
              {formatCentsForMessage(totalDebits)}
            </p>
          </div>
          <div>
            <span className="text-ledger-500">Total credits</span>
            <p className="font-bold tabular-nums text-ledger-900">
              {formatCentsForMessage(totalCredits)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${
              balanced
                ? "bg-ledger-600 text-white"
                : lineCount >= 2
                  ? "bg-amber-400 text-amber-950"
                  : "bg-ledger-200 text-ledger-600"
            }`}
            aria-hidden="true"
          >
            {balanced ? "✓" : lineCount >= 2 ? "!" : "—"}
          </span>
          <div>
            <p
              className={`text-sm font-semibold ${
                balanced
                  ? "text-ledger-700"
                  : lineCount >= 2
                    ? "text-amber-800"
                    : "text-ledger-600"
              }`}
            >
              {balanced
                ? "Entry balances"
                : lineCount < 2
                  ? "Add at least 2 lines"
                  : `Out of balance by ${formatCentsForMessage(difference)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
