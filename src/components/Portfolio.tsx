import { Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const brands = [
  {
    name: 'Virgo Point Capital',
    description: 'Flagship fleet with premium service standards',
    trucks: 31,
    accent: '#FFB800', // Primary amber
  },
  {
    name: 'Libra Haulage',
    description: 'Mid-tier reliability for consistent operations',
    trucks: 26,
    accent: '#3B82F6', // Blue
  },
  {
    name: 'Pure Coordination',
    description: 'Specialized operations and overflow capacity',
    trucks: 11,
    accent: '#10B981', // Green
  },
  {
    name: 'First Move Logistics',
    description: 'Agile response for urgent deliveries',
    trucks: 6,
    accent: '#8B5CF6', // Purple
  },
];

export function Portfolio() {
  return (
    <section
      id="portfolio"
      className="scroll-mt-20 bg-background border-t border-border py-16 sm:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Our Fleet Brands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four specialized brands, one standard of excellence. Each optimized for specific
            operational needs, all delivering VPC quality.
          </p>
        </div>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className={cn(
                'group bg-card border border-border p-6',
                'hover:-translate-y-1 transition-all duration-300',
                'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
              )}
              style={{
                // Subtle accent on hover via CSS custom property
                '--brand-accent': brand.accent,
              } as React.CSSProperties}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 flex items-center justify-center mb-4 border"
                style={{
                  backgroundColor: `${brand.accent}10`,
                  borderColor: `${brand.accent}30`,
                }}
              >
                <Truck
                  className="w-6 h-6"
                  style={{ color: brand.accent }}
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {brand.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                {brand.description}
              </p>

              {/* Truck Count */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <span
                  className="text-2xl font-heading font-bold"
                  style={{ color: brand.accent }}
                >
                  {brand.trucks}
                </span>
                <span className="text-sm text-muted-foreground">trucks</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Fleet */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border">
            <span className="text-muted-foreground">Total Fleet Capacity:</span>
            <span className="text-2xl font-heading font-bold text-primary">
              73+ Trucks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
