import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock,
  Heart,
  Quote,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { SiteButton } from "@/components/ui/site-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/site/product-card";
import { CATALOG } from "@/content/catalog";
import { portfolioItems } from "@/content/portfolio";
import { services } from "@/content/services";
import {
  homeProcess,
  site,
  stats,
  testimonials,
  whyChoose,
  socialGallery,
} from "@/content/site";

export const metadata: Metadata = {
  title: {
    absolute: "JsCreatives | Printing, Branding & Custom Merchandise in Kenya",
  },
  description:
    "JsCreatives is a Nairobi printing and branding studio. We design and produce branded apparel, corporate gifts, stationery, packaging, signage and event branding for businesses across Kenya.",
  alternates: { canonical: "/" },
};

const whyIcons = {
  shield: ShieldCheck,
  sparkles: Sparkles,
  value: CircleDollarSign,
  convenience: Clock,
  satisfaction: Heart,
  delivery: Truck,
} as const;

const featuredSlugs = [
  "signature-branded-t-shirt",
  "heavyweight-branded-hoodie",
  "non-woven-tote-bag",
  "premium-business-cards",
];

const featuredProducts = featuredSlugs
  .map((slug) => CATALOG.find((product) => product.slug === slug))
  .filter((product): product is (typeof CATALOG)[number] => Boolean(product));

const featuredWorkIds = [
  "orbit-launch-merch",
  "kiri-packaging",
  "mara-signage",
  "nova-team-kit",
  "asali-labels",
];

const featuredWork = featuredWorkIds
  .map((id) => portfolioItems.find((item) => item.id === id))
  .filter((item): item is (typeof portfolioItems)[number] => Boolean(item));

const disciplines = [
  "Brand identity",
  "Screen print",
  "Embroidery",
  "Offset print",
  "Large format",
  "Packaging",
  "Corporate gifts",
  "Event branding",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-40 top-0 h-[38rem] w-[38rem] rounded-full bg-gold/8 blur-3xl" aria-hidden="true" />

        <div className="container-wide relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16">
          {/*<div className="flex flex-col gap-3 border-b border-line pb-5 text-[10px] font-semibold uppercase tracking-[0.19em] text-stone sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2.5">
              <span className="gold-dot" />
               Print &amp; Brand Studio
            </span>
            <span className="inline-flex items-center gap-2 text-ink">
              {site.tagline}
              <ArrowUpRight className="h-3 w-3 text-gold" />
            </span>
          </div>*/}

          <div className="relative mt-9 lg:mt-12">
            <div
              className="pointer-events-none absolute right-0 top-1/2 z-0 hidden -translate-y-1/2 md:block"
              aria-hidden="true"
            >
              <Image
                src={site.logo}
                alt=""
                width={2000}
                height={2000}
                priority
                unoptimized
                className="hero-logo h-auto w-[clamp(9rem,20vw,18rem)]"
              />
            </div>
            <h1 className="display-hero relative z-10 text-ink">
              <span className="block">Your brand,</span>
              <span className="block text-transparent [-webkit-text-stroke:1.5px_var(--color-brand-red)]">
                Our creativity.
              </span>
              <span className="block">One impactful</span>
              <span className="block text-gold-deep">Experience.</span>
            </h1>
          </div>

          <div className="mt-10 grid gap-10 border-t border-line pt-8 lg:mt-14 lg:grid-cols-12 lg:gap-12 lg:pt-10">
            <div className="lg:col-span-4">
              <p className="max-w-md text-[15px] leading-[1.8] text-stone">
                We are a Nairobi studio for printing, branding and customized
                merchandise. From the first sketch to the final delivery, we make
                your brand something people can see, wear, hold and remember.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <SiteButton href="/services" variant="ink" size="md">
                  Explore our services
                </SiteButton>
                <SiteButton href="/quote" variant="outline" size="md">
                  Request a free quote
                </SiteButton>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["/images/brand/merch-cap.jpg", "/images/brand/merch-mug.jpg", "/images/brand/merch-notebook.jpg"].map(
                    (src) => (
                      <span
                        key={src}
                        className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-paper"
                      >
                        <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    )
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-stone">
                  Trusted by teams, founders
                  <br />
                  and institutions across Kenya.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="group relative aspect-[16/10] overflow-hidden bg-charcoal">
                <Image
                  src="/images/brand/hero-work-collage.jpg"
                  alt="A collection of branded merchandise, print and packaging produced by JsCreatives"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-5 sm:p-7">
                  <p className="max-w-xs text-[10px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-paper/80">
                    Apparel · Packaging · Stationery
                    <br />
                    One studio, end to end.
                  </p>
                  <span className="hidden border border-paper/25 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-paper/80 sm:block">
                    Selected work / 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-paper-deep py-4">
          <div className="marquee-mask overflow-hidden">
            <div className="flex w-max animate-marquee-slow items-center">
              {[...disciplines, ...disciplines].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="flex items-center gap-6 px-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone"
                >
                  {item}
                  <span className="h-1 w-1 rounded-full bg-gold" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="paper-grain relative py-20 lg:py-28">
        <div className="container-wide relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">The studio</p>
            <h2 className="display-title mt-6 max-w-xl text-ink">
              More than print.
              <br />
              A brand made <span className="text-gold-deep">tangible.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={100}>
            <p className="max-w-2xl text-lg leading-[1.7] text-ink-soft sm:text-xl">
              Your brand is not only what people see on a screen. It is the shirt
              your team wears, the notebook a client keeps, the packaging a
              customer opens and the banner they remember.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-[1.85] text-stone">
              JsCreatives brings design, print and production under one roof so
              every piece feels like it belongs to the same story. We work with
              individuals, businesses, organizations and institutions to turn
              ideas into well-finished things that carry your name with confidence.
            </p>
            <Link
              href="/about"
              className="link-line mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              More about JsCreatives
              <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
            </Link>
          </Reveal>
        </div>

        <div className="container-wide relative z-10 mt-16 grid grid-cols-2 gap-y-8 border-y border-line py-8 sm:grid-cols-4 lg:mt-20">
          {stats.map((stat) => (
            <div key={stat.label} className="px-1 sm:px-6 sm:first:pl-0">
              <p className="font-display text-[clamp(2.3rem,4vw,3.6rem)] font-medium leading-none tracking-[-0.05em] text-ink">
                {stat.value}
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-stone">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title={
                <>
                  One studio for everything
                  <br />
                  your brand <span className="text-gold-deep">touches.</span>
                </>
              }
              description="Design, print, branding and merchandise, produced with one team and one standard of finish."
              link={{ href: "/services", label: "All services" }}
            />
          </Reveal>

          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={(index % 3) * 80}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block border-t border-line-dark pt-4"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                    />
                    <span className="absolute left-3 top-3 bg-ink/75 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-paper backdrop-blur-sm">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-5">
                    <div>
                      <h3 className="font-display text-[20px] font-medium tracking-[-0.03em] text-ink transition-colors group-hover:text-gold-deep">
                        {service.name}
                      </h3>
                      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-stone">
                        {service.description}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-stone transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title={
                <>
                  Work that leaves
                  <br />
                  a <span className="text-gold-deep">mark.</span>
                </>
              }
              description="A look at recent branding, packaging, merchandise and print projects produced in the studio."
              link={{ href: "/portfolio", label: "View portfolio" }}
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-12">
            {featuredWork.map((item, index) => {
              const spans = [
                "md:col-span-7 aspect-[16/11]",
                "md:col-span-5 aspect-[16/11]",
                "md:col-span-4 aspect-[4/5]",
                "md:col-span-4 aspect-[4/5]",
                "md:col-span-4 aspect-[4/5]",
              ];
              return (
                <Reveal
                  key={item.id}
                  delay={index * 60}
                  className={index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-4"}
                >
                  <Link
                    href="/portfolio"
                    className={`group relative block overflow-hidden bg-charcoal ${spans[index] ?? "aspect-[4/5]"}`}
                  >
                    <Image
                      src={item.image}
                      alt={`${item.title} for ${item.client}`}
                      fill
                      sizes={index < 2 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 33vw"}
                      className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-soft">
                          {item.category}
                        </p>
                        <h3 className="mt-1.5 max-w-xs font-display text-[18px] font-medium leading-snug tracking-[-0.02em] text-paper">
                          {item.title}
                        </h3>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-paper/25 text-paper transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Our products"
              title={
                <>
                  Branded, built,
                  <br />
                  <span className="text-gold-deep">delivered.</span>
                </>
              }
              description="Seven product categories, made to order. Pick a starting point or tell us what you have in mind."
              link={{ href: "/products", label: "Browse products" }}
            />
          </Reveal>

          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.slug} delay={index * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
              Also available
            </span>
            {[
              "Apparel",
              "Office",
              "Promotional",
              "Bags",
              "Marketing",
              "Events",
              "Gifts",
            ].map((label) => (
              <Link
                key={label}
                href="/products"
                className="text-[12px] text-ink transition-colors hover:text-gold-deep"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-20 text-paper lg:py-28">
        <div className="pointer-events-none absolute inset-0 grain-layer opacity-[0.06]" aria-hidden="true" />
        <div className="container-wide relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/brand/work-lumen-studio.jpg"
                alt="Branded stationery and print collateral produced for Lumen Studio"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-paper/10" />
              <div className="absolute bottom-4 left-4 bg-paper/95 px-4 py-3 text-ink">
                <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                  In the studio
                </p>
                <p className="mt-1 font-display text-sm font-medium">Design to delivery, handled.</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-gold-soft">How it works</p>
              <h2 className="display-title mt-6 max-w-2xl text-paper">
                From brief to delivery,
                <br />
                without the <span className="text-gold-soft">guesswork.</span>
              </h2>
            </Reveal>

            <div className="mt-10 divide-y divide-paper/12 border-t border-paper/12">
              {homeProcess.map((step, index) => (
                <Reveal key={step.step} delay={index * 60}>
                  <div className="grid grid-cols-[auto_1fr] gap-5 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-7">
                    <span className="font-display text-[13px] font-medium tracking-[0.05em] text-gold-soft">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-display text-[19px] font-medium tracking-[-0.02em] text-paper">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-paper/55">
                        {step.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 hidden h-4 w-4 text-paper/25 sm:block" />
                  </div>
                </Reveal>
              ))}
            </div>

            <SiteButton href="/how-it-works" variant="light" size="md" className="mt-8">
              See the full process
            </SiteButton>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Why JsCreatives"
              title={
                <>
                  Good work. Done
                  <br />
                  <span className="text-gold-deep">properly.</span>
                </>
              }
              description="The things our clients count on, from the first quote to the last box on the delivery van."
              link={{ href: "/about", label: "About us" }}
            />
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, index) => {
              const Icon = whyIcons[item.icon as keyof typeof whyIcons] ?? Sparkles;
              return (
                <Reveal key={item.title} delay={(index % 3) * 70}>
                  <div className="border-t border-line pt-5">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} />
                      <span className="text-[10px] font-semibold tracking-[0.14em] text-stone-light">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-[19px] font-medium tracking-[-0.02em] text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-stone">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Client words"
              title={
                <>
                  The work speaks.
                  <br />
                  So do the <span className="text-gold-deep">people.</span>
                </>
              }
              description="A few words from teams we have branded, dressed, printed for and delivered to."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={index * 80}>
                <figure className="flex h-full flex-col border-t border-line-dark pt-6">
                  <Quote className="h-7 w-7 text-gold/70" strokeWidth={1.2} />
                  <blockquote className="mt-6 flex-1 font-display text-[19px] font-normal leading-[1.55] tracking-[-0.015em] text-ink-soft">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 border-t border-line pt-5">
                    <p className="text-[12px] font-semibold text-ink">{testimonial.name}</p>
                    <p className="mt-1 text-[11px] text-stone">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">From the studio</p>
                <h2 className="display-subtitle mt-5 max-w-xl text-ink">
                  A closer look at what
                  <br />
                  we are <span className="text-gold-deep">making.</span>
                </h2>
              </div>
              <Link
                href="https://instagram.com/jscreatives__/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep"
              >
                @jscreatives__
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {socialGallery.map((item, index) => (
              <Reveal key={item.caption} delay={index * 45}>
                <Link
                  href="https://instagram.com/jscreatives__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden bg-charcoal"
                  aria-label={item.caption}
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center border border-paper/40 text-paper">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Tell us what you need printed,
              <br />
              branded or <span className="text-gold-deep">delivered.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SiteButton href="/quote" variant="ink" size="lg">
              Request a quote
            </SiteButton>
            <SiteButton href="/contact" variant="outline" size="lg">
              Contact the studio
            </SiteButton>
          </div>
        </div>
      </section>
    </>
  );
}
