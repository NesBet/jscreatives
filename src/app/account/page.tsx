"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/layout/auth-provider";
import { PayNowButton } from "@/components/orders/pay-now-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  productName: string;
  productCategory: string;
  productMethod: string;
  productOption: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  payment: { status: string; reference: string } | null;
}

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    PROCESSING: "text-blue-400",
    SHIPPED: "text-purple-400",
    DELIVERED: "text-green-400",
    CANCELLED: "text-red-400",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">My Account</h1>
        <LogoutButton />
      </div>

      {/* User Info */}
      <div className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-slate-300">
            <span className="text-slate-500">Name:</span> {user.name}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Email:</span> {user.email}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Role:</span> {user.role}
          </p>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Order History</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-800/50" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-slate-400">No orders yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 transition-colors hover:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Order #{order.id.slice(0, 8)}...
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-KE")}{" "}
                      &middot; {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {formatPrice(Number(order.total))}
                    </p>
                    <p
                      className={`text-xs font-medium ${statusColors[order.status] || "text-slate-400"}`}
                    >
                      {order.status}
                    </p>
                    {order.payment?.status !== "SUCCESS" && order.payment?.reference && (
                      <div className="mt-2 flex justify-end">
                        <PayNowButton orderId={order.id} reference={order.payment.reference} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
