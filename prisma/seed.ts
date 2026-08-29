import { PrismaClient, KitType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface ClubConfig {
  name: string;
  abbrev: string;
  primaryColor: string;
  secondaryColor: string;
  featured: boolean;
}

const clubs: ClubConfig[] = [
  { name: 'Manchester United', abbrev: 'MNU', primaryColor: 'red', secondaryColor: 'black', featured: true },
  { name: 'Arsenal', abbrev: 'ARS', primaryColor: 'red', secondaryColor: 'white', featured: true },
  { name: 'Chelsea', abbrev: 'CHE', primaryColor: 'blue', secondaryColor: 'white', featured: true },
  { name: 'Manchester City', abbrev: 'MCI', primaryColor: 'sky blue', secondaryColor: 'white', featured: true },
  { name: 'Tottenham Hotspur', abbrev: 'TOT', primaryColor: 'navy', secondaryColor: 'white', featured: true },
  { name: 'Liverpool', abbrev: 'LIV', primaryColor: 'red', secondaryColor: 'green', featured: true },
  { name: 'Bayern Munich', abbrev: 'BAY', primaryColor: 'red', secondaryColor: 'white', featured: false },
  { name: 'Real Madrid', abbrev: 'RMA', primaryColor: 'white', secondaryColor: 'gold', featured: false },
  { name: 'Borussia Dortmund', abbrev: 'BVB', primaryColor: 'yellow', secondaryColor: 'black', featured: false },
  { name: 'Barcelona', abbrev: 'BAR', primaryColor: 'blue', secondaryColor: 'red', featured: false },
  { name: 'Atletico Madrid', abbrev: 'ATM', primaryColor: 'red', secondaryColor: 'white striped', featured: false },
  { name: 'PSG', abbrev: 'PSG', primaryColor: 'navy', secondaryColor: 'red', featured: false },
  { name: 'Ajax', abbrev: 'AJX', primaryColor: 'red', secondaryColor: 'white', featured: false },
];

const kitTypes: KitType[] = ['HOME', 'AWAY', 'THIRD'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const season = '2025/26';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getBasePrice(kitType: KitType): number {
  switch (kitType) {
    case 'THIRD':
      return 1900;
    default:
      return 1500;
  }
}

function getKitDescription(club: ClubConfig, kitType: KitType): string {
  const kitLabel = kitType.toLowerCase();
  return `Official ${club.name} ${kitType} jersey for the ${season} season. Featuring the iconic ${club.primaryColor} and ${club.secondaryColor} design, this premium jersey is crafted with moisture-wicking technology for maximum comfort on and off the pitch. Show your support in style with this authentic ${club.name} ${kitLabel} kit.`;
}

async function main() {
  console.log('🌱 Starting seed...\n');

  // ── Clear existing data ──────────────────────────────────────────────────
  console.log('🗑️  Clearing existing data...');
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
  console.log('   ✅ Existing data cleared\n');

  // ── Seed accounts ───────────────────────────────────────────────────────
  const defaultHash =
    process.env.ACCOUNT_DEFAULT_PASSWORD_HASH || (await hash('Jscreatives@2030!', 12));

  console.log('👤 Creating admin user...');
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
  console.log(`   ✅ Admin user created: ${admin.email} (${admin.phone})\n`);

  console.log('👤 Creating Nesh Rono user...');
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
  console.log(`   ✅ Nesh Rono user created: ${nesh.email} (${nesh.phone})\n`);

  // ── Create products ──────────────────────────────────────────────────────
  let totalProducts = 0;
  let totalImages = 0;
  let totalVariants = 0;

  for (const club of clubs) {
    console.log(`⚽ Processing ${club.name}...`);

    for (const kitType of kitTypes) {
      const name = `${club.name} ${kitType} Jersey ${season}`;
      const slug = slugify(name);
      const basePrice = getBasePrice(kitType);

      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          description: getKitDescription(club, kitType),
          club: club.name,
          kitType,
          season,
          basePrice,
          active: true,
          featured: club.featured,
        },
        create: {
          name,
          slug,
          description: getKitDescription(club, kitType),
          club: club.name,
          kitType,
          season,
          basePrice,
          active: true,
          featured: club.featured,
        },
      });
      totalProducts++;

      // ── Product images ──────────────────────────────────────────────────
      const imageTypes = [
        { suffix: 'front', sortOrder: 0, altText: `${club.name} ${kitType} Jersey - Front View` },
        { suffix: 'back', sortOrder: 1, altText: `${club.name} ${kitType} Jersey - Back View` },
        { suffix: 'detail', sortOrder: 2, altText: `${club.name} ${kitType} Jersey - Detail View` },
      ];

      for (const img of imageTypes) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `/images/products/${slug}-${img.suffix}.webp`,
            altText: img.altText,
            sortOrder: img.sortOrder,
          },
        });
        totalImages++;
      }

      // ── Product variants (sizes) ────────────────────────────────────────
      for (const size of sizes) {
        const sku = `${club.abbrev}-${kitType}-${size}`;
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            sku,
            stock: Math.floor(Math.random() * 41) + 10, // 10-50
            priceOverride: null,
          },
        });
        totalVariants++;
      }
    }
  }

  console.log('\n📊 Seed Summary:');
  console.log(`   👤 Seeded users: 2 (admin +254780237794, Nesh Rono +254794249775)`);
  console.log(`   📦 Products:   ${totalProducts}`);
  console.log(`   🖼️  Images:     ${totalImages}`);
  console.log(`   📏 Variants:   ${totalVariants}`);
  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
