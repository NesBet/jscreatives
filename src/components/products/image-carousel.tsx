"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Code2, Play } from "lucide-react";
import { SiteMedia } from "@/components/site/site-media";
import { cn } from "@/lib/utils";
import type { MediaValue } from "@/lib/media-types";

export interface CarouselMedia extends MediaValue {
  id?: string;
}

interface ImageCarouselProps {
  items: CarouselMedia[];
  className?: string;
}

function Thumbnail({ item, alt }: { item: CarouselMedia; alt: string }) {
  if (item.embedUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-charcoal text-paper/70">
        <Code2 className="h-5 w-5" />
      </div>
    );
  }

  if (item.url && item.mediaKind === "VIDEO") {
    return (
      <div className="relative h-full w-full bg-charcoal">
        <video
          src={item.url}
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink/30 text-paper">
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>
    );
  }

  return (
    <SiteMedia
      media={{ ...item, altText: alt }}
      sizes="80px"
      className="transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function ImageCarousel({ items, className }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex((index + count) % count);
    },
    [count]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(0);
  }, [count]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      if (event.key === "ArrowLeft") goTo(activeIndex - 1);
      if (event.key === "ArrowRight") goTo(activeIndex + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, goTo]);

  if (count === 0) return null;

  const active = items[Math.min(activeIndex, count - 1)];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        className="relative aspect-square overflow-hidden bg-charcoal"
        aria-roledescription="carousel"
        aria-label="Product media"
      >
        <SiteMedia
          media={active}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          videoControls
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/90 text-ink backdrop-blur-sm transition-colors hover:bg-gold"
              aria-label="Previous product media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-paper/90 text-ink backdrop-blur-sm transition-colors hover:bg-gold"
              aria-label="Next product media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 z-10 bg-ink/70 px-2.5 py-1 text-[10px] font-semibold text-paper backdrop-blur-sm">
              {activeIndex + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {items.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "group relative aspect-square overflow-hidden border-2 bg-charcoal transition-colors",
                index === activeIndex
                  ? "border-gold"
                  : "border-line hover:border-stone"
              )}
              aria-label={`View product media ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <Thumbnail
                item={item}
                alt={item.altText || `Product media ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
