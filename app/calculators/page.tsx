"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/** Calculators live on Tools — client redirect keeps static export compatible. */
export default function CalculatorsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/tools#calculators");
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-ledger-600">Year-end calculators moved to Business Tools.</p>
      <Link href="/tools#calculators">
        <Button>Open calculators</Button>
      </Link>
    </div>
  );
}
