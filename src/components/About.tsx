import { useEffect, useRef, useState } from 'react';
import { Shield, MapPin, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const kpiCards = [
  {
    value: '99.2',
    suffix: '%',
    label: 'Fleet Uptime',
    description: 'Industry-leading availability',
  },
  {
    value: '2.4',
    suffix: 'M+ km',
    label: 'Distance Covered',
    description: 'Across Nigerian routes',
  },
  {
    value: '94.7',
    suffix: '%',
    label: 'On-Time Delivery',
    description: 'Consistent reliability',
  },
];

const whyVpcPoints = [
  {
    icon: Shield,
    title: 'Strict Compliance',
    description: 'Full regulatory adherence with proper documentation and safety protocols for every shipment.',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'GPS-enabled fleet visibility. Know exactly where your cargo is at any moment.',
  },
  {
    icon: Truck,
    title: 'Fleet Scale',
    description: '73+ trucks across 4 brands. Capacity to handle your volume, reliability to deliver.',
  },
];

function AnimatedKPI({ value, suffix, delay = 0 }: { value: string; suffix: string; delay?: number }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Parse the numeric part
          const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
          const hasDecimal = value.includes('.');
          const duration = 1500;
          const startTime = performance.now() + delay;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            if (elapsed < 0) {
              requestAnimationFrame(animate);
              return;
            }

            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numericValue * eased;

            if (hasDecimal) {
              setDisplayValue(current.toFixed(1));
            } else {
              setDisplayValue(Math.floor(current).toString());
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, delay, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

export function About() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [kpisRef, kpisVisible] = useScrollReveal<HTMLDivElement>();
  const [whyRef, whyVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section
      id="about"
      className="scroll-mt-20 bg-card border-t border-border py-16 sm:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={cn(
            'text-center mb-12 sm:mb-16 reveal',
            headerVisible && 'visible'
          )}
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Built on Integrity, Driven by Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nigeria's trusted partner for container haulage. We move cargo with precision,
            transparency, and unwavering commitment to delivery.
          </p>
        </div>

        {/* KPI Cards */}
        <div
          ref={kpisRef}
          className={cn(
            'grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 sm:mb-20 reveal',
            kpisVisible && 'visible'
          )}
        >
          {kpiCards.map((kpi, index) => (
            <div
              key={kpi.label}
              className={cn(
                'bg-background border border-border p-6 sm:p-8 card-hover',
                `reveal-delay-${(index + 1) * 100}`
              )}
            >
              <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                <AnimatedKPI value={kpi.value} suffix={kpi.suffix} delay={index * 200} />
              </div>
              <div className="text-lg font-medium text-foreground mb-1">
                {kpi.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {kpi.description}
              </div>
            </div>
          ))}
        </div>

        {/* Why VPC? */}
        <div
          ref={whyRef}
          className={cn(
            'max-w-4xl mx-auto reveal',
            whyVisible && 'visible'
          )}
        >
          <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground text-center mb-10">
            Why VPC?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyVpcPoints.map((point, index) => (
              <div
                key={point.title}
                className={cn(
                  'text-center',
                  `reveal-delay-${(index + 1) * 100}`
                )}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 border border-primary/20 mb-4 transition-colors duration-300 hover:bg-primary/20 hover:border-primary/40">
                  <point.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {point.title}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
