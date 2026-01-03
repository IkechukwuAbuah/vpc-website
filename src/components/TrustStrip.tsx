import { CheckCircle, Clock } from 'lucide-react';

const stats = [
  { value: '1,000+', label: 'Shipments Delivered' },
  { value: '50+', label: 'Active Clients' },
  { value: '4', label: 'Fleet Brands' },
];

export function TrustStrip() {
  return (
    <section className="bg-primary/5 border-y border-primary/20 py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Response within 24 hours</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Verified Fleet Operator</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
