"use client";

import { usePathname } from "next/navigation";
import { ConceptVisual, type ConceptVisualVariant } from "@/components/visuals/ConceptVisual";

function routeVariant(pathname: string): ConceptVisualVariant {
  if (pathname.startsWith("/games")) return "arcade";
  if (pathname.startsWith("/reports")) return "reports";
  if (pathname.startsWith("/tools") || pathname.startsWith("/calculators")) return "tools";
  if (pathname.startsWith("/profile") || pathname.startsWith("/certificate")) return "profile";
  if (pathname.includes("year-end")) return "boss";
  if (pathname.startsWith("/challenges") || pathname.startsWith("/lessons")) return "sorter";
  return "ledger";
}

export function SiteAtmosphere() {
  const pathname = usePathname();
  const variant = routeVariant(pathname);
  const quietReadingPage =
    pathname.startsWith("/lessons") || pathname.startsWith("/challenges");

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-24 top-20 h-96 w-96 rounded-full bg-ledger-300/10 blur-3xl" />
      <div className="absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="accounting-grid absolute inset-0 opacity-[0.14]" />

      {!quietReadingPage && (
        <>
          <div className="absolute -right-16 top-[18%] hidden h-64 w-80 opacity-[0.075] xl:block">
            <ConceptVisual variant={variant} className="h-full w-full" />
          </div>

        </>
      )}
    </div>
  );
}
