"use client";

import Link from "next/link";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <Alert variant="error" title="Something went wrong" className="text-left">
        <p>
          We could not load this page. Your progress is saved locally — try again
          or return to the dashboard.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mt-2 font-mono text-xs opacity-80">{error.message}</p>
        )}
      </Alert>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
