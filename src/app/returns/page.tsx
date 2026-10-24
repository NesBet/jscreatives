import Link from "next/link";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata = {
  title: "Returns & Exchanges - JSCREATIVES",
  description:
    "Our return and exchange policy for JSCREATIVES merchandise and print orders across Kenya.",
};

const policy = [
  {
    title: "7-Day Window",
    description:
      "Unused stock merchandise in original condition can be returned or exchanged within 7 days of delivery.",
  },
  {
    title: "Original Condition",
    description:
      "Items must be unworn, unwashed and with all tags attached. Proof of purchase is required.",
  },
  {
    title: "Custom Production",
    description:
      "Personalised and made-to-order items — including printed apparel, packaging and signage — are non-returnable unless defective or different from the approved proof.",
  },
  {
    title: "Defective Items",
    description:
      "If your order arrives damaged or faulty, contact us immediately for a repair, replacement or refund.",
  },
];

const steps = [
  { title: "Request", description: "Reach out via our Contact page with your order number and reason." },
  { title: "Approve", description: "Our team reviews and shares the return instructions and address." },
  { title: "Ship", description: "Send the item back using a tracked courier within Kenya." },
  { title: "Refund", description: "Once received and inspected, refunds are processed to your original method." },
];

export default function ReturnsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-24 lg:py-32">
        <header className="max-w-3xl animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Policy</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-[var(--font-display)]">
            Returns & <span className="gradient-text">Exchanges</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            We want you to love what we make. If something isn&apos;t right, here&apos;s how our
            return and exchange process works.
          </p>
        </header>

        <section className="mt-16">
          <div className="grid gap-6 sm:grid-cols-2">
            {policy.map((item) => (
              <DoubleBezelCard key={item.title} variant="interactive" padding="lg" className="animate-fade-in-up">
                <h3 className="text-xl font-semibold text-white font-[var(--font-display)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </DoubleBezelCard>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            How To Return
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <DoubleBezelCard key={step.title} padding="lg" className="animate-fade-in-up">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-500 font-semibold font-[var(--font-display)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white font-[var(--font-display)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </DoubleBezelCard>
            ))}
          </div>
        </section>

        <section className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 px-6 py-14 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            Need to start a return?
          </h2>
          <p className="max-w-xl text-slate-400">
            Send us a message with your order details and we&apos;ll guide you through the next steps.
          </p>
          <MagneticButton size="lg" href="/contact">
            Contact Support
          </MagneticButton>
        </section>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-slate-500 transition-colors hover:text-white">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
