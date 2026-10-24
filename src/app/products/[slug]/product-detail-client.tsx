"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OptionSelector } from "@/components/products/option-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/layout/cart-provider";
import { useAuth } from "@/components/layout/auth-provider";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  option: string;
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const selectedVariant = variants.find((v) => v.option === selectedOption);
  const price = selectedVariant?.price ?? basePrice;

  const handleAddToCart = async () => {
    if (!user) {
      toast("info", "Please log in to add items to cart");
      router.push("/login");
      return;
    }
    if (!selectedVariant) {
      toast("error", "Please select an option");
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
      <OptionSelector
        options={variants.map((v) => ({ option: v.option, stock: v.stock }))}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
      />

      {selectedVariant && (
        <p className="text-lg font-bold text-white transition-all duration-200">{formatPrice(price * quantity)}</p>
      )}

      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-300">Quantity</h3>
        <div className="flex w-fit items-center rounded-lg border border-slate-600">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-l-lg text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white active:scale-90 disabled:opacity-40"
          >
            -
          </button>
          <span className="flex h-10 w-10 items-center justify-center border-x border-slate-600 text-sm text-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-r-lg text-slate-300 transition-all duration-150 hover:bg-slate-700 hover:text-white active:scale-90"
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

      <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/50 p-4">
        <p className="text-xs leading-relaxed text-slate-400">
          Need this item tailored to your brand? Add artwork notes at checkout or{" "}
          <a href="/contact" className="font-medium text-red-400 hover:text-red-300">
            talk to our studio
          </a>{" "}
          about a fully custom production run.
        </p>
      </div>
    </div>
  );
}
