import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Eye } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SiteButton } from "@/components/ui/site-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { coreValues, site, whyChoose } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet JsCreatives, a Nairobi printing and branding studio helping individuals, businesses, organizations and institutions bring their ideas to life.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About JsCreatives"
        title={
          <>
            A studio built on the belief
            <br />
            that brands should feel <span className="text-gold-deep">real.</span>
          </>
        }
        description={
          <>
            <p>
              JsCreatives is a printing, branding and creative solutions company
              based in Nairobi, Kenya. We help people and organizations turn ideas
              into well-designed, well-produced things they are proud to put their
              name on.
            </p>
            <p className="mt-4">
              Our work sits where design meets production: identity, print,
              merchandise, packaging and the branded environments customers
              experience.
            </p>
          </>
        }
        image="/images/brand/work-mara-co.jpg"
        imageAlt="Storefront branding and signage produced for Mara & Co."
      >
        <SiteButton href="/quote" variant="ink">
          Start a project
        </SiteButton>
        <SiteButton href="/portfolio" variant="outline">
          See our work
        </SiteButton>
      </PageHero>

      <section className="paper-grain relative py-20 lg:py-28">
        <div className="container-wide relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Our story</p>
            <h2 className="display-title mt-6 text-ink">
              Rooted in craft.
              <br />
              Built for <span className="text-gold-deep">impact.</span>
            </h2>
            <div className="mt-8 border-l border-gold/50 pl-5">
              <p className="font-display text-lg font-normal italic leading-snug text-ink-soft">
                &ldquo;{site.tagline}&rdquo;
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone">
                The JsCreatives promise
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={100}>
            <div className="space-y-5 text-[15px] leading-[1.85] text-stone">
              <p>
                JsCreatives was built around a simple observation: a brand is
                experienced through the things people touch. The shirt a team wears,
                the card a client keeps, the packaging a customer opens, the sign
                above a door. These are not small details. They are the brand.
              </p>
              <p>
                That is why we bring creative direction, print and production
                together under one roof. Instead of passing your project between a
                designer, a printer and a supplier, you work with one studio that
                understands the whole picture and stays accountable from proof to
                delivery.
              </p>
              <p>
                Our clients include businesses, startups, organizations and
                institutions across Kenya and East Africa. Some come to us with a
                finished logo. Others come with a rough idea on a phone note. We
                meet both at the same place: a clear plan, a fair quotation and a
                finished piece that feels considered.
              </p>
            </div>

            <div className="mt-9 grid gap-5 border-t border-line pt-7 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                  Based in
                </p>
                <p className="mt-2 text-sm text-ink">{site.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                  Working with
                </p>
                <p className="mt-2 text-sm text-ink">Businesses &amp; institutions</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                  Serving
                </p>
                <p className="mt-2 text-sm text-ink">Kenya &amp; East Africa</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="What drives us"
              title={
                <>
                  A clear mission.
                  <br />
                  A bigger <span className="text-gold-deep">vision.</span>
                </>
              }
              description="We are not here to be the loudest studio in the room. We are here to be the one clients trust with the work that represents them."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col border border-line bg-paper-light p-7 sm:p-9">
                <span className="flex h-11 w-11 items-center justify-center border border-line text-gold-deep">
                  <Compass className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <h3 className="mt-6 font-display text-[26px] font-medium tracking-[-0.035em] text-ink">
                  Our mission
                </h3>
                <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-stone">
                  To help individuals, businesses, organizations and institutions
                  bring their ideas to life through quality printing, professional
                  branding, customized merchandise and thoughtful creative
                  solutions, delivered with consistency and care.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="flex h-full flex-col border border-line bg-paper-light p-7 sm:p-9">
                <span className="flex h-11 w-11 items-center justify-center border border-line text-gold-deep">
                  <Eye className="h-5 w-5" strokeWidth={1.4} />
                </span>
                <h3 className="mt-6 font-display text-[26px] font-medium tracking-[-0.035em] text-ink">
                  Our vision
                </h3>
                <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-stone">
                  To be the trusted partner brands turn to when they want to stand
                  out, show up professionally and be remembered, across Kenya and
                  beyond.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-wide">
          <Reveal>
            <SectionHeading
              eyebrow="Core values"
              title={
                <>
                  The standards behind
                  <br />
                  every <span className="text-gold-deep">piece.</span>
                </>
              }
              description="Six values that guide how we design, quote, produce and communicate."
            />
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <Reveal key={value.title} delay={(index % 3) * 70}>
                <div className="flex gap-5 border-t border-line pt-5">
                  <span className="font-display text-[12px] font-medium tracking-[0.05em] text-gold-deep">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-[20px] font-medium tracking-[-0.025em] text-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-stone">
                      {value.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              <Image
                src="/images/brand/work-orbit-tech.jpg"
                alt="Branded event merchandise produced for Orbit Tech"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">Why clients choose us</p>
              <h2 className="display-title mt-6 max-w-2xl text-ink">
                A partner who handles
                <br />
                the <span className="text-gold-deep">details.</span>
              </h2>
            </Reveal>

            <div className="mt-9 divide-y divide-line border-t border-line">
              {whyChoose.map((item, index) => (
                <Reveal key={item.title} delay={index * 40}>
                  <div className="grid grid-cols-[auto_1fr] gap-5 py-5">
                    <span className="font-display text-[12px] font-medium tracking-[0.05em] text-gold-deep">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[17px] font-medium tracking-[-0.02em] text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-stone">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Link
              href="/how-it-works"
              className="link-line mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              How we work
              <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Work with us</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Bring us your next idea.
              <br />
              We will help it <span className="text-gold-deep">land.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SiteButton href="/quote" variant="ink" size="lg">
              Request a quote
            </SiteButton>
            <SiteButton href="/contact" variant="outline" size="lg">
              Contact us
            </SiteButton>
          </div>
        </div>
      </section>
    </>
  );
}
