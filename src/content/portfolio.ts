export const portfolioCategories = [
  "Apparel Branding",
  "Corporate Merchandise",
  "Office Branding",
  "Printing Projects",
  "Event Branding",
  "Promotional Products",
  "Personalized Gifts",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: PortfolioCategory;
  image: string;
  description: string;
  services: string[];
  year: string;
  size?: "wide" | "tall" | "normal";
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "nova-team-kit",
    title: "Team kit and training collection",
    client: "Nova Athletics",
    category: "Apparel Branding",
    image: "/images/brand/work-nova-athletics.jpg",
    description:
      "Sublimated training tees and caps produced for a Nairobi running club, with a coordinated kit that holds its colour through repeated use.",
    services: ["Apparel branding", "Sublimation", "Headwear"],
    year: "2026",
    size: "tall",
  },
  {
    id: "signature-tee",
    title: "Signature branded T-shirt",
    client: "JsCreatives studio sample",
    category: "Apparel Branding",
    image: "/images/brand/merch-tee.jpg",
    description:
      "A retail-quality combed cotton tee with a clean screen-printed mark, used as our reference for hand feel and print durability.",
    services: ["Screen print", "Apparel"],
    year: "2026",
  },
  {
    id: "heavyweight-hoodie",
    title: "Heavyweight corporate hoodie",
    client: "Studio sample",
    category: "Apparel Branding",
    image: "/images/brand/merch-hoodie.jpg",
    description:
      "A 320gsm fleece hoodie with an embroidered chest mark, produced for teams that need a warm layer that still looks considered.",
    services: ["Embroidery", "Apparel"],
    year: "2026",
    size: "tall",
  },
  {
    id: "polo-uniform",
    title: "Front-of-house polo uniforms",
    client: "Hospitality client",
    category: "Apparel Branding",
    image: "/images/brand/merch-polo.jpg",
    description:
      "Embroidered pique polos for a customer-facing team, finished with a durable logo that keeps its shape through weekly laundering.",
    services: ["Embroidery", "Uniforms"],
    year: "2026",
  },
  {
    id: "orbit-launch-merch",
    title: "Launch event merchandise",
    client: "Orbit Tech",
    category: "Corporate Merchandise",
    image: "/images/brand/work-orbit-tech.jpg",
    description:
      "A coordinated launch collection including tees, caps and delegate cards for a technology summit in Nairobi.",
    services: ["Event merchandise", "Screen print", "Print"],
    year: "2026",
    size: "wide",
  },
  {
    id: "corporate-gift-box",
    title: "Curated corporate gift box",
    client: "Executive client gifting",
    category: "Corporate Merchandise",
    image: "/images/brand/merch-box.jpg",
    description:
      "A branded mailer box assembled for end-of-year client gifting, with a notebook, pen and drinkware inside.",
    services: ["Packaging", "Corporate gifts"],
    year: "2026",
  },
  {
    id: "branded-notebook",
    title: "Softcover branded notebooks",
    client: "Conference stationery",
    category: "Corporate Merchandise",
    image: "/images/brand/merch-notebook.jpg",
    description:
      "Lay-flat notebooks with a printed cover and elastic closure, produced for a conference delegate pack.",
    services: ["Print", "Notebooks"],
    year: "2026",
    size: "tall",
  },
  {
    id: "steel-bottle",
    title: "Insulated branded bottles",
    client: "Corporate wellness client",
    category: "Corporate Merchandise",
    image: "/images/brand/merch-bottle.jpg",
    description:
      "Double-wall steel bottles with a UV-printed brand mark, used in a staff wellness and client gifting programme.",
    services: ["UV print", "Drinkware"],
    year: "2026",
  },
  {
    id: "mara-signage",
    title: "Storefront signage and graphics",
    client: "Mara & Co.",
    category: "Office Branding",
    image: "/images/brand/work-mara-co.jpg",
    description:
      "A storefront signage system with window graphics and an exterior brand mark designed for visibility from the street.",
    services: ["Signage", "Window graphics"],
    year: "2026",
    size: "wide",
  },
  {
    id: "lumen-stationery",
    title: "Stationery and print collateral",
    client: "Lumen Studio",
    category: "Office Branding",
    image: "/images/brand/work-lumen-studio.jpg",
    description:
      "A coordinated stationery suite covering letterheads, cards and presentation folders for a creative studio.",
    services: ["Offset print", "Stationery"],
    year: "2026",
  },
  {
    id: "letterhead-suite",
    title: "Letterheads and envelopes",
    client: "Professional services client",
    category: "Office Branding",
    image: "/images/brand/merch-letterhead.jpg",
    description:
      "Uncoated letterheads and envelopes printed to match an existing brand guide, with a tactile finish that suits everyday correspondence.",
    services: ["Offset print", "Stationery"],
    year: "2026",
  },
  {
    id: "business-cards",
    title: "Premium business cards",
    client: "Consulting firm",
    category: "Office Branding",
    image: "/images/brand/merch-cards.jpg",
    description:
      "Heavyweight cards with a crisp offset finish and clean edges, produced for a client-facing consulting team.",
    services: ["Business cards", "Offset print"],
    year: "2026",
  },
  {
    id: "kiri-packaging",
    title: "Retail packaging and cups",
    client: "Kiri Coffee",
    category: "Printing Projects",
    image: "/images/brand/work-kiri-coffee.jpg",
    description:
      "Coffee bags, labels and takeaway cups produced as one retail system, with colour matched across materials.",
    services: ["Packaging", "Labels", "Print"],
    year: "2026",
    size: "tall",
  },
  {
    id: "asali-labels",
    title: "Labels and shelf presence",
    client: "Asali Botanics",
    category: "Printing Projects",
    image: "/images/brand/work-asali-botanics.jpg",
    description:
      "A label system designed to hold its own on a crowded retail shelf, with clear hierarchy and a premium finish.",
    services: ["Labels", "Packaging"],
    year: "2026",
  },
  {
    id: "sticker-pack",
    title: "Die-cut vinyl stickers",
    client: "Campaign giveaway",
    category: "Printing Projects",
    image: "/images/brand/merch-stickers.jpg",
    description:
      "Weather-resistant vinyl stickers with a matte laminate, produced for a campaign that needed durable giveaways.",
    services: ["Vinyl print", "Stickers"],
    year: "2026",
  },
  {
    id: "pull-up-banner",
    title: "Pull-up banner system",
    client: "Exhibition client",
    category: "Printing Projects",
    image: "/images/brand/merch-banner.jpg",
    description:
      "A retractable banner with a weighted base and a wrinkle-resistant print, built to be reused across events.",
    services: ["Large format", "Banners"],
    year: "2026",
    size: "tall",
  },
  {
    id: "sora-event-stationery",
    title: "Conference and guest stationery",
    client: "Sora Hotels",
    category: "Event Branding",
    image: "/images/brand/work-sora-hotels.jpg",
    description:
      "In-room print and guest stationery for a hospitality group, produced as a complete branded set.",
    services: ["Hospitality print", "Stationery"],
    year: "2026",
    size: "wide",
  },
  {
    id: "orbit-event-branding",
    title: "Summit branding and delegate kit",
    client: "Orbit Tech",
    category: "Event Branding",
    image: "/images/brand/work-orbit-tech.jpg",
    description:
      "A summit identity applied to delegate cards, apparel and event signage, with every piece produced to one visual system.",
    services: ["Event branding", "Merchandise"],
    year: "2026",
  },
  {
    id: "event-backdrop",
    title: "Event backdrop and display",
    client: "Product launch",
    category: "Event Branding",
    image: "/images/brand/merch-banner.jpg",
    description:
      "A large-format backdrop and matching pull-up display produced for a product launch and exhibition stand.",
    services: ["Large format", "Event branding"],
    year: "2026",
    size: "tall",
  },
  {
    id: "non-woven-tote",
    title: "Non-woven campaign bags",
    client: "Community programme",
    category: "Promotional Products",
    image: "/images/brand/merch-tote.jpg",
    description:
      "Reusable non-woven bags screen printed for a community awareness campaign, chosen for cost and repeat use.",
    services: ["Screen print", "Bags"],
    year: "2026",
  },
  {
    id: "kraft-retail-bag",
    title: "Branded kraft retail bags",
    client: "Retail client",
    category: "Promotional Products",
    image: "/images/brand/merch-kraft-bag.jpg",
    description:
      "Recyclable kraft bags with twisted handles and a one-colour print, used at a retail counter and pop-up.",
    services: ["Packaging", "Retail"],
    year: "2026",
  },
  {
    id: "branded-pen",
    title: "Customized gel pens",
    client: "Conference giveaway",
    category: "Promotional Products",
    image: "/images/brand/merch-pen.jpg",
    description:
      "Soft-touch gel pens with a one-colour logo print, produced as a high-retention conference giveaway.",
    services: ["Promotional merchandise", "UV print"],
    year: "2026",
  },
  {
    id: "embroidered-cap",
    title: "Embroidered branded caps",
    client: "Sports club",
    category: "Promotional Products",
    image: "/images/brand/merch-cap.jpg",
    description:
      "Six-panel structured caps with an embroidered club mark, produced in team colours for training and events.",
    services: ["Embroidery", "Headwear"],
    year: "2026",
    size: "tall",
  },
  {
    id: "ceramic-mug",
    title: "Branded ceramic mugs",
    client: "Client thank-you gift",
    category: "Personalized Gifts",
    image: "/images/brand/merch-mug.jpg",
    description:
      "Glazed ceramic mugs with a full-colour wrap, produced as a simple, useful gift for clients and staff.",
    services: ["UV print", "Drinkware"],
    year: "2026",
  },
  {
    id: "gift-box-set",
    title: "Personalized gift box set",
    client: "Executive gifting",
    category: "Personalized Gifts",
    image: "/images/brand/merch-box.jpg",
    description:
      "A branded gift box curated with a notebook, pen and mug, finished with a printed sleeve and ribbon.",
    services: ["Packaging", "Corporate gifts"],
    year: "2026",
    size: "tall",
  },
  {
    id: "notebook-pen-set",
    title: "Notebook and pen set",
    client: "Staff welcome pack",
    category: "Personalized Gifts",
    image: "/images/brand/merch-notebook.jpg",
    description:
      "A softcover notebook paired with a branded pen, produced as part of a new-staff welcome pack.",
    services: ["Notebooks", "Pens"],
    year: "2026",
  },
];
