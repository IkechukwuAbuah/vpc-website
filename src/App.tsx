import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
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

        {/* Placeholder sections for anchor navigation */}
        <section id="about" className="min-h-[400px] bg-card border-t border-border flex items-center justify-center">
          <p className="text-muted-foreground">About section coming in Phase 2</p>
        </section>

        <section id="portfolio" className="min-h-[400px] bg-background border-t border-border flex items-center justify-center">
          <p className="text-muted-foreground">Portfolio section coming in Phase 2</p>
        </section>

        <section id="watchtower" className="min-h-[400px] bg-card border-t border-border flex items-center justify-center">
          <p className="text-muted-foreground">WatchTower section coming in Phase 2</p>
        </section>

        <section id="contact" className="min-h-[400px] bg-background border-t border-border flex items-center justify-center">
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
