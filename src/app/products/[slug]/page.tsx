import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { categoryLabel, printMethodLabel } from "@/constants";
import { ImageCarousel } from "@/components/products/image-carousel";
import { ProductDetailClient } from "./product-detail-client";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const price = product.variants[0]?.priceOverride ?? product.basePrice;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-8 flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/catalog" className="transition-colors hover:text-white">Shop</Link>
        <span>/</span>
        <span className="text-slate-300">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ImageCarousel images={product.images.map(img => ({ url: img.url, altText: img.altText ?? undefined }))} />

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-red-500/20 bg-red-600/10 px-3 py-1 text-xs font-medium text-red-400">
              {categoryLabel(product.category)}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300">
              {printMethodLabel(product.printMethod)}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl font-[var(--font-display)]">
            {product.name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Designed and produced by JSCREATIVES in Nairobi.
          </p>

          <p className="mt-4 text-3xl font-bold text-red-500 font-[var(--font-display)]">
            From {formatPrice(Number(price))}
          </p>

          <p className="mt-6 leading-relaxed text-slate-400">
            {product.description}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-[var(--color-border-default)] py-6">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Material</dt>
              <dd className="mt-1.5 text-sm text-slate-200">{product.material}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Turnaround</dt>
              <dd className="mt-1.5 text-sm text-slate-200">{product.turnaround}</dd>
            </div>
          </dl>

          <ProductDetailClient
            productId={product.id}
            variants={product.variants.map((v) => ({
              id: v.id,
              option: v.option,
              stock: v.stock,
              price: v.priceOverride
                ? Number(v.priceOverride)
                : Number(product.basePrice),
            }))}
            basePrice={Number(product.basePrice)}
          />
        </div>
      </div>
    </div>
  );
}
