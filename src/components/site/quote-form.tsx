"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2, Paperclip, X } from "lucide-react";
import { CATALOG } from "@/content/catalog";
import { serviceOptions } from "@/content/services";
import { whatsappUrl } from "@/content/site";

export interface QuoteDefaults {
  service?: string;
  productName?: string;
  quantity?: string;
  preferredColor?: string;
  additionalInstructions?: string;
}

const inputClass =
  "w-full border border-line bg-paper-light px-4 py-3.5 text-[13px] text-ink outline-none transition-colors placeholder:text-stone/50 focus:border-ink";

const labelClass = "mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-ink";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function QuoteForm({ defaults = {} }: { defaults?: QuoteDefaults }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [successName, setSuccessName] = useState("");
  const [artwork, setArtwork] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFileError("");

    if (!file) {
      setArtwork(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Artwork must be 8MB or smaller.");
      setArtwork(null);
      event.target.value = "";
      return;
    }
    setArtwork(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (fileError) {
      setError(fileError);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website")) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        const detail =
          result.details && typeof result.details === "object"
            ? Object.values(result.details as Record<string, string[]>).flat()[0]
            : undefined;
        setError(detail || result.error || "We could not submit your quote request. Please try again.");
        setStatus("idle");
        return;
      }

      setSuccessName(String(formData.get("fullName") || ""));
      setStatus("success");
      setArtwork(null);
      form.reset();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-paper-light p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center border border-gold/40 bg-gold/10 text-gold-deep">
          <Check className="h-5 w-5" strokeWidth={2} />
        </span>
        <h2 className="mt-6 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">
          Request received{successName ? `, ${successName.split(" ")[0]}` : ""}.
        </h2>
        <p className="mt-4 max-w-lg text-[14px] leading-[1.85] text-stone">
          We have your details and artwork reference. Our team will review the brief
          and come back with a clear quotation, usually within one business day.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-3 bg-ink px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink"
          >
            Add details on WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="inline-flex items-center justify-center border border-ink/20 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-paper-light p-6 sm:p-8 lg:p-10">
      <fieldset>
        <legend className="mb-6 flex w-full items-center gap-3 border-b border-line pb-4 text-left">
          <span className="flex h-7 w-7 items-center justify-center border border-line text-[10px] font-semibold text-gold-deep">
            01
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
            About you
          </span>
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-name" className={labelClass}>
              Full name *
            </label>
            <input
              id="quote-name"
              name="fullName"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              placeholder="Your name"
              defaultValue=""
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-company" className={labelClass}>
              Company / organisation
            </label>
            <input
              id="quote-company"
              name="companyName"
              type="text"
              autoComplete="organization"
              placeholder="Optional"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-phone" className={labelClass}>
              Phone / WhatsApp *
            </label>
            <input
              id="quote-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+254 700 000 000"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-email" className={labelClass}>
              Email address *
            </label>
            <input
              id="quote-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="mb-6 flex w-full items-center gap-3 border-b border-line pb-4 text-left">
          <span className="flex h-7 w-7 items-center justify-center border border-line text-[10px] font-semibold text-gold-deep">
            02
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
            The project
          </span>
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-service" className={labelClass}>
              Service required *
            </label>
            <select
              id="quote-service"
              name="service"
              required
              defaultValue={defaults.service ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quote-product" className={labelClass}>
              Product or item
            </label>
            <input
              id="quote-product"
              name="productName"
              type="text"
              list="quote-product-options"
              defaultValue={defaults.productName ?? ""}
              placeholder="e.g. Branded T-shirts"
              className={inputClass}
            />
            <datalist id="quote-product-options">
              {CATALOG.map((product) => (
                <option key={product.slug} value={product.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="quote-quantity" className={labelClass}>
              Quantity *
            </label>
            <input
              id="quote-quantity"
              name="quantity"
              type="number"
              min={1}
              required
              defaultValue={defaults.quantity ?? "1"}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-color" className={labelClass}>
              Preferred colour
            </label>
            <input
              id="quote-color"
              name="preferredColor"
              type="text"
              defaultValue={defaults.preferredColor ?? ""}
              placeholder="e.g. Black, brand gold"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-date" className={labelClass}>
              Preferred delivery date
            </label>
            <input
              id="quote-date"
              name="preferredDeliveryDate"
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="quote-artwork" className={labelClass}>
              Artwork
            </label>
            <label
              htmlFor="quote-artwork"
              className="flex cursor-pointer items-center justify-between gap-3 border border-dashed border-line bg-paper px-4 py-3.5 text-[12px] text-stone transition-colors hover:border-ink"
            >
              <span className="inline-flex items-center gap-2 truncate">
                <Paperclip className="h-4 w-4 shrink-0 text-gold-deep" />
                {artwork ? artwork.name : "Attach a file (optional)"}
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.12em]">Browse</span>
            </label>
            <input
              id="quote-artwork"
              name="artwork"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.ai,.eps,.zip"
              onChange={onFileChange}
              className="sr-only"
            />
            {artwork && (
              <button
                type="button"
                onClick={() => setArtwork(null)}
                className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-stone hover:text-ink"
              >
                <X className="h-3 w-3" />
                Remove file
              </button>
            )}
            <p className="mt-2 text-[10px] text-stone">PDF, PNG, JPG, AI, EPS or ZIP. Max 8MB.</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="quote-description" className={labelClass}>
              Project description *
            </label>
            <textarea
              id="quote-description"
              name="description"
              required
              minLength={10}
              rows={5}
              placeholder="Tell us what you need, how it will be used, and any finishes or deadlines we should know about."
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="quote-instructions" className={labelClass}>
              Additional instructions
            </label>
            <textarea
              id="quote-instructions"
              name="additionalInstructions"
              rows={3}
              defaultValue={defaults.additionalInstructions ?? ""}
              placeholder="Placement, sizing, packaging, delivery notes or anything else."
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
      </fieldset>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {fileError && <p className="mt-5 text-[12px] text-red-800">{fileError}</p>}
      {error && (
        <p role="alert" className="mt-5 border border-red-800/20 bg-red-50 px-4 py-3 text-[12px] text-red-800">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="max-w-sm text-[10px] leading-relaxed text-stone">
          Sending this request does not commit you to an order. We will confirm
          pricing, artwork and timelines before production.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              Sending request
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Submit quote request
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
