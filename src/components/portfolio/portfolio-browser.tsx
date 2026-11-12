"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import {
  portfolioCategories,
  portfolioItems,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/content/portfolio";
import { cn } from "@/lib/utils";

const aspectClass: Record<NonNullable<PortfolioItem["size"]>, string> = {
  wide: "aspect-[4/3]",
  tall: "aspect-[3/4]",
  normal: "aspect-square",
};

export function PortfolioBrowser({
  items = portfolioItems,
}: {
  items?: PortfolioItem[];
}) {
  const [category, setCategory] = useState<PortfolioCategory | "All">("All");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filtered = useMemo(
    () =>
      category === "All"
        ? items
        : items.filter((item) => item.category === category),
    [category, items]
  );

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <>
      <div className="border-y border-line">
        <div className="container-wide flex items-center gap-1 overflow-x-auto py-4 no-scrollbar">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={cn(
              "shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
              category === "All"
                ? "bg-ink text-paper"
                : "text-stone hover:bg-paper-deep hover:text-ink"
            )}
          >
            All work
          </button>
          {portfolioCategories.map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setCategory(entry)}
              className={cn(
                "shrink-0 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                category === entry
                  ? "bg-ink text-paper"
                  : "text-stone hover:bg-paper-deep hover:text-ink"
              )}
            >
              {entry}
            </button>
          ))}
        </div>
      </div>

      <div className="container-wide py-10 lg:py-14">
        <div className="flex items-end justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-stone">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            {category !== "All" ? ` · ${category}` : ""}
          </p>
          <p className="hidden max-w-sm text-right text-[11px] leading-relaxed text-stone sm:block">
            Select a project to see the brief, the pieces produced and the services used.
          </p>
        </div>

        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group mb-5 block w-full break-inside-avoid text-left"
              aria-label={`View project: ${item.title}`}
            >
              <div
                className={cn(
                  "relative overflow-hidden bg-charcoal",
                  aspectClass[item.size ?? "normal"]
                )}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} — ${item.client}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
                <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center bg-paper text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-4 border-t border-line pt-3">
                <div>
                  <h3 className="font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-stone">
                    {item.client} · {item.year}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative my-4 w-full max-w-5xl bg-paper"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center bg-paper text-ink shadow-sm transition-colors hover:bg-ink hover:text-paper"
              aria-label="Close project"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-square bg-charcoal">
                <Image
                  src={selected.image}
                  alt={`${selected.title} — ${selected.client}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 sm:p-9 lg:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-gold-deep">
                  {selected.category} · {selected.year}
                </p>
                <h2 className="mt-4 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
                  {selected.title}
                </h2>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-stone">
                  {selected.client}
                </p>
                <p className="mt-6 text-[14px] leading-[1.85] text-stone">
                  {selected.description}
                </p>

                <div className="mt-7 border-t border-line pt-5">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.17em] text-stone">
                    Services used
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.services.map((service) => (
                      <span key={service} className="border border-line px-3 py-1.5 text-[11px] text-ink-soft">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/quote?service=${encodeURIComponent(selected.category)}&product=${encodeURIComponent(
                    selected.title
                  )}`}
                  className="group mt-8 inline-flex items-center gap-3 bg-ink px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink"
                >
                  Request something similar
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
