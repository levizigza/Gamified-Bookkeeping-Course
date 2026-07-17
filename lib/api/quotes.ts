export type Quote = {
  text: string;
  author: string;
};

const FALLBACK_QUOTES: Quote[] = [
  { text: "Revenue is vanity, profit is sanity, cash is king.", author: "Business Proverb" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order.", author: "T.T. Munger" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Accounting is the language of business.", author: "Warren Buffett" },
  { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
];

export async function fetchDailyQuote(): Promise<Quote> {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      next: { revalidate: 86_400 },
    });

    if (!res.ok) throw new Error(`Quote API returned ${res.status}`);

    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : data;

    if (entry?.q && entry?.a) {
      return { text: entry.q, author: entry.a };
    }
    throw new Error("Unexpected quote format");
  } catch {
    const idx = new Date().getDate() % FALLBACK_QUOTES.length;
    return FALLBACK_QUOTES[idx];
  }
}
