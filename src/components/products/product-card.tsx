"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProduct {
  slug: string;
  club: string;
  kitType: string;
  season: string;
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
  const variant = product.variants[0];
  const price = variant?.priceOverride
    ? Number(String(variant.priceOverride))
    : variant?.price
      ? Number(String(variant.price))
      : Number(String(product.basePrice));

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="double-bezel rounded-2xl overflow-hidden transition-all duration-500 ease-(--ease-smooth)] hover:shadow-(--shadow-glow)] hover:border-white/15 hover:-translate-y-2">
        <div className="double-bezel-inner rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="relative aspect-4/5 overflow-hidden bg-slate-900">
            <Image
              src={imgError ? '/jscreatives.webp' : (image?.url || '/jscreatives.webp')}
              alt={image?.altText || `${product.club} ${product.kitType} jersey`}
              fill
              loading="lazy"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-700 ease-(--ease-smooth)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute left-3 top-3">
              <Badge variant={product.kitType.toLowerCase() as "home" | "away" | "third"}>
                {product.kitType}
              </Badge>
            </div>
            {/* Quick view indicator */}
            <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="px-3 py-1.5 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                Quick View
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-base font-semibold text-white font-(--font-display)] group-hover:text-red-400 transition-colors duration-300">
              {product.club}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{product.season} • {product.kitType}</p>
            <p className="mt-3 text-lg font-bold text-red-500 font-(--font-display)]">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
