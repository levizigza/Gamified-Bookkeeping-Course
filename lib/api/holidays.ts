export type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties: string[] | null;
};

/** Alberta-relevant holidays aligned with Bright Path's June 2024 story + nearby dates. */
export const FALLBACK_CANADIAN_HOLIDAYS: Holiday[] = [
  {
    date: "2024-05-20",
    localName: "Victoria Day",
    name: "Victoria Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2024-07-01",
    localName: "Canada Day",
    name: "Canada Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2024-08-05",
    localName: "Heritage Day",
    name: "Heritage Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB"],
  },
  {
    date: "2024-09-02",
    localName: "Labour Day",
    name: "Labour Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2024-10-14",
    localName: "Thanksgiving",
    name: "Thanksgiving Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2024-11-11",
    localName: "Remembrance Day",
    name: "Remembrance Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2024-12-25",
    localName: "Christmas Day",
    name: "Christmas Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2025-01-01",
    localName: "New Year's Day",
    name: "New Year's Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2025-02-17",
    localName: "Family Day",
    name: "Family Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB"],
  },
  {
    date: "2025-04-18",
    localName: "Good Friday",
    name: "Good Friday",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2025-05-19",
    localName: "Victoria Day",
    name: "Victoria Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2025-07-01",
    localName: "Canada Day",
    name: "Canada Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2026-01-01",
    localName: "New Year's Day",
    name: "New Year's Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2026-02-16",
    localName: "Family Day",
    name: "Family Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB"],
  },
  {
    date: "2026-04-03",
    localName: "Good Friday",
    name: "Good Friday",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2026-05-18",
    localName: "Victoria Day",
    name: "Victoria Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2026-07-01",
    localName: "Canada Day",
    name: "Canada Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2026-09-07",
    localName: "Labour Day",
    name: "Labour Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
  {
    date: "2026-10-12",
    localName: "Thanksgiving",
    name: "Thanksgiving Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-ON", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2026-11-11",
    localName: "Remembrance Day",
    name: "Remembrance Day",
    countryCode: "CA",
    global: false,
    counties: ["CA-AB", "CA-BC", "CA-SK", "CA-MB", "CA-NB", "CA-NS", "CA-PE", "CA-NL", "CA-YT", "CA-NT", "CA-NU"],
  },
  {
    date: "2026-12-25",
    localName: "Christmas Day",
    name: "Christmas Day",
    countryCode: "CA",
    global: true,
    counties: null,
  },
];

export async function fetchCanadianHolidays(
  year: number = new Date().getFullYear(),
): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/CA`,
      { next: { revalidate: 86_400 } },
    );

    if (!res.ok) throw new Error(`Nager.Date API returned ${res.status}`);

    const data = (await res.json()) as Holiday[];
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Empty holidays payload");
    }
    return data;
  } catch {
    return FALLBACK_CANADIAN_HOLIDAYS.filter((h) => h.date.startsWith(String(year))).concat(
      FALLBACK_CANADIAN_HOLIDAYS.filter((h) => !h.date.startsWith(String(year))).slice(0, 8),
    );
  }
}

export function getUpcomingHolidays(holidays: Holiday[], count: number = 5): Holiday[] {
  const today = new Date().toISOString().slice(0, 10);
  const albertaRelevant = holidays.filter(
    (h) => isAlbertaHoliday(h) && (h.global || h.counties?.includes("CA-AB")),
  );
  const pool = albertaRelevant.length > 0 ? albertaRelevant : holidays;
  const upcoming = pool.filter((h) => h.date >= today);
  if (upcoming.length > 0) return upcoming.slice(0, count);

  // Course story is June 2024 — show story-month holidays when "today" is past the list.
  return pool.filter((h) => h.date >= "2024-06-01").slice(0, count);
}

export function isAlbertaHoliday(holiday: Holiday): boolean {
  return holiday.global || (holiday.counties?.includes("CA-AB") ?? false);
}

export function formatHolidayDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
