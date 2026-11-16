import { prisma } from "./prisma";
import type { MediaValue } from "./media-types";
import type { ResolvedSiteImage } from "./site-images";

export async function getProductMediaMap(slugs: string[]) {
  const uniqueSlugs = Array.from(new Set(slugs));
  if (uniqueSlugs.length === 0) return new Map<string, MediaValue>();

  const products = await prisma.product.findMany({
    where: { slug: { in: uniqueSlugs } },
    select: {
      slug: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: {
          mediaKind: true,
          url: true,
          embedUrl: true,
          altText: true,
        },
      },
    },
  });

  const mediaBySlug = new Map<string, MediaValue>();
  for (const product of products) {
    const primary = product.images.find((image) => image.url || image.embedUrl);
    if (primary) {
      mediaBySlug.set(product.slug, {
        mediaKind: primary.mediaKind,
        url: primary.url,
        embedUrl: primary.embedUrl,
        altText: primary.altText,
      });
    }
  }

  return mediaBySlug;
}

export function resolveProductMedia(
  siteMedia: ResolvedSiteImage,
  storedMedia?: MediaValue
): MediaValue {
  if (siteMedia.isOverride) return siteMedia;
  if (storedMedia) {
    return {
      ...storedMedia,
      altText: storedMedia.altText || siteMedia.altText,
    };
  }
  return siteMedia;
}
