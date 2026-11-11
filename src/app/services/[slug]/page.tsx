import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { SiteButton } from "@/components/ui/site-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getService, services } from "@/content/services";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      images: [{ url: service.image, alt: service.imageAlt }],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const serviceIndex = services.findIndex((item) => item.slug === service.slug) + 1;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.seoDescription,
    provider: {
      "@type": "LocalBusiness",
      name: "JsCreatives",
      telephone: "+254780237794",
      email: "hello@jscreatives.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
    },
    areaServed: "Kenya",
    serviceType: service.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="border-b border-line">
        <div className="container-wide pt-8 lg:pt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-stone transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All services
          </Link>
        </div>

        <div className="container-wide grid gap-10 pb-14 pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">Service 0{serviceIndex}</p>
            <h1 className="display-title mt-6 text-ink">{service.name}</h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-stone">
              {service.description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <SiteButton href="/quote" variant="ink">
                Request a quote
              </SiteButton>
              <SiteButton href="/contact" variant="outline">
                Ask a question
              </SiteButton>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">The approach</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Designed around how
              <br />
              the piece will be <span className="text-gold-deep">used.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-stone">
              {service.intro}
            </p>

            <div className="mt-10">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.19em] text-stone">
                What we can produce
              </h3>
              <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {service.offerings.map((offering) => (
                  <li key={offering} className="flex items-start gap-3 text-[13px] text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" strokeWidth={2} />
                    {offering}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={100}>
            <div className="border border-line bg-paper-light p-7 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-gold-deep">
                What you can expect
              </p>
              <div className="mt-6 space-y-7">
                {service.outcomes.map((outcome, index) => (
                  <div key={outcome.title} className="border-t border-line pt-5 first:border-0 first:pt-0">
                    <span className="text-[10px] font-semibold tracking-[0.14em] text-stone-light">
                      0{index + 1}
                    </span>
                    <h3 className="mt-2 font-display text-[17px] font-medium tracking-[-0.02em] text-ink">
                      {outcome.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-stone">
                      {outcome.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-16 lg:py-24">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Keep exploring"
            title={
              <>
                Other ways we can
                <br />
                <span className="text-gold-deep">help.</span>
              </>
            }
            link={{ href: "/services", label: "All services" }}
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={index * 60}>
                <Link
                  href={`/services/${item.slug}`}
                  className="group block border-t border-line-dark pt-4"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <h3 className="font-display text-[18px] font-medium tracking-[-0.02em] text-ink group-hover:text-gold-deep">
                      {item.name}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-stone transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
