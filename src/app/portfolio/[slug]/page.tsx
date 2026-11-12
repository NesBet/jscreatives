import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteButton } from "@/components/ui/site-button";
import { Reveal } from "@/components/ui/reveal";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/lib/case-studies";

export const dynamic = "force-dynamic";

export const revalidate = 300;

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getCaseStudyBySlug(slug);
  if (!story) return {};

  return {
    title: `${story.title} | Branding Journey`,
    description: story.summary,
    alternates: { canonical: `/portfolio/${story.slug}` },
    openGraph: {
      title: story.title,
      description: story.summary,
      images: [{ url: story.coverUrl, alt: story.coverAlt || story.title }],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const story = await getCaseStudyBySlug(slug);
  if (!story) notFound();

  const moreStories = (await getPublishedCaseStudies({ limit: 3 })).filter(
    (item) => item.id !== story.id
  );
  const paragraphs = story.story.split(/\n{2,}/).filter(Boolean);
  const stages = Array.from(new Set(story.images.map((image) => image.stage)));

  return (
    <>
      <section className="border-b border-line">
        <div className="container-wide pt-8 lg:pt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          <div className="mt-8 grid gap-10 pb-12 lg:grid-cols-12 lg:gap-14 lg:pb-16">
            <div className="lg:col-span-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-gold-deep">
                {story.category} · {story.year}
              </p>
              <h1 className="display-title mt-5 max-w-4xl text-ink">
                {story.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-stone">
                {story.summary}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
                {story.services.map((service) => (
                  <span
                    key={service}
                    className="border border-line px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                <Image
                  src={story.coverUrl}
                  alt={story.coverAlt || story.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="eyebrow">The story</p>
            <div className="mt-6 space-y-5">
              {paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 40}>
                  <p className="max-w-3xl text-[15px] leading-[1.9] text-ink-soft">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="border-t border-line pt-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone">
                Client
              </p>
              <p className="mt-2 font-display text-xl font-medium text-ink">{story.client}</p>
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone">
                Year
              </p>
              <p className="mt-2 text-[14px] text-ink-soft">{story.year}</p>
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-stone">
                Services
              </p>
              <ul className="mt-2 space-y-1.5">
                {story.services.map((service) => (
                  <li key={service} className="text-[13px] text-ink-soft">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {story.images.length > 0 && (
        <section className="border-y border-line bg-paper-deep py-16 lg:py-24">
          <div className="container-wide">
            <Reveal>
              <p className="eyebrow">Behind the scenes</p>
              <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
                Inside the <span className="text-gold-deep">process.</span>
              </h2>
            </Reveal>

            <div className="mt-10 space-y-12">
              {stages.map((stage) => {
                const images = story.images.filter((image) => image.stage === stage);
                return (
                  <div key={stage}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                      {stage.replaceAll("_", " ")}
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {images.map((image, index) => (
                        <Reveal key={image.id} delay={index * 50}>
                          <figure>
                            <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
                              <Image
                                src={image.url}
                                alt={image.altText || image.caption || story.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                            {(image.caption || image.altText) && (
                              <figcaption className="mt-3 text-[12px] leading-relaxed text-stone">
                                {image.caption || image.altText}
                              </figcaption>
                            )}
                          </figure>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {moreStories.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-4">
              <h2 className="display-subtitle text-ink">More journeys</h2>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone hover:text-ink"
              >
                All work
                <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {moreStories.map((item) => (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.slug}`}
                  className="group grid grid-cols-[120px_1fr] gap-4 border-t border-line pt-4"
                >
                  <div className="relative aspect-square overflow-hidden bg-charcoal">
                    <Image
                      src={item.coverUrl}
                      alt={item.coverAlt || item.title}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                      {item.client}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-medium leading-snug text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-stone">
                      {item.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-paper-deep py-16 lg:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Your project next</p>
            <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
              Have a story worth
              <br />
              <span className="text-gold-deep">making?</span>
            </h2>
          </div>
          <SiteButton href="/quote" variant="ink" size="lg">
            Start a project
          </SiteButton>
        </div>
      </section>
    </>
  );
}
