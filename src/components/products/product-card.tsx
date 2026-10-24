"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoryLabel, printMethodLabel } from "@/constants";
import { formatPrice } from "@/lib/utils";

interface ProductCardProduct {
  name: string;
  slug: string;
  category: string;
  printMethod: string;
  basePrice: number | string | { toString(): string };
  images: { url: string; altText?: string | null }[];
  variants: { priceOverride?: number | string | null | { toString(): string }; price?: number | string | { toString(): string } }[];
}

interface ProductCardProps {
  product: ProductCardProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const image = product.images[0];
  const prices = product.variants
    .map((v) =>
      v.priceOverride
        ? Number(String(v.priceOverride))
        : v.price
          ? Number(String(v.price))
          : Number(String(product.basePrice))
    )
    .filter((price) => Number.isFinite(price) && price > 0);
  const price = prices.length > 0 ? Math.min(...prices) : Number(String(product.basePrice));

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="double-bezel rounded-2xl overflow-hidden transition-all duration-500 ease-[var(--ease-smooth)] hover:shadow-[var(--shadow-glow)] hover:border-white/15 hover:-translate-y-2">
        <div className="double-bezel-inner rounded-2xl overflow-hidden">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
            <Image
              src={imgError ? "/jscreatives.webp" : image?.url || "/jscreatives.webp"}
              alt={image?.altText || `${product.name} branded merchandise`}
              fill
              loading="lazy"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
            <div className="absolute left-3 top-3">
              <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {categoryLabel(product.category)}
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {printMethodLabel(product.printMethod)}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                View
              </span>
            </div>
          </div>

          <div className="p-5">
            <h3 className="text-base font-semibold text-white font-[var(--font-display)] transition-colors duration-300 group-hover:text-red-400">
              {product.name}
            </h3>
            <p className="mt-1.5 text-xs text-slate-500">
              {categoryLabel(product.category)} &middot; {printMethodLabel(product.printMethod)}
            </p>
            <p className="mt-3 text-lg font-bold text-red-500 font-[var(--font-display)]">
              From {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
