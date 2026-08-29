"use client";

import { useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/components/layout/cart-provider";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useToast } from "@/components/ui/toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, togglePrinting, updatePrinting, clearCart, loading, updating } = useCart();
  const { toast } = useToast();

  const printingIncomplete = items.some(
    (item) =>
      item.printingEnabled &&
      (!item.printingName?.trim() || !item.printingNumber?.trim())
  );

  const handleTogglePrinting = useCallback(
    async (itemId: string, enabled: boolean, name?: string, number?: string) => {
      try {
        await togglePrinting(itemId, enabled, name, number);
        toast("success", enabled ? "Printing enabled" : "Printing disabled");
      } catch {
        toast("error", "Failed to update printing");
      }
    },
    [togglePrinting, toast]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-800" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
        <svg className="h-20 w-20 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="mt-6 text-2xl font-bold text-white animate-fade-in-up">Your cart is empty</h2>
        <p className="mt-2 animate-fade-in-up text-slate-400" style={{ animationDelay: "100ms" }}>
          Add some jerseys to get started!
        </p>
        <Link href="/catalog" className="mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>Browse Jerseys</div>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
        <Link href="/catalog" className="text-sm text-slate-400 transition-colors duration-200 hover:text-white">
          Continue shopping &rarr;
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="stagger-children space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onTogglePrinting={handleTogglePrinting}
                onUpdatePrinting={updatePrinting}
                onRemove={removeItem}
                updating={updating.has(item.id)}
              />
            ))}
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-slate-500 transition-colors duration-200 hover:text-red-400"
          >
            Clear cart
          </button>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <CartSummary items={items} />
          {printingIncomplete ? (
            <div
              aria-disabled="true"
              title="Enter a name and number for printing on every printed item before checkout"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "w-full cursor-not-allowed opacity-50"
              )}
            >
              Proceed to Checkout
            </div>
          ) : (
            <Link href="/checkout" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
              Proceed to Checkout
            </Link>
          )}
          {printingIncomplete && (
            <p className="text-center text-xs text-red-400">
              Enter a name and number for all printed items to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
