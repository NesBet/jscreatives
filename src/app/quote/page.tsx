import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle, Phone, ShieldCheck, Timer } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { QuoteForm, type QuoteDefaults } from "@/components/site/quote-form";
import { Reveal } from "@/components/ui/reveal";
import { site, whatsappUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Request a free printing, branding or customized merchandise quote from JsCreatives in Nairobi. Share your product, quantity, artwork and deadline.",
  alternates: { canonical: "/quote" },
};

interface QuotePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams;

  const defaults: QuoteDefaults = {
    service: first(params.service),
    productName: first(params.product),
    quantity: first(params.quantity),
    preferredColor: first(params.color),
    additionalInstructions: first(params.option)
      ? `Preferred option: ${first(params.option)}`
      : undefined,
  };

  return (
    <>
      <PageHero
        eyebrow="Get a quote"
        title={
          <>
            Tell us what you need.
            <br />
            We will price it <span className="text-gold-deep">properly.</span>
          </>
        }
        description={
          <p>
            Share the item, quantity, artwork and deadline. We will review the
            brief, recommend the right production route and send a clear quotation,
            usually within one business day.
          </p>
        }
      >
        <div className="inline-flex items-center gap-2.5 border border-line bg-paper-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-deep" strokeWidth={1.7} />
          No obligation. No pressure.
        </div>
        <div className="inline-flex items-center gap-2.5 border border-line bg-paper-light px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
          <Timer className="h-3.5 w-3.5 text-gold-deep" strokeWidth={1.7} />
          Reply within one business day
        </div>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">What happens next</p>
              <h2 className="display-subtitle mt-5 text-ink">
                A clear quote.
                <br />
                No <span className="text-gold-deep">surprises.</span>
              </h2>

              <div className="mt-8 divide-y divide-line border-t border-line">
                {[
                  {
                    title: "We review your brief",
                    description: "We check the product, quantity, artwork and deadline you have shared.",
                  },
                  {
                    title: "We recommend a route",
                    description: "Material, print method and finishing options are matched to how the piece will be used.",
                  },
                  {
                    title: "We send an itemised quote",
                    description: "You receive clear pricing, production timelines and next steps.",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="grid grid-cols-[auto_1fr] gap-4 py-5">
                    <span className="flex h-7 w-7 items-center justify-center border border-line text-[10px] font-semibold text-gold-deep">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[16px] font-medium tracking-[-0.02em] text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-stone">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-line bg-paper-light p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                  Prefer to talk?
                </p>
                <div className="mt-4 space-y-3 text-[12px]">
                  <a href={`tel:${site.phone}`} className="flex items-center gap-3 text-ink hover:text-gold-deep">
                    <Phone className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                    {site.phoneDisplay}
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ink hover:text-gold-deep"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2.5 text-[11px] leading-relaxed text-stone">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" strokeWidth={2} />
                <span>
                  Already have artwork? Attach it. No file yet? Send the brief anyway.
                </span>
              </div>

              <Link
                href="/how-it-works"
                className="link-line mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink"
              >
                See the full process
                <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={80}>
            <QuoteForm defaults={defaults} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
