import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { track } from '@/lib/analytics';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#watchtower', label: 'WatchTower' },
  { href: '#contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    track('cta_click', { cta_name: href.replace('#', ''), section: 'header' });
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav aria-label="Main navigation" className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="text-2xl font-bold text-foreground font-['Manrope'] touch-target flex items-center"
          onClick={() => handleNavClick('#hero')}
        >
          VPC
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target"
          >
            <a
              href="#contact"
              onClick={() => track('cta_click', { cta_name: 'get-quote-header', section: 'header' })}
            >
              Get a Quote
            </a>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="touch-target"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-card border-border">
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={link.href}
                    className="text-lg text-foreground hover:text-primary transition-colors font-medium touch-target flex items-center"
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 touch-target mt-4"
                >
                  <a
                    href="#contact"
                    onClick={() => track('cta_click', { cta_name: 'get-quote-mobile', section: 'header' })}
                  >
                    Get a Quote
                  </a>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
