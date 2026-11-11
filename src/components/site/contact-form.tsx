"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { serviceOptions } from "@/content/services";

const inputClass =
  "w-full border border-line bg-paper-light px-4 py-3.5 text-[13px] text-ink outline-none transition-colors placeholder:text-stone/50 focus:border-ink";

const labelClass = "mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-ink";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "We could not send your message. Please try again.");
        setStatus("idle");
        return;
      }

      setMessage(result.message || "Thank you. We will be in touch shortly.");
      setStatus("success");
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
        <h3 className="mt-6 font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium leading-tight tracking-[-0.035em] text-ink">
          Message received.
        </h3>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-stone">{message}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 inline-flex items-center gap-3 border border-ink/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          Send another message
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-paper-light p-6 sm:p-8 lg:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Full name *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email address *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone / WhatsApp
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254 700 000 000"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            Company / organisation
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Optional"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-service" className={labelClass}>
            What can we help with?
          </label>
          <select id="contact-service" name="service" defaultValue="" className={inputClass}>
            <option value="">Select a service (optional)</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className={labelClass}>
            Your message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            rows={6}
            placeholder="Tell us what you are planning, the quantity you need and your deadline."
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="mt-5 border border-red-800/20 bg-red-50 px-4 py-3 text-[12px] text-red-800">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-xs text-[10px] leading-relaxed text-stone">
          We use your details only to respond to this enquiry.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              Sending
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Send message
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
