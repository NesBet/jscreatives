"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/auth-provider";
import { PayNowButton } from "@/components/orders/pay-now-button";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productClub: string;
  productKitType: string;
  productSize: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  printingEnabled: boolean;
  printingName: string | null;
  printingNumber: string | null;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPhone: string;
  items: OrderItem[];
  payment: {
    status: string;
    reference: string;
    paidAt: string | null;
  } | null;
}

export default function OrderDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Order not found");
          return res.json();
        })
        .then((data) => setOrder(data.order))
        .catch(() => setError("Order not found"))
        .finally(() => setLoading(false));
    }
  }, [user, orderId]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <Link href="/account" className="mt-4 text-red-500 hover:text-red-400">
          Back to Account
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-600/10 text-yellow-400",
    PROCESSING: "bg-blue-600/10 text-blue-400",
    SHIPPED: "bg-purple-600/10 text-purple-400",
    DELIVERED: "bg-green-600/10 text-green-400",
    CANCELLED: "bg-red-600/10 text-red-400",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
      >
        &larr; Back to Account
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Order #{order.id.slice(0, 8)}...
        </h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] || "text-slate-400"}`}
        >
          {order.status}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-400">
        Placed on {new Date(order.createdAt).toLocaleDateString("en-NG", { dateStyle: "long" })}
      </p>

      {order.payment?.status !== "SUCCESS" && order.payment?.reference && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-yellow-600/30 bg-yellow-600/5 p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-400">Payment required</p>
            <p className="text-xs text-slate-400">
              Complete payment to process this order.
            </p>
          </div>
          <PayNowButton orderId={order.id} reference={order.payment.reference} />
        </div>
      )}

      {/* Payment Info */}
      {order.payment && (
        <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
          <h3 className="text-sm font-semibold text-white">Payment</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div>
              <p className="text-slate-500">Status</p>
              <p className="text-slate-300">{order.payment.status}</p>
            </div>
            <div>
              <p className="text-slate-500">Reference</p>
              <p className="text-slate-300 font-mono text-xs">{order.payment.reference}</p>
            </div>
            {order.payment.paidAt && (
              <div>
                <p className="text-slate-500">Paid At</p>
                <p className="text-slate-300">
                  {new Date(order.payment.paidAt).toLocaleDateString("en-NG")}
                </p>
              </div>
            )}
            <div>
              <p className="text-slate-500">Total</p>
              <p className="text-slate-300 font-bold">{formatPrice(Number(order.total))}</p>
            </div>
          </div>
        </div>
      )}

      {/* Shipping */}
      <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
        <h3 className="text-sm font-semibold text-white">Shipping Address</h3>
        <p className="mt-2 text-sm text-slate-400">
          {order.shippingStreet}, {order.shippingCity}, {order.shippingState}
        </p>
        <p className="text-sm text-slate-400">Phone: {order.shippingPhone}</p>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
        <h3 className="text-sm font-semibold text-white">Items</h3>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-slate-700/50 pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {item.productClub} {item.productKitType}
                </p>
                <p className="text-xs text-slate-400">
                  Size: {item.productSize} &middot; Qty: {item.quantity}
                </p>
                {item.printingEnabled && (
                  <p className="text-xs text-slate-500 mt-1">
                    Printing: {item.printingName || "N/A"} #{item.printingNumber || "N/A"}
                  </p>
                )}
              </div>
              <p className="text-sm font-bold text-white">
                {formatPrice(Number(item.subtotal))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
