import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { site, socialLinks, whatsappUrl } from "@/content/site";
import { socialIconMap } from "@/components/site/social-icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact JsCreatives in Nairobi for printing, branding, customized merchandise, promotional products and event branding. Call, WhatsApp or send an enquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Tell us what you are
            <br />
            <span className="text-gold-deep">making.</span>
          </>
        }
        description={
          <p>
            A product list, a deadline, a rough idea or a file you need printed.
            Send it through and we will come back with a clear next step.
          </p>
        }
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink"
        >
          Chat on WhatsApp
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <a
          href={`tel:${site.phone}`}
          className="inline-flex items-center justify-center gap-3 border border-ink/25 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
        >
          Call the studio
        </a>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Studio details</p>
            <h2 className="display-subtitle mt-5 text-ink">
              Reach us the way
              <br />
              that suits <span className="text-gold-deep">you.</span>
            </h2>

            <div className="mt-8 space-y-6 border-t border-line pt-6">
              <a href={`tel:${site.phone}`} className="group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-gold-deep">
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                    Call us
                  </span>
                  <span className="mt-1 block text-[14px] text-ink transition-colors group-hover:text-gold-deep">
                    {site.phoneDisplay}
                  </span>
                </span>
              </a>

              <a href={`mailto:${site.email}`} className="group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-gold-deep">
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                    Email us
                  </span>
                  <span className="mt-1 block break-all text-[14px] text-ink transition-colors group-hover:text-gold-deep">
                    {site.email}
                  </span>
                </span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-gold-deep">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                    WhatsApp
                  </span>
                  <span className="mt-1 block text-[14px] text-ink transition-colors group-hover:text-gold-deep">
                    Chat with us
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-gold-deep">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                    Find us
                  </span>
                  <span className="mt-1 block text-[14px] text-ink">{site.location}</span>
                  <span className="mt-1 block text-[11px] text-stone">{site.locationNote}</span>
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <h3 className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-ink">
                  Studio hours
                </h3>
              </div>
              <dl className="mt-4 space-y-2">
                {site.hours.map((entry) => (
                  <div key={entry.days} className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2 text-[12px]">
                    <dt className="text-stone">{entry.days}</dt>
                    <dd className="font-medium text-ink">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                Follow the studio
              </p>
              <div className="mt-3 flex gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = socialIconMap[social.label as keyof typeof socialIconMap];
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`JsCreatives on ${social.label}`}
                      className="flex h-10 w-10 items-center justify-center border border-line text-stone transition-colors hover:border-ink hover:text-ink"
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : social.label.charAt(0)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={100}>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Send a message</p>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium tracking-[-0.035em] text-ink">
                  We usually reply within one business day.
                </h2>
              </div>
            </div>
            <div className="mt-7">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line bg-ink py-16 text-paper lg:py-20">
        <div className="pointer-events-none absolute inset-0 grain-layer opacity-[0.05]" aria-hidden="true" />
        <div className="container-wide relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow text-gold-soft">Faster response</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-paper">
              Send a photo, a file or a voice note.
              <br />
              We will tell you what is <span className="text-gold-soft">possible.</span>
            </h2>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 bg-gold px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-paper"
          >
            Open WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>
    </>
  );
}
