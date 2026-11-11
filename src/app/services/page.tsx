import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SiteButton } from "@/components/ui/site-button";
import { Reveal } from "@/components/ui/reveal";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Printing, corporate branding, customized merchandise, graphic design, promotional materials and event branding from JsCreatives in Nairobi, Kenya.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={
          <>
            Everything your brand needs,
            <br />
            under one <span className="text-gold-deep">roof.</span>
          </>
        }
        description={
          <p>
            Print, identity, merchandise and branded environments, planned and
            produced as one coherent system. Start with a single item or brief us
            on the full rollout.
          </p>
        }
      >
        <SiteButton href="/quote" variant="ink">
          Request a free quote
        </SiteButton>
        <SiteButton href="/products" variant="outline">
          Browse products
        </SiteButton>
      </PageHero>

      <section className="py-8 lg:py-12">
        <div className="container-wide">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={40}>
              <article className="grid gap-8 border-b border-line py-12 first:pt-4 lg:grid-cols-12 lg:gap-12 lg:py-16">
                <div
                  className={`lg:col-span-5 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden bg-charcoal"
                  >
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                      0{index + 1}
                    </span>
                  </Link>
                </div>

                <div
                  className={`lg:col-span-7 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-gold-deep">
                    Service 0{index + 1}
                  </p>
                  <h2 className="mt-3 font-display text-[clamp(1.8rem,3.3vw,3rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
                    <Link href={`/services/${service.slug}`} className="transition-colors hover:text-gold-deep">
                      {service.name}
                    </Link>
                  </h2>
                  <p className="mt-5 max-w-2xl text-[14px] leading-[1.85] text-stone">
                    {service.intro}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                    {service.offerings.slice(0, 6).map((offering) => (
                      <span
                        key={offering}
                        className="border border-line px-3 py-1.5 text-[11px] text-ink-soft"
                      >
                        {offering}
                      </span>
                    ))}
                    {service.offerings.length > 6 && (
                      <span className="px-1 py-1.5 text-[11px] text-stone">
                        +{service.offerings.length - 6} more
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/services/${service.slug}`}
                    className="group mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep"
                  >
                    Explore this service
                    <span className="flex h-8 w-8 items-center justify-center border border-line transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-paper-deep py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Not sure where to start?</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Tell us what you need.
              <br />
              We will map the <span className="text-gold-deep">route.</span>
            </h2>
          </div>
          <SiteButton href="/contact" variant="ink" size="lg">
            Talk to the studio
          </SiteButton>
        </div>
      </section>
    </>
  );
}
