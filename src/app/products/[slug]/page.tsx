import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ImageCarousel } from "@/components/products/image-carousel";
import { ProductDetailClient } from "./product-detail-client";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const price = product.variants[0]?.priceOverride ?? product.basePrice;
  const kitTypeLabel =
    product.kitType.charAt(0) + product.kitType.slice(1).toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Carousel */}
        <ImageCarousel images={product.images.map(img => ({ url: img.url, altText: img.altText ?? undefined }))} />

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
              {product.club}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                product.kitType === "HOME"
                  ? "bg-red-600/10 text-red-500"
                  : product.kitType === "AWAY"
                    ? "bg-blue-600/10 text-blue-400"
                    : "bg-green-600/10 text-green-400"
              }`}
            >
              {kitTypeLabel}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            {product.club} {kitTypeLabel} Jersey
          </h1>
          <p className="mt-2 text-sm text-slate-400">{product.season}</p>

          <p className="mt-1 text-3xl font-bold text-red-500">
            {formatPrice(Number(price))}
          </p>

          <p className="mt-6 leading-relaxed text-slate-400">
            {product.description}
          </p>

          {/* Interactive section */}
          <ProductDetailClient
            productId={product.id}
            variants={product.variants.map((v) => ({
              id: v.id,
              size: v.size,
              stock: v.stock,
              price: v.priceOverride
                ? Number(v.priceOverride)
                : Number(product.basePrice),
            }))}
            basePrice={Number(product.basePrice)}
          />
        </div>
      </div>
    </div>
  );
}
