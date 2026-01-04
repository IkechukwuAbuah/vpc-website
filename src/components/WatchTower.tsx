import { MapPin, Clock, Bell, Shield, BarChart3, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

const features = [
  {
    icon: MapPin,
    title: 'Live Container Tracking',
    description: 'See your container\'s exact location on a map—updated every 2 minutes',
  },
  {
    icon: Clock,
    title: 'Accurate ETAs',
    description: 'Plan your warehouse ops with arrival times you can actually trust',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Get notified the moment something changes: delays, arrivals, diversions',
  },
  {
    icon: Shield,
    title: 'Terminal Integration',
    description: 'Connected to EFL systems—your tracking starts at the gate',
  },
  {
    icon: BarChart3,
    title: 'Driver Safety Records',
    description: 'Know your driver\'s performance history before they touch your cargo',
  },
  {
    icon: FileCheck,
    title: 'Documentation Ready',
    description: 'All paperwork in one place—waybills, PODs, compliance records',
  },
];

export function WatchTower() {
  const handleDemoRequest = () => {
    track('demo_request');
    // Scroll to contact form
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="watchtower"
      className="scroll-mt-20 bg-card border-t border-border py-16 sm:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Fleet Intelligence
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Know Where Your Cargo Is. Always.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            WatchTower connects directly to EFL's terminal systems, giving you visibility
            from the moment your container enters the gate until it reaches your warehouse.
          </p>
        </div>

        {/* Dashboard Mockup + Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Dashboard Preview - Mockup */}
          <div className="order-2 lg:order-1">
            <div className="bg-background border border-border p-4 sm:p-6">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-heading font-semibold text-foreground">
                    WatchTower Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Live
                </div>
              </div>

              {/* Mock Map Area */}
              <div className="aspect-video bg-background border border-border mb-4 relative overflow-hidden">
                {/* Grid pattern to simulate map */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                  }}
                />
                {/* Mock truck markers */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-3/4 left-2/3 w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />

                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              </div>

              {/* Mock Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-card border border-border">
                  <div className="text-lg font-heading font-bold text-primary">47</div>
                  <div className="text-xs text-muted-foreground">Active Trucks</div>
                </div>
                <div className="text-center p-3 bg-card border border-border">
                  <div className="text-lg font-heading font-bold text-green-500">23</div>
                  <div className="text-xs text-muted-foreground">On Schedule</div>
                </div>
                <div className="text-center p-3 bg-card border border-border">
                  <div className="text-lg font-heading font-bold text-primary">98%</div>
                  <div className="text-xs text-muted-foreground">Fleet Health</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      {feature.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 pt-8 border-t border-border">
              <Button
                onClick={handleDemoRequest}
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request a Demo
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                See WatchTower in action with your specific use case
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
