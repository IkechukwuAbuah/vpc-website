import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { setupScrollDepthTracking, createSectionObserver, track } from '@/lib/analytics';

function App() {
  useEffect(() => {
    // Setup scroll depth tracking
    const cleanupScroll = setupScrollDepthTracking();

    // Setup section view tracking
    const observer = createSectionObserver((sectionId) => {
      track('section_view', { section_id: sectionId });
    });

    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      cleanupScroll();
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <main className="min-h-dvh bg-background">
        {/* Hero Section */}
        <section id="hero" className="min-h-[560px] sm:min-h-dvh flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground font-['Manrope']">
              Engineering the Future of Freight
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              VPC Logistics delivers container cargo from Nigerian ports with real-time tracking,
              strict compliance, and on-time delivery.
            </p>
            <p className="mt-4 text-2xl font-semibold text-primary">
              Certainty. Every Trip.
            </p>
          </div>
        </section>
      </main>
      <Toaster />
      <Analytics />
    </>
  );
}

export default App;
