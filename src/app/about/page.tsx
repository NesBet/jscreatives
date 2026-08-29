import Link from "next/link";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata = {
  title: "About JSCREATIVES - Premium Football Jerseys Kenya",
  description:
    "Learn about JSCREATIVES, your home for premium football jerseys and custom name & number printing across Kenya.",
};

const values = [
  {
    title: "Authentic Quality",
    description:
      "Every jersey is sourced and crafted to match official standards, with premium stitching and moisture-wicking comfort.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Custom Printing",
    description:
      "Add your own name and number with professional heat-press printing that lasts wash after wash.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: "Fast Nationwide Delivery",
    description:
      "We deliver across Kenya with tracking on every order, getting your kit to your door in 2-5 business days.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

const stats = [
  { value: "6+", label: "Top Clubs" },
  { value: "2-5", label: "Day Delivery" },
  { value: "100%", label: "Authentic" },
  { value: "24/7", label: "Support" },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-24 lg:py-32">
        <header className="max-w-3xl animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Our Story</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-[var(--font-display)]">
            About <span className="gradient-text">JSCREATIVES</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            JSCREATIVES was born from a simple belief: every football fan deserves to wear their
            passion with pride. We bring premium, authentic jerseys and professional custom printing
            to fans across Kenya.
          </p>
        </header>

        <section className="mt-16">
          <DoubleBezelCard variant="elevated" padding="lg" className="animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white font-[var(--font-display)]">Our Mission</h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              To make authentic football culture accessible to every supporter — combining official
              and replica kits from the world&apos;s top clubs with personalized name &amp; number
              printing, delivered reliably and affordably, anywhere in Kenya.
            </p>
          </DoubleBezelCard>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            What Sets Us Apart
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <DoubleBezelCard key={value.title} variant="interactive" padding="lg" className="animate-fade-in-up">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
                  {value.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white font-[var(--font-display)]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{value.description}</p>
              </DoubleBezelCard>
            ))}
          </div>
        </section>

        <section className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="double-bezel rounded-2xl p-6 text-center animate-fade-in-up"
            >
              <p className="text-3xl font-bold text-red-500 font-[var(--font-display)]">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 px-6 py-14 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            Ready to wear your passion?
          </h2>
          <p className="max-w-xl text-slate-400">
            Browse our collection of premium kits or reach out and we&apos;ll help you create
            something uniquely yours.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <MagneticButton size="lg" href="/catalog">
              Shop Collection
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg" href="/contact">
              Contact Us
            </MagneticButton>
          </div>
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
