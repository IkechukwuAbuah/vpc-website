import {
  Banknote,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Truck,
  UserPlus,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    step: '01',
    side: 'Customer',
    icon: UserPlus,
    title: 'Request dispatch',
    description: 'Pickup, drop‑off, container type, timing — in one request.',
  },
  {
    step: '02',
    side: 'Customer',
    icon: CheckCircle2,
    title: 'Dispatch confirmed',
    description: 'We confirm rate + ETA, then assign a driver.',
  },
  {
    step: '03',
    side: 'Customer',
    icon: Truck,
    title: 'Truck heads to pickup',
    description: 'Driver dispatched to port/ICD and begins the move.',
  },
  {
    step: '04',
    side: 'Customer',
    icon: MapPin,
    title: 'Track live',
    description: 'Live status + map tracking for cargo owners, terminals, and your warehouse.',
  },
  {
    step: '05',
    side: 'Customer',
    icon: FileText,
    title: 'Close out with docs',
    description: 'POD/waybill + completion confirmation — stored for audit.',
  },
  {
    step: '06',
    side: 'Operations',
    icon: ShieldCheck,
    title: 'Match capacity',
    description: 'Vetted truck + driver, availability checked to prevent double‑assignment.',
  },
  {
    step: '07',
    side: 'Operations',
    icon: FileText,
    title: 'Confirm route + docs',
    description: 'Dispatch record created with route, container details, and documentation plan.',
  },
  {
    step: '08',
    side: 'Operations',
    icon: MapPin,
    title: 'Monitor + alerts',
    description: 'At gate, en route, delays — surfaced in WatchTower.',
  },
  {
    step: '09',
    side: 'Operations',
    icon: Truck,
    title: 'Assign a driver',
    description: 'Dispatch to an available driver and truck — no double‑assignment.',
  },
  {
    step: '10',
    side: 'Operations',
    icon: Banknote,
    title: 'Receipt + close‑out',
    description: 'Receipts and compliance docs issued for finance and reporting.',
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
            How Dispatch Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple operating flow for Type‑B haulage: request, dispatch, track, and close out with documentation.
          </p>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {(['Customer', 'Operations'] as const).map((side) => (
            <div key={side} className="surface border border-border p-6 sm:p-8 relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-carbon-grid opacity-[0.25]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="text-left">
                    <p className="text-xs tracking-widest uppercase text-muted-foreground">
                      {side === 'Customer' ? 'Customer side' : 'Operations side'}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                      {side === 'Customer' ? 'Create the order' : 'Run the trip'}
                    </h3>
                  </div>
                  <div
                    className={cn(
                      'text-xs px-3 py-1 border',
                      side === 'Customer' ? 'border-accent/30 text-accent' : 'border-primary/30 text-primary'
                    )}
                  >
                    {side === 'Customer' ? '01–05' : '06–10'}
                  </div>
                </div>

                <div className="space-y-4">
                  {steps
                    .filter(s => s.side === side)
                    .map((s) => (
                      <div key={s.step} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-background border border-border flex items-center justify-center rounded-lg">
                          <s.icon className={cn('w-5 h-5', side === 'Customer' ? 'text-accent' : 'text-primary')} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-3">
                            <span className="text-xs tracking-widest text-muted-foreground">
                              {s.step}
                            </span>
                            <p className="font-medium text-foreground">
                              {s.title}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proof callout */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 surface border border-border rounded-xl">
            <span className="text-muted-foreground">
              Built for ports, terminals, and high‑volume shippers
            </span>
            <span className="highway-strip h-px w-12 opacity-60 hidden sm:block" aria-hidden="true" />
            <span className="text-sm text-foreground">
              Want to see the dispatch board?
              <a href="#watchtower" className="text-primary font-semibold ml-2">
                View tracking →
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
