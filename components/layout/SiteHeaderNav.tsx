"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_SYMBOLS, type NavSymbolId } from "@/components/navigation/NavSymbols";
import { playSound } from "@/lib/audio/soundEngine";

type NavLink = {
  href: string;
  symbolId: NavSymbolId;
};

const navLinks: NavLink[] = [
  { href: "/dashboard", symbolId: "dashboard" },
  { href: "/games", symbolId: "games" },
  { href: "/games/arcade", symbolId: "arcade" },
  { href: "/reports", symbolId: "reports" },
  { href: "/tools", symbolId: "tools" },
  { href: "/profile", symbolId: "profile" },
];

function NavLinkItem({
  href,
  symbolId,
  active,
  onClick,
}: NavLink & { active: boolean; onClick?: () => void }) {
  const config = NAV_SYMBOLS[symbolId];

  const handleClick = () => {
    playSound(symbolId === "games" ? "chaChing" : "navClick");
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-medium transition-all duration-200 sm:px-3 sm:py-2 ${
        active
          ? "bg-ledger-600 text-white shadow-sm"
          : "text-ledger-700 hover:bg-ledger-100 hover:text-ledger-900"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
          active ? "text-white" : "text-ledger-600"
        } ${config.outline} ${active ? "border-white/40 bg-white/20" : ""}`}
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <span className="hidden md:inline">{config.label}</span>
    </Link>
  );
}

export function SiteHeaderNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/games/arcade") return pathname.startsWith("/games/arcade");
    if (href === "/games") return pathname.startsWith("/games") && !pathname.startsWith("/games/arcade");
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-0.5 sm:flex"
      >
        {navLinks.map((link) => (
          <NavLinkItem
            key={link.href}
            {...link}
            active={isActive(link.href)}
          />
        ))}
      </nav>

      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ledger-200 bg-white text-ledger-700 sm:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => {
          playSound("navClick");
          setMenuOpen((open) => !open);
        }}
      >
        <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-16 border-b border-ledger-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:hidden animate-fade-in"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.href}
                {...link}
                active={isActive(link.href)}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
