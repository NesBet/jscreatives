import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, PackageCheck, ShieldCheck, Timer } from "lucide-react";
import { ProductQuotePanel } from "@/components/products/product-quote-panel";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/ui/reveal";
import { CATALOG, getCatalogProduct } from "@/content/catalog";
import { categoryLabel, printMethodLabel } from "@/constants";
import { getSiteImageMap, resolveSiteImage } from "@/lib/site-images";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATALOG.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalogProduct = getCatalogProduct(slug);
  if (!catalogProduct) return {};

  const images = await getSiteImageMap();
  const product = {
    ...catalogProduct,
    image: resolveSiteImage(images, `product:${catalogProduct.slug}:image`).url,
  };

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const catalogProduct = getCatalogProduct(slug);
  if (!catalogProduct) notFound();

  const images = await getSiteImageMap();
  const product = {
    ...catalogProduct,
    image: resolveSiteImage(images, `product:${catalogProduct.slug}:image`).url,
  };
  const related = CATALOG.filter(
    (item) => item.category === product.category && item.slug !== product.slug
  )
    .slice(0, 4)
    .map((item) => ({
      ...item,
      image: resolveSiteImage(images, `product:${item.slug}:image`).url,
    }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: categoryLabel(product.category),
    material: product.material,
    brand: { "@type": "Brand", name: "JsCreatives" },
    manufacturer: {
      "@type": "Organization",
      name: "JsCreatives",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="border-b border-line">
        <div className="container-wide pt-8 lg:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="text-stone-light">/</span>
            <Link href="/products" className="transition-colors hover:text-ink">
              Products
            </Link>
            <span className="text-stone-light">/</span>
            <span className="text-ink">{product.name}</span>
          </nav>
        </div>

        <div className="container-wide grid gap-10 pb-14 pt-8 lg:grid-cols-12 lg:gap-14 lg:pb-20 lg:pt-10">
          <div className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden bg-charcoal lg:sticky lg:top-28">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                {categoryLabel(product.category)}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-stone transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All products
            </Link>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.19em] text-gold-deep">
              {printMethodLabel(product.printMethod)}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-[14px] leading-[1.85] text-stone">
              {product.description}
            </p>

            <ProductQuotePanel
              productName={product.name}
              basePrice={product.basePrice}
              colors={product.colors}
              options={product.options}
            />

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6">
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                  Material
                </dt>
                <dd className="mt-1.5 text-[13px] text-ink-soft">{product.material}</dd>
              </div>
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                  Turnaround
                </dt>
                <dd className="mt-1.5 text-[13px] text-ink-soft">{product.turnaround}</dd>
              </div>
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                  Print method
                </dt>
                <dd className="mt-1.5 text-[13px] text-ink-soft">
                  {printMethodLabel(product.printMethod)}
                </dd>
              </div>
              <div>
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                  Customization
                </dt>
                <dd className="mt-1.5 text-[13px] text-ink-soft">
                  {product.customization.join(", ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-wide grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Why order this way</p>
            <h2 className="display-subtitle mt-5 text-ink">
              Quoted around
              <br />
              your <span className="text-gold-deep">brief.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={80}>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Artwork checked",
                  description: "Every file is reviewed before production so placement and colour are right.",
                },
                {
                  icon: PackageCheck,
                  title: "Finish approved",
                  description: "You approve a mockup before we print, embroider or pack a single item.",
                },
                {
                  icon: Timer,
                  title: "Timeline confirmed",
                  description: "Your quotation includes a realistic production and delivery timeline.",
                },
              ].map((item) => (
                <div key={item.title} className="border-t border-line pt-5">
                  <item.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} />
                  <h3 className="mt-4 font-display text-[16px] font-medium tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-stone">{item.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {product.customization.length > 0 && (
        <section className="border-y border-line bg-paper-deep py-14 lg:py-16">
          <div className="container-wide grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">Customization options</p>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.customization.map((option) => (
                  <li key={option} className="flex items-start gap-3 text-[13px] text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" strokeWidth={2} />
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow">More in {categoryLabel(product.category)}</p>
                <h2 className="display-subtitle mt-5 text-ink">Keep browsing.</h2>
              </div>
              <Link
                href="/products"
                className="group hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors hover:text-gold-deep sm:inline-flex"
              >
                All products
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 60}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
