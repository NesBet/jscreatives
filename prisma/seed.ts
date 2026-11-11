import { PrismaClient, ProductCategory, PrintMethod } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import { CATALOG } from '../src/content/catalog';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting JsCreatives seed...\n');

  console.log('Clearing existing catalogue and enquiry data...');
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  console.log('   Catalogue cleared\n');

  const defaultHash =
    process.env.ACCOUNT_DEFAULT_PASSWORD_HASH || (await hash('Jscreatives@2030!', 12));

  console.log('Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { phone: '+254780237794' },
    update: {
      email: 'admin@jscreatives.com',
      name: 'JSCREATIVES Admin',
      role: 'ADMIN',
    },
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

  let totalVariants = 0;

  for (const config of CATALOG) {
    console.log(`Creating ${config.name}...`);

    const product = await prisma.product.create({
      data: {
        name: config.name,
        slug: config.slug,
        description: config.description,
        category: config.category as ProductCategory,
        printMethod: config.printMethod as PrintMethod,
        material: config.material,
        turnaround: config.turnaround,
        basePrice: config.basePrice,
        colors: config.colors,
        customization: config.customization,
        active: true,
        featured: config.featured,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: config.image,
        altText: `${config.name} by JsCreatives`,
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
  console.log('   Admin: +254780237794');
  console.log(`   Products: ${CATALOG.length}`);
  console.log(`   Images: ${CATALOG.length}`);
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
