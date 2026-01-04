import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { DispatchCard } from '@/components/DispatchCard';
import { RoutePattern } from '@/components/RoutePattern';
import { track } from '@/lib/analytics';

// Lazy load Three.js for code-splitting (~1MB reduction in initial bundle)
const FluidScene = lazy(() => import('./FluidScene').then(m => ({ default: m.FluidScene })));

// Fallback component for Suspense
function FluidSceneFallback() {
  return (
    <div
      className="absolute inset-0 -z-10"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 50%, #0A0A0A 100%)',
      }}
    />
  );
}

const heroKpis = [
  { value: '73+', label: 'Trucks in Network', suffix: '' },
  { value: '≤ 60', label: 'Dispatch Confirm', suffix: 'm' },
  { value: '≈ 2', label: 'Live Updates', suffix: 'm' },
];

function formatKpi(value: string, suffix: string) {
  const numericMatch = value.match(/[\d.]+/);
  if (!numericMatch) return value + suffix;

  const n = parseFloat(numericMatch[0]);
  if (Number.isNaN(n)) return value + suffix;

  const prefix = value.split(numericMatch[0])[0] || '';
  const postfix = value.split(numericMatch[0])[1] || '';
  const formatted = value.includes('.') ? n.toFixed(1) : Math.round(n).toString();
  return prefix + formatted + postfix + suffix;
}

function AnimatedNumber({ value, suffix }: { value: string; suffix: string }) {
  const initial = formatKpi(value, suffix);
  const [displayed, setDisplayed] = useState(initial);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Extract numeric part for animation
          const numericMatch = value.match(/[\d.]+/);
          if (numericMatch) {
            const target = parseFloat(numericMatch[0]);
            const prefix = value.split(numericMatch[0])[0] || '';
            const postfix = value.split(numericMatch[0])[1] || '';
            const suffixText = suffix ?? '';
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              const current = target * eased;

              // Format based on original value
              let formatted: string;
              if (value.includes('.')) {
                formatted = current.toFixed(1);
              } else if (value.includes(',')) {
                formatted = Math.round(current).toLocaleString();
              } else {
                formatted = Math.round(current).toString();
              }

              setDisplayed(prefix + formatted + postfix + suffixText);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          } else {
            setDisplayed(value + suffix);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {displayed}
    </span>
  );
}

export function Hero() {
  const handleCTAClick = (ctaName: string) => {
    track('cta_click', { cta_name: ctaName, section: 'hero' });
  };

  return (
    <section
      id="hero"
      className="min-h-[740px] sm:min-h-dvh flex flex-col justify-center relative pt-24 pb-10"
    >
      {/* WebGL fluid background (desktop) / static gradient (mobile) */}
      <Suspense fallback={<FluidSceneFallback />}>
        <FluidScene />
      </Suspense>
      <div
        className="absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          maskImage: 'radial-gradient(70% 70% at 50% 40%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 40%, black 0%, transparent 70%)',
        }}
      >
        <RoutePattern className="w-full h-full" />
      </div>
      <div className="absolute inset-0 -z-10 bg-carbon-grid opacity-[0.18]" />
      <div className="absolute inset-0 -z-10 bg-aurora opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background/70" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left (top): story */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 bg-background/60 border border-border px-4 py-2 mb-6 rounded-full backdrop-blur-sm">
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                VPC Dispatch
              </span>
              <span className="highway-strip h-px w-10 opacity-80" aria-hidden="true" />
              <span className="text-xs text-foreground">
                On-demand Type‑B trucks
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-['Manrope'] leading-[1.05] tracking-tight">
              Book <span className="text-primary">Type‑B</span> Trucks
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Track Every Container.
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              A dispatch network built for Nigerian ports: request a truck, dispatch fast,
              track live, and close out with documentation — with visibility for every stakeholder.
            </p>
          </div>

          {/* Right: dispatch card (mobile-first ordering) */}
          <div id="dispatch" className="lg:col-span-5 lg:row-span-2 scroll-mt-28">
            <DispatchCard onPrimaryAction={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} />
          </div>

          {/* Left (bottom): proof + CTAs */}
          <div className="lg:col-span-7">
            {/* Product microcopy */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="bg-background/55 border border-border px-3 py-1 rounded-md backdrop-blur-sm">
                Request
              </span>
              <span className="bg-background/55 border border-border px-3 py-1 rounded-md backdrop-blur-sm">
                Dispatch
              </span>
              <span className="bg-background/55 border border-border px-3 py-1 rounded-md backdrop-blur-sm">
                Track
              </span>
              <span className="bg-background/55 border border-border px-3 py-1 rounded-md backdrop-blur-sm">
                Close out
              </span>
              <span className="text-xs opacity-80">
                — one simple flow, end-to-end
              </span>
            </div>

            {/* Tagline */}
            <p className="mt-6 text-2xl md:text-3xl font-semibold text-accent font-['Manrope']">
              Certainty. Every Trip.
            </p>

            {/* KPI Strip */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              {heroKpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="surface border border-border p-4 sm:p-5 card-hover rounded-xl"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-foreground font-['Manrope']">
                    <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
                  </div>
                  <div className="text-xs tracking-wide text-muted-foreground mt-2 uppercase">
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target w-full sm:w-auto text-lg px-8"
              >
                <a href="#dispatch" onClick={() => handleCTAClick('request-dispatch')}>
                  Request Dispatch
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-secondary touch-target w-full sm:w-auto text-lg px-8"
              >
                <a href="#portfolio" onClick={() => handleCTAClick('how-it-works')}>
                  How It Works
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
