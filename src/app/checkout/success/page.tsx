"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/layout/cart-provider";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-600/10">
        <svg
          className="h-10 w-10 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold text-white">Order Confirmed!</h1>
      <p className="mt-3 max-w-md text-slate-400">
        Thank you for your order. You will receive a confirmation email shortly.
        If you were redirected to payment, your order is being processed.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/account">
          <Button variant="secondary">View Orders</Button>
        </Link>
        <Link href="/catalog">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
