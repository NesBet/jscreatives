import type { PrintMethodValue, ProductCategory } from "@/constants";

export interface CatalogOption {
  label: string;
  stock: number;
  priceOverride?: number;
}

export interface CatalogProduct {
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  printMethod: PrintMethodValue;
  material: string;
  turnaround: string;
  basePrice: number;
  featured: boolean;
  image: string;
  colors: string[];
  customization: string[];
  options: CatalogOption[];
}

const apparelSizes = (stock: number): CatalogOption[] => [
  { label: "S", stock },
  { label: "M", stock },
  { label: "L", stock },
  { label: "XL", stock },
  { label: "XXL", stock },
];

export const CATALOG: CatalogProduct[] = [
  {
    name: "Signature Branded T-Shirt",
    slug: "signature-branded-t-shirt",
    description:
      "A retail-quality combed cotton tee finished with your logo or artwork in a soft-hand screen print. Built for launches, teams, events and everyday brand wear.",
    category: "APPAREL_CLOTHING",
    printMethod: "SCREEN_PRINT",
    material: "100% combed cotton, 180gsm",
    turnaround: "5 to 7 business days",
    basePrice: 1200,
    featured: true,
    image: "/images/brand/merch-tee.jpg",
    colors: ["White", "Black", "Sand", "Navy", "Olive"],
    customization: ["Screen print", "DTF transfer", "Embroidery"],
    options: apparelSizes(60),
  },
  {
    name: "Corporate Pique Polo",
    slug: "corporate-pique-polo",
    description:
      "A sharp pique polo for front-of-house teams, field staff and corporate gifting, embroidered with a durable logo that keeps its shape.",
    category: "APPAREL_CLOTHING",
    printMethod: "EMBROIDERY",
    material: "Cotton pique, 200gsm",
    turnaround: "7 to 10 business days",
    basePrice: 1800,
    featured: true,
    image: "/images/brand/merch-polo.jpg",
    colors: ["White", "Black", "Navy", "Grey", "Olive"],
    customization: ["Embroidery", "Screen print"],
    options: apparelSizes(45),
  },
  {
    name: "Heavyweight Branded Hoodie",
    slug: "heavyweight-branded-hoodie",
    description:
      "A premium 320gsm fleece hoodie with a clean drape, double-lined hood and embroidered chest mark. Made for cool mornings and considered merch drops.",
    category: "APPAREL_CLOTHING",
    printMethod: "EMBROIDERY",
    material: "Cotton-rich fleece, 320gsm",
    turnaround: "7 to 10 business days",
    basePrice: 2800,
    featured: true,
    image: "/images/brand/merch-hoodie.jpg",
    colors: ["Black", "Charcoal", "Sand", "Navy"],
    customization: ["Embroidery", "DTF transfer", "Screen print"],
    options: apparelSizes(35),
  },
  {
    name: "Executive Reflective Jacket",
    slug: "executive-reflective-jacket",
    description:
      "A practical branded jacket for field teams, logistics crews and outdoor staff, with reflective detailing and a durable embroidered mark.",
    category: "APPAREL_CLOTHING",
    printMethod: "EMBROIDERY",
    material: "Poly-cotton twill with reflective trim",
    turnaround: "10 to 14 business days",
    basePrice: 3500,
    featured: true,
    image: "/images/brand/work-nova-athletics.jpg",
    colors: ["Black", "Navy", "Hi-vis yellow"],
    customization: ["Embroidery", "Heat transfer", "Printed name badges"],
    options: apparelSizes(30),
  },
  {
    name: "Embroidered Baseball Cap",
    slug: "embroidered-baseball-cap",
    description:
      "A six-panel structured cap with a curved brim and adjustable strap. Your mark is embroidered in up to six thread colours for a premium finish.",
    category: "APPAREL_CLOTHING",
    printMethod: "EMBROIDERY",
    material: "Brushed cotton twill",
    turnaround: "5 to 7 business days",
    basePrice: 900,
    featured: true,
    image: "/images/brand/merch-cap.jpg",
    colors: ["Black", "Stone", "Navy", "Olive"],
    customization: ["Embroidery", "Woven label"],
    options: [{ label: "One size", stock: 100 }],
  },
  {
    name: "Premium Business Cards",
    slug: "premium-business-cards",
    description:
      "Crisp offset-printed cards on a substantial stock, with optional spot UV or soft-touch lamination. Clean edges and a memorable first handshake.",
    category: "OFFICE_STATIONERY",
    printMethod: "OFFSET",
    material: "350gsm matte art card",
    turnaround: "3 to 5 business days",
    basePrice: 1500,
    featured: true,
    image: "/images/brand/merch-cards.jpg",
    colors: ["Full colour", "Black and white", "Gold foil"],
    customization: ["Matte laminate", "Spot UV", "Soft touch", "Foil stamping"],
    options: [
      { label: "100 cards", stock: 80 },
      { label: "250 cards", stock: 60, priceOverride: 2800 },
      { label: "500 cards", stock: 40, priceOverride: 4800 },
    ],
  },
  {
    name: "Softcover Branded Notebook",
    slug: "softcover-branded-notebook",
    description:
      "A lay-flat notebook with 160 lined pages, an elastic closure and a printed or foil-stamped cover. Pair it with a branded pen for a desk set that gets used.",
    category: "OFFICE_STATIONERY",
    printMethod: "DIGITAL",
    material: "Recycled board, 90gsm paper",
    turnaround: "5 to 7 business days",
    basePrice: 800,
    featured: true,
    image: "/images/brand/merch-notebook.jpg",
    colors: ["Black", "Kraft", "Navy", "Burgundy"],
    customization: ["Cover print", "Foil stamping", "Debossing", "Elastic closure"],
    options: [
      { label: "A5", stock: 90 },
      { label: "A4", stock: 55, priceOverride: 1100 },
    ],
  },
  {
    name: "Letterheads & Envelopes",
    slug: "letterheads-and-envelopes",
    description:
      "A coordinated stationery suite printed on uncoated paper for a tactile, professional finish. Colour matched to your brand guidelines.",
    category: "OFFICE_STATIONERY",
    printMethod: "OFFSET",
    material: "100gsm uncoated bond",
    turnaround: "5 to 7 business days",
    basePrice: 2500,
    featured: false,
    image: "/images/brand/merch-letterhead.jpg",
    colors: ["White", "Cream", "Light grey"],
    customization: ["One or two colour print", "Full colour", "Envelope printing"],
    options: [
      { label: "100 sets", stock: 50 },
      { label: "250 sets", stock: 30, priceOverride: 4800 },
      { label: "500 sets", stock: 20, priceOverride: 8500 },
    ],
  },
  {
    name: "Customized Gel Pen",
    slug: "customized-gel-pen",
    description:
      "A smooth-writing gel pen with a soft-touch barrel and a clean one-colour logo print. A low-cost, high-retention giveaway for conferences and reception desks.",
    category: "PROMOTIONAL_MERCHANDISE",
    printMethod: "UV_PRINT",
    material: "Recycled ABS with metal clip",
    turnaround: "5 to 7 business days",
    basePrice: 150,
    featured: true,
    image: "/images/brand/merch-pen.jpg",
    colors: ["Black", "White", "Navy", "Gold"],
    customization: ["One-colour logo print", "Two-colour print", "Engraving"],
    options: [{ label: "One size", stock: 500 }],
  },
  {
    name: "Event Lanyard & Badge Set",
    slug: "event-lanyard-and-badge-set",
    description:
      "Branded lanyards with matching delegate badges, produced for conferences, launches and exhibitions. A practical piece every guest keeps.",
    category: "PROMOTIONAL_MERCHANDISE",
    printMethod: "SUBLIMATION",
    material: "Polyester lanyard with PVC badge holder",
    turnaround: "7 to 10 business days",
    basePrice: 350,
    featured: false,
    image: "/images/brand/work-orbit-tech.jpg",
    colors: ["Full colour", "Black", "Navy", "Gold"],
    customization: ["Sublimated logo", "Woven logo", "Printed badge"],
    options: [{ label: "One size", stock: 300 }],
  },
  {
    name: "Insulated Steel Bottle",
    slug: "insulated-steel-bottle",
    description:
      "A double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. Your artwork is UV printed for a durable, full-colour finish.",
    category: "PROMOTIONAL_MERCHANDISE",
    printMethod: "UV_PRINT",
    material: "18/8 stainless steel",
    turnaround: "7 to 10 business days",
    basePrice: 1600,
    featured: false,
    image: "/images/brand/merch-bottle.jpg",
    colors: ["Black", "Silver", "White", "Navy"],
    customization: ["UV print", "Laser engraving"],
    options: [
      { label: "500ml", stock: 60 },
      { label: "750ml", stock: 40, priceOverride: 1950 },
    ],
  },
  {
    name: "Non-Woven Tote Bag",
    slug: "non-woven-tote-bag",
    description:
      "A reusable non-woven carryall with reinforced handles and a wide print area. A practical brand touchpoint for retail, events and welcome packs.",
    category: "BAGS_ACCESSORIES",
    printMethod: "SCREEN_PRINT",
    material: "80gsm non-woven polypropylene",
    turnaround: "5 to 7 business days",
    basePrice: 450,
    featured: true,
    image: "/images/brand/merch-tote.jpg",
    colors: ["Natural", "Black", "Navy", "Olive"],
    customization: ["Screen print", "Heat transfer", "Full-colour print"],
    options: [{ label: "Standard", stock: 200 }],
  },
  {
    name: "Branded Kraft Bag",
    slug: "branded-kraft-bag",
    description:
      "A natural kraft paper bag with twisted handles and a bold one-colour print. A recyclable, retail-ready finishing touch for counters and pop-ups.",
    category: "BAGS_ACCESSORIES",
    printMethod: "SCREEN_PRINT",
    material: "Recycled kraft paper, 120gsm",
    turnaround: "5 to 7 business days",
    basePrice: 600,
    featured: false,
    image: "/images/brand/merch-kraft-bag.jpg",
    colors: ["Natural kraft", "White", "Black"],
    customization: ["One-colour print", "Two-colour print", "Rope or twisted handles"],
    options: [
      { label: "Small", stock: 150 },
      { label: "Medium", stock: 100, priceOverride: 900 },
      { label: "Large", stock: 70, priceOverride: 1400 },
    ],
  },
  {
    name: "Everyday Laptop Backpack",
    slug: "everyday-laptop-backpack",
    description:
      "A clean commuter backpack with a padded laptop sleeve, water-resistant shell and subtle embroidered branding. Designed for teams that move between office, site and studio.",
    category: "BAGS_ACCESSORIES",
    printMethod: "EMBROIDERY",
    material: "Recycled polyester, 600D",
    turnaround: "10 to 14 business days",
    basePrice: 3200,
    featured: false,
    image: "/images/brand/merch-backpack.jpg",
    colors: ["Black", "Charcoal", "Navy"],
    customization: ["Embroidery", "Rubber patch", "Woven label"],
    options: [{ label: "One size", stock: 40 }],
  },
  {
    name: "Pull-Up Banner",
    slug: "pull-up-banner",
    description:
      "A retractable banner with a weighted aluminium base and a wrinkle-resistant print. Set up in seconds, pack down into the carry bag and reuse it event after event.",
    category: "MARKETING_MATERIALS",
    printMethod: "DIGITAL",
    material: "Anti-curl PET film, aluminium base",
    turnaround: "3 to 5 business days",
    basePrice: 4500,
    featured: true,
    image: "/images/brand/merch-banner.jpg",
    colors: ["Full colour"],
    customization: ["Standard base", "Premium base", "Carry bag included"],
    options: [
      { label: "2 x 3 ft", stock: 30 },
      { label: "3 x 6 ft", stock: 20, priceOverride: 7500 },
      { label: "4 x 8 ft", stock: 12, priceOverride: 11000 },
    ],
  },
  {
    name: "Vinyl Sticker Pack",
    slug: "vinyl-sticker-pack",
    description:
      "Weather-resistant die-cut vinyl stickers with a matte or gloss laminate. Perfect for packaging seals, laptops, bottles and campaign giveaways.",
    category: "MARKETING_MATERIALS",
    printMethod: "VINYL",
    material: "PVC vinyl with laminate",
    turnaround: "3 to 5 business days",
    basePrice: 500,
    featured: false,
    image: "/images/brand/merch-stickers.jpg",
    colors: ["Full colour", "Single colour", "Metallic"],
    customization: ["Die cutting", "Matte laminate", "Gloss laminate", "Kiss cut sheets"],
    options: [
      { label: "A5 sheet", stock: 200 },
      { label: "A4 sheet", stock: 150, priceOverride: 900 },
    ],
  },
  {
    name: "Event Backdrop & Display",
    slug: "event-backdrop-and-display",
    description:
      "A large-format branded backdrop with a clean frame and a wrinkle-resistant print, designed for launches, conferences and exhibition stands.",
    category: "EVENT_BRANDING",
    printMethod: "DIGITAL",
    material: "Tension fabric or PVC banner",
    turnaround: "5 to 7 business days",
    basePrice: 0,
    featured: true,
    image: "/images/brand/work-orbit-tech.jpg",
    colors: ["Full colour"],
    customization: ["Tension fabric", "PVC banner", "Pop-up frame", "Custom size"],
    options: [
      { label: "2.5 x 2.5 m", stock: 0 },
      { label: "3 x 2.5 m", stock: 0 },
      { label: "Custom size", stock: 0 },
    ],
  },
  {
    name: "Conference Branding Suite",
    slug: "conference-branding-suite",
    description:
      "A complete conference package covering backdrop, delegate stationery, lanyards, signage and take-home gifts, produced to one visual system.",
    category: "EVENT_BRANDING",
    printMethod: "DIGITAL",
    material: "Mixed production, quoted per event",
    turnaround: "Quoted to your event date",
    basePrice: 0,
    featured: false,
    image: "/images/brand/work-sora-hotels.jpg",
    colors: ["Brand colours"],
    customization: ["Backdrop", "Delegate stationery", "Lanyards", "Signage", "Gifts"],
    options: [
      { label: "Half-day event", stock: 0 },
      { label: "Full-day event", stock: 0 },
      { label: "Multi-day event", stock: 0 },
    ],
  },
  {
    name: "Ceramic Coffee Mug",
    slug: "ceramic-coffee-mug",
    description:
      "A weighted ceramic mug with a glossy finish and a print that wraps cleanly around the body. A simple, useful brand object for offices, hospitality and client thank-yous.",
    category: "PERSONALIZED_GIFTS",
    printMethod: "UV_PRINT",
    material: "Glazed ceramic",
    turnaround: "5 to 7 business days",
    basePrice: 650,
    featured: true,
    image: "/images/brand/merch-mug.jpg",
    colors: ["White", "Black", "Navy"],
    customization: ["Full-colour wrap", "One-colour print", "Gift box"],
    options: [
      { label: "330ml", stock: 100 },
      { label: "450ml", stock: 60, priceOverride: 800 },
    ],
  },
  {
    name: "Curated Corporate Gift Box",
    slug: "curated-corporate-gift-box",
    description:
      "A branded mailer box assembled around your budget and audience, with options for drinkware, stationery, snacks and a printed message card.",
    category: "PERSONALIZED_GIFTS",
    printMethod: "OFFSET",
    material: "Corrugated board with printed sleeve",
    turnaround: "7 to 10 business days",
    basePrice: 0,
    featured: true,
    image: "/images/brand/merch-box.jpg",
    colors: ["Black", "Kraft", "White", "Brand colour"],
    customization: ["Printed sleeve", "Ribbon", "Message card", "Custom contents"],
    options: [
      { label: "Small box", stock: 0 },
      { label: "Medium box", stock: 0 },
      { label: "Large box", stock: 0 },
    ],
  },
  {
    name: "Branded Notebook & Pen Set",
    slug: "branded-notebook-and-pen-set",
    description:
      "A softcover notebook paired with a customized gel pen, presented as a desk set for staff welcome packs, client gifts and conferences.",
    category: "PERSONALIZED_GIFTS",
    printMethod: "DIGITAL",
    material: "Recycled notebook board with ABS pen",
    turnaround: "5 to 7 business days",
    basePrice: 1200,
    featured: false,
    image: "/images/brand/merch-notebook.jpg",
    colors: ["Black", "Kraft", "Navy"],
    customization: ["Cover print", "Foil stamping", "Pen print", "Gift sleeve"],
    options: [
      { label: "A5 set", stock: 70 },
      { label: "A4 set", stock: 45, priceOverride: 1500 },
    ],
  },
];

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return CATALOG.find((product) => product.slug === slug);
}

export const featuredCatalog = CATALOG.filter((product) => product.featured);
