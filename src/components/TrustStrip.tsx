import { CheckCircle, Clock, Link2, Activity } from 'lucide-react';

const stats = [
  { value: 'Request', label: 'Create a dispatch request' },
  { value: 'Dispatch', label: 'Driver assigned + docs-ready' },
  { value: 'Track', label: 'Live status & location' },
];

export function TrustStrip() {
  return (
    <section className="bg-background border-y border-border py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          {/* Platform Badge */}
          <div className="flex items-center gap-2 surface border border-border px-4 py-2 rounded-xl">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Live dispatch network</span>
            <span className="highway-strip h-px w-10 opacity-60" aria-hidden="true" />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5" />
              Ports • terminals • warehouses
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
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
              <span>Response within 1 hour (business hours)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Verified transporters & drivers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
