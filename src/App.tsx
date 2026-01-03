import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { TrustStrip } from '@/components/TrustStrip';
import { Portfolio } from '@/components/Portfolio';
import { WatchTower } from '@/components/WatchTower';
import { Footer } from '@/components/Footer';
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
      <Header />
      <main className="min-h-dvh bg-background">
        <Hero />
        <About />
        <TrustStrip />
        <Portfolio />
        <WatchTower />

        {/* Contact form coming in Phase 3 */}
        <section id="contact" className="scroll-mt-20 min-h-[400px] bg-background border-t border-border flex items-center justify-center">
          <p className="text-muted-foreground">Contact form coming in Phase 3</p>
        </section>
      </main>
      <Footer />
      <Toaster />
      <Analytics />
    </>
  );
}

export default App;
