import { Heart, Wind, Soup, Droplet } from "lucide-react";

interface Organ {
  key: string;
  label: string;
  pct: number;
  icon: typeof Heart;
  // SVG coords on the figure (viewBox 200x500)
  x: number;
  y: number;
}

export function BodyDiagnosis({ score = 50 }: { score?: number }) {
  // Derive deterministic organ percentages from the latest risk score.
  const base = Math.max(40, Math.min(95, 100 - score));
  const organs: Organ[] = [
    { key: "heart", label: "Heart", pct: clamp(base + 5), icon: Heart, x: 110, y: 175 },
    { key: "lungs", label: "Lungs", pct: clamp(base + 15), icon: Wind, x: 95, y: 155 },
    { key: "stomach", label: "Stomach", pct: clamp(base - 30), icon: Soup, x: 102, y: 235 },
    { key: "liver", label: "Liver", pct: clamp(base - 5), icon: Droplet, x: 118, y: 220 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
      {/* Figure */}
      <div className="relative flex items-center justify-center rounded-2xl bg-gradient-mint p-4">
        <svg viewBox="0 0 200 500" className="h-72 w-auto md:h-80" aria-label="Anatomical figure">
          <defs>
            <linearGradient id="body" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.13 195)" />
              <stop offset="100%" stopColor="oklch(0.62 0.13 200)" />
            </linearGradient>
          </defs>
          {/* head */}
          <circle cx="100" cy="50" r="30" fill="url(#body)" />
          {/* neck */}
          <rect x="92" y="78" width="16" height="14" fill="url(#body)" />
          {/* torso */}
          <path
            d="M60 95 Q100 85 140 95 L150 220 Q140 260 130 290 L115 295 L110 250 L100 250 L90 250 L85 295 L70 290 Q60 260 50 220 Z"
            fill="url(#body)"
          />
          {/* arms */}
          <path d="M60 100 Q35 140 30 200 Q28 240 35 270 L48 268 Q44 235 48 200 Q55 150 70 115 Z" fill="url(#body)" />
          <path d="M140 100 Q165 140 170 200 Q172 240 165 270 L152 268 Q156 235 152 200 Q145 150 130 115 Z" fill="url(#body)" />
          {/* legs */}
          <path d="M70 290 L62 420 L70 460 L88 460 L92 420 L96 300 Z" fill="url(#body)" />
          <path d="M130 290 L138 420 L130 460 L112 460 L108 420 L104 300 Z" fill="url(#body)" />

          {/* connector dots + lines */}
          {organs.map((o) => (
            <g key={o.key}>
              <line
                x1={o.x}
                y1={o.y}
                x2={o.x > 100 ? 195 : 5}
                y2={o.y}
                stroke="oklch(0.75 0.08 75)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <circle cx={o.x} cy={o.y} r="4" fill="oklch(1 0 0)" stroke="oklch(0.58 0.13 200)" strokeWidth="2" />
            </g>
          ))}
        </svg>
      </div>

      {/* Organ cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {organs.map((o) => (
          <div
            key={o.key}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <o.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{o.label}</p>
                <span className="text-xs font-semibold text-foreground/80">{o.pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                  style={{ width: `${o.pct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(10, Math.min(99, Math.round(n)));
}
