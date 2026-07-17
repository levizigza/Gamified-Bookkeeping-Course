import type { ConsistencyRuleContent } from "@/lib/data/lessons";

type ConsistencyRuleProps = {
  rule: ConsistencyRuleContent;
};

export function ConsistencyRule({ rule }: ConsistencyRuleProps) {
  return (
    <aside
      className="rounded-2xl border-l-4 border-ledger-600 bg-ledger-100/60 p-5 sm:p-6"
      aria-label="Consistency rule"
    >
      <div className="flex gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ledger-600/10 text-xl"
          aria-hidden="true"
        >
          📌
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ledger-600">
            {rule.title ?? "Consistency Rule"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ledger-800">
            {rule.body}
          </p>
          <blockquote className="mt-3 rounded-lg bg-white/80 px-4 py-3 text-sm italic text-ledger-700">
            {rule.example}
          </blockquote>
        </div>
      </div>
    </aside>
  );
}
