import { cn } from '@/lib/utils';

type RoutePatternProps = {
  className?: string;
};

export function RoutePattern({ className }: RoutePatternProps) {
  return (
    <svg
      className={cn('pointer-events-none select-none', className)}
      viewBox="0 0 1200 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="routeStroke" x1="120" y1="120" x2="1060" y2="620" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(var(--primary) / 0.0)" />
          <stop offset="0.22" stopColor="hsl(var(--primary) / 0.35)" />
          <stop offset="0.62" stopColor="hsl(var(--accent) / 0.22)" />
          <stop offset="1" stopColor="hsl(var(--accent) / 0.0)" />
        </linearGradient>
        <radialGradient id="nodeFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(560 360) rotate(90) scale(340 520)">
          <stop stopColor="hsl(var(--primary) / 0.22)" />
          <stop offset="0.55" stopColor="hsl(var(--accent) / 0.14)" />
          <stop offset="1" stopColor="hsl(var(--accent) / 0.0)" />
        </radialGradient>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 0.7 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft node field */}
      <g opacity="0.9">
        <path
          d="M84 148C264 96 402 168 520 226C652 292 744 278 860 236C988 190 1080 212 1140 288"
          stroke="url(#routeStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 16"
          className="route-dash"
        />
        <path
          d="M114 544C220 430 338 392 470 392C610 392 726 452 866 502C1004 552 1082 548 1162 522"
          stroke="url(#routeStroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 16"
          className="route-dash route-dash-slow"
        />
        <path
          d="M240 640C330 562 420 520 540 506C676 490 760 526 884 568C1014 614 1088 620 1146 602"
          stroke="url(#routeStroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="8 14"
          className="route-dash route-dash-fast"
        />
      </g>

      {/* Nodes */}
      <g filter="url(#softGlow)">
        {[
          { cx: 168, cy: 176, r: 3.5 },
          { cx: 312, cy: 140, r: 2.5 },
          { cx: 528, cy: 236, r: 3.0 },
          { cx: 712, cy: 256, r: 2.5 },
          { cx: 902, cy: 226, r: 3.5 },
          { cx: 230, cy: 520, r: 2.5 },
          { cx: 462, cy: 396, r: 3.0 },
          { cx: 708, cy: 458, r: 2.5 },
          { cx: 936, cy: 520, r: 3.5 },
          { cx: 360, cy: 612, r: 2.5 },
          { cx: 600, cy: 506, r: 3.0 },
          { cx: 868, cy: 566, r: 2.5 },
          { cx: 1082, cy: 612, r: 3.5 },
        ].map((node) => (
          <circle
            key={`${node.cx}-${node.cy}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="url(#nodeFill)"
            stroke="hsl(var(--border) / 0.8)"
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}

