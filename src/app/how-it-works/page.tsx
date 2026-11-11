import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Clock, FileCheck2, MessageSquare, Palette } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SiteButton } from "@/components/ui/site-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { detailedProcess } from "@/content/site";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how a JsCreatives project moves from enquiry and quotation to design approval, production, quality check and delivery.",
  alternates: { canonical: "/how-it-works" },
};

const prepare = [
  {
    icon: MessageSquare,
    title: "What you need",
    description: "The product, quantity and a rough idea of the finish you have in mind.",
  },
  {
    icon: Palette,
    title: "Your artwork",
    description: "A logo or design file if you have one. We can refine or recreate it.",
  },
  {
    icon: FileCheck2,
    title: "Colours and sizes",
    description: "Preferred colours, sizes and any placement requirements.",
  },
  {
    icon: Clock,
    title: "Your deadline",
    description: "The date you need it in hand, not just the date you are ordering.",
  },
];

const faqs = [
  {
    question: "Do I need finished artwork to request a quote?",
    answer:
      "No. Send what you have, even a rough sketch or reference. We can advise on file setup, prepare a print-ready version and share a mockup for approval before production.",
  },
  {
    question: "Is there a minimum order quantity?",
    answer:
      "It depends on the product and production method. Some items can be produced in small numbers, while custom manufacturing and certain print methods have minimums. Your quotation will state the minimum clearly.",
  },
  {
    question: "How is payment handled?",
    answer:
      "Once you approve the quotation and artwork, we confirm the payment terms in writing. Larger production runs are typically invoiced with a deposit before production and the balance before delivery.",
  },
  {
    question: "Can you deliver outside Nairobi?",
    answer:
      "Yes. We serve clients across Kenya and can arrange delivery or courier to other regions. Delivery costs and timelines are confirmed with your quotation.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={
          <>
            From first message
            <br />
            to final <span className="text-gold-deep">delivery.</span>
          </>
        }
        description={
          <p>
            A clear, five-step process with no surprises. You always know what is
            happening, what has been approved and when your order will be ready.
          </p>
        }
        image="/images/brand/work-lumen-studio.jpg"
        imageAlt="Design, print and stationery production for Lumen Studio"
      >
        <SiteButton href="/quote" variant="ink">
          Start your quote
        </SiteButton>
        <SiteButton href="/contact" variant="outline">
          Ask a question
        </SiteButton>
      </PageHero>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">The process</p>
              <h2 className="display-title mt-6 text-ink">
                Five steps.
                <br />
                One <span className="text-gold-deep">standard.</span>
              </h2>
              <p className="mt-6 max-w-sm text-[14px] leading-[1.85] text-stone">
                Most projects follow the same rhythm. The detail changes with the
                product, but the care does not.
              </p>
              <div className="mt-8 border-t border-line pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  Need help now?
                </p>
                <a
                  href="https://wa.me/254780237794"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-ink"
                >
                  Chat with the studio
                  <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
                </a>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {detailedProcess.map((step, index) => (
                <Reveal key={step.step} delay={index * 50}>
                  <div className="grid grid-cols-[auto_1fr] gap-5 border-b border-line py-7 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:py-9">
                    <span className="font-display text-[26px] font-medium leading-none tracking-[-0.04em] text-gold-deep sm:text-[34px]">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.03em] text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-[13px] leading-[1.85] text-stone">
                        {step.description}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-2 border border-line bg-paper-light px-3 py-2 text-[11px] text-stone">
                        <Check className="h-3 w-3 text-gold-deep" strokeWidth={2} />
                        {step.note}
                      </p>
                    </div>
                    <span className="hidden self-center text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-light sm:block">
                      0{index + 1} / 05
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-16 lg:py-24">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Before you start"
              title={
                <>
                  What to have
                  <br />
                  <span className="text-gold-deep">ready.</span>
                </>
              }
              description="You do not need everything figured out. These four details help us quote accurately and avoid delays later."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {prepare.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <div className="border-t border-line-dark pt-5">
                  <item.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.4} />
                  <h3 className="mt-4 font-display text-[17px] font-medium tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-stone">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Good to know</p>
            <h2 className="display-title mt-6 text-ink">
              Questions,
              <br />
              <span className="text-gold-deep">answered.</span>
            </h2>
            <div className="mt-8 relative aspect-[4/3] overflow-hidden bg-charcoal">
              <Image
                src="/images/brand/merch-cards.jpg"
                alt="Premium business cards produced by JsCreatives"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <div className="border-t border-line">
              {faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-display text-[17px] font-medium tracking-[-0.02em] text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-line text-stone transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 text-[13px] leading-[1.85] text-stone">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-stone">
              <span>Still unsure?</span>
              <Link href="/contact" className="link-line text-ink">
                Send us a message
              </Link>
              <Link href="/quote" className="link-line text-ink">
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-deep py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Ready to begin?</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Send the brief.
              <br />
              We will take it from <span className="text-gold-deep">there.</span>
            </h2>
          </div>
          <SiteButton href="/quote" variant="ink" size="lg">
            Request a free quote
          </SiteButton>
        </div>
      </section>
    </>
  );
}
