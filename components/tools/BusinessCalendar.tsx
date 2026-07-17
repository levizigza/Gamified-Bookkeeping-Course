"use client";

import type { Holiday } from "@/lib/api/holidays";
import { formatHolidayDate, getUpcomingHolidays, isAlbertaHoliday } from "@/lib/api/holidays";

type BusinessCalendarProps = {
  holidays: Holiday[];
};

export function BusinessCalendar({ holidays }: BusinessCalendarProps) {
  const shown = getUpcomingHolidays(holidays, 8);

  return (
    <div className="card-surface p-6">
      <h3 className="mb-1 text-lg font-bold text-ledger-900">Canadian Business Calendar</h3>
      <p className="mb-5 text-sm text-ledger-600">
        Statutory holidays affect payroll, bank processing, and filing deadlines. Alberta dates are
        highlighted for Bright Path Consulting in Calgary.
      </p>

      {shown.length === 0 ? (
        <p className="text-center text-sm text-ledger-600">No holidays available right now.</p>
      ) : (
        <ul className="divide-y divide-ledger-100">
          {shown.map((h) => {
            const alberta = isAlbertaHoliday(h);
            return (
              <li
                key={`${h.date}-${h.localName}`}
                className={`flex items-start gap-4 py-3 ${alberta ? "" : "opacity-70"}`}
              >
                <div className="min-w-[5.5rem] text-right">
                  <p className="text-sm font-semibold tabular-nums text-ledger-900">
                    {formatHolidayDate(h.date)}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ledger-900">
                    {h.localName}
                    {alberta && (
                      <span className="ml-2 inline-block rounded-full bg-ledger-100 px-2 py-0.5 text-xs font-semibold text-ledger-700">
                        Alberta
                      </span>
                    )}
                    {h.global && (
                      <span className="ml-2 inline-block rounded-full bg-ledger-600 px-2 py-0.5 text-xs font-semibold text-white">
                        National
                      </span>
                    )}
                  </p>
                  {h.name !== h.localName && (
                    <p className="mt-0.5 text-xs text-ledger-500">{h.name}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-ledger-500">
        Tip: On holiday weeks, record bank fees and payroll still due — then reconcile when banks reopen.
      </p>
    </div>
  );
}
