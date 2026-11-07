import { useId } from "react";
import { cn } from "../utils/cn";

type Tone = "dark" | "light";

const palette = {
  dark: { text: "#4a2e1a", sub: "#3a2618", from: "#6f4322", to: "#b07c4c" },
  light: { text: "#f8f5f0", sub: "#efe7dc", from: "#b8895a", to: "#e2bf93" },
} as const;

/**
 * STAY logo, recreated as SVG from the brand artwork:
 * bronze Moroccan arch, serif "STAY" with a diamond inside the A,
 * "BY MY MARRAKECH TRIP", a diamond divider and the tagline.
 *
 * variant="full"  — stacked logo with byline, divider and tagline (footer, large uses)
 * variant="mark"  — arch + STAY only (navbar, small uses)
 */
export function StayLogo({
  variant = "full",
  tone = "dark",
  className,
  title = "STAY by My Marrakech Trip — Hospitality Commercial Management",
}: {
  variant?: "full" | "mark";
  tone?: Tone;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const c = palette[tone];
  const gradient = `url(#bronze-${id})`;
  const full = variant === "full";

  return (
    <svg
      viewBox={full ? "0 0 640 372" : "112 0 424 222"}
      className={cn("block", className)}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id={`bronze-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.from} />
          <stop offset="1" stopColor={c.to} />
        </linearGradient>
      </defs>

      {/* Arch with tapered wings */}
      <g fill={gradient}>
        <path d="M168 86 L272 82.5 L272 88 Z" />
        <path d="M472 86 L368 82.5 L368 88 Z" />
      </g>
      <path
        d="M273 86 V68 C273 46 293 34 309 24 C314 21 318 16 320 10 C322 16 326 21 331 24 C347 34 367 46 367 68 V86"
        fill="none"
        stroke={gradient}
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* STAY wordmark — S, T and Y set in Cinzel; A drawn without a crossbar */}
      <g fill={c.text} fontFamily="Cinzel, 'Trajan Pro', Georgia, serif" fontSize="132" fontWeight="500" textAnchor="middle">
        <text x="161" y="208">S</text>
        <text x="258" y="208">T</text>
        <text x="480" y="208">Y</text>
      </g>
      <g fill={c.text}>
        {/* thick right leg */}
        <path d="M357 112 H371 L420 204 H403 Z" />
        {/* hairline left leg */}
        <path d="M359 116 L362.5 122 L321 204 H316 Z" />
        {/* serifs */}
        <rect x="302" y="203" width="32" height="5" />
        <rect x="392" y="203" width="40" height="5" />
      </g>
      <path d="M366 166 L376 178 L366 190 L356 178 Z" fill={gradient} />

      {full && (
        <>
          <text
            x="324"
            y="262"
            textAnchor="middle"
            fill={c.sub}
            fontFamily="Cinzel, 'Trajan Pro', Georgia, serif"
            fontSize="30"
            letterSpacing="8"
          >
            BY MY MARRAKECH TRIP
          </text>
          <g fill={gradient}>
            <path d="M150 300 L306 298.6 L306 301.4 Z" />
            <path d="M490 300 L334 298.6 L334 301.4 Z" />
            <path d="M320 289 L331 300 L320 311 L309 300 Z" />
          </g>
          <text
            x="323"
            y="350"
            textAnchor="middle"
            fill={c.sub}
            fontFamily="Manrope, Arial, sans-serif"
            fontSize="17.5"
            fontWeight="500"
            letterSpacing="6"
          >
            HOSPITALITY COMMERCIAL MANAGEMENT
          </text>
        </>
      )}
    </svg>
  );
}

/** Arch + diamond icon (used for small decorative accents). */
export function ArchMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M9 34 V24 C9 16 15 12 20 8 C25 12 31 16 31 24 V34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M20 22 L23 25.5 L20 29 L17 25.5 Z" fill="currentColor" />
    </svg>
  );
}
