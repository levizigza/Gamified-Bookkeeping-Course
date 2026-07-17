"use client";

type AccountingTypewriterProps = {
  className?: string;
  active?: boolean;
};

export function AccountingTypewriter({ className = "", active = true }: AccountingTypewriterProps) {
  return (
    <div
      className={`relative ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 80"
        className={`h-full w-full ${active ? "animate-typewriter-tap" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Machine body */}
        <rect x="8" y="20" width="72" height="44" rx="4" fill="#2d3748" stroke="#1a202c" strokeWidth="1.5" />
        <rect x="14" y="26" width="60" height="20" rx="2" fill="#1a202c" />
        {/* Keys */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={16 + i * 9}
            y="50"
            width="7"
            height="6"
            rx="1"
            fill="#4a5568"
            className={active ? "animate-key-press" : ""}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {/* Paper roll */}
        <rect x="52" y="8" width="28" height="16" rx="2" fill="#f7f0e0" stroke="#d4c9a8" strokeWidth="1" />
        {/* Receipt coming out */}
        <g className={active ? "animate-receipt-print" : ""}>
          <rect x="78" y="12" width="32" height="56" rx="1" fill="#fffef8" stroke="#e8e0cc" strokeWidth="1" />
          <line x1="82" y1="22" x2="106" y2="22" stroke="#bbddce" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="82" y1="30" x2="100" y2="30" stroke="#dceee6" strokeWidth="1.5" />
          <line x1="82" y1="38" x2="104" y2="38" stroke="#dceee6" strokeWidth="1.5" />
          <line x1="82" y1="46" x2="96" y2="46" stroke="#dceee6" strokeWidth="1.5" />
          <text x="82" y="58" fontSize="6" fill="#2d7057" fontFamily="monospace">$47.20</text>
        </g>
        {/* Bell */}
        <circle cx="72" cy="38" r="3" fill="#f5c842" className={active ? "animate-bell-ring" : ""} />
      </svg>
    </div>
  );
}
