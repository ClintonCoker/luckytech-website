import type { DeviceStyle } from "@/content/products";

interface Props {
  style: DeviceStyle;
  tint: [string, string];
  id: string;
  /** "back" shows the cameras; "front" shows a lit screen. */
  view?: "back" | "front";
  pro?: boolean;
  className?: string;
}

const lens = (cx: number, cy: number, r: number, key: string | number) => (
  <g key={key}>
    <circle cx={cx} cy={cy} r={r} fill="#0b0d10" stroke="rgba(255,255,255,0.28)" strokeWidth={r * 0.18} />
    <circle cx={cx} cy={cy} r={r * 0.62} fill="url(#lensGlass)" />
    <circle cx={cx - r * 0.25} cy={cy - r * 0.28} r={r * 0.16} fill="rgba(255,255,255,0.55)" />
  </g>
);

const flash = (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r} fill="#f4ecd2" opacity={0.9} />;

/**
 * Clean product illustration drawn in the product's colours.
 * Used until a real photo is added for a product.
 */
export function DeviceArt({ style, tint, id, view = "back", pro = false, className }: Props) {
  const [c1, c2] = tint;
  const gid = `g-${id}-${view}`;
  const sid = `s-${id}-${view}`;

  if (style === "tablet") {
    return (
      <svg viewBox="0 0 320 420" className={className} role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
          <linearGradient id={sid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0f7a3a" />
            <stop offset="0.5" stopColor="#0b2a4a" />
            <stop offset="1" stopColor="#e3192c" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="300" height="400" rx="30" fill={`url(#${gid})`} />
        <rect x="24" y="24" width="272" height="372" rx="18" fill={`url(#${sid})`} />
        <circle cx="160" cy="17" r="3" fill="#0b0d10" />
        <path d="M24 300 Q 120 220 296 260 L296 378 Q296 396 278 396 L42 396 Q24 396 24 378 Z" fill="rgba(255,255,255,0.08)" />
        <rect x="10" y="10" width="300" height="400" rx="30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      </svg>
    );
  }

  if (style === "keypad") {
    return (
      <svg viewBox="0 0 200 400" className={className} role="img" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c2} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
          <linearGradient id={sid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1fbd5b" />
            <stop offset="1" stopColor="#063d1e" />
          </linearGradient>
        </defs>
        <rect x="20" y="10" width="160" height="380" rx="34" fill={`url(#${gid})`} />
        <rect x="40" y="40" width="120" height="110" rx="10" fill={`url(#${sid})`} />
        <rect x="40" y="40" width="120" height="110" rx="10" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3" />
        <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="26" fontFamily="system-ui" fontWeight="700">12:45</text>
        <rect x="58" y="168" width="84" height="34" rx="17" fill="rgba(0,0,0,0.35)" />
        <circle cx="100" cy="185" r="9" fill="rgba(255,255,255,0.35)" />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={42 + (i % 3) * 40} y={220 + Math.floor(i / 3) * 38} width="34" height="28" rx="12" fill="rgba(255,255,255,0.18)" />
        ))}
        <rect x="20" y="10" width="160" height="380" rx="34" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
      </svg>
    );
  }

  const W = 200;
  const H = 410;
  const rx = style === "iphone" ? 38 : 30;

  const back = () => {
    switch (style) {
      case "iphone":
        return (
          <>
            <rect x="22" y="22" width="84" height="88" rx="24" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.25)" />
            {pro ? [lens(48, 46, 15, 1), lens(48, 86, 15, 2), lens(84, 66, 15, 3)] : [lens(46, 47, 15, 1), lens(82, 85, 15, 2)]}
            {flash(86, 40, 5)}
          </>
        );
      case "galaxy-s":
        return pro ? (
          <>
            {[42, 82, 122].map((y, i) => lens(44, y, 16, i))}
            {lens(84, 62, 9, 4)}
            {flash(84, 92, 5)}
          </>
        ) : (
          <>
            <rect x="22" y="22" width="64" height="118" rx="22" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" />
            {[48, 82, 114].map((y, i) => lens(46, y, 13, i))}
            {flash(74, 48, 4)}
          </>
        );
      case "galaxy-a":
        return (
          <>
            {[44, 80, 116].map((y, i) => lens(44, y, 13, i))}
            {flash(74, 44, 4)}
          </>
        );
      case "redmi":
        return (
          <>
            <rect x="20" y="20" width="96" height="96" rx="22" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.22)" />
            {lens(48, 48, 17, 1)}
            {lens(48, 92, 12, 2)}
            {lens(88, 48, 9, 3)}
            {flash(88, 88, 5)}
          </>
        );
      case "infinix":
        return (
          <>
            <rect x="20" y="20" width="104" height="104" rx="30" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" />
            {lens(50, 50, 18, 1)}
            {lens(94, 50, 11, 2)}
            {lens(50, 96, 11, 3)}
            {flash(94, 94, 6)}
          </>
        );
      case "tecno":
        return (
          <>
            <circle cx={W / 2} cy="80" r="60" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            {lens(W / 2 - 22, 62, 16, 1)}
            {lens(W / 2 + 22, 62, 16, 2)}
            {lens(W / 2, 102, 13, 3)}
            {flash(W / 2 + 34, 104, 5)}
          </>
        );
      case "itel":
      default:
        return (
          <>
            <rect x="22" y="22" width="56" height="92" rx="18" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.22)" />
            {lens(50, 48, 14, 1)}
            {lens(50, 88, 10, 2)}
            {flash(70, 104, 4)}
          </>
        );
    }
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-hidden="true">
      <defs>
        <radialGradient id="lensGlass" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#3b5a7a" />
          <stop offset="0.5" stopColor="#11161d" />
          <stop offset="1" stopColor="#050608" />
        </radialGradient>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={sid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#19a84f" />
          <stop offset="0.45" stopColor="#0b2f4f" />
          <stop offset="1" stopColor="#e3192c" />
        </linearGradient>
        <linearGradient id={`${gid}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(255,255,255,0)" />
          <stop offset="0.45" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="0.6" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Frame */}
      <rect x="4" y="4" width={W - 8} height={H - 8} rx={rx + 2} fill={c2} />
      {view === "front" ? (
        <>
          <rect x="10" y="10" width={W - 20} height={H - 20} rx={rx - 4} fill="#050608" />
          <rect x="16" y="16" width={W - 32} height={H - 32} rx={rx - 8} fill={`url(#${sid})`} />
          {style === "iphone" ? <rect x={W / 2 - 30} y="26" width="60" height="18" rx="9" fill="#050608" /> : <circle cx={W / 2} cy="34" r="7" fill="#050608" />}
          <text x={W / 2} y="120" textAnchor="middle" fill="#fff" fontSize="44" fontFamily="system-ui" fontWeight="300">9:41</text>
          <path d={`M16 ${H - 140} Q ${W / 2} ${H - 220} ${W - 16} ${H - 160} L ${W - 16} ${H - 30} Q ${W - 16} ${H - 16} ${W - 30} ${H - 16} L 30 ${H - 16} Q 16 ${H - 16} 16 ${H - 30} Z`} fill="rgba(255,255,255,0.08)" />
        </>
      ) : (
        <>
          <rect x="8" y="8" width={W - 16} height={H - 16} rx={rx - 2} fill={`url(#${gid})`} />
          {back()}
        </>
      )}
      <rect x="8" y="8" width={W - 16} height={H - 16} rx={rx - 2} fill={`url(#${gid}-sheen)`} />
      <rect x="4" y="4" width={W - 8} height={H - 8} rx={rx + 2} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    </svg>
  );
}

export const isPro = (slug: string) => /pro|ultra|plus/.test(slug);
