type ConceptVisualVariant =
  | "ledger"
  | "sorter"
  | "reports"
  | "boss"
  | "arcade"
  | "tools"
  | "profile";

type ConceptVisualProps = {
  variant: ConceptVisualVariant;
  className?: string;
};

const palette: Record<ConceptVisualVariant, [string, string, string]> = {
  ledger: ["#3d8c6d", "#f5c842", "#dceee6"],
  sorter: ["#7c5cc4", "#e8b020", "#eee8ff"],
  reports: ["#3977b8", "#3d8c6d", "#e0efff"],
  boss: ["#b54e58", "#f5c842", "#ffe5e8"],
  arcade: ["#8354c7", "#3d8c6d", "#f5c842"],
  tools: ["#2d7057", "#5b8fc7", "#e5f5ef"],
  profile: ["#c99212", "#3d8c6d", "#fff4cc"],
};

export function ConceptVisual({ variant, className = "" }: ConceptVisualProps) {
  const [primary, accent, pale] = palette[variant];
  const id = `visual-${variant}`;

  return (
    <svg
      viewBox="0 0 240 180"
      className={className}
      role="img"
      aria-label={`${variant} accounting illustration`}
    >
      <defs>
        <linearGradient id={`${id}-surface`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={pale} />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#0e221b" floodOpacity=".18" />
        </filter>
      </defs>

      <ellipse cx="120" cy="154" rx="82" ry="13" fill="#0e221b" opacity=".08" />
      <g className="visual-float" filter={`url(#${id}-shadow)`}>
        <rect x="45" y="27" width="150" height="118" rx="20" fill={`url(#${id}-surface)`} />
        <rect x="45" y="27" width="150" height="17" rx="12" fill={primary} opacity=".9" />
        <circle cx="59" cy="35.5" r="3" fill="#fff" opacity=".8" />
        <circle cx="69" cy="35.5" r="3" fill="#fff" opacity=".5" />

        {variant === "ledger" && (
          <>
            <rect x="67" y="58" width="106" height="67" rx="7" fill="#fff" stroke={primary} strokeWidth="2" />
            {[0, 1, 2, 3].map((row) => (
              <g key={row}>
                <line x1="76" y1={72 + row * 14} x2="164" y2={72 + row * 14} stroke={pale} strokeWidth="5" />
                <circle cx={82 + row * 20} cy={72 + row * 14} r="3.5" fill={row % 2 ? accent : primary} />
              </g>
            ))}
            <path d="M154 54l9 0 0 9" stroke={accent} strokeWidth="3" />
          </>
        )}

        {variant === "sorter" && (
          <>
            {[0, 1, 2].map((column) => (
              <rect key={column} x={61 + column * 42} y="63" width="34" height="58" rx="7" fill={column === 1 ? pale : "#fff"} stroke={primary} strokeWidth="2" />
            ))}
            {[0, 1, 2, 3].map((card) => (
              <g key={card} className={`visual-sort-card visual-delay-${card}`}>
                <rect x={67 + (card % 3) * 42} y={70 + (card % 2) * 25} width="22" height="15" rx="3" fill={card % 2 ? accent : primary} />
                <line x1={71 + (card % 3) * 42} y1={76 + (card % 2) * 25} x2={84 + (card % 3) * 42} y2={76 + (card % 2) * 25} stroke="#fff" strokeWidth="2" />
              </g>
            ))}
          </>
        )}

        {variant === "reports" && (
          <>
            {[0.35, 0.58, 0.76, 1].map((height, index) => (
              <rect key={height} x={67 + index * 24} y={120 - height * 52} width="15" height={height * 52} rx="4" fill={index === 3 ? accent : primary} opacity={0.55 + index * 0.13} />
            ))}
            <path d="M64 108C88 94 97 101 116 79s34-16 55-35" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" className="visual-chart-line" />
            <circle cx="171" cy="44" r="5" fill={accent} />
          </>
        )}

        {variant === "boss" && (
          <>
            <path d="M120 53l42 16v25c0 24-18 38-42 45-24-7-42-21-42-45V69z" fill={primary} />
            <path d="M99 91l14 14 29-32" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M82 61l-9-13m85 13 9-13" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          </>
        )}

        {variant === "arcade" && (
          <>
            <rect x="73" y="57" width="94" height="66" rx="22" fill={primary} />
            <circle cx="101" cy="91" r="17" fill="#fff" opacity=".18" />
            <path d="M91 91h20m-10-10v20" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <circle cx="140" cy="84" r="6" fill={accent} />
            <circle cx="151" cy="98" r="6" fill="#fff" opacity=".8" />
            <path d="M88 120l-9 14m73-14 9 14" stroke={primary} strokeWidth="7" strokeLinecap="round" />
          </>
        )}

        {variant === "tools" && (
          <>
            <circle cx="104" cy="90" r="31" fill={pale} stroke={primary} strokeWidth="7" />
            <path d="M126 112l31 27" stroke={primary} strokeWidth="12" strokeLinecap="round" />
            <path d="M90 91h28m-14-14v28" stroke={accent} strokeWidth="6" strokeLinecap="round" />
            <circle cx="159" cy="62" r="15" fill={accent} />
            <text x="159" y="68" textAnchor="middle" fill="#1b3c31" fontSize="18" fontWeight="800">$</text>
          </>
        )}

        {variant === "profile" && (
          <>
            <path d="M120 55l12 22 25 4-18 18 4 25-23-12-23 12 4-25-18-18 25-4z" fill={accent} />
            <circle cx="120" cy="91" r="13" fill="#fff" opacity=".85" />
            <path d="M98 137h44" stroke={primary} strokeWidth="8" strokeLinecap="round" />
            <path d="M108 113v24m24-24v24" stroke={primary} strokeWidth="5" />
          </>
        )}
      </g>

      <circle cx="37" cy="60" r="6" fill={accent} className="visual-orbit visual-delay-1" />
      <rect x="192" y="104" width="11" height="11" rx="3" fill={primary} className="visual-orbit visual-delay-2" />
      <path d="M33 126l5 9 10 1-7 7 2 10-10-5-9 5 2-10-7-7 10-1z" fill={accent} opacity=".7" className="visual-orbit visual-delay-3" />
    </svg>
  );
}

export type { ConceptVisualVariant };
