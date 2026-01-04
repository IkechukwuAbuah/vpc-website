import { useMemo, useState } from 'react';
import { ArrowRight, MapPin, Truck, CalendarClock, ShieldCheck, ChevronLeft, BadgeCheck, CheckCircle2, Route, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const pickupOptions = [
  { value: 'apapa', label: 'Apapa Port' },
  { value: 'tincan', label: 'Tin Can Island' },
  { value: 'lekki', label: 'Lekki / Free Zone' },
  { value: 'odock', label: 'Off-dock / ICD' },
];

const containerOptions = [
  { value: '20', label: '20ft' },
  { value: '40', label: '40ft' },
  { value: 'empty', label: 'Empty return' },
];

const whenOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'scheduled', label: 'Schedule' },
];

type Stage = 'details' | 'dispatch' | 'track';

const stageMeta: Array<{ id: Stage; label: string }> = [
  { id: 'details', label: 'Details' },
  { id: 'dispatch', label: 'Dispatch' },
  { id: 'track', label: 'Track' },
];

const stageOrder: Record<Stage, number> = {
  details: 0,
  dispatch: 1,
  track: 2,
};

type DispatchCardProps = {
  onPrimaryAction?: () => void;
};

function formatNaira(value: number) {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}m`;
  }
  return `₦${Math.round(value / 1_000)}k`;
}

const WHATSAPP_NUMBER = '2349096673176';

export function DispatchCard({ onPrimaryAction }: DispatchCardProps) {
  const [pickup, setPickup] = useState<string>('');
  const [destination, setDestination] = useState('');
  const [container, setContainer] = useState<string>('');
  const [when, setWhen] = useState<string>('');
  const [stage, setStage] = useState<Stage>('details');

  const summary = useMemo(() => {
    const pickupLabel = pickupOptions.find(o => o.value === pickup)?.label;
    const whenLabel = whenOptions.find(o => o.value === when)?.label;
    const containerLabel = containerOptions.find(o => o.value === container)?.label;

    const parts = [
      pickupLabel ? `Pickup: ${pickupLabel}` : null,
      destination ? `Drop-off: ${destination}` : null,
      containerLabel ? `Container: ${containerLabel}` : null,
      whenLabel ? `When: ${whenLabel}` : null,
    ].filter(Boolean);

    return parts.join(' • ');
  }, [pickup, destination, container, when]);

  const currentStageIndex = stageOrder[stage];
  const hasMatchSignal = Boolean(pickup && destination);
  const canRequestDispatch = hasMatchSignal;

  const estimate = useMemo(() => {
    if (!hasMatchSignal) return null;

    const pickupAdjust: Record<string, number> = {
      apapa: 45_000,
      tincan: 35_000,
      lekki: 55_000,
      odock: 25_000,
    };

    const containerAdjust: Record<string, number> = {
      '20': 70_000,
      '40': 150_000,
      empty: 10_000,
    };

    const normalizedDestination = destination.toLowerCase();
    const distanceAdjust =
      normalizedDestination.includes('abuja') ? 240_000 :
      normalizedDestination.includes('ibadan') ? 95_000 :
      normalizedDestination.includes('sagamu') ? 55_000 :
      normalizedDestination.includes('oshodi') ? 25_000 :
      75_000;

    const base =
      240_000 +
      (pickupAdjust[pickup] ?? 35_000) +
      (containerAdjust[container] ?? 50_000) +
      distanceAdjust;

    const low = Math.round((base * 0.98) / 10_000) * 10_000;
    const high = Math.round((base * 1.12) / 10_000) * 10_000;

    const pickupEta =
      pickup === 'odock' ? '25–45m' :
      pickup === 'lekki' ? '40–70m' :
      '30–60m';

    const dropoffEta =
      normalizedDestination.includes('abuja') ? '10–14h' :
      normalizedDestination.includes('ibadan') ? '3–5h' :
      normalizedDestination.includes('sagamu') ? '2–3h' :
      '1–3h';

    return {
      priceRange: `${formatNaira(low)}–${formatNaira(high)}`,
      pickupEta,
      dropoffEta,
    };
  }, [hasMatchSignal, pickup, destination, container]);

  const canOpenDispatch = hasMatchSignal;
  const canOpenTrack = stage !== 'details';

  const whatsAppMessage = useMemo(() => {
    const pickupLabel = pickupOptions.find(o => o.value === pickup)?.label;
    const whenLabel = whenOptions.find(o => o.value === when)?.label;
    const containerLabel = containerOptions.find(o => o.value === container)?.label;

    const lines: string[] = [];
    lines.push("Hello VPC Dispatch — I'd like to request a Type‑B truck.");

    const hasDetails = Boolean(pickupLabel || destination || containerLabel || whenLabel);
    if (hasDetails) {
      lines.push('');
    }

    if (pickupLabel) lines.push(`Pickup: ${pickupLabel}`);
    if (destination) lines.push(`Drop‑off: ${destination}`);
    if (containerLabel) lines.push(`Container: ${containerLabel}`);
    if (whenLabel) lines.push(`When: ${whenLabel}`);

    if (estimate) {
      lines.push('');
      lines.push(`Estimate: ${estimate.priceRange}`);
      lines.push(`Pickup ETA: ${estimate.pickupEta}`);
      lines.push(`Trip ETA: ${estimate.dropoffEta}`);
    }

    return lines.join('\n');
  }, [pickup, destination, container, when, estimate]);

  const handlePrimary = () => {
    if (!canRequestDispatch) return;
    setStage('dispatch');
    track('dispatch_request', {
      pickup: pickup || 'not_set',
      destination: destination || 'not_set',
      container: container || 'not_set',
      when: when || 'not_set',
    });

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    track('cta_click', { cta_name: 'request-dispatch-whatsapp', section: 'dispatch_card' });

    // If the browser blocks popups, fall back to the contact section.
    if (!popup) {
      onPrimaryAction?.();
    }
  };

  const handleStageJump = (next: Stage) => {
    const nextIndex = stageOrder[next];

    if (next === 'dispatch' && !canOpenDispatch) return;
    if (next === 'track' && !canOpenTrack) return;

    // Only allow forward navigation if prerequisites are satisfied.
    if (nextIndex > 0 && !canOpenDispatch) return;

    setStage(next);
  };

  const handleStartTracking = () => {
    setStage('track');
    track('tracking_open', { source: 'dispatch_card' });
  };

  const handleReset = () => {
    setStage('details');
    track('dispatch_reset', { source: 'dispatch_card' });
  };

  return (
    <div className="surface border border-border p-5 sm:p-6 relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-carbon-grid opacity-[0.35]" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">
              Dispatch
            </p>
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
              Book a Type‑B Truck
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              VPC Dispatch — request, route, track, and close out with docs.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-background/55 border border-border px-3 py-1 rounded-full backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Verified network
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1 bg-background/55 border border-border p-1 rounded-full backdrop-blur-sm">
            {stageMeta.map((s, idx) => {
              const isActive = idx === currentStageIndex;
              const isEnabled =
                idx <= currentStageIndex ||
                (s.id === 'dispatch' && canOpenDispatch) ||
                (s.id === 'track' && canOpenTrack);

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => isEnabled && handleStageJump(s.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
                    !isEnabled && 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={!isEnabled}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* DETAILS */}
          {stage === 'details' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="text-xs text-muted-foreground">
                    Pickup
                  </Label>
                  <Select value={pickup} onValueChange={setPickup}>
                    <SelectTrigger id="pickup" className="bg-background border-border h-11">
                      <SelectValue placeholder="Select pickup point" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickupOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="container" className="text-xs text-muted-foreground">
                    Container
                  </Label>
                  <Select value={container} onValueChange={setContainer}>
                    <SelectTrigger id="container" className="bg-background border-border h-11">
                      <SelectValue placeholder="Select size/type" />
                    </SelectTrigger>
                    <SelectContent>
                      {containerOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-xs text-muted-foreground">
                    Drop‑off
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g., Ikeja, Ibadan, Abuja"
                      className="h-11 pl-10 bg-background border-border"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="when" className="text-xs text-muted-foreground">
                    When
                  </Label>
                  <Select value={when} onValueChange={setWhen}>
                    <SelectTrigger id="when" className="bg-background border-border h-11">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {whenOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>VPC fleet + partner transporters</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="w-4 h-4 text-accent" />
                  <span>Docs-ready POD & waybills</span>
                </div>
              </div>

              {summary ? (
                <div className="bg-background/70 border border-border p-3 text-xs text-muted-foreground rounded-md">
                  {summary}
                </div>
              ) : (
                <div className="bg-background/60 border border-border p-3 text-xs text-muted-foreground rounded-md">
                  Add pickup + drop‑off to generate an ETA and rate estimate.
                </div>
              )}

              {estimate ? (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Estimate</p>
                    <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{estimate.priceRange}</p>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground">Pickup</p>
                    <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{estimate.pickupEta}</p>
                  </div>
                  <div className="bg-card border border-border p-3 rounded-lg">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground">ETA</p>
                    <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{estimate.dropoffEta}</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  onClick={handlePrimary}
                  disabled={!canRequestDispatch}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Request Dispatch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-border bg-background/60 hover:bg-secondary"
                >
                  <a
                    href="#watchtower"
                    onClick={() => track('cta_click', { cta_name: 'see-tracking', section: 'hero_dispatch' })}
                  >
                    See Live Tracking
                  </a>
                </Button>
              </div>
            </>
          ) : null}

          {/* DISPATCH */}
          {stage === 'dispatch' ? (
            <div className="bg-background/70 border border-border p-4 rounded-md">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Dispatch confirmed</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Route className="w-3.5 h-3.5 text-primary" />
                      {pickupOptions.find(o => o.value === pickup)?.label ?? 'Pickup'} → {destination || 'Drop‑off'}
                    </span>
                    <span className="highway-strip h-px w-8 opacity-60" aria-hidden="true" />
                    <span>
                      {estimate
                        ? `${estimate.priceRange} • Pickup ${estimate.pickupEta} • ETA ${estimate.dropoffEta}`
                        : 'Generating estimate…'}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleStageJump('details')}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-card border border-border p-4 rounded-lg">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">Driver</p>
                  <p className="text-sm font-medium text-foreground mt-1">Musa A.</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Truck TB‑041 • Type‑B • Verified
                  </p>
                </div>
                <div className="bg-card border border-border p-4 rounded-lg">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground">Docs</p>
                  <p className="text-sm font-medium text-foreground mt-1">Waybill + POD</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Receipt + audit trail generated at close‑out
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-card border border-border p-4 rounded-lg">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Ops log</p>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {[
                    'Request accepted',
                    'Route confirmed',
                    'Driver assigned (availability checked)',
                    'Tracking enabled for stakeholders',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleStartTracking}
                >
                  Start Tracking
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 border-border bg-background/60 hover:bg-secondary"
                  onClick={handleReset}
                >
                  New request
                </Button>
              </div>
            </div>
          ) : null}

          {/* TRACK */}
          {stage === 'track' ? (
            <div className="bg-background/70 border border-border p-4 rounded-md">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Live tracking</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Status updates every ~2 minutes • shareable link for terminals + warehouse.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1 rounded-full">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  Verified
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground mb-4">
                {[
                  { label: 'At Gate', active: true, color: 'bg-accent' },
                  { label: 'En Route', active: true, color: 'bg-primary' },
                  { label: 'Delivered', active: false, color: 'bg-muted-foreground' },
                ].map((s) => (
                  <div key={s.label} className="bg-card border border-border px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={[s.color, 'w-2 h-2 rounded-full'].join(' ')} aria-hidden="true" />
                      <span className={s.active ? 'text-foreground' : ''}>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="aspect-[16/9] bg-card border border-border rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-carbon-grid opacity-[0.25]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-background/70" />
                <div className="absolute top-[26%] left-[22%] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-accent rounded-sm" />
                  <span className="text-[11px] text-muted-foreground">Apapa</span>
                </div>
                <div className="absolute bottom-[22%] right-[24%] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-sm" />
                  <span className="text-[11px] text-muted-foreground">Drop‑off</span>
                </div>
                <div className="absolute top-[46%] left-[52%] w-3 h-3 bg-primary animate-pulse rounded-sm" />
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <a
                    href="#watchtower"
                    onClick={() => track('cta_click', { cta_name: 'open-watchtower', section: 'dispatch_card' })}
                  >
                    Open WatchTower
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 border-border bg-background/60 hover:bg-secondary"
                  onClick={handleReset}
                >
                  New request
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
