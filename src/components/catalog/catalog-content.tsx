"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { RevealItem } from "@/components/ui/ScrollReveal";
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  PRINT_METHODS,
  PRINT_METHOD_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_PER_PAGE,
} from "@/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap-wrapper";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  printMethod: string;
  basePrice: number;
  images: { url: string; altText?: string }[];
  variants: { priceOverride?: number | string | null | { toString(): string }; price?: number | string | { toString(): string } }[];
}

interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduce = useReducedMotion();
  const productsRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentPrintMethod = searchParams.get("printMethod") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentPerPage = parseInt(searchParams.get("perPage") || "") || PRODUCT_PER_PAGE;

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      router.push(`/catalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.set("category", currentCategory);
        if (currentPrintMethod) params.set("printMethod", currentPrintMethod);
        params.set("sort", currentSort);
        params.set("page", currentPage.toString());
        params.set("perPage", currentPerPage.toString());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentPrintMethod, currentSort, currentPage, currentPerPage]);

  useEffect(() => {
    if (reduce || !productsRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".catalog-product-card",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: productsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".catalog-product-image").forEach((imgEl) => {
        gsap.fromTo(
          imgEl,
          { scale: 1.1, opacity: 0, filter: "grayscale(20%)" },
          {
            scale: 1,
            opacity: 1,
            filter: "grayscale(0%)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: imgEl,
              start: "top 90%",
              toggleActions: "play none none reverse",
              once: true,
            },
          }
        );
      });
    }, productsRef.current);

    return () => ctx.revert();
  }, [products, reduce]);

  const activeCategory = PRODUCT_CATEGORIES.find((category) => category === currentCategory);

  const filtersContent = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("category", "")}
            className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
              !currentCategory
                ? "border-red-500/30 bg-red-600/10 text-red-500"
                : "border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            All Merchandise
          </button>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => updateParams("category", category)}
              className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
                currentCategory === category
                  ? "border-red-500/30 bg-red-600/10 text-red-500"
                  : "border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Print Method</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("printMethod", "")}
            className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
              !currentPrintMethod
                ? "border-red-500/30 bg-red-600/10 text-red-500"
                : "border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            All Methods
          </button>
          {PRINT_METHODS.map((method) => (
            <button
              key={method}
              onClick={() => updateParams("printMethod", method)}
              className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
                currentPrintMethod === method
                  ? "border-red-500/30 bg-red-600/10 text-red-500"
                  : "border-slate-700/50 text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {PRINT_METHOD_LABELS[method]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Sort By</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-white transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">The Brand Shop</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-display)]">
            Merchandise &amp; print, made to carry your brand.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {activeCategory
              ? CATEGORY_DESCRIPTIONS[activeCategory]
              : "Explore apparel, bags, drinkware, stationery, signage and packaging produced by our Nairobi studio."}
          </p>
          {pagination && (
            <p className="mt-3 text-xs text-slate-500">
              {pagination.total} product{pagination.total !== 1 ? "s" : ""} available
            </p>
          )}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="shrink-0 rounded-xl border border-slate-700/50 bg-slate-800/50 px-5 py-3 text-sm text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-8 lg:gap-12">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">{filtersContent}</div>
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 max-w-full overflow-y-auto border-r border-slate-800 bg-slate-950/95 p-6 backdrop-blur-2xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {filtersContent}
            </div>
          </div>
        )}

        <div className="flex-1">
          {loading ? (
            <div ref={productsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoFlow: "dense" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="catalog-product-card animate-pulse overflow-hidden rounded-2xl bg-slate-800/50">
                  <div className="aspect-[4/5] bg-slate-800" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 rounded bg-slate-700" />
                    <div className="h-4 w-1/2 rounded bg-slate-700" />
                    <div className="h-6 w-1/3 rounded bg-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <svg className="h-20 w-20 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-6 text-2xl font-semibold text-white">No products found</h3>
              <p className="mt-3 text-slate-400">Try a different category or print method.</p>
              <Button variant="secondary" className="mt-6" onClick={() => router.push("/catalog")}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div ref={productsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ gridAutoFlow: "dense" }}>
                {products.map((product) => (
                  <RevealItem key={product.id} index={products.indexOf(product)}>
                    <div className="catalog-product-card">
                      <ProductCard product={product} />
                    </div>
                  </RevealItem>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => updateParams("page", (currentPage - 1).toString())}
                    className="transition-all duration-300"
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm font-medium text-slate-400">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => updateParams("page", (currentPage + 1).toString())}
                    className="transition-all duration-300"
                  >
                    Next
                  </Button>
                  <PerPageSelector
                    value={currentPerPage}
                    onChange={(v) => updateParams("perPage", v.toString())}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
