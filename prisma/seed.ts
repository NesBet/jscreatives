import { PrismaClient, ProductCategory, PrintMethod } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface VariantConfig {
  label: string;
  stock: number;
  priceOverride?: number;
}

interface ProductConfig {
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  printMethod: PrintMethod;
  material: string;
  turnaround: string;
  basePrice: number;
  featured: boolean;
  image: string;
  options: VariantConfig[];
}

const apparelSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const products: ProductConfig[] = [
  {
    name: 'Signature Branded T-Shirt',
    slug: 'signature-branded-t-shirt',
    description:
      'A retail-quality combed cotton tee finished with your logo or artwork in crisp screen print. Soft-hand inks, reinforced neck tape and a shape that holds up wash after wash. Ideal for launches, teams, events and everyday brand wear.',
    category: 'APPAREL',
    printMethod: 'SCREEN_PRINT',
    material: '100% combed cotton, 180gsm',
    turnaround: '5-7 business days',
    basePrice: 1200,
    featured: true,
    image: '/images/examples/merch-tee.jpg',
    options: apparelSizes.map((label) => ({ label, stock: 48 })),
  },
  {
    name: 'Heavyweight Branded Hoodie',
    slug: 'heavyweight-branded-hoodie',
    description:
      'A premium 320gsm fleece hoodie with a clean, structured drape and an embroidered chest mark. Double-lined hood, ribbed cuffs and a generous kangaroo pocket. Built for cool mornings, team kits and merch drops that feel considered.',
    category: 'APPAREL',
    printMethod: 'EMBROIDERY',
    material: 'Cotton-rich fleece, 320gsm',
    turnaround: '7-10 business days',
    basePrice: 2800,
    featured: true,
    image: '/images/examples/merch-hoodie.jpg',
    options: apparelSizes.map((label) => ({ label, stock: 32 })),
  },
  {
    name: 'Corporate Polo Shirt',
    slug: 'corporate-polo-shirt',
    description:
      'A sharp pique polo for front-of-house teams, field staff and corporate gifting. Your logo is embroidered for a durable, premium finish that keeps its shape through repeated wear and laundering.',
    category: 'APPAREL',
    printMethod: 'EMBROIDERY',
    material: 'Cotton pique, 200gsm',
    turnaround: '7-10 business days',
    basePrice: 1800,
    featured: false,
    image: '/images/examples/merch-polo.jpg',
    options: apparelSizes.map((label) => ({ label, stock: 36 })),
  },
  {
    name: 'Embroidered Baseball Cap',
    slug: 'embroidered-baseball-cap',
    description:
      'A six-panel structured cap with a curved brim and adjustable strap. Your mark is embroidered in up to six thread colours for a finish that reads premium up close and across the room.',
    category: 'HEADWEAR',
    printMethod: 'EMBROIDERY',
    material: 'Brushed cotton twill',
    turnaround: '5-7 business days',
    basePrice: 900,
    featured: true,
    image: '/images/examples/merch-cap.jpg',
    options: [{ label: 'One size', stock: 80 }],
  },
  {
    name: 'Ribbed Knit Beanie',
    slug: 'ribbed-knit-beanie',
    description:
      'A double-layer ribbed beanie with a woven label or embroidered mark. Warm, understated and easy to brand, it is a favourite for outdoor teams and end-of-year client gifts.',
    category: 'HEADWEAR',
    printMethod: 'EMBROIDERY',
    material: 'Recycled acrylic knit',
    turnaround: '7-10 business days',
    basePrice: 800,
    featured: false,
    image: '/images/examples/merch-beanie.jpg',
    options: [{ label: 'One size', stock: 70 }],
  },
  {
    name: 'Canvas Tote Bag',
    slug: 'canvas-tote-bag',
    description:
      'A heavyweight canvas carryall with reinforced handles and a wide print area. Screen printed in one or more colours, it is a practical brand touchpoint for retail, events and welcome packs.',
    category: 'BAGS',
    printMethod: 'SCREEN_PRINT',
    material: '12oz cotton canvas',
    turnaround: '5-7 business days',
    basePrice: 700,
    featured: true,
    image: '/images/examples/merch-tote.jpg',
    options: [
      { label: 'Natural', stock: 90 },
      { label: 'Black', stock: 60 },
    ],
  },
  {
    name: 'Everyday Laptop Backpack',
    slug: 'everyday-laptop-backpack',
    description:
      'A clean commuter backpack with a padded laptop sleeve, water-resistant shell and subtle embroidered branding. Designed for teams that move between office, site and studio.',
    category: 'BAGS',
    printMethod: 'EMBROIDERY',
    material: 'Recycled polyester, 600D',
    turnaround: '10-14 business days',
    basePrice: 3200,
    featured: false,
    image: '/images/examples/merch-backpack.jpg',
    options: [{ label: 'One size', stock: 28 }],
  },
  {
    name: 'Drawstring Gym Bag',
    slug: 'drawstring-gym-bag',
    description:
      'A lightweight drawstring bag with a full-colour sublimated panel. A quick-turnaround option for sports clubs, activations and school programmes where colour and volume matter.',
    category: 'BAGS',
    printMethod: 'SUBLIMATION',
    material: 'Polyester microfibre',
    turnaround: '7-10 business days',
    basePrice: 500,
    featured: false,
    image: '/images/examples/merch-drawstring.jpg',
    options: [{ label: 'One size', stock: 120 }],
  },
  {
    name: 'Ceramic Coffee Mug',
    slug: 'ceramic-coffee-mug',
    description:
      'A weighted ceramic mug with a glossy finish and a print that wraps cleanly around the body. A simple, useful brand object for offices, hospitality and client thank-yous.',
    category: 'DRINKWARE',
    printMethod: 'UV_PRINT',
    material: 'Glazed ceramic',
    turnaround: '5-7 business days',
    basePrice: 650,
    featured: true,
    image: '/images/examples/merch-mug.jpg',
    options: [
      { label: '330ml', stock: 70 },
      { label: '450ml', stock: 45, priceOverride: 800 },
    ],
  },
  {
    name: 'Insulated Steel Bottle',
    slug: 'insulated-steel-bottle',
    description:
      'A double-wall stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. Your artwork is UV printed for a durable, full-colour finish. A premium gift for teams and clients.',
    category: 'DRINKWARE',
    printMethod: 'UV_PRINT',
    material: '18/8 stainless steel',
    turnaround: '7-10 business days',
    basePrice: 1600,
    featured: false,
    image: '/images/examples/merch-bottle.jpg',
    options: [
      { label: '500ml', stock: 48 },
      { label: '750ml', stock: 30, priceOverride: 1950 },
    ],
  },
  {
    name: 'Softcover Branded Notebook',
    slug: 'softcover-branded-notebook',
    description:
      'A lay-flat softcover notebook with 160 lined pages, an elastic closure and a printed or foil-stamped cover. Pair it with a branded pen for a desk set that gets used every day.',
    category: 'STATIONERY',
    printMethod: 'DIGITAL',
    material: 'Recycled board, 90gsm paper',
    turnaround: '5-7 business days',
    basePrice: 800,
    featured: false,
    image: '/images/examples/merch-notebook.jpg',
    options: [
      { label: 'A5', stock: 75 },
      { label: 'A4', stock: 45, priceOverride: 1100 },
    ],
  },
  {
    name: 'Premium Business Cards',
    slug: 'premium-business-cards',
    description:
      'Crisp, offset-printed business cards on a substantial stock with optional spot UV or soft-touch lamination. Precise colour, clean edges and a finish that makes the first handshake memorable.',
    category: 'STATIONERY',
    printMethod: 'OFFSET',
    material: '350gsm matte art card',
    turnaround: '3-5 business days',
    basePrice: 1500,
    featured: true,
    image: '/images/examples/merch-cards.jpg',
    options: [
      { label: '100 cards', stock: 60 },
      { label: '250 cards', stock: 45, priceOverride: 2800 },
      { label: '500 cards', stock: 30, priceOverride: 4800 },
    ],
  },
  {
    name: 'Letterheads & Envelopes',
    slug: 'letterheads-and-envelopes',
    description:
      'A coordinated stationery suite printed on uncoated paper for a tactile, professional finish. Letterheads, envelopes and compliment slips are colour-matched to your brand guidelines.',
    category: 'STATIONERY',
    printMethod: 'OFFSET',
    material: '100gsm uncoated bond',
    turnaround: '5-7 business days',
    basePrice: 2500,
    featured: false,
    image: '/images/examples/merch-letterhead.jpg',
    options: [
      { label: '100 sets', stock: 40 },
      { label: '250 sets', stock: 24, priceOverride: 4800 },
      { label: '500 sets', stock: 16, priceOverride: 8500 },
    ],
  },
  {
    name: 'Branded Gel Pen',
    slug: 'branded-gel-pen',
    description:
      'A smooth-writing gel pen with a soft-touch barrel and a clean one-colour logo print. A low-cost, high-retention giveaway for conferences, hotels and reception desks.',
    category: 'STATIONERY',
    printMethod: 'UV_PRINT',
    material: 'Recycled ABS with metal clip',
    turnaround: '5-7 business days',
    basePrice: 150,
    featured: false,
    image: '/images/examples/merch-pen.jpg',
    options: [{ label: 'One size', stock: 300 }],
  },
  {
    name: 'Pull-Up Banner',
    slug: 'pull-up-banner',
    description:
      'A retractable banner with a weighted aluminium base and a wrinkle-resistant print. Set up in seconds, pack down into the included carry bag, and reuse it event after event.',
    category: 'SIGNAGE',
    printMethod: 'DIGITAL',
    material: 'Anti-curl PET film, aluminium base',
    turnaround: '3-5 business days',
    basePrice: 4500,
    featured: true,
    image: '/images/examples/merch-banner.jpg',
    options: [
      { label: '2 x 3 ft', stock: 25 },
      { label: '3 x 6 ft', stock: 18, priceOverride: 7500 },
      { label: '4 x 8 ft', stock: 10, priceOverride: 11000 },
    ],
  },
  {
    name: 'Vinyl Sticker Pack',
    slug: 'vinyl-sticker-pack',
    description:
      'Weather-resistant die-cut vinyl stickers with a premium matte or gloss laminate. Perfect for packaging seals, laptops, water bottles and campaign giveaways.',
    category: 'SIGNAGE',
    printMethod: 'VINYL',
    material: 'PVC vinyl with laminate',
    turnaround: '3-5 business days',
    basePrice: 500,
    featured: false,
    image: '/images/examples/merch-stickers.jpg',
    options: [
      { label: 'A5 sheet', stock: 150 },
      { label: 'A4 sheet', stock: 100, priceOverride: 900 },
    ],
  },
  {
    name: 'Custom Mailer Box',
    slug: 'custom-mailer-box',
    description:
      'A sturdy corrugated mailer with a full-colour outer print and a clean interior. Designed to protect your product and turn unboxing into a brand moment.',
    category: 'PACKAGING',
    printMethod: 'OFFSET',
    material: 'E-flute corrugated board',
    turnaround: '10-14 business days',
    basePrice: 1200,
    featured: true,
    image: '/images/examples/merch-box.jpg',
    options: [
      { label: 'Small', stock: 55 },
      { label: 'Medium', stock: 40, priceOverride: 1600 },
      { label: 'Large', stock: 25, priceOverride: 2200 },
    ],
  },
  {
    name: 'Branded Kraft Bag',
    slug: 'branded-kraft-bag',
    description:
      'A natural kraft paper bag with twisted handles and a bold one-colour print. A recyclable, retail-ready finishing touch for counters, pop-ups and takeaway orders.',
    category: 'PACKAGING',
    printMethod: 'SCREEN_PRINT',
    material: 'Recycled kraft paper, 120gsm',
    turnaround: '5-7 business days',
    basePrice: 600,
    featured: false,
    image: '/images/examples/merch-kraft-bag.jpg',
    options: [
      { label: 'Small', stock: 120 },
      { label: 'Medium', stock: 90, priceOverride: 900 },
      { label: 'Large', stock: 60, priceOverride: 1400 },
    ],
  },
];

async function main() {
  console.log('Starting JSCREATIVES seed...\n');

  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log('   Existing data cleared\n');

  const defaultHash =
    process.env.ACCOUNT_DEFAULT_PASSWORD_HASH || (await hash('Jscreatives@2030!', 12));

  console.log('Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { phone: '+254780237794' },
    update: { email: 'admin@jscreatives.com', name: 'JSCREATIVES Admin', role: 'ADMIN' },
    create: {
      phone: '+254780237794',
      email: 'admin@jscreatives.com',
      name: 'JSCREATIVES Admin',
      hashedPassword: defaultHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log(`   Admin user ready: ${admin.email} (${admin.phone})\n`);

  console.log('Creating Nesh Rono user...');
  const nesh = await prisma.user.upsert({
    where: { phone: '+254794249775' },
    update: {
      email: 'nesh.rono69@gmail.com',
      name: 'Nesh Rono',
      role: 'CUSTOMER',
    },
    create: {
      phone: '+254794249775',
      email: 'nesh.rono69@gmail.com',
      name: 'Nesh Rono',
      hashedPassword: defaultHash,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });
  console.log(`   Nesh Rono ready: ${nesh.email} (${nesh.phone})\n`);

  let totalVariants = 0;

  for (const config of products) {
    console.log(`Creating ${config.name}...`);

    const product = await prisma.product.upsert({
      where: { slug: config.slug },
      update: {
        name: config.name,
        description: config.description,
        category: config.category,
        printMethod: config.printMethod,
        material: config.material,
        turnaround: config.turnaround,
        basePrice: config.basePrice,
        active: true,
        featured: config.featured,
      },
      create: {
        name: config.name,
        slug: config.slug,
        description: config.description,
        category: config.category,
        printMethod: config.printMethod,
        material: config.material,
        turnaround: config.turnaround,
        basePrice: config.basePrice,
        active: true,
        featured: config.featured,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: config.image,
        altText: `${config.name} - JSCREATIVES branded merchandise`,
        sortOrder: 0,
      },
    });

    for (const [index, option] of config.options.entries()) {
      const optionSlug = option.label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          option: option.label,
          sku: `JS-${config.category.slice(0, 3)}-${config.slug.slice(0, 13).toUpperCase()}-${index + 1}-${optionSlug.toUpperCase()}`,
          stock: option.stock,
          priceOverride: option.priceOverride ?? null,
        },
      });
      totalVariants++;
    }
  }

  console.log('\nSeed summary:');
  console.log('   Users: 2 (admin +254780237794, Nesh Rono +254794249775)');
  console.log(`   Products: ${products.length}`);
  console.log(`   Images: ${products.length}`);
  console.log(`   Variants: ${totalVariants}`);
  console.log('\nSeed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
