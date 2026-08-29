"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap-wrapper";
import { useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Authentic Quality",
    description: "Premium materials and stitching that match official standards. Every jersey is crafted for comfort and durability.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Custom Printing",
    description: "Add your own name and number to any jersey. Professional heat-press printing that lasts.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: "Fast Delivery",
    description: "We deliver across Nigeria with tracking on every order. Get your jersey in 2-5 business days.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

interface FeaturedProductImage {
  url: string;
  altText?: string;
}

interface FeaturedProductVariant {
  price?: number | string;
  priceOverride?: number | string;
}

interface FeaturedProduct {
  id: string;
  slug: string;
  club: string;
  kitType: string;
  season?: string;
  basePrice: number | string;
  images: FeaturedProductImage[];
  variants: FeaturedProductVariant[];
}

// Featured Products Section Component
function FeaturedProductsSection({ featuredProducts, loading }: { featuredProducts: FeaturedProduct[]; loading: boolean }) {
  if (loading) {
    return (
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-display)]">
              Featured Jerseys
            </h2>
            <Link href="/catalog" className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gridAutoFlow: "dense" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="double-bezel rounded-2xl overflow-hidden bg-slate-800/50">
                  <div className="aspect-[4/5] bg-slate-800" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-700 rounded w-1/2" />
                    <div className="h-6 bg-slate-700 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 lg:py-36 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-[var(--font-display)]">
            Featured Jerseys
          </h2>
          <Link href="/catalog" className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gridAutoFlow: "dense" }}>
          {featuredProducts.map((product) => (
            <ProductPreviewCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductPreviewCard({ product }: { product: FeaturedProduct }) {
  const image = product.images?.[0];
  const [imgSrc, setImgSrc] = useState<string>(image?.url || '/jscreatives.webp');
  const price = product.variants?.[0]?.priceOverride
    ? Number(String(product.variants[0].priceOverride))
    : product.variants?.[0]?.price
      ? Number(String(product.variants[0].price))
      : Number(String(product.basePrice));

  return (
    <Link href={`/products/${product.slug}`} className="group relative">
      <div className="double-bezel rounded-2xl overflow-hidden transition-all duration-500 ease-[var(--ease-smooth)] hover:shadow-[var(--shadow-glow)] hover:border-white/15 hover:-translate-y-2">
        <div className="double-bezel-inner rounded-2xl overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
            <Image
              src={imgSrc}
              alt={image?.altText || `${product.club} ${product.kitType} jersey`}
              fill
              onError={() => setImgSrc('/jscreatives.webp')}
              className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute left-3 top-3">
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/60 backdrop-blur-sm text-white">
                {product.kitType}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white font-[var(--font-display)]">
              {product.club}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{product.season} &bull; {product.kitType}</p>
            <p className="mt-3 text-xl font-bold text-red-500 font-[var(--font-display)]">
              Ksh {price.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

const ROTATING_WORDS = ["Jerseys", "Posters", "Banners", "Cards"];

export default function HomePage() {
  const reduce = useReducedMotion();
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Rotating hero word — JS-driven so it re-initializes correctly after client-side
  // navigation (a pure-CSS keyframe animation does not reliably restart on remount).
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const rotatingRef = useRef(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      rotatingRef.current = (rotatingRef.current + 1) % ROTATING_WORDS.length;
      setRotatingIndex(rotatingRef.current);
    }, 2200);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/products?featured=true&perPage=20');
        if (res.ok) {
          const data = await res.json();
          const products = data.products || [];
          const seen = new Set<string>();
          const uniqueByClub = products.filter((p: FeaturedProduct) => {
            if (seen.has(p.club)) return false;
            if (seen.size >= 4) return false;
            seen.add(p.club);
            return true;
          });
          setFeaturedProducts(uniqueByClub);
        }
      } catch (e) {
        console.error('Failed to fetch featured products', e);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay: 0.2,
        }
      );

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          delay: 0.4,
        }
      );

      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
          delay: 0.6,
          stagger: 0.1,
        }
      );

      // Hero background image parallax
      gsap.to(".hero-bg-image", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Hero content fade out on scroll
      gsap.to(".hero-content", {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Feature cards scroll reveal
      (gsap.utils.toArray<HTMLElement>(".feature-card")).forEach((card, i: number) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "expo.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
              once: true,
            },
          }
        );
      });

      // Feature icons float animation
      (gsap.utils.toArray<HTMLElement>(".feature-icon")).forEach((icon) => {
        gsap.to(icon, {
          y: -8,
          rotation: 2,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }, document);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background with radial gradients */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-slate-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-3xl" />
        </div>

        {/* Hero background image */}
        <div className="hero-section absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0 hero-bg-image">
            <Image
              src="https://picsum.photos/seed/jersey-hero/1920/1080"
              alt=""
              fill
              priority
              className="w-full h-full object-cover opacity-15"
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90" />
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 flex min-h-[90vh] items-center">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-48">
            <div ref={heroContentRef} className="hero-content relative max-w-5xl">
              <h1 className="hero-title text-5xl font-bold tracking-tighter leading-[1.05] text-white sm:text-6xl lg:text-7xl xl:text-8xl font-[var(--font-display)]">
                Premium Custom{" "}
                <span className="hero-rotator" aria-live="polite">
                  {ROTATING_WORDS.map((word, i) => (
                    <span
                      key={word}
                      className={`hero-rotator-word gradient-text${i === rotatingIndex ? " is-active" : ""}`}
                    >
                      {word}
                    </span>
                  ))}
                </span>
              </h1>
              <p className="hero-subtitle mt-8 text-lg text-slate-300 sm:text-xl lg:text-2xl max-w-2xl leading-relaxed">
                Custom Name & Number Printing Available. Shop official and replica kits from top clubs worldwide.
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <MagneticButton size="lg" href="/catalog" className="hero-cta">
                  Shop Now
                </MagneticButton>
                <MagneticButton variant="secondary" size="lg" href="/catalog" className="hero-cta">
                  View Collection
                </MagneticButton>
              </div>

              {/* Trust indicators */}
              <div className="mt-16 flex flex-wrap items-center gap-8 text-slate-500 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Authentic Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2.5.5-5 1.5-7A6 6 0 1121 14.5c0 2.5-.5 5-1.5 7z" />
                  </svg>
                  <span>Custom Printing Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-10" aria-hidden="true">
          <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProductsSection featuredProducts={featuredProducts} loading={loadingFeatured} />

      {/* Why Choose Us Section */}
      <section className="py-32 lg:py-48 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[var(--font-display)]">
              Why Choose Us
            </h2>
            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We&apos;re committed to delivering the best football jersey experience with authentic quality,
              customization options, and reliable delivery across Nigeria.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card group relative">
                <div className="double-bezel rounded-2xl p-8 h-full transition-all duration-500 ease-[var(--ease-smooth)] hover:shadow-[var(--shadow-glow)] hover:border-white/15 hover:-translate-y-2">
                  <div className="double-bezel-inner rounded-2xl p-8">
                    <div className="feature-icon flex h-14 w-14 items-center justify-center rounded-xl bg-red-600/10 text-red-500 transition-all duration-500 group-hover:scale-110 group-hover:bg-red-600/20">
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white font-[var(--font-display)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 lg:py-48 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-slate-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[var(--font-display)]">
            Ready to Create Your Custom Jersey?
          </h2>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Choose your favorite club, add your name and number, and wear your passion with pride.
          </p>
<div className="mt-12 flex flex-wrap justify-center gap-4">
              <MagneticButton size="lg" href="/catalog" className="w-full sm:w-auto">
                Start Customizing
              </MagneticButton>
              <MagneticButton variant="secondary" size="lg" href="/catalog">
                Browse Collection
              </MagneticButton>
            </div>
        </div>
        </section>
      </div>
    );
  }
