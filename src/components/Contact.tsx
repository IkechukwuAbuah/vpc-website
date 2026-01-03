import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { track } from '@/lib/analytics';

const contactSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  name: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  volume: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const volumeOptions = [
  { value: '1-10', label: '1-10 containers/month' },
  { value: '10-50', label: '10-50 containers/month' },
  { value: '50-100', label: '50-100 containers/month' },
  { value: '100+', label: '100+ containers/month' },
];

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleFirstFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      track('form_start', { form: 'contact' });
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Log to console (as per spec)
    console.log('Form submission:', data);

    // Track success
    track('form_submit', { form: 'contact', volume: data.volume || 'not_specified' });

    // Show success toast
    toast.success('Message sent!', {
      description: "We'll get back to you within 24 hours.",
    });

    reset();
    setIsSubmitting(false);
  };

  const handleFieldError = (fieldName: string, error: string) => {
    track('form_error', { field: fieldName, error });
  };

  const handleWhatsAppClick = () => {
    track('cta_click', { cta_name: 'whatsapp', section: 'contact' });
  };

  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-background border-t border-border py-16 sm:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Let's Move Your Cargo
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch for a partnership inquiry or request a quote.
            We respond within 24 hours.
          </p>
        </div>

        {/* WhatsApp CTA - Primary Conversion */}
        <div className="max-w-xl mx-auto mb-12">
          <Button
            asChild
            size="lg"
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-[#0A0A0A] font-medium h-14 text-lg"
          >
            <a
              href="https://wa.me/2348012345678?text=Hello%2C%20I%27m%20interested%20in%20VPC%20Logistics%20services."
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-6 w-6 mr-3" />
              Chat on WhatsApp
            </a>
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-3">
            Fastest response — typically within 1 hour during business hours
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border p-6 sm:p-8">
                <p className="text-foreground font-medium mb-6">
                  Or send us a message
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company */}
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Company Name *
                      </label>
                      <Input
                        id="company"
                        {...register('company')}
                        onFocus={handleFirstFocus}
                        onBlur={() => {
                          if (errors.company) {
                            handleFieldError('company', errors.company.message || 'Invalid');
                          }
                        }}
                        placeholder="Your company"
                        autoComplete="organization"
                        className="h-11 text-base bg-background border-border focus:border-primary focus:ring-primary"
                      />
                      {errors.company && (
                        <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Contact Name *
                      </label>
                      <Input
                        id="name"
                        {...register('name')}
                        onFocus={handleFirstFocus}
                        onBlur={() => {
                          if (errors.name) {
                            handleFieldError('name', errors.name.message || 'Invalid');
                          }
                        }}
                        placeholder="Your name"
                        autoComplete="name"
                        className="h-11 text-base bg-background border-border focus:border-primary focus:ring-primary"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        onFocus={handleFirstFocus}
                        onBlur={() => {
                          if (errors.email) {
                            handleFieldError('email', errors.email.message || 'Invalid');
                          }
                        }}
                        placeholder="you@company.com"
                        autoComplete="email"
                        inputMode="email"
                        className="h-11 text-base bg-background border-border focus:border-primary focus:ring-primary"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        onFocus={handleFirstFocus}
                        placeholder="+234 801 234 5678"
                        autoComplete="tel"
                        inputMode="tel"
                        className="h-11 text-base bg-background border-border focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Volume */}
                  <div>
                    <label
                      htmlFor="volume"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Monthly Volume
                    </label>
                    <Select
                      onValueChange={(value) => {
                        setValue('volume', value);
                        handleFirstFocus();
                      }}
                    >
                      <SelectTrigger id="volume" className="h-11 text-base bg-background border-border">
                        <SelectValue placeholder="Select container volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      onFocus={handleFirstFocus}
                      onBlur={() => {
                        if (errors.message) {
                          handleFieldError('message', errors.message.message || 'Invalid');
                        }
                      }}
                      placeholder="Tell us about your logistics needs..."
                      rows={4}
                      className="text-base bg-background border-border focus:border-primary focus:ring-primary resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Privacy Notice */}
                  <p className="text-xs text-muted-foreground text-center">
                    Your information is protected under NDPA guidelines.
                    We'll never share your data with third parties.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Email</p>
                    <a
                      href="mailto:partnerships@vpc.com.ng"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      partnerships@vpc.com.ng
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Phone</p>
                    <a
                      href="tel:+2348012345678"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      +234 801 234 5678
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Address</p>
                    <p className="text-muted-foreground text-sm">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Business Hours</p>
                    <p className="text-muted-foreground text-sm">
                      Mon - Fri, 8:00 AM - 6:00 PM WAT
                    </p>
                  </div>
                </div>

                {/* Response Time Badge */}
                <div className="bg-card border border-border p-4 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Response within 24 hours
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Usually faster during business hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
