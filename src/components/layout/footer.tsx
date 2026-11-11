import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { navLinks, site, socialLinks, whatsappUrl } from "@/content/site";
import { services } from "@/content/services";
import { socialIconMap } from "@/components/site/social-icons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 grain-layer opacity-[0.05]" aria-hidden="true" />

      <div className="container-wide relative z-10">
        <div className="grid gap-10 border-b border-paper/12 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:py-20">
          <div>
            <p className="eyebrow text-gold-soft">Start something</p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.2rem,4.4vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.045em] text-paper">
              Let&apos;s make your brand
              <br />
              impossible to ignore.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-paper/55 lg:text-right">
              Tell us what you want to print, wear, hand out or put on a wall. We will
              come back with a clear quote and a production plan.
            </p>
            <Link
              href="/quote"
              className="group inline-flex items-center gap-4 bg-gold px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-paper"
            >
              Request a free quote
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.9fr_1.05fr] lg:py-16">
          <div>
            <Logo invert />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/55">
              {site.description}
            </p>
            <div className="mt-7 flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`JsCreatives on ${social.label}`}
                    className="flex h-9 w-9 items-center justify-center border border-paper/15 text-paper/55 transition-colors hover:border-gold hover:text-gold-soft"
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : social.label.charAt(0)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Explore
            </h3>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-sm text-paper/65 transition-colors hover:text-gold-soft"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Services
            </h3>
            <nav aria-label="Service links" className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="w-fit text-sm text-paper/65 transition-colors hover:text-gold-soft"
                >
                  {service.shortName}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-paper/40">
              Visit or call
            </h3>
            <div className="mt-5 flex flex-col gap-4 text-sm text-paper/65">
              <span className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span>
                  {site.location}
                  <span className="mt-1 block text-xs text-paper/40">{site.locationNote}</span>
                </span>
              </span>
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 hover:text-gold-soft">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-gold-soft">
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {site.email}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-gold-soft"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-6 space-y-1 border-t border-paper/12 pt-5 text-xs text-paper/40">
              {site.hours.map((entry) => (
                <p key={entry.days} className="flex justify-between gap-4">
                  <span>{entry.days}</span>
                  <span>{entry.time}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-paper/12 py-7 text-[10px] uppercase tracking-[0.16em] text-paper/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-gold" />
            {site.tagline}
          </p>
          <p>Nairobi · Kenya</p>
        </div>
      </div>
    </footer>
  );
}
