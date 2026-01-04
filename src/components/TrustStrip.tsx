import { CheckCircle, Clock, Link2 } from 'lucide-react';

const stats = [
  { value: '1,800+', label: 'Containers Monthly' },
  { value: '73+', label: 'Active Trucks' },
  { value: '4', label: 'Fleet Brands' },
];

export function TrustStrip() {
  return (
    <section className="bg-primary/5 border-y border-primary/20 py-8 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          {/* EFL Ecosystem Badge */}
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Part of the EFL logistics ecosystem</span>
          </div>

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
