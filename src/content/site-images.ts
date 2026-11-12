import { CATALOG } from "@/content/catalog";
import { portfolioItems } from "@/content/portfolio";
import { socialGallery } from "@/content/site";

export interface SiteImageDefinition {
  key: string;
  label: string;
  group: string;
  defaultUrl: string;
  defaultAlt: string;
}

export const siteImageDefinitions: SiteImageDefinition[] = [
  {
    key: "home:hero-collage",
    label: "Homepage hero collage",
    group: "Homepage",
    defaultUrl: "/images/brand/hero-work-collage.jpg",
    defaultAlt:
      "A collection of branded merchandise, print and packaging produced by JsCreatives",
  },
  {
    key: "home:studio-image",
    label: "Homepage studio image",
    group: "Homepage",
    defaultUrl: "/images/brand/work-lumen-studio.jpg",
    defaultAlt: "Branded stationery and print collateral produced for Lumen Studio",
  },
  {
    key: "home:trust-avatar-1",
    label: "Homepage trust avatar 1",
    group: "Homepage",
    defaultUrl: "/images/brand/merch-cap.jpg",
    defaultAlt: "Branded cap",
  },
  {
    key: "home:trust-avatar-2",
    label: "Homepage trust avatar 2",
    group: "Homepage",
    defaultUrl: "/images/brand/merch-mug.jpg",
    defaultAlt: "Branded mug",
  },
  {
    key: "home:trust-avatar-3",
    label: "Homepage trust avatar 3",
    group: "Homepage",
    defaultUrl: "/images/brand/merch-notebook.jpg",
    defaultAlt: "Branded notebook",
  },
  ...CATALOG.map((product) => ({
    key: `product:${product.slug}:image`,
    label: product.name,
    group: "Products",
    defaultUrl: product.image,
    defaultAlt: product.name,
  })),
  ...portfolioItems.map((item) => ({
    key: `portfolio:${item.id}:image`,
    label: item.title,
    group: "Portfolio",
    defaultUrl: item.image,
    defaultAlt: `${item.title} — ${item.client}`,
  })),
  {
    key: "portfolio:hero",
    label: "Portfolio page hero",
    group: "Portfolio",
    defaultUrl: "/images/brand/work-asali-botanics.jpg",
    defaultAlt: "Label and packaging design produced for Asali Botanics",
  },
  ...socialGallery.map((item, index) => ({
    key: `gallery:${index + 1}:image`,
    label: item.caption,
    group: "Social gallery",
    defaultUrl: item.image,
    defaultAlt: item.caption,
  })),
];

export const siteImageDefinitionMap = new Map(
  siteImageDefinitions.map((definition) => [definition.key, definition])
);
