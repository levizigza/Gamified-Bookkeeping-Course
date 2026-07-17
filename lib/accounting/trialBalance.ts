import type {
  AccountType,
  JournalEntry,
  TrialBalance,
  TrialBalanceRow,
  ValidationError,
} from "@/lib/types/accounting";
import type { ChartAccount } from "@/lib/data/chartOfAccounts";
import type { JournalEntryLike } from "@/lib/accounting/journalValidation";
import {
  formatCentsForMessage,
  getLineCreditCents,
  getLineDebitCents,
  isBalanced,
} from "@/lib/accounting/journalValidation";

/** Running totals for one account before netting to TB columns. */
export type AccountBalance = {
  accountId: string;
  totalDebitsCents: number;
  totalCreditsCents: number;
  /** Positive = net debit, negative = net credit. */
  netCents: number;
};

export type FormattedTrialBalanceRow = TrialBalanceRow & {
  debitDisplay: string;
  creditDisplay: string;
  hasActivity: boolean;
  /** True when balance is on the unusual side for this account type. */
  isAbnormalBalance: boolean;
  abnormalExplanation?: string;
};

export type TrialBalanceValidationResult = {
  balanced: boolean;
  totalDebitsCents: number;
  totalCreditsCents: number;
  errors: ValidationError[];
  warnings: string[];
  abnormalRowCount: number;
  zeroActivityAccountCount: number;
};

export type GenerateTrialBalanceOptions = {
  asOfDate: string;
  /** Include accounts with no journal activity (default true). */
  includeZeroBalanceAccounts?: boolean;
};

export type GenerateTrialBalanceResult = {
  trialBalance: TrialBalance;
  warnings: string[];
  unbalancedEntryIds: string[];
  missingAccountIds: string[];
};

/** Account types that normally carry a debit balance. */
const DEBIT_NORMAL_TYPES: AccountType[] = ["asset", "expense"];

function isDebitNormalBalance(accountType: AccountType): boolean {
  return DEBIT_NORMAL_TYPES.includes(accountType);
}

function accountMap(chart: ChartAccount[]): Map<string, ChartAccount> {
  return new Map(chart.map((a) => [a.id, a]));
}

function netToTrialBalanceColumns(
  netCents: number,
): { debitCents: number; creditCents: number } {
  if (netCents > 0) {
    return { debitCents: netCents, creditCents: 0 };
  }
  if (netCents < 0) {
    return { debitCents: 0, creditCents: Math.abs(netCents) };
  }
  return { debitCents: 0, creditCents: 0 };
}

function isAbnormalBalance(
  accountType: AccountType,
  netCents: number,
): boolean {
  if (netCents === 0) return false;
  if (isDebitNormalBalance(accountType)) {
    return netCents < 0;
  }
  return netCents > 0;
}

function abnormalExplanation(
  accountName: string,
  accountType: AccountType,
): string {
  if (isDebitNormalBalance(accountType)) {
    return (
      `${accountName} normally has a debit balance (assets and expenses increase with debits). ` +
      `A credit balance here is unusual — review recent entries for errors.`
    );
  }
  return (
    `${accountName} normally has a credit balance (liabilities, equity, and income increase with credits). ` +
    `A debit balance here is unusual — review recent entries for errors.`
  );
}

/**
 * Sum debits and credits for one account across all journal entries.
 */
export function getAccountBalance(
  accountId: string,
  journalEntries: JournalEntryLike[],
): AccountBalance {
  let totalDebitsCents = 0;
  let totalCreditsCents = 0;

  for (const entry of journalEntries) {
    for (const line of entry.lines) {
      if (line.accountId !== accountId) continue;
      totalDebitsCents += getLineDebitCents(line);
      totalCreditsCents += getLineCreditCents(line);
    }
  }

  return {
    accountId,
    totalDebitsCents,
    totalCreditsCents,
    netCents: totalDebitsCents - totalCreditsCents,
  };
}

/**
 * Build a trial balance from posted journal entries and the chart of accounts.
 * Flags unbalanced entries and lines pointing to unknown accounts.
 */
export function generateTrialBalance(
  journalEntries: JournalEntryLike[],
  chartOfAccounts: ChartAccount[],
  options: GenerateTrialBalanceOptions,
): GenerateTrialBalanceResult {
  const accounts = accountMap(chartOfAccounts);
  const includeZero = options.includeZeroBalanceAccounts ?? true;
  const warnings: string[] = [];
  const unbalancedEntryIds: string[] = [];
  const missingAccountIds = new Set<string>();

  const balanceByAccount = new Map<string, AccountBalance>();

  for (const entry of journalEntries) {
    if (!isBalanced(entry)) {
      const id = entry.id ?? "unknown";
      unbalancedEntryIds.push(id);
      warnings.push(
        `Journal entry "${entry.description ?? id}" is out of balance and was skipped from totals. ` +
          `Fix the entry so debits equal credits before relying on this trial balance.`,
      );
      continue;
    }

    for (const line of entry.lines) {
      if (!accounts.has(line.accountId)) {
        missingAccountIds.add(line.accountId);
        warnings.push(
          `Line references unknown account id "${line.accountId}". ` +
            `Add it to your chart of accounts or correct the account on the journal line.`,
        );
        continue;
      }

      const existing = balanceByAccount.get(line.accountId) ?? {
        accountId: line.accountId,
        totalDebitsCents: 0,
        totalCreditsCents: 0,
        netCents: 0,
      };
      existing.totalDebitsCents += getLineDebitCents(line);
      existing.totalCreditsCents += getLineCreditCents(line);
      existing.netCents = existing.totalDebitsCents - existing.totalCreditsCents;
      balanceByAccount.set(line.accountId, existing);
    }
  }

  const rows: TrialBalanceRow[] = [];

  for (const chartAccount of chartOfAccounts) {
    if (!chartAccount.active) continue;

    const balance = balanceByAccount.get(chartAccount.id);
    const netCents = balance?.netCents ?? 0;
    const hasActivity = netCents !== 0;

    if (!hasActivity && !includeZero) continue;

    const { debitCents, creditCents } = netToTrialBalanceColumns(netCents);

    rows.push({
      accountId: chartAccount.id,
      accountCode: chartAccount.code,
      accountName: chartAccount.name,
      accountType: chartAccount.accountType,
      accountSubType: chartAccount.accountSubType,
      debitCents,
      creditCents,
    });
  }

  rows.sort((a, b) => a.accountCode.localeCompare(b.accountCode));

  const totalDebitsCents = rows.reduce((s, r) => s + r.debitCents, 0);
  const totalCreditsCents = rows.reduce((s, r) => s + r.creditCents, 0);

  return {
    trialBalance: {
      asOfDate: options.asOfDate,
      rows,
      totalDebitsCents,
      totalCreditsCents,
      balanced: totalDebitsCents === totalCreditsCents,
    },
    warnings,
    unbalancedEntryIds,
    missingAccountIds: [...missingAccountIds],
  };
}

/** Add display strings and abnormal-balance flags for UI rendering. */
export function formatTrialBalanceRows(
  rows: TrialBalanceRow[],
): FormattedTrialBalanceRow[] {
  return rows.map((row) => {
    const hasActivity = row.debitCents > 0 || row.creditCents > 0;
    const abnormal = isAbnormalBalance(
      row.accountType,
      row.debitCents - row.creditCents,
    );

    return {
      ...row,
      debitDisplay: row.debitCents > 0 ? formatCentsForMessage(row.debitCents) : "—",
      creditDisplay: row.creditCents > 0 ? formatCentsForMessage(row.creditCents) : "—",
      hasActivity,
      isAbnormalBalance: abnormal,
      abnormalExplanation: abnormal
        ? abnormalExplanation(row.accountName, row.accountType)
        : undefined,
    };
  });
}

/**
 * Validate a trial balance: totals must match and each row should have only one side filled.
 */
export function validateTrialBalance(
  rows: TrialBalanceRow[],
): TrialBalanceValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];
  let abnormalRowCount = 0;
  let zeroActivityAccountCount = 0;

  let totalDebitsCents = 0;
  let totalCreditsCents = 0;

  for (const row of rows) {
    totalDebitsCents += row.debitCents;
    totalCreditsCents += row.creditCents;

    const hasDebit = row.debitCents > 0;
    const hasCredit = row.creditCents > 0;

    if (!hasDebit && !hasCredit) {
      zeroActivityAccountCount++;
      continue;
    }

    if (hasDebit && hasCredit) {
      errors.push({
        code: "STATEMENT_IMBALANCE",
        message:
          `${row.accountName} has amounts in both debit and credit columns. ` +
          `A trial balance row should show the net balance on one side only.`,
        field: row.accountId,
      });
    }

    const net = row.debitCents - row.creditCents;
    if (isAbnormalBalance(row.accountType, net)) {
      abnormalRowCount++;
      warnings.push(abnormalExplanation(row.accountName, row.accountType));
    }
  }

  if (totalDebitsCents !== totalCreditsCents) {
    const diff = Math.abs(totalDebitsCents - totalCreditsCents);
    errors.push({
      code: "UNBALANCED",
      message:
        `This trial balance is out of balance by ${formatCentsForMessage(diff)}. ` +
        `Total debits are ${formatCentsForMessage(totalDebitsCents)} and total credits are ` +
        `${formatCentsForMessage(totalCreditsCents)}. Find and fix the underlying journal entries.`,
    });
  }

  return {
    balanced: errors.length === 0 && totalDebitsCents === totalCreditsCents,
    totalDebitsCents,
    totalCreditsCents,
    errors,
    warnings,
    abnormalRowCount,
    zeroActivityAccountCount,
  };
}

/**
 * Plain-language explanation of a trial balance for beginner business owners.
 */
export function explainTrialBalance(rows: TrialBalanceRow[]): string {
  const validation = validateTrialBalance(rows);
  const activeRows = rows.filter((r) => r.debitCents > 0 || r.creditCents > 0);

  if (activeRows.length === 0) {
    return (
      "This trial balance has no account activity yet. Post journal entries from your June " +
      "transactions first — then each account with a balance will appear here in either the " +
      "debit or credit column."
    );
  }

  const parts: string[] = [
    `This trial balance lists ${activeRows.length} account${activeRows.length === 1 ? "" : "s"} with activity. ` +
      `Each account shows its net balance in either the debit column or the credit column — not both.`,
    "Assets and expenses normally appear as debits. Liabilities, equity, and income normally appear as credits.",
  ];

  if (validation.balanced) {
    parts.push(
      `The report is balanced: total debits (${formatCentsForMessage(validation.totalDebitsCents)}) ` +
        `equal total credits (${formatCentsForMessage(validation.totalCreditsCents)}). ` +
        `That is your green light to build a Profit & Loss and Balance Sheet.`,
    );
  } else {
    parts.push(
      validation.errors[0]?.message ??
        "The debit and credit totals do not match — track down the error before preparing financial statements.",
    );
  }

  if (validation.zeroActivityAccountCount > 0) {
    parts.push(
      `${validation.zeroActivityAccountCount} account${validation.zeroActivityAccountCount === 1 ? "" : "s"} ` +
        `had no activity and show blank balances — that is normal for unused accounts.`,
    );
  }

  if (validation.abnormalRowCount > 0) {
    parts.push(
      `${validation.abnormalRowCount} account${validation.abnormalRowCount === 1 ? "" : "s"} ` +
        `have an unusual balance (on the wrong side for their type). Double-check those entries.`,
    );
  }

  return parts.join(" ");
}

/** Convenience: generate, format, and validate in one call. */
export function buildFormattedTrialBalance(
  journalEntries: JournalEntry[],
  chartOfAccounts: ChartAccount[],
  asOfDate: string,
): {
  formattedRows: FormattedTrialBalanceRow[];
  trialBalance: TrialBalance;
  validation: TrialBalanceValidationResult;
  explanation: string;
  generation: GenerateTrialBalanceResult;
} {
  const generation = generateTrialBalance(journalEntries, chartOfAccounts, {
    asOfDate,
    includeZeroBalanceAccounts: false,
  });
  const formattedRows = formatTrialBalanceRows(generation.trialBalance.rows);
  const validation = validateTrialBalance(generation.trialBalance.rows);
  const explanation = explainTrialBalance(generation.trialBalance.rows);

  return {
    formattedRows,
    trialBalance: generation.trialBalance,
    validation,
    explanation,
    generation,
  };
}
