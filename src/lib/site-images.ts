import { prisma } from "@/lib/prisma";
import {
  siteImageDefinitions,
  siteImageDefinitionMap,
  type SiteImageDefinition,
} from "@/content/site-images";

export interface ResolvedSiteImage {
  key: string;
  url: string;
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
          url: override?.url ?? definition.defaultUrl,
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
): Pick<SiteImageDefinition, "defaultUrl" | "defaultAlt"> & {
  url: string;
  altText: string;
} {
  const resolved = images.get(key);
  const definition = siteImageDefinitionMap.get(key);

  return {
    defaultUrl: definition?.defaultUrl ?? "",
    defaultAlt: definition?.defaultAlt ?? "",
    url: resolved?.url ?? definition?.defaultUrl ?? "",
    altText: resolved?.altText ?? definition?.defaultAlt ?? "",
  };
}
