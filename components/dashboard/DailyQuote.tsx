"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/api/quotes";

type DailyQuoteProps = {
  serverQuote: Quote;
};

export function DailyQuote({ serverQuote }: DailyQuoteProps) {
  const [quote, setQuote] = useState<Quote>(serverQuote);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setQuote(serverQuote);
    setVisible(true);
  }, [serverQuote]);

  if (!visible) return null;

  return (
    <aside
      aria-label="Daily inspiration"
      className="animate-fade-in card-surface mb-8 px-6 py-5"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ledger-400">
        Daily inspiration
      </p>
      <blockquote className="text-base leading-relaxed text-ledger-800 italic">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      <p className="mt-2 text-sm font-medium text-ledger-500">
        — {quote.author}
      </p>
    </aside>
  );
}
