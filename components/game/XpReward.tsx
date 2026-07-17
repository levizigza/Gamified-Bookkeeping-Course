"use client";

import { useEffect, useState } from "react";

type XpRewardProps = {
  amount: number;
  show: boolean;
  className?: string;
};

export function XpReward({ amount, show, className = "" }: XpRewardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [show, amount]);

  if (!visible || amount <= 0) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="animate-xp-pop rounded-2xl border border-gold-500/40 bg-gold-400/20 px-6 py-3 shadow-lg shadow-gold-500/10 backdrop-blur-sm">
        <p className="text-center text-lg font-bold tabular-nums text-gold-600">
          +{amount} XP
        </p>
      </div>
    </div>
  );
}
