import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { CaseStudy, CaseStudyImage } from "@prisma/client";

type Journey = CaseStudy & {
  images: CaseStudyImage[];
  _count?: { images: number };
};

interface BrandingJourneysProps {
  stories: Journey[];
  compact?: boolean;
}

export function BrandingJourneys({ stories, compact = false }: BrandingJourneysProps) {
  if (stories.length === 0) return null;

  return (
    <section className="border-y border-line bg-paper-deep py-20 lg:py-28">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Behind the branding journeys</p>
              <h2 className="display-subtitle mt-5 max-w-2xl text-ink">
                The thinking, the process
                <br />
                and the <span className="text-gold-deep">hands behind it.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-stone lg:text-right">
              Follow a project from the first sketch through production to the
              finished pieces our clients put into the world.
            </p>
          </div>
        </Reveal>

        <div className={`mt-12 grid gap-5 ${compact ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {stories.map((story, index) => (
            <Reveal key={story.id} delay={index * 70}>
              <Link
                href={`/portfolio/${story.slug}`}
                className="group block overflow-hidden border border-line bg-paper"
              >
                <div className={`relative overflow-hidden bg-charcoal ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}>
                  <Image
                    src={story.coverUrl}
                    alt={story.coverAlt || story.title}
                    fill
                    sizes={compact ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
                    className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-4 top-4 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
                    {story.category}
                  </span>
                  <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center bg-paper text-ink transition-colors group-hover:bg-gold">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-gold-deep">
                    {story.client} · {story.year}
                  </p>
                  <h3 className="mt-2 font-display text-[21px] font-medium leading-snug tracking-[-0.03em] text-ink">
                    {story.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-stone">
                    {story.summary}
                  </p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone">
                    {story._count?.images ?? story.images.length} process images
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {compact && (
          <div className="mt-10 border-t border-line pt-6">
            <Link
              href="/portfolio"
              className="link-line inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
            >
              Explore all branding journeys
              <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
