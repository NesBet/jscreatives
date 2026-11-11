import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CatalogProduct } from "@/content/catalog";
import { categoryLabel } from "@/constants";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: CatalogProduct;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const price =
    product.basePrice > 0
      ? `From KES ${new Intl.NumberFormat("en-KE").format(product.basePrice)}`
      : "Request a quote";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("group block", className)}
      aria-label={`${product.name} — ${price}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur-sm">
            Studio pick
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-1 items-center justify-center bg-paper text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
            {categoryLabel(product.category)}
          </p>
          <h3 className="mt-2 font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink">
            {product.name}
          </h3>
        </div>
        <p className="mt-1 shrink-0 text-[11px] text-stone">{price}</p>
      </div>
    </Link>
  );
}
