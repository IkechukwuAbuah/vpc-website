import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#watchtower', label: 'WatchTower' },
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    track('cta_click', { cta_name: 'whatsapp', section: 'footer' });
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#hero" className="text-2xl font-bold text-foreground font-['Manrope']">
              VPC
            </a>
            <p className="text-muted-foreground text-sm">
              Engineering the Future of Freight
            </p>
            <p className="text-primary font-semibold">Certainty. Every Trip.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold font-['Manrope']">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold font-['Manrope']">Contact</h3>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:partnerships@vpc.com.ng"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                partnerships@vpc.com.ng
              </a>
              <a
                href="tel:+2348012345678"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                +234 801 234 5678
              </a>
              <span className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lagos, Nigeria
              </span>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold font-['Manrope']">Get in Touch</h3>
            <p className="text-muted-foreground text-sm">
              Response within 24 hours
            </p>
            <Button
              asChild
              className="bg-[#25D366] hover:bg-[#128C7E] text-white touch-target w-full md:w-auto"
            >
              <a
                href="https://wa.me/2348012345678?text=Hello%2C%20I%27m%20interested%20in%20VPC%20Logistics%20services."
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} VPC Logistics. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Mon - Fri, 8:00 AM - 6:00 PM WAT
          </p>
        </div>
      </div>
    </footer>
  );
}
