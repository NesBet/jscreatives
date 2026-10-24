"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { formatPrice } from "@/lib/utils";
import { categoryLabel } from "@/constants";

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  lowStockAlerts: {
    id: string;
    option: string;
    stock: number;
    product: { name: string; category: string };
  }[];
  topSellingCategories: { category: string; totalSold: number }[];
  recentOrders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string };
    items: { quantity: number }[];
  }[];
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetch("/api/admin/dashboard")
        .then((res) => res.json())
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <>
        <AdminHeader title="Dashboard" />
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-800/50" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!data) return null;

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    PROCESSING: "text-blue-400",
    SHIPPED: "text-purple-400",
    DELIVERED: "text-green-400",
  };

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <p className="text-sm text-slate-400">Total Revenue</p>
            <p className="mt-2 text-2xl font-bold text-white">
              {formatPrice(Number(data.totalRevenue))}
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <p className="text-sm text-slate-400">Total Orders</p>
            <p className="mt-2 text-2xl font-bold text-white">{data.totalOrders}</p>
          </div>
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-2 text-2xl font-bold text-white">{data.totalUsers}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Low Stock Alerts */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Low Stock Alerts</h3>
            {data.lowStockAlerts.length === 0 ? (
              <p className="text-sm text-slate-400">No low stock items.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                      <th className="pb-2 font-medium">Product</th>
                      <th className="pb-2 font-medium">Option</th>
                      <th className="pb-2 font-medium text-right">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStockAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-slate-700/50">
                        <td className="py-2 text-white">
                          {alert.product.name}
                        </td>
                        <td className="py-2 text-slate-300">{alert.option}</td>
                        <td className="py-2 text-right">
                          <span className="text-red-400 font-medium">{alert.stock}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Selling Categories */}
          <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Top Selling Categories</h3>
            <div className="space-y-3">
              {data.topSellingCategories.length === 0 && (
                <p className="text-sm text-slate-400">No sales data yet.</p>
              )}
              {data.topSellingCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{categoryLabel(item.category)}</span>
                  <span className="text-sm font-medium text-white">
                    {item.totalSold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Items</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-700/50">
                    <td className="py-3 font-mono text-xs text-slate-300">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 text-white">
                      {order.user.name || order.user.email}
                    </td>
                    <td className="py-3 text-slate-300">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}
                    </td>
                    <td className="py-3 text-white font-medium">
                      {formatPrice(Number(order.total))}
                    </td>
                    <td className="py-3">
                      <span className={statusColors[order.status] || "text-slate-400"}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-KE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
