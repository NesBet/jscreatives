"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SizeSelector } from "@/components/products/size-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/layout/cart-provider";
import { useAuth } from "@/components/layout/auth-provider";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  size: string;
  stock: number;
  price: number;
}

interface ProductDetailClientProps {
  productId: string;
  variants: Variant[];
  basePrice: number;
}

export function ProductDetailClient({
  variants,
  basePrice,
}: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const price = selectedVariant?.price ?? basePrice;

  const handleAddToCart = async () => {
    if (!user) {
      toast("info", "Please log in to add items to cart");
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast("error", "Please select a size");
      return;
    }
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      setShowSuccess(true);
      toast("success", "Added to cart!");
      setTimeout(() => setShowSuccess(false), 1500);
    } catch {
      toast("error", "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <SizeSelector
        variants={variants.map((v) => ({ size: v.size, stock: v.stock }))}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
      />

      {selectedVariant && (
        <p className="text-lg font-bold text-white transition-all duration-200">{formatPrice(price * quantity)}</p>
      )}

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">Quantity</h3>
        <div className="flex items-center rounded-lg border border-slate-600 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 rounded-l-lg transition-all duration-150 active:scale-90 disabled:opacity-40"
          >
            -
          </button>
          <span className="flex h-10 w-10 items-center justify-center text-sm text-white border-x border-slate-600">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-10 w-10 items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 rounded-r-lg transition-all duration-150 active:scale-90"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative">
        <Button
          size="lg"
          className={`w-full transition-all duration-300 ${showSuccess ? 'bg-green-600 hover:bg-green-600 scale-[0.98]' : ''}`}
          loading={adding}
          disabled={!selectedVariant}
          onClick={handleAddToCart}
        >
          {showSuccess ? (
            <span className="flex items-center gap-2 animate-bounce-in">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </span>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </div>
    </div>
  );
}
