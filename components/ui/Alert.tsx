import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<AlertVariant, string> = {
  info: "border-ledger-300 bg-ledger-50 text-ledger-800",
  success: "border-ledger-400 bg-ledger-50 text-ledger-800",
  warning: "border-amber-300 bg-amber-50 text-amber-900",
  error: "border-red-300 bg-red-50 text-red-900",
};

const iconMap: Record<AlertVariant, string> = {
  info: "ℹ️",
  success: "✓",
  warning: "⚠️",
  error: "✕",
};

export function Alert({
  variant = "info",
  title,
  children,
  className = "",
}: AlertProps) {
  return (
    <div
      role={variant === "error" || variant === "warning" ? "alert" : "status"}
      className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${variantClasses[variant]} ${className}`}
    >
      <span className="mt-0.5 shrink-0 text-base" aria-hidden="true">
        {iconMap[variant]}
      </span>
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
      </div>
    </div>
  );
}
