"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import type { CatalogOption } from "@/content/catalog";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

interface ProductQuotePanelProps {
  productName: string;
  basePrice: number;
  colors: string[];
  options: CatalogOption[];
}

export function ProductQuotePanel({
  productName,
  basePrice,
  colors,
  options,
}: ProductQuotePanelProps) {
  const [color, setColor] = useState(colors[0] ?? "");
  const [option, setOption] = useState(options[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);

  const selected = useMemo(
    () => options.find((entry) => entry.label === option),
    [options, option]
  );
  const unitPrice = selected?.priceOverride ?? basePrice;
  const hasPrice = unitPrice > 0;

  const params = new URLSearchParams({
    product: productName,
    service: "Customized Merchandise",
    quantity: String(quantity),
  });
  if (color) params.set("color", color);
  if (option) params.set("option", option);

  const quoteHref = `/quote?${params.toString()}`;
  const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hello JsCreatives, I would like a quote for ${productName}. Quantity: ${quantity}. Colour: ${
      color || "to confirm"
    }. Option: ${option || "to confirm"}.`
  )}`;

  return (
    <div className="mt-8 space-y-7">
      <div className="border-y border-line py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-stone">
          {hasPrice ? "Starting price" : "Pricing"}
        </p>
        <p className="mt-2 font-display text-[28px] font-medium tracking-[-0.04em] text-ink">
          {hasPrice
            ? `From KES ${new Intl.NumberFormat("en-KE").format(unitPrice)}`
            : "Quoted to your specification"}
        </p>
        <p className="mt-1 text-[11px] text-stone">
          Final price depends on quantity, artwork and finishing.
        </p>
      </div>

      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.19em] text-ink">
              Preferred colour
            </h3>
            <span className="text-[11px] text-stone">{color || "To confirm"}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setColor(entry)}
                aria-pressed={color === entry}
                className={cn(
                  "border px-3 py-2 text-[11px] transition-colors",
                  color === entry
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-stone hover:border-ink hover:text-ink"
                )}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>
      )}

      {options.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.19em] text-ink">
              Size or option
            </h3>
            <span className="text-[11px] text-stone">{option}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {options.map((entry) => (
              <button
                key={entry.label}
                type="button"
                onClick={() => setOption(entry.label)}
                aria-pressed={option === entry.label}
                className={cn(
                  "border px-3 py-2 text-[11px] transition-colors",
                  option === entry.label
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-stone hover:border-ink hover:text-ink"
                )}
              >
                {entry.label}
                {entry.priceOverride ? ` · KES ${new Intl.NumberFormat("en-KE").format(entry.priceOverride)}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.19em] text-ink">Quantity</h3>
        <div className="mt-3 flex w-fit items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="flex h-10 w-10 items-center justify-center text-stone transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-40"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => {
              const next = Number(event.target.value);
              setQuantity(Number.isFinite(next) ? Math.max(1, Math.floor(next)) : 1);
            }}
            aria-label="Quantity"
            className="h-10 w-16 border-x border-line bg-transparent text-center text-[13px] text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQuantity((value) => value + 1)}
            className="flex h-10 w-10 items-center justify-center text-stone transition-colors hover:bg-paper-deep hover:text-ink"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          href={quoteHref}
          className="group inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink"
        >
          Add to quote request
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-line px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
