import { prisma } from "@/lib/prisma";
import {
  siteImageDefinitions,
  siteImageDefinitionMap,
  type SiteImageDefinition,
} from "@/content/site-images";

export interface ResolvedSiteImage {
  key: string;
  mediaKind: "IMAGE" | "VIDEO";
  url: string;
  embedUrl: string | null;
  altText: string;
  isOverride: boolean;
}

export async function getSiteImageMap(): Promise<Map<string, ResolvedSiteImage>> {
  const rows = await prisma.siteImage.findMany();
  const overrides = new Map(rows.map((row) => [row.key, row]));

  return new Map(
    siteImageDefinitions.map((definition) => {
      const override = overrides.get(definition.key);
      return [
        definition.key,
        {
          key: definition.key,
          mediaKind: override?.mediaKind ?? "IMAGE",
          url: override?.url ?? definition.defaultUrl,
          embedUrl: override?.embedUrl ?? null,
          altText: override?.altText ?? definition.defaultAlt,
          isOverride: Boolean(override),
        },
      ];
    })
  );
}

export function resolveSiteImage(
  images: Map<string, ResolvedSiteImage>,
  key: string
): Pick<SiteImageDefinition, "defaultUrl" | "defaultAlt"> &
  ResolvedSiteImage {
  const resolved = images.get(key);
  const definition = siteImageDefinitionMap.get(key);

  return {
    key,
    defaultUrl: definition?.defaultUrl ?? "",
    defaultAlt: definition?.defaultAlt ?? "",
    mediaKind: resolved?.mediaKind ?? "IMAGE",
    url: resolved?.url ?? definition?.defaultUrl ?? "",
    embedUrl: resolved?.embedUrl ?? null,
    altText: resolved?.altText ?? definition?.defaultAlt ?? "",
    isOverride: resolved?.isOverride ?? false,
  };
}
