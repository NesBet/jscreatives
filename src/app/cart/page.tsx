"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/components/layout/cart-provider";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, loading, updating } = useCart();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-800" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
          <svg className="h-9 w-9 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-white font-[var(--font-display)]">Your cart is empty</h2>
        <p className="mt-2 text-slate-400">Browse the shop to add branded merchandise and print.</p>
        <Link href="/catalog" className="mt-8">
          <div className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>Browse the Shop</div>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Your Order</p>
          <h1 className="mt-2 text-3xl font-bold text-white font-[var(--font-display)]">Shopping Cart</h1>
        </div>
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
          <Link href="/checkout" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "w-full")}>
            Proceed to Checkout
          </Link>
          <p className="text-center text-xs text-slate-500">
            Add artwork or brand notes at checkout. We will confirm proofs before production.
          </p>
        </div>
      </div>
    </div>
  );
}
