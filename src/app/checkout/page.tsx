"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/auth-provider";
import { useCart } from "@/components/layout/cart-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";
import { PRINTING_SURCHARGE } from "@/constants";

interface CartItemData {
  id: string;
  quantity: number;
  printingEnabled: boolean;
  printingName: string;
  printingNumber: string;
  unitPrice: number | string;
  variant: {
    product: {
      club: string;
      kitType: string;
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
  const printingTotal = cartItems.reduce(
    (sum, i) =>
      sum + (i.printingEnabled ? PRINTING_SURCHARGE * i.quantity : 0),
    0
  );
  const total = subtotal + printingTotal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 0. Ensure custom printing items have a name & number filled in
      const missingPrinting = cartItems.find(
        (i) =>
          i.printingEnabled &&
          (!i.printingName?.trim() || !i.printingNumber?.trim())
      );
      if (missingPrinting) {
        toast(
          "error",
          "Please enter a name and number for every jersey with custom printing before checkout."
        );
        setSubmitting(false);
        return;
      }

      // 1. Create the order (cart stays intact until payment succeeds)
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        throw new Error(data.error || "Failed to create order");
      }

      const { order } = await orderRes.json();

      // 2. Initialize the Paystack transaction to get an access_code
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

      // 3. Launch the Paystack inline popup
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const popup = new PaystackPop();
      popup.resumeTransaction(accessCode, {
        onSuccess: async () => {
          // Payment succeeded: clear the cart now that stock is deducted server-side
          await clearCart();
          router.push(`/orders/${order.id}?ref=${reference}`);
        },
        onCancel: () => {
          // Keep the cart intact so the customer can retry
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
          <Button className="mt-6">Browse Jerseys</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Shipping Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Shipping Address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  required
                  placeholder="123 Street Name"
                />
              </div>
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Lagos"
              />
              <Input
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder="Lagos State"
              />
              <Input
                label="Postal Code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                placeholder="100001"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6 sticky top-24">
            <h2 className="mb-4 text-lg font-semibold text-white">Order Summary</h2>
            <div className="space-y-3 text-sm">
              {(items as CartItemData[]).map((item) => (
                <div key={item.id} className="flex justify-between text-slate-300">
                  <span className="truncate">
                    {item.variant.product.club} {item.variant.product.kitType} x{item.quantity}
                    {item.printingEnabled && (
                      <span className="text-red-400">
                        {" "}
                        (Print: {item.printingName || "—"} #{item.printingNumber || "—"})
                      </span>
                    )}
                  </span>
                  <span className="ml-2 flex-shrink-0">
                    {formatPrice(
                      Number(item.unitPrice) * item.quantity +
                        (item.printingEnabled ? PRINTING_SURCHARGE * item.quantity : 0)
                    )}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {printingTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Printing</span>
                    <span>{formatPrice(printingTotal)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
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
          </div>
        </div>
      </form>
    </div>
  );
}
