import type { BossTipContent } from "@/lib/data/lessons";

type BossTipProps = {
  tip: BossTipContent;
};

export function BossTip({ tip }: BossTipProps) {
  return (
    <aside
      className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-gold-400/15 to-gold-400/5 p-5 sm:p-6"
      aria-label="Boss tip"
    >
      <div className="flex gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-xl"
          aria-hidden="true"
        >
          💡
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Boss Tip
          </p>
          {tip.title && (
            <h3 className="mt-1 text-base font-semibold text-ledger-900">
              {tip.title}
            </h3>
          )}
          <p className="mt-2 text-sm leading-relaxed text-ledger-700">
            {tip.body}
          </p>
        </div>
      </div>
    </aside>
  );
}
