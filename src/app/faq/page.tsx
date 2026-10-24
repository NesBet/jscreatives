"use client";

import { useState } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I start a branding or print project?",
    answer:
      "Send us a brief through the Contact page with what you are launching, the pieces you need, quantities and your deadline. We reply with a scope, production route and quote.",
  },
  {
    question: "Do you design as well as print?",
    answer:
      "Yes. We handle identity design, artwork development and production. You can come with a finished logo or start from a blank page — either way we will prepare print-ready files.",
  },
  {
    question: "What can you brand?",
    answer:
      "Apparel, caps, totes, backpacks, drinkware, notebooks, business cards, letterheads, stickers, banners and custom packaging. If it can be printed or embroidered, ask us.",
  },
  {
    question: "Can I order small quantities?",
    answer:
      "Stock merchandise can be ordered in small quantities through the shop. Custom production runs have minimum order quantities that depend on the item and print method — we will confirm them in your quote.",
  },
  {
    question: "What is your turnaround time?",
    answer:
      "In-stock branded merchandise usually ships within 2-5 business days. Custom identity and production projects typically take 2-3 weeks after artwork approval, depending on quantity and finishing.",
  },
  {
    question: "Will I see a proof before production?",
    answer:
      "Always. We send a digital proof showing placement, colour and sizing. Production only begins after you approve it in writing.",
  },
  {
    question: "How does payment work?",
    answer:
      "Shop orders are paid securely through Paystack by card or mobile money. Larger projects are invoiced with a deposit before production and the balance before delivery.",
  },
  {
    question: "Can I return branded or printed items?",
    answer:
      "Custom-made and personalised items are non-returnable unless they are defective or differ from the approved proof. Unused stock items can be returned within 7 days. See our Returns page for details.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="double-bezel rounded-2xl overflow-hidden animate-fade-in-up">
      <div className="double-bezel-inner rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <span className="text-base font-medium text-white">{question}</span>
          <svg
            className={cn(
              "h-5 w-5 flex-shrink-0 text-red-500 transition-transform duration-300",
              open && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          className={cn(
            "grid transition-all duration-300 ease-[var(--ease-smooth)]",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <p className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 py-24 lg:py-32">
        <header className="animate-fade-in-up text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Help Center</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl font-[var(--font-display)]">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="mt-6 text-slate-400">
            Everything you need to know about projects, production, delivery and returns.
          </p>
        </header>

        <div className="mt-14 space-y-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 px-6 py-12 text-center animate-fade-in-up">
          <h2 className="text-2xl font-semibold text-white font-[var(--font-display)]">
            Still have a question?
          </h2>
          <p className="text-slate-400">Tell us what you are working on and we will point you in the right direction.</p>
          <MagneticButton href="/contact">Contact Us</MagneticButton>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-white">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
