import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageClassName?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  imageClassName,
  children,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line", className)}>
      <div className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-gold/6 blur-3xl" aria-hidden="true" />
      <div className="container-wide relative z-10 pb-14 pt-10 lg:pb-20 lg:pt-14">
        <div className="flex items-center justify-between gap-6 border-b border-line pb-5 text-[10px] font-semibold uppercase tracking-[0.19em] text-stone">
          <span className="inline-flex items-center gap-2.5">
            <span className="gold-dot" />
            {eyebrow}
          </span>
          <span className="hidden text-stone/70 sm:block">Nairobi · Kenya</span>
        </div>

        <div className={cn("mt-10 grid gap-10 lg:mt-14", image ? "lg:grid-cols-12 lg:gap-12" : "")}>
          <div className={cn(image ? "lg:col-span-7" : "max-w-4xl")}>
            <h1 className="display-title text-balance text-ink">{title}</h1>
            <div className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-stone">
              {description}
            </div>
            {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
            {aside}
          </div>

          {image && (
            <div className="lg:col-span-5">
              <div className={cn("relative aspect-[4/5] overflow-hidden bg-charcoal", imageClassName)}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-ink/10" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
