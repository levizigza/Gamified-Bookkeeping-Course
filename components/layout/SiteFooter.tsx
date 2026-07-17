import Link from "next/link";

const footerLinks = [
  { href: "/board", label: "Board" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/games", label: "Games" },
  { href: "/reports", label: "Reports" },
  { href: "/tools", label: "Tools" },
  { href: "/profile", label: "Profile" },
  { href: "/certificate", label: "Certificate" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ledger-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-ledger-800">Ledger Quest</p>
          <p className="text-xs text-ledger-500">Bookkeeping for business owners</p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ledger-600 transition-colors hover:text-ledger-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
