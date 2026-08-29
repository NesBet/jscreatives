"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { RevealItem } from "@/components/ui/ScrollReveal";
import { CLUBS, KIT_TYPES, PRODUCT_PER_PAGE } from "@/constants";
import { gsap, ScrollTrigger } from "@/lib/gsap-wrapper";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  slug: string;
  club: string;
  kitType: string;
  season: string;
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

  const currentClub = searchParams.get("club") || "";
  const currentKitType = searchParams.get("kitType") || "";
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
        if (currentClub) params.set("club", currentClub);
        if (currentKitType) params.set("kitType", currentKitType);
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
  }, [currentClub, currentKitType, currentSort, currentPage, currentPerPage]);

  // GSAP Scroll Animations
  useEffect(() => {
    if (reduce || !productsRef.current) return;

    const ctx = gsap.context(() => {
      // Animate product cards on load
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

      // Image scale reveal on scroll
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

  const filtersContent = (
    <div className="space-y-8">
      {/* Club Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Club</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("club", "")}
            className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 ${
              !currentClub
                ? "bg-red-600/10 text-red-500 border border-red-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50"
            }`}
          >
            All Clubs
          </button>
          {CLUBS.map((c) => (
            <button
              key={c}
              onClick={() => updateParams("club", c)}
              className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 ${
                currentClub === c
                  ? "bg-red-600/10 text-red-500 border border-red-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Kit Type Filter */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Kit Type</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateParams("kitType", "")}
            className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 ${
              !currentKitType
                ? "bg-red-600/10 text-red-500 border border-red-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50"
            }`}
          >
            All Types
          </button>
          {KIT_TYPES.map((kt) => (
            <button
              key={kt}
              onClick={() => updateParams("kitType", kt)}
              className={`block w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300 ${
                currentKitType === kt
                  ? "bg-red-600/10 text-red-500 border border-red-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-slate-700/50"
              }`}
            >
              {kt.charAt(0) + kt.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Sort By</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all duration-300"
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-(--font-display)]">
            Shop Jerseys
          </h1>
          {pagination && (
            <p className="mt-2 text-sm text-slate-400">
              {pagination.total} product{pagination.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden transition-all duration-300"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-8 lg:gap-12">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">{filtersContent}</div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-80 max-w-full overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
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

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gridAutoFlow: "dense" }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="catalog-product-card animate-pulse rounded-2xl overflow-hidden bg-slate-800/50">
                  <div className="aspect-4/5 bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-700 rounded w-1/2" />
                    <div className="h-6 bg-slate-700 rounded w-1/3" />
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
              <p className="mt-3 text-slate-400">Try adjusting your filters or search terms.</p>
              <Button variant="secondary" className="mt-6" onClick={() => router.push("/catalog")}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gridAutoFlow: "dense" }}>
                {products.map((product) => (
                  <RevealItem key={product.id} index={products.indexOf(product)}>
                    <div className="catalog-product-card">
                      <ProductCard product={product} />
                    </div>
                  </RevealItem>
                ))}
              </div>

              {/* Pagination */}
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
                  <span className="flex items-center px-4 text-sm text-slate-400 font-medium">
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
