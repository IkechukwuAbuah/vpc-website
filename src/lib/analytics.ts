import { track as vercelTrack } from '@vercel/analytics';

// Analytics event types for VPC website
type AnalyticsEvent =
  | 'section_view'
  | 'cta_click'
  | 'form_start'
  | 'form_submit'
  | 'form_error'
  | 'demo_request'
  | 'scroll_depth';

type AnalyticsProperties = {
  section_view: { section_id: string };
  cta_click: { cta_name: string; section: string };
  form_start: Record<string, never>;
  form_submit: { volume_selected?: string };
  form_error: { field_name: string; error: string };
  demo_request: Record<string, never>;
  scroll_depth: { depth_percent: number };
};

// Type-safe track function
export function track<T extends AnalyticsEvent>(
  event: T,
  properties?: AnalyticsProperties[T]
): void {
  vercelTrack(event, properties);
}

// Scroll depth tracking (call once on mount)
export function setupScrollDepthTracking(): () => void {
  const thresholds = [25, 50, 75, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !tracked.has(threshold)) {
        tracked.add(threshold);
        track('scroll_depth', { depth_percent: threshold });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}

// Section view tracking with Intersection Observer
export function createSectionObserver(
  callback: (sectionId: string) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          callback(entry.target.id);
        }
      });
    },
    { threshold: 0.5 }
  );
}
