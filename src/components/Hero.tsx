import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

const kpis = [
  { value: '73+', label: 'Trucks', suffix: '' },
  { value: '99.2', label: 'Uptime', suffix: '%' },
  { value: '1,800+', label: 'Monthly Jobs', suffix: '' },
];

function AnimatedNumber({ value, suffix }: { value: string; suffix: string }) {
  const [displayed, setDisplayed] = useState('0');
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

              setDisplayed(prefix + formatted + postfix);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          } else {
            setDisplayed(value);
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
      {displayed}{suffix}
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
      className="min-h-[560px] sm:min-h-dvh flex flex-col items-center justify-center relative pt-20"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card -z-10" />

      <div className="container mx-auto px-4 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-['Manrope'] leading-tight">
          Engineering the Future
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          of Freight
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          VPC Logistics delivers container cargo from Nigerian ports with real-time tracking,
          strict compliance, and on-time delivery.
        </p>

        {/* Tagline */}
        <p className="mt-4 text-2xl md:text-3xl font-semibold text-primary font-['Manrope']">
          Certainty. Every Trip.
        </p>

        {/* KPI Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-card border border-border p-4 sm:p-6"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary font-['Manrope']">
                <AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target w-full sm:w-auto text-lg px-8"
          >
            <a href="#contact" onClick={() => handleCTAClick('get-quote')}>
              Get a Quote
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border text-foreground hover:bg-secondary touch-target w-full sm:w-auto text-lg px-8"
          >
            <a href="#watchtower" onClick={() => handleCTAClick('request-demo')}>
              Request Demo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
