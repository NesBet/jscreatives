"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productClub: string;
  productKitType: string;
  productSize: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number | string;
  printingEnabled: boolean;
  printingName: string | null;
  printingNumber: string | null;
  subtotal: number | string;
}

interface Payment {
  status: string;
  channel: string | null;
  reference: string;
}

interface Order {
  id: string;
  status: string;
  total: number | string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingPhone: string;
  items: OrderItem[];
  payment: Payment | null;
}

function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifying = Boolean(reference) && verifyStatus === null && order?.payment?.status !== "SUCCESS";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (!res.ok) throw new Error("Could not load order");
        const data = await res.json();
        if (active) setOrder(data.order);
      } catch {
        if (active) setError("Failed to load order details");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [params.id]);

  useEffect(() => {
    if (!reference || !order) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();
        if (active) {
          setVerifyStatus(data.status);
          // refresh order so status reflects latest
          const o = await fetch(`/api/orders/${params.id}`);
          if (o.ok) {
            const d = await o.json();
            setOrder(d.order);
          }
        }
      } catch {
        if (active) setVerifyStatus(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [reference, order, params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Order not found</h2>
        <p className="mt-2 text-slate-400">{error}</p>
        <Link href="/catalog" className="mt-6">
          <Button>Browse Jerseys</Button>
        </Link>
      </div>
    );
  }

  const paid = order.payment?.status === "SUCCESS" || verifyStatus === "success";
  const total = Number(order.total);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-fade-in">
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8 text-center">
        {paid ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 animate-bounce-in">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Payment Successful!</h1>
            <p className="mt-2 text-slate-400">
              Thank you for your order. We&apos;ve received your payment and will start processing it shortly.
            </p>
          </>
        ) : verifying ? (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            <h1 className="mt-4 text-xl font-bold text-white">Verifying payment...</h1>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600/20">
              <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white">Order Placed</h1>
            <p className="mt-2 text-slate-400">
              We&apos;re confirming your payment. You&apos;ll receive an update once it&apos;s verified.
            </p>
          </>
        )}
        <p className="mt-4 text-sm text-slate-500">Order reference: {order.payment?.reference}</p>
      </div>

      {/* Order items */}
      <div className="mt-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Order Summary</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900">
                {item.productImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {item.productClub} {item.productKitType}
                </p>
                <p className="text-xs text-slate-400">
                  Size {item.productSize}
                  {item.printingEnabled && ` · Print: ${item.printingName || ""} ${item.printingNumber || ""}`.trim()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">x{item.quantity}</p>
                <p className="text-sm font-semibold text-red-500">{formatPrice(Number(item.subtotal))}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-700 pt-4 flex justify-between font-bold text-white">
          <span>Total</span>
          <span className="text-red-500">{formatPrice(total)}</span>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          <p>Shipping to: {order.shippingStreet}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
          <p>Phone: {order.shippingPhone}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/catalog" className="flex-1">
          <Button variant="outline" className="w-full">Continue Shopping</Button>
        </Link>
        <Link href="/account" className="flex-1">
          <Button className="w-full">View My Orders</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPageWrapper() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
