import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SiteButton } from "@/components/ui/site-button";
import { Reveal } from "@/components/ui/reveal";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CATALOG } from "@/content/catalog";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Explore branded apparel, office stationery, promotional merchandise, bags, marketing materials, event branding and personalized gifts from JsCreatives in Kenya.",
  alternates: { canonical: "/products" },
};

const orderingSteps = [
  {
    number: "01",
    title: "Choose a product",
    description: "Start with a category or send us a reference of what you have in mind.",
  },
  {
    number: "02",
    title: "Share your artwork",
    description: "Send a logo, design file or rough idea. We will advise on the best production route.",
  },
  {
    number: "03",
    title: "Approve and receive",
    description: "We confirm the mockup, quantity and quote before production begins.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our products"
        title={
          <>
            Products made
            <br />
            to carry your <span className="text-gold-deep">brand.</span>
          </>
        }
        description={
          <p>
            Apparel, stationery, merchandise, bags, marketing material, event
            branding and gifts. Every item is produced to order and finished with
            your artwork, colours and details.
          </p>
        }
        image="/images/brand/merch-box.jpg"
        imageAlt="A branded corporate gift box produced by JsCreatives"
      >
        <SiteButton href="/quote" variant="ink">
          Request a quote
        </SiteButton>
        <SiteButton href="/contact" variant="outline">
          Ask about an item
        </SiteButton>
      </PageHero>

      <CatalogBrowser products={CATALOG} />

      <section className="border-y border-line bg-paper-deep py-16 lg:py-20">
        <div className="container-wide">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="eyebrow">Ordering</p>
                <h2 className="display-subtitle mt-5 text-ink">
                  Simple from the
                  <br />
                  first <span className="text-gold-deep">enquiry.</span>
                </h2>
                <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-stone">
                  We quote every product to your quantity, artwork and finishing.
                  No checkout, no guesswork, just a clear production plan.
                </p>
              </div>
              <div className="lg:col-span-8">
                <div className="grid gap-8 sm:grid-cols-3">
                  {orderingSteps.map((step) => (
                    <div key={step.number} className="border-t border-line pt-4">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-gold-deep">
                        {step.number}
                      </span>
                      <h3 className="mt-3 font-display text-[17px] font-medium tracking-[-0.02em] text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[12px] leading-relaxed text-stone">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Need something else?</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              If it can be printed or branded,
              <br />
              we can <span className="text-gold-deep">quote it.</span>
            </h2>
          </div>
          <SiteButton href="/contact" variant="ink" size="lg">
            Tell us what you need
          </SiteButton>
        </div>
      </section>
    </>
  );
}
