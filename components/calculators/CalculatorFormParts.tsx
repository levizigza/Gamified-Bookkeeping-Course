import type { ReactNode } from "react";

const inputClassName =
  "w-full rounded-xl border border-ledger-300 px-4 py-2.5 text-ledger-900 focus:border-ledger-500 focus:outline-none focus:ring-2 focus:ring-ledger-200";

const labelClassName = "mb-1.5 block text-sm font-medium text-ledger-700";

export function CalculatorField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-ledger-500">{hint}</p>}
    </div>
  );
}

export function CalculatorTextInput({
  id,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "numeric" | "text";
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className={inputClassName}
    />
  );
}

export function CalculatorResults({
  rows,
}: {
  rows: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-xl bg-ledger-100 px-4 py-3">
          <dt className="text-xs font-medium text-ledger-600">{row.label}</dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-ledger-900">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CalculatorErrors({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <ul className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}

export function SamplePresetButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-ledger-200 bg-white px-3 py-1.5 text-xs font-medium text-ledger-700 hover:border-ledger-400 hover:bg-ledger-50"
    >
      {label}
    </button>
  );
}
