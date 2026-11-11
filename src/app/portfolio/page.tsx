import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SiteButton } from "@/components/ui/site-button";
import { PortfolioBrowser } from "@/components/portfolio/portfolio-browser";

export const metadata: Metadata = {
  title: "Our Portfolio",
  description:
    "See selected printing, branding, apparel, packaging, signage and event branding projects produced by JsCreatives in Nairobi, Kenya.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Our portfolio"
        title={
          <>
            Work that speaks
            <br />
            before you <span className="text-gold-deep">do.</span>
          </>
        }
        description={
          <p>
            Branding, print, packaging, merchandise and event work produced for
            businesses, startups and institutions. A selection of recent projects
            from the studio.
          </p>
        }
        image="/images/brand/work-asali-botanics.jpg"
        imageAlt="Label and packaging design produced for Asali Botanics"
      >
        <SiteButton href="/quote" variant="ink">
          Start a project
        </SiteButton>
        <SiteButton href="/services" variant="outline">
          Explore services
        </SiteButton>
      </PageHero>

      <PortfolioBrowser />

      <section className="border-t border-line bg-paper-deep py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Your project next</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Have a brief, a rough idea
              <br />
              or just a <span className="text-gold-deep">reference?</span>
            </h2>
          </div>
          <SiteButton href="/contact" variant="ink" size="lg">
            Talk to us
          </SiteButton>
        </div>
      </section>
    </>
  );
}
