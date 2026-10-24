"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap-wrapper";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProductCard } from "@/components/products/product-card";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "Naming, logo systems, typography and art direction that give your business a clear, ownable visual language.",
    tags: ["Logo systems", "Brand guidelines", "Art direction"],
    span: "lg:col-span-4",
  },
  {
    number: "02",
    title: "Apparel & Merch",
    description:
      "Tees, polos, hoodies and caps produced with screen print, DTF and embroidery built for daily wear.",
    tags: ["Screen print", "DTF", "Embroidery"],
    span: "lg:col-span-2",
  },
  {
    number: "03",
    title: "Print & Signage",
    description:
      "Business cards, stationery, stickers, banners and large-format signage with colour you can trust.",
    tags: ["Offset", "Large format", "Vinyl"],
    span: "lg:col-span-2",
  },
  {
    number: "04",
    title: "Packaging",
    description:
      "Mailer boxes, kraft bags and labels designed as a complete unboxing moment, not an afterthought.",
    tags: ["Mailer boxes", "Labels", "Retail bags"],
    span: "lg:col-span-4",
  },
];

const work = [
  {
    client: "Kiri Coffee",
    project: "Retail packaging & cups",
    image: "/images/examples/work-kiri-coffee.jpg",
    tags: ["Packaging", "Brand identity"],
    className: "lg:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    client: "Nova Athletics",
    project: "Team kit & training collection",
    image: "/images/examples/work-nova-athletics.jpg",
    tags: ["Apparel", "Sublimation"],
    className: "lg:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    client: "Lumen Studio",
    project: "Stationery & print collateral",
    image: "/images/examples/work-lumen-studio.jpg",
    tags: ["Stationery", "Offset"],
    className: "lg:col-span-4",
    aspect: "aspect-square",
  },
  {
    client: "Asali Botanics",
    project: "Labels & retail shelf presence",
    image: "/images/examples/work-asali-botanics.jpg",
    tags: ["Labels", "Packaging"],
    className: "lg:col-span-4",
    aspect: "aspect-square",
  },
  {
    client: "Mara & Co.",
    project: "Storefront signage system",
    image: "/images/examples/work-mara-co.jpg",
    tags: ["Signage", "Environmental"],
    className: "lg:col-span-4",
    aspect: "aspect-square",
  },
  {
    client: "Orbit Tech",
    project: "Launch event merch",
    image: "/images/examples/work-orbit-tech.jpg",
    tags: ["Merch", "Screen print"],
    className: "lg:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    client: "Kijani Farms",
    project: "Produce packaging & crate labels",
    image: "/images/examples/work-kijani-farms.jpg",
    tags: ["Packaging", "Labels"],
    className: "lg:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    client: "Sora Hotels",
    project: "In-room print & guest stationery",
    image: "/images/examples/work-sora-hotels.jpg",
    tags: ["Hospitality", "Print"],
    className: "lg:col-span-12",
    aspect: "aspect-[21/9]",
  },
];

const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "A short call to understand your brand, audience, quantities and deadline. We scope the right production route.",
  },
  {
    step: "02",
    title: "Design & proof",
    description:
      "We refine the artwork and send a digital proof. Nothing goes to print until you approve the details.",
  },
  {
    step: "03",
    title: "Produce",
    description:
      "Our studio prints, embroiders, cuts and finishes in-house, checking colour and quality at every stage.",
  },
  {
    step: "04",
    title: "Deliver",
    description:
      "Orders are packed, tracked and delivered across Kenya. Larger rollouts can be batched by location.",
  },
];

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  printMethod: string;
  basePrice: number | string;
  images: { url: string; altText?: string | null }[];
  variants: { priceOverride?: number | string | null; price?: number | string }[];
}

function FeaturedProductsSection({
  featuredProducts,
  loading,
}: {
  featuredProducts: FeaturedProduct[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="h-10 w-64 animate-pulse rounded bg-slate-800" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="double-bezel overflow-hidden rounded-2xl">
                  <div className="aspect-[4/5] bg-slate-800" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-slate-700" />
                    <div className="h-4 w-1/2 rounded bg-slate-700" />
                    <div className="h-6 w-1/3 rounded bg-slate-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">The Shop</p>
            <h2 className="mt-3 text-3xl font-bold text-white font-[var(--font-display)] sm:text-4xl">
              Branded goods, ready to order.
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-medium text-red-500 transition-colors hover:text-red-400"
          >
            Browse all products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const reduce = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?featured=true&perPage=8");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts((data.products || []).slice(0, 4));
        }
      } catch {
        // silently fail
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (reduce || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-kicker",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-line",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.2, stagger: 0.1 }
      );
      gsap.fromTo(
        ".hero-copy",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.55 }
      );
      gsap.fromTo(
        ".hero-actions > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", delay: 0.75, stagger: 0.1 }
      );
      gsap.fromTo(
        ".hero-image",
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out" }
      );
      gsap.to(".hero-image", {
        scale: 1.08,
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "expo.out",
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, clipPath: "inset(12% 0% 0% 0%)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          }
        );
      });

      gsap.fromTo(
        ".process-step",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".process-grid", start: "top 82%", once: true },
        }
      );
    }, pageRef.current);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={pageRef} className="relative">
      {/* Hero */}
      <section className="hero-section relative flex min-h-[92vh] items-end overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="hero-image absolute inset-0">
            <Image
              src="/images/examples/hero-work-collage.jpg"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-[#050505]/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-40 sm:px-6 lg:pb-28">
          <div className="max-w-3xl">
            <p className="hero-kicker flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              <span className="h-px w-10 bg-red-500" />
              Branding &amp; print studio — Nairobi
            </p>
            <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-tighter text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-[var(--font-display)]">
              <span className="hero-line block">We build brands</span>
              <span className="hero-line block">people wear, carry</span>
              <span className="hero-line block text-red-500">and remember.</span>
            </h1>
            <p className="hero-copy mt-7 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              From identity systems to apparel, packaging and signage — JSCREATIVES designs
              and produces the physical pieces your brand lives in.
            </p>
            <div className="hero-actions mt-10 flex flex-wrap gap-4">
              <MagneticButton size="lg" href="/contact">
                Start a Project
              </MagneticButton>
              <MagneticButton variant="secondary" size="lg" href="#work">
                See Our Work
              </MagneticButton>
            </div>

            <div className="hero-copy mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Identity &amp; design
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Production in-house
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Delivery across Kenya
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Capability strip */}
      <div className="border-y border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[var(--color-border-default)] px-4 sm:grid-cols-4 sm:px-6">
          {["Brand identity", "Apparel", "Print & signage", "Packaging"].map((item) => (
            <span
              key={item}
              className="py-5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 first:border-l-0"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Selected work */}
      <section id="work" className="scroll-mt-24 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Selected Work</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white font-[var(--font-display)] sm:text-5xl">
                Brands you can touch.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                A selection of identity, merchandise and print projects produced for hospitality,
                retail, sport and technology teams.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 text-sm font-medium text-red-500 transition-colors hover:text-red-400"
            >
              Start a project &rarr;
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {work.map((project) => (
              <article
                key={project.client}
                className={`work-card group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900 ${project.className}`}
              >
                <div className={`relative ${project.aspect} overflow-hidden`}>
                  <Image
                    src={project.image}
                    alt={`${project.client} — ${project.project}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-200 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-white font-[var(--font-display)]">
                      {project.client}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">{project.project}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative overflow-hidden border-y border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] py-24 lg:py-32">
        <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-red-600/5 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">What We Do</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white font-[var(--font-display)] sm:text-5xl">
              One studio, from first sketch to final print.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Most brands juggle a designer, a printer and a merchandise supplier. We keep the
              whole chain in one place so the result stays consistent.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-6">
            {services.map((service) => (
              <article
                key={service.title}
                className={`service-card double-bezel group rounded-2xl p-7 transition-all duration-500 hover:border-white/15 hover:shadow-[var(--shadow-glow)] sm:p-9 ${service.span}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-xs text-slate-500">{service.number}</span>
                  <svg
                    className="h-5 w-5 text-slate-600 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
                <h3 className="mt-12 text-2xl font-semibold text-white font-[var(--font-display)]">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                  {service.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-700/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProductsSection featuredProducts={featuredProducts} loading={loadingFeatured} />

      {/* Process */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">How It Works</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white font-[var(--font-display)] sm:text-5xl">
                A calm, clear production process.
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-slate-400">
                You will always know what stage your project is at, what needs approval and when
                it will be ready.
              </p>
              <MagneticButton href="/contact" className="mt-8">
                Book a discovery call
              </MagneticButton>
            </div>

            <div className="process-grid divide-y divide-[var(--color-border-default)] border-y border-[var(--color-border-default)]">
              {process.map((item) => (
                <div key={item.step} className="process-step grid gap-4 py-8 sm:grid-cols-[56px_1fr] sm:py-10">
                  <span className="font-mono text-xs text-red-500">{item.step}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white font-[var(--font-display)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[var(--color-border-default)] py-24 lg:py-32">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Let&apos;s Build</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white font-[var(--font-display)] sm:text-5xl lg:text-6xl">
            Your next brand moment starts here.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400">
            Tell us what you are launching, how many pieces you need and when it has to be ready.
            We will come back with a clear plan and quote.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <MagneticButton size="lg" href="/contact">
              Start a Project
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg" href="/catalog">
              Shop the Collection
            </MagneticButton>
          </div>
        </div>
      </section>
    </div>
  );
}
