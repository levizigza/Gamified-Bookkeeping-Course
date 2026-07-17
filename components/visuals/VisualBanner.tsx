import { ConceptVisual, type ConceptVisualVariant } from "@/components/visuals/ConceptVisual";

type VisualBannerProps = {
  variant: ConceptVisualVariant;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function VisualBanner({
  variant,
  eyebrow,
  title,
  description,
  className = "",
}: VisualBannerProps) {
  return (
    <section
      className={`visual-banner relative mb-8 overflow-hidden rounded-3xl border border-ledger-200/70 bg-gradient-to-br from-white via-ledger-50 to-ledger-100/70 px-6 py-7 shadow-card sm:px-8 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(245,200,66,.18),transparent_35%)]" />
      <div className="relative z-10 max-w-[62%] sm:max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ledger-500">{eyebrow}</p>
        <h1 className="mt-2 text-balance text-2xl font-bold text-ledger-950 sm:text-3xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ledger-600 sm:text-base">{description}</p>
      </div>
      <div className="absolute -bottom-8 -right-8 h-44 w-52 sm:-bottom-14 sm:right-2 sm:h-60 sm:w-72">
        <ConceptVisual variant={variant} className="h-full w-full" />
      </div>
    </section>
  );
}
