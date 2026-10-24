"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/auth-provider";
import { useCart } from "@/components/layout/cart-provider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { categoryLabel, printMethodLabel, ORDER_NOTES_MAX } from "@/constants";
import { formatPrice } from "@/lib/utils";

interface CartItemData {
  id: string;
  quantity: number;
  unitPrice: number | string;
  variant: {
    option: string;
    product: {
      name: string;
      category: string;
      printMethod: string;
    };
  };
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  const cartItems = items as CartItemData[];
  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.unitPrice) * i.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, country: "Kenya" }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error || "Failed to create order");
      }

      const { order } = await orderRes.json();

      const initRes = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!initRes.ok) {
        const data = await initRes.json();
        throw new Error(data.error || "Could not start payment");
      }

      const { accessCode, reference } = await initRes.json();

      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async () => {
          await clearCart();
          router.push(`/orders/${order.id}?ref=${reference}`);
        },
        onCancel: () => {
          setSubmitting(false);
          toast("info", "Payment cancelled — your cart is still saved");
        },
        onError: () => {
          setSubmitting(false);
          toast("error", "Payment failed. Please try again.");
        },
      });
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Cart is empty</h2>
        <p className="mt-2 text-slate-400">Add items before checking out.</p>
        <Link href="/catalog">
          <Button className="mt-6">Browse the Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Secure Checkout</p>
      <h1 className="mt-2 text-3xl font-bold text-white font-[var(--font-display)]">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white font-[var(--font-display)]">
              Delivery Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                  placeholder="Building, street and area"
                />
              </div>
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Nairobi"
              />
              <Input
                label="County / State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder="Nairobi County"
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                placeholder="00100"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+254 7XX XXX XXX"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white font-[var(--font-display)]">
              Artwork &amp; Branding Notes
            </h2>
            <p className="mb-4 text-xs leading-relaxed text-slate-500">
              Tell us about logos, colours, print placement or anything we should know. Our team will
              send a digital proof before production begins.
            </p>
            <Textarea
              label="Order notes (optional)"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="e.g. Pantone 485 C logo on the left chest, names listed in the attached brief..."
              rows={4}
              maxLength={ORDER_NOTES_MAX}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]/60 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white font-[var(--font-display)]">Order Summary</h2>
            <div className="space-y-3 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-slate-300">
                  <span className="min-w-0">
                    <span className="block truncate text-white">{item.variant.product.name}</span>
                    <span className="block text-xs text-slate-500">
                      {categoryLabel(item.variant.product.category)} &middot; {item.variant.option} &middot;{" "}
                      {printMethodLabel(item.variant.product.printMethod)} &middot; Qty {item.quantity}
                    </span>
                  </span>
                  <span className="flex-shrink-0">
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-[var(--color-border-default)] pt-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span>Confirmed after order</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border-default)] pt-3 font-bold text-white">
                <span>Total</span>
                <span className="text-red-500">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              loading={submitting}
            >
              Pay with Paystack
            </Button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
              Payment is secure. Production starts after artwork approval.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
