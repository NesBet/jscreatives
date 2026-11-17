import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MediaValue } from "@/lib/media-types";

interface SiteMediaProps {
  media: MediaValue;
  sizes: string;
  className?: string;
  videoControls?: boolean;
  interactive?: boolean;
}

function canOptimize(url: string) {
  if (url.startsWith("/")) return true;
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith(".supabase.co") ||
      host === "res.cloudinary.com" ||
      host === "images.unsplash.com" ||
      host === "picsum.photos"
    );
  } catch {
    return false;
  }
}

export function SiteMedia({
  media,
  sizes,
  className,
  videoControls = true,
  interactive = true,
}: SiteMediaProps) {
  const label = media.altText || "JsCreatives media";
  const interactionClass = interactive ? undefined : "pointer-events-none";

  if (media.embedUrl) {
    return (
      <iframe
        src={media.embedUrl}
        title={label}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className={cn("h-full w-full border-0", interactionClass, className)}
      />
    );
  }

  if (media.url && media.mediaKind === "VIDEO") {
    return (
      <video
        src={media.url}
        controls={videoControls}
        muted={!videoControls}
        playsInline
        preload="metadata"
        aria-label={label}
        className={cn("h-full w-full object-cover", interactionClass, className)}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (media.url) {
    return (
      <Image
        src={media.url}
        alt={media.altText || ""}
        fill
        sizes={sizes}
        loading="lazy"
        decoding="async"
        unoptimized={!canOptimize(media.url)}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-charcoal text-[10px] uppercase tracking-[0.14em] text-paper/40",
        className
      )}
    >
      No media
    </div>
  );
}
