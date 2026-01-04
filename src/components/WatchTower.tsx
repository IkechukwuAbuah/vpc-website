import {
  AlertTriangle,
  Bell,
  CalendarClock,
  Clock,
  FileCheck,
  MapPin,
  Shield,
  Truck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

const features = [
  {
    icon: MapPin,
    title: 'Live Tracking',
    description: 'Map visibility updated in minutes — with route, status, and ETAs.',
  },
  {
    icon: CalendarClock,
    title: 'Accurate ETAs',
    description: 'Plan operations with ETAs you can actually schedule against.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Delays, arrivals, diversions — you know when anything changes.',
  },
  {
    icon: Shield,
    title: 'Payments & Compliance',
    description: 'Verification, receipts, NDPA-safe data handling, and audit trail.',
  },
  {
    icon: Users,
    title: 'Availability Controls',
    description: 'Prevent double-assignment; see available drivers/trucks instantly.',
  },
  {
    icon: FileCheck,
    title: 'Documentation Ready',
    description: 'Waybills, PODs, compliance docs — ready at close‑out.',
  },
];

type TripStatus = 'waiting' | 'at_gate' | 'en_route' | 'delivered' | 'issue';

type StatusStyle = { label: string; dot: string; text: string };

const statusStyles: Record<TripStatus, StatusStyle> = {
  waiting: { label: 'Waiting', dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
  at_gate: { label: 'At Gate', dot: 'bg-accent', text: 'text-accent' },
  en_route: { label: 'En Route', dot: 'bg-primary', text: 'text-primary' },
  delivered: { label: 'Delivered', dot: 'bg-primary', text: 'text-primary' },
  issue: { label: 'Issue', dot: 'bg-red-500', text: 'text-red-400' },
};

type Trip = {
  id: string;
  route: string;
  driver: string;
  truck: string;
  eta: string;
  status: TripStatus;
};

const trips: Trip[] = [
  { id: 'VPC-2481', route: 'Apapa → Ikeja', driver: 'Musa A.', truck: 'TB‑041', eta: '2h 10m', status: 'en_route' },
  { id: 'VPC-2487', route: 'Tin Can → Ibadan', driver: 'Chidi O.', truck: 'TB‑118', eta: '4h 30m', status: 'at_gate' },
  { id: 'VPC-2492', route: 'Lekki → Apapa', driver: 'Amina S.', truck: 'TB‑077', eta: '—', status: 'waiting' },
  { id: 'VPC-2495', route: 'Apapa → Sagamu', driver: 'Tunde K.', truck: 'TB‑009', eta: 'Delivered', status: 'delivered' },
  { id: 'VPC-2501', route: 'Off‑dock → Ikeja', driver: 'Femi B.', truck: 'TB‑203', eta: 'Investigate', status: 'issue' },
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
      className="scroll-mt-20 bg-card border-t border-border py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-carbon-grid opacity-[0.14]" aria-hidden="true" />
      <div className="absolute inset-0 bg-aurora opacity-[0.22]" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-card border border-border text-foreground text-sm font-medium mb-4 rounded-lg">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            WatchTower Control Room
            <span className="highway-strip h-px w-10 opacity-60" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">live tracking + dispatch</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Live Tracking That Feels Like Software
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A control-room view for operations: maximize the map, color-code statuses,
            and keep an audit trail from dispatch to POD.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Control room preview */}
          <div className="lg:col-span-8">
            <div className="surface border border-border p-4 sm:p-6 relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-carbon-grid opacity-[0.3]" />
              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0 rounded-lg">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-foreground leading-tight truncate">
                        WatchTower
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Live map + trip board • updates every ~2 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1 rounded-md">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    Live
                  </div>
                </div>

                {/* Map */}
                <div className="aspect-[16/10] bg-background border border-border mb-4 relative overflow-hidden rounded-lg">
                  <div className="absolute inset-0 opacity-40 bg-carbon-grid" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/60" />

                  {/* Port markers */}
                  <div className="absolute top-[24%] left-[26%] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-accent rounded-sm" />
                    <span className="text-[11px] text-muted-foreground">Apapa</span>
                  </div>
                  <div className="absolute top-[42%] left-[62%] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-accent rounded-sm" />
                    <span className="text-[11px] text-muted-foreground">Tin Can</span>
                  </div>

                  {/* Active trucks */}
                  <div className="absolute top-[34%] left-[36%] w-3.5 h-3.5 bg-primary animate-pulse rounded-sm" />
                  <div className="absolute top-[56%] left-[48%] w-3.5 h-3.5 bg-primary animate-pulse rounded-sm" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-[68%] left-[72%] w-3.5 h-3.5 bg-primary animate-pulse rounded-sm" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-[30%] right-[20%] w-3.5 h-3.5 bg-red-500 animate-pulse rounded-sm" style={{ animationDelay: '0.2s' }} />

                  {/* Selected trip overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-card/90 border border-border p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Trip {trips[0].id} • {trips[0].route}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Driver: {trips[0].driver} • Truck: {trips[0].truck} • ETA: {trips[0].eta}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={statusStyles[trips[0].status].dot + ' w-2 h-2'} aria-hidden="true" />
                        <span className={statusStyles[trips[0].status].text}>
                          {statusStyles[trips[0].status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-left p-3 bg-card border border-border rounded-lg">
                    <div className="text-lg font-heading font-bold text-foreground">47</div>
                    <div className="text-xs text-muted-foreground">Active trips</div>
                  </div>
                  <div className="text-left p-3 bg-card border border-border rounded-lg">
                    <div className="text-lg font-heading font-bold text-primary">23</div>
                    <div className="text-xs text-muted-foreground">On schedule</div>
                  </div>
                  <div className="text-left p-3 bg-card border border-border rounded-lg">
                    <div className="text-lg font-heading font-bold text-accent">6</div>
                    <div className="text-xs text-muted-foreground">Needs attention</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="lg:col-span-4">
            <div className="surface border border-border p-6 sm:p-8 rounded-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">
                    Dispatch board
                  </p>
                  <h3 className="text-xl font-heading font-semibold text-foreground">
                    Trips & Status
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Updated 2m ago
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-background border border-border p-4 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {trip.id} • {trip.route}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {trip.driver} • {trip.truck} • ETA: {trip.eta}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs flex-shrink-0">
                        <span className={statusStyles[trip.status].dot + ' w-2 h-2'} aria-hidden="true" />
                        <span className={statusStyles[trip.status].text}>
                          {statusStyles[trip.status].label}
                        </span>
                      </div>
                    </div>

                    {trip.status === 'issue' ? (
                      <div className="mt-3 flex items-start gap-2 text-xs text-red-300 bg-red-950/30 border border-red-900/40 p-3 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>
                          Issue log: driver reported gate delay — reviewing before resolution.
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background border border-border p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Users className="w-4 h-4 text-primary" />
                    Available drivers
                  </div>
                  <p className="text-2xl font-heading font-bold text-foreground mt-2">18</p>
                  <p className="text-xs text-muted-foreground mt-1">Filtered to prevent double‑assignment</p>
                </div>
                <div className="bg-background border border-border p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Truck className="w-4 h-4 text-accent" />
                    Type‑B trucks
                  </div>
                  <p className="text-2xl font-heading font-bold text-foreground mt-2">27</p>
                  <p className="text-xs text-muted-foreground mt-1">Active + ready for dispatch</p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-border">
                <Button
                  onClick={handleDemoRequest}
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Request Platform Access
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  See WatchTower with your routes, container types, and reporting needs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">
                Platform controls
              </p>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                Built for Dispatch Ops
              </h3>
            </div>
            <div className="highway-strip h-px flex-1 max-w-[240px] opacity-60 hidden sm:block" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="surface border border-border p-5 card-hover rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      {feature.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
