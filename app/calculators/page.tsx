import { redirect } from "next/navigation";

export const metadata = {
  title: "Year-End Calculators — Ledger Quest",
};

/** Calculators now live on Tools so every nav tab has a clear job. */
export default function CalculatorsPage() {
  redirect("/tools#calculators");
}
