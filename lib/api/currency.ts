export type ExchangeRates = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP", "MXN", "JPY", "AUD", "INR", "CHF"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<string, string> = {
  CAD: "Canadian Dollar",
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  MXN: "Mexican Peso",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  INR: "Indian Rupee",
  CHF: "Swiss Franc",
};

/** Offline snapshot so Tools never blanks during demos. */
export const FALLBACK_EXCHANGE_RATES: ExchangeRates = {
  base: "CAD",
  date: "2024-06-28",
  rates: {
    USD: 0.73,
    EUR: 0.68,
    GBP: 0.58,
    MXN: 13.2,
    JPY: 117.5,
    AUD: 1.1,
    INR: 61.0,
    CHF: 0.66,
  },
};

export async function fetchExchangeRates(
  base: string = "CAD",
  targets: string[] = [...SUPPORTED_CURRENCIES],
): Promise<ExchangeRates> {
  try {
    const to = targets.join(",");
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${base}&to=${to}`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok) throw new Error(`Frankfurter API returned ${res.status}`);

    const data = (await res.json()) as ExchangeRates;
    if (!data?.rates || Object.keys(data.rates).length === 0) {
      throw new Error("Empty rates payload");
    }
    return data;
  } catch {
    return {
      ...FALLBACK_EXCHANGE_RATES,
      base,
      rates: Object.fromEntries(
        targets.map((code) => [code, FALLBACK_EXCHANGE_RATES.rates[code] ?? 1]),
      ),
    };
  }
}

export function convertAmount(amountCents: number, rate: number): number {
  return Math.round(amountCents * rate);
}
