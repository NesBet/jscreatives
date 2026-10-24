import Link from "next/link";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata = {
  title: "About JSCREATIVES - Branding & Print Studio Kenya",
  description:
    "JSCREATIVES is a Nairobi branding and print studio creating identities, apparel, packaging and signage for brands across Kenya.",
};

const values = [
  {
    title: "Design-led",
    description:
      "Every project starts with the brand idea, not the product. We design the system before we choose the material.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    title: "Built in-house",
    description:
      "Printing, embroidery, cutting and finishing happen under one roof, so colour and quality stay consistent.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Reliable delivery",
    description:
      "Clear timelines, digital proofs and tracked delivery across Kenya. No surprises between approval and arrival.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
];

const stats = [
  { value: "7", label: "Product categories" },
  { value: "1", label: "Studio, end to end" },
  { value: "100%", label: "Artwork checked" },
  { value: "2-5", label: "Day delivery" },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <header className="max-w-3xl animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Our Story</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-[var(--font-display)]">
            About <span className="gradient-text">JSCREATIVES</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            JSCREATIVES is a branding and print studio in Nairobi. We help businesses turn an idea
            into a complete visual identity — then produce the apparel, packaging and print that
            carry it into the real world.
          </p>
        </header>

        <section className="mt-16">
          <DoubleBezelCard variant="elevated" padding="lg" className="animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white font-[var(--font-display)]">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              To make strong branding accessible to growing businesses: considered design, honest
              production advice and physical pieces that feel as good as they look. One studio,
              from the first sketch to the final delivery.
            </p>
          </DoubleBezelCard>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            How We Work
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
            Have a launch coming up?
          </h2>
          <p className="max-w-xl text-slate-400">
            Bring us the brief, the deadline and the quantity. We will help shape the rest.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <MagneticButton size="lg" href="/contact">
              Start a Project
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg" href="/catalog">
              Shop the Collection
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
