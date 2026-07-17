type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
  className?: string;
};

export function ProgressBar({
  current,
  total,
  label = "Challenge progress",
  className = "",
}: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-ledger-700">{label}</span>
        <span className="tabular-nums text-ledger-500">
          {current} of {total}
        </span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-ledger-100"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-ledger-600 to-ledger-400 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
