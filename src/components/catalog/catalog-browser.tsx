"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/site/product-card";
import type { CatalogProduct } from "@/content/catalog";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/constants";
import { cn } from "@/lib/utils";

interface CatalogBrowserProps {
  products: CatalogProduct[];
}

export function CatalogBrowser({ products }: CatalogBrowserProps) {
  const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "ALL" || product.category === category;
      const matchesQuery =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        CATEGORY_LABELS[product.category].toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query]);

  return (
    <div>
      <div className="border-y border-line">
        <div className="container-wide flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            <button
              type="button"
              onClick={() => setCategory("ALL")}
              className={cn(
                "shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                category === "ALL"
                  ? "bg-ink text-paper"
                  : "text-stone hover:bg-paper-deep hover:text-ink"
              )}
            >
              All products
            </button>
            {PRODUCT_CATEGORIES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={cn(
                  "shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  category === value
                    ? "bg-ink text-paper"
                    : "text-stone hover:bg-paper-deep hover:text-ink"
                )}
              >
                {CATEGORY_LABELS[value]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border border-line bg-paper-light px-3 py-2 lg:w-64">
            <Search className="h-3.5 w-3.5 shrink-0 text-stone" strokeWidth={1.7} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full bg-transparent text-[12px] text-ink outline-none placeholder:text-stone/60"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-3.5 w-3.5 text-stone hover:text-ink" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide py-10 lg:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.7} />
              {category === "ALL" ? "All categories" : CATEGORY_LABELS[category]}
            </p>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-stone">
              {category === "ALL"
                ? "Explore the full range. Every product can be branded to your artwork, colours and quantity."
                : CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-14 border border-line bg-paper-light p-10 text-center">
            <p className="font-display text-xl font-medium text-ink">No products match that search.</p>
            <p className="mt-2 text-sm text-stone">
              Try another category, or tell us what you need and we will quote it directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("ALL");
                setQuery("");
              }}
              className="mt-6 border border-ink/25 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
