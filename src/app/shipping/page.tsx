import Link from "next/link";
import { DoubleBezelCard } from "@/components/ui/DoubleBezelCard";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const metadata = {
  title: "Shipping Info - JSCREATIVES",
  description:
    "Delivery times, costs and tracking for JSCREATIVES merchandise and print orders across Kenya.",
};

const steps = [
  {
    title: "Place Your Order",
    description: "Order stocked merchandise online, or approve a project quote for custom production.",
  },
  {
    title: "We Produce & Check",
    description: "Your pieces are printed, embroidered or finished, then quality-checked against the approved proof.",
  },
  {
    title: "Tracked Delivery",
    description: "We hand off to our courier and share tracking details so you can follow the order to your door.",
  },
];

const regions = [
  { region: "Nairobi & Metro", time: "1-2 business days", note: "Same-city express available" },
  { region: "Major Towns", time: "2-3 business days", note: "Nakuru, Kisumu, Mombasa, Eldoret" },
  { region: "Other Regions", time: "3-5 business days", note: "Nationwide coverage" },
];

export default function ShippingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-24 lg:py-32">
        <header className="max-w-3xl animate-fade-in-up">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-500">Delivery</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-[var(--font-display)]">
            Shipping <span className="gradient-text">Info</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            We deliver branded merchandise and print projects across Kenya with tracking on every
            order. Here&apos;s what to expect from checkout to your doorstep.
          </p>
        </header>

        <section className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            How Delivery Works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <DoubleBezelCard key={step.title} variant="interactive" padding="lg" className="animate-fade-in-up">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-red-500 font-semibold font-[var(--font-display)]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white font-[var(--font-display)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </DoubleBezelCard>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <DoubleBezelCard variant="elevated" padding="lg" className="animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-white font-[var(--font-display)]">Estimated Delivery Times</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-default)] text-slate-400">
                    <th className="py-3 pr-4 font-medium">Region</th>
                    <th className="py-3 pr-4 font-medium">Delivery Time</th>
                    <th className="py-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r) => (
                    <tr key={r.region} className="border-b border-[var(--color-border-subtle)]">
                      <td className="py-4 pr-4 font-medium text-white">{r.region}</td>
                      <td className="py-4 pr-4 text-slate-300">{r.time}</td>
                      <td className="py-4 text-slate-400">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DoubleBezelCard>
        </section>

        <section className="mt-20 grid gap-6 sm:grid-cols-2">
          <DoubleBezelCard padding="lg" className="animate-fade-in-up">
            <h3 className="text-xl font-semibold text-white font-[var(--font-display)]">Tracking</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Every order ships with tracking. You&apos;ll get a tracking link by email as soon as your
              order leaves our studio.
            </p>
          </DoubleBezelCard>
          <DoubleBezelCard padding="lg" className="animate-fade-in-up">
            <h3 className="text-xl font-semibold text-white font-[var(--font-display)]">Shipping Costs</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Shipping is calculated at checkout based on your delivery location. Orders above our
              free-shipping threshold ship at no extra cost.
            </p>
          </DoubleBezelCard>
        </section>

        <section className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 px-6 py-14 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold tracking-tight text-white font-[var(--font-display)]">
            Ready to brand your next drop?
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <MagneticButton size="lg" href="/catalog">
              Shop Collection
            </MagneticButton>
            <MagneticButton variant="secondary" size="lg" href="/returns">
              Returns Policy
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
