"use client";

import { useState } from "react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I order a jersey with custom name & number?",
    answer:
      "Add your favourite jersey to the cart, enable custom printing, and enter the name and number you'd like. Our team heat-presses it professionally before shipping.",
  },
  {
    question: "Which clubs and kits do you stock?",
    answer:
      "We carry home and away kits from top clubs including Manchester United, Arsenal, Chelsea, Manchester City, Tottenham and Liverpool, with more added regularly.",
  },
  {
    question: "What are your delivery times within Kenya?",
    answer:
      "Most orders are delivered within 2-5 business days. You'll receive tracking details once your order ships.",
  },
  {
    question: "How does payment work?",
    answer:
      "We use Paystack for secure checkout. You can pay with mobile money or card, and your order is processed only after payment is confirmed.",
  },
  {
    question: "Can I return or exchange a jersey?",
    answer:
      "Yes. Unworn jerseys in original condition can be returned within 7 days of delivery. Custom-printed items are non-returnable unless defective. See our Returns page for details.",
  },
  {
    question: "Are the jerseys authentic?",
    answer:
      "We source premium, authentic-quality kits that match official standards for materials, stitching and comfort.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use our Contact page to send a message, or reach us through the support links in the footer. We typically respond within one business day.",
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
            Everything you need to know about ordering, printing, shipping and returns.
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
          <p className="text-slate-400">Our team is happy to help you out.</p>
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
