export interface Service {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  image: string;
  imageAlt: string;
  offerings: string[];
  outcomes: { title: string; description: string }[];
  seoTitle: string;
  seoDescription: string;
}

export const services: Service[] = [
  {
    slug: "printing-services",
    name: "Printing Services",
    shortName: "Printing",
    description:
      "Business cards, flyers, brochures, banners and everyday print that carries your brand with clarity.",
    intro:
      "From a single set of business cards to a full company profile run, we print on the right stock with colour you can trust. Our team checks every file before production and advises on finishes that suit how the piece will be used.",
    image: "/images/brand/work-lumen-studio.jpg",
    imageAlt: "Printed stationery and brand collateral for Lumen Studio",
    offerings: [
      "Business cards",
      "Flyers and posters",
      "Brochures",
      "Company profiles",
      "Letterheads",
      "Certificates",
      "Stickers and labels",
      "Banners and roll-up banners",
      "Invitations",
      "Calendars",
      "Notebooks and diaries",
    ],
    outcomes: [
      {
        title: "Colour confidence",
        description:
          "Files are checked and proofs are shared before printing so the final piece matches your brand.",
      },
      {
        title: "The right finish",
        description:
          "Matte, gloss, soft touch, spot UV or foil, we recommend a finish that fits the piece and your budget.",
      },
      {
        title: "Reliable turnaround",
        description:
          "Clear production timelines from approval, with collection or delivery confirmed in your quotation.",
      },
    ],
    seoTitle: "Printing Services in Kenya",
    seoDescription:
      "Professional printing services in Kenya for business cards, flyers, brochures, company profiles, letterheads, banners, stickers and more.",
  },
  {
    slug: "corporate-branding",
    name: "Corporate Branding",
    shortName: "Corporate branding",
    description:
      "Office branding, staff uniforms, signage and branded environments that make your business recognisable.",
    intro:
      "A strong brand is consistent wherever people meet it. We help businesses establish a professional and recognisable identity across the office, the team, the vehicle and the customer touchpoints that matter.",
    image: "/images/brand/work-mara-co.jpg",
    imageAlt: "Storefront and office branding for Mara & Co.",
    offerings: [
      "Office branding",
      "Corporate merchandise",
      "Staff uniforms",
      "Branded stationery",
      "Vehicle branding",
      "Window graphics",
      "Wall branding",
      "Reception and office signage",
      "Promotional merchandise",
    ],
    outcomes: [
      {
        title: "One consistent identity",
        description:
          "Your logo, colours and tone are applied consistently across every branded surface.",
      },
      {
        title: "Spaces that work",
        description:
          "Signage and graphics are planned for visibility, durability and the way customers move through your space.",
      },
      {
        title: "Teams that represent you",
        description:
          "Uniforms and merchandise are produced in the right materials for daily wear and repeated washing.",
      },
    ],
    seoTitle: "Corporate Branding Company in Kenya",
    seoDescription:
      "Corporate branding in Kenya: office branding, staff uniforms, vehicle branding, signage, branded stationery and promotional merchandise.",
  },
  {
    slug: "customized-merchandise",
    name: "Customized Merchandise",
    shortName: "Customized merchandise",
    description:
      "Branded apparel, bags, drinkware, pens and gifts produced for teams, launches, events and client gifting.",
    intro:
      "Merchandise is one of the most tangible ways to keep your brand close to people. We help you choose products that suit your audience, then apply your branding with a finish that lasts beyond the first wash or the first week.",
    image: "/images/brand/hero-work-collage.jpg",
    imageAlt: "Customized branded merchandise including apparel, bags, drinkware and stationery",
    offerings: [
      "T-shirts",
      "Polo shirts",
      "Corporate shirts",
      "Hoodies",
      "Caps and bucket hats",
      "Reflective jackets",
      "Dust coats and overalls",
      "Aprons",
      "Wristbands",
      "Pens",
      "Keyholders",
      "Mugs",
      "Water bottles",
      "Notebooks",
      "Lanyards",
      "Tote bags and non-woven bags",
    ],
    outcomes: [
      {
        title: "Material guidance",
        description:
          "We help you match the product to the use case, whether it is a premium client gift or a high-volume event giveaway.",
      },
      {
        title: "Durable branding",
        description:
          "Screen print, DTF, embroidery, sublimation and UV print are selected for the product and the finish you want.",
      },
      {
        title: "Quantity flexibility",
        description:
          "From a single customized T-shirt to a large corporate rollout, we quote the right production route for your volume.",
      },
    ],
    seoTitle: "Customized Merchandise in Kenya",
    seoDescription:
      "Customized merchandise in Kenya: branded T-shirts, polo shirts, hoodies, caps, reflective jackets, mugs, bottles, pens and corporate gifts.",
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    shortName: "Graphic design",
    description:
      "Logos, brand concepts and marketing design that give your business a clear, professional visual language.",
    intro:
      "Good design makes the message easier to understand and harder to forget. We create logos, brand concepts and marketing materials that are practical to produce and consistent across print and digital.",
    image: "/images/brand/work-asali-botanics.jpg",
    imageAlt: "Label and brand design work for Asali Botanics",
    offerings: [
      "Logo design",
      "Business card design",
      "Flyers and posters",
      "Social media graphics",
      "Company profiles",
      "Branding concepts",
      "Marketing materials",
      "Product mockups",
    ],
    outcomes: [
      {
        title: "A clear identity",
        description:
          "Your logo and visual system are designed to work at every size, from a business card to a building sign.",
      },
      {
        title: "Production-ready files",
        description:
          "You receive artwork prepared for print, with the correct colour modes, bleeds and export formats.",
      },
      {
        title: "A consistent rollout",
        description:
          "We can apply the design to stationery, merchandise and signage so the brand stays coherent.",
      },
    ],
    seoTitle: "Graphic Design and Logo Design in Kenya",
    seoDescription:
      "Graphic design in Kenya: logo design, business card design, social media graphics, company profiles, branding concepts and marketing materials.",
  },
  {
    slug: "promotional-marketing-materials",
    name: "Promotional & Marketing Materials",
    shortName: "Promotional materials",
    description:
      "Pull-up banners, flags, posters, stickers and corporate gifts that make your campaign visible.",
    intro:
      "Whether you are exhibiting, launching a campaign or running a roadshow, the right promotional materials do more than fill a table. We produce pieces that are easy to set up, hard to miss and consistent with your brand.",
    image: "/images/brand/merch-banner.jpg",
    imageAlt: "Pull-up banner and promotional display materials",
    offerings: [
      "Pull-up banners",
      "Promotional flags",
      "Branded tents",
      "Banners",
      "Posters",
      "Stickers",
      "Corporate gifts",
      "Promotional merchandise",
    ],
    outcomes: [
      {
        title: "Event-ready quality",
        description:
          "Materials are chosen for transport, setup and repeated use at activations and exhibitions.",
      },
      {
        title: "Visibility that fits",
        description:
          "We advise on sizes and placements so your message reads clearly from the intended distance.",
      },
      {
        title: "Coordinated campaigns",
        description:
          "Print, merchandise and giveaways can be produced together for a consistent campaign look.",
      },
    ],
    seoTitle: "Promotional and Marketing Materials in Kenya",
    seoDescription:
      "Promotional materials in Kenya: pull-up banners, promotional flags, branded tents, posters, stickers, corporate gifts and promotional merchandise.",
  },
  {
    slug: "event-branding",
    name: "Event Branding",
    shortName: "Event branding",
    description:
      "Complete event branding for conferences, launches, church events, weddings and community gatherings.",
    intro:
      "Events are a chance for people to experience your brand in person. We brand the full environment, from the entrance and backdrop to the lanyards, merchandise and take-home gifts, so the experience feels considered from start to finish.",
    image: "/images/brand/work-orbit-tech.jpg",
    imageAlt: "Event merchandise and branding for the Orbit Tech summit",
    offerings: [
      "Corporate events",
      "Conferences",
      "Church events",
      "Weddings",
      "Birthday celebrations",
      "Community events",
      "Product launches",
      "Exhibitions",
    ],
    outcomes: [
      {
        title: "A complete look",
        description:
          "Backdrops, signage, lanyards, merchandise and gifts are planned as one visual system.",
      },
      {
        title: "Deadline discipline",
        description:
          "Event work is planned backwards from your date, with approvals and delivery scheduled in advance.",
      },
      {
        title: "A lasting impression",
        description:
          "Guests leave with branded pieces that keep your event present long after the day is over.",
      },
    ],
    seoTitle: "Event Branding in Kenya",
    seoDescription:
      "Event branding in Kenya for corporate events, conferences, church events, weddings, product launches and exhibitions.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceOptions = [
  ...services.map((service) => service.name),
  "Multiple services",
  "Other",
] as const;
