"use client";

type SaleStatus = "ready" | "posting" | "complete";

type VintageCalculatorIntroProps = {
  status: SaleStatus;
  onEnter: () => void;
};

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "00", "0", "."];

export function VintageCalculatorIntro({
  status,
  onEnter,
}: VintageCalculatorIntroProps) {
  const complete = status === "complete";

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#241b14] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(245,200,66,0.16),transparent_34%),linear-gradient(135deg,#3a291d_0%,#1b1510_48%,#10241d_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 47px, rgba(240,247,244,.12) 48px), repeating-linear-gradient(90deg, transparent 0 79px, rgba(240,247,244,.08) 80px)",
        }}
      />

      <div className="absolute left-[5%] top-[13%] hidden -rotate-6 rounded-xl border border-[#d6c49d]/30 bg-[#efe5c7]/90 p-5 text-[#294036] shadow-2xl lg:block">
        <p className="font-mono text-xs font-bold">BRIGHT PATH CONSULTING</p>
        <div className="mt-3 h-px bg-[#294036]/25" />
        <p className="mt-3 font-mono text-[11px]">June 2024 Sales Ledger</p>
        <p className="mt-1 font-mono text-[11px]">Invoice BP-0624-018</p>
        <p className="mt-4 font-mono text-sm font-bold">TOTAL&nbsp;&nbsp;&nbsp;$950.00</p>
      </div>

      <div className="relative z-10 flex min-h-full items-start justify-center px-3 pb-6 pt-14 sm:items-center sm:px-6 sm:pb-10 sm:pt-16 lg:py-10">
        <div className="grid w-full max-w-5xl items-center gap-2 sm:gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <header className="mx-auto max-w-md text-center lg:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gold-400 sm:text-[11px] sm:tracking-[0.28em]">
              Ledger Quest · June 2024
            </p>
            <h1 className="mt-1.5 text-balance text-xl font-black leading-tight text-white sm:mt-3 sm:text-5xl">
              Complete the first sale.
            </h1>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#d7ddd9] sm:mt-3 sm:text-base">
              Bright Path earned $904.76 and collected $45.24 of GST. The
              accounting calculator is ready to post the $950.00 total.
            </p>
            <div
              className={`mx-auto mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold transition-colors motion-reduce:transition-none sm:mt-5 sm:px-4 sm:py-2 sm:text-sm lg:mx-0 ${
                complete
                  ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-200"
                  : "border-gold-400/45 bg-gold-400/10 text-gold-300"
              }`}
              aria-live="polite"
            >
              <span aria-hidden="true">{complete ? "✓" : "↵"}</span>
              {status === "ready"
                ? "Press Enter"
                : status === "posting"
                  ? "Posting sale…"
                  : "Sale complete"}
            </div>
          </header>

          <div className="relative mx-auto w-full max-w-[min(100%,450px)]">
            <div
              className={`absolute left-1/2 top-0 w-[72%] -translate-x-1/2 rounded-t-lg border-x border-t border-[#b9aa85] bg-[#f3e9c9] px-3 py-2.5 text-[#263a31] shadow-lg transition-transform duration-700 motion-reduce:transition-none sm:w-[78%] sm:px-5 sm:py-4 ${
                complete
                  ? "-translate-y-[38%] sm:-translate-y-[44%]"
                  : "-translate-y-[18%] sm:-translate-y-[25%]"
              }`}
              aria-hidden="true"
            >
              <div className="flex justify-between font-mono text-[9px] font-bold sm:text-[10px]">
                <span>BRIGHT PATH</span>
                <span>06/30/24</span>
              </div>
              <div className="my-1.5 border-t border-dashed border-[#72684f]/50 sm:my-2" />
              <div className="space-y-0.5 font-mono text-[10px] sm:space-y-1 sm:text-[11px]">
                <p className="flex justify-between"><span>CONSULTING SALE</span><span>904.76</span></p>
                <p className="flex justify-between"><span>GST COLLECTED</span><span>45.24</span></p>
                <p className="flex justify-between font-black"><span>TOTAL</span><span>950.00</span></p>
                {complete && (
                  <p className="pt-1.5 text-center font-black tracking-widest text-[#276548] sm:pt-2">
                    *** POSTED ***
                  </p>
                )}
              </div>
            </div>

            <div className="relative mt-8 rounded-[1.5rem] border border-[#d3c39f]/60 bg-gradient-to-br from-[#ded2b5] via-[#b7aa8b] to-[#756952] p-1.5 shadow-[0_35px_90px_rgba(0,0,0,0.55)] sm:mt-16 sm:rounded-[2rem] sm:p-5">
              <div className="rounded-[1rem] border border-black/30 bg-[#39372f] p-2.5 shadow-inner sm:rounded-[1.25rem] sm:p-5">
                <div className="flex items-center justify-between gap-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#c9bea0] sm:text-[9px] sm:tracking-[0.18em]">
                  <span>Ledger 1200</span>
                  <span className="truncate">Accounting machine</span>
                </div>

                <div className="mt-1.5 rounded-lg border-4 border-[#25241f] bg-[#a9bd91] px-2.5 py-1.5 font-mono text-[#172519] shadow-[inset_0_3px_10px_rgba(0,0,0,0.45)] sm:mt-3 sm:px-4 sm:py-3">
                  <p className="text-[9px] font-bold tracking-wider sm:text-[10px]">
                    {complete ? "SALE COMPLETE" : status === "posting" ? "POSTING…" : "SALE TOTAL"}
                  </p>
                  <p className="mt-0.5 text-right text-xl font-black tracking-wider sm:mt-1 sm:text-4xl">
                    {complete ? "950.00 ✓" : "950.00"}
                  </p>
                </div>

                <div className="mt-2 grid grid-cols-[1fr_0.72fr] gap-1.5 sm:mt-4 sm:gap-3">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2" aria-hidden="true">
                    {KEYS.map((key) => (
                      <span
                        key={key}
                        className="flex min-h-7 items-center justify-center rounded-md border-b-4 border-[#181713] bg-[#eeeadc] font-mono text-[11px] font-black text-[#25241f] shadow sm:min-h-10 sm:text-sm"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-1 sm:gap-2">
                    <div className="grid grid-cols-2 gap-1 sm:gap-2" aria-hidden="true">
                      {["+", "−", "×", "÷"].map((key) => (
                        <span
                          key={key}
                          className="flex min-h-7 items-center justify-center rounded-md border-b-4 border-[#30372f] bg-[#748071] font-mono text-sm font-black text-white sm:min-h-10"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnter();
                      }}
                      disabled={status !== "ready"}
                      autoFocus
                      className={`min-h-14 rounded-lg border-b-[6px] px-2 font-mono text-sm font-black tracking-widest text-white shadow-lg transition-all motion-reduce:transition-none sm:min-h-20 sm:px-3 sm:text-lg ${
                        status === "ready"
                          ? "border-[#743529] bg-[#a94b3a] hover:translate-y-0.5 hover:border-b-4 hover:bg-[#bd5845] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                          : "border-[#315c49] bg-[#458267]"
                      }`}
                      aria-label="Press Enter to complete the sale"
                    >
                      {complete ? "POSTED ✓" : status === "posting" ? "POSTING" : "ENTER"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mx-auto mt-2 h-1.5 w-2/3 rounded-full bg-black/20 sm:mt-3 sm:h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
