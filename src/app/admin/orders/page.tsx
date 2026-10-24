"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { OrderStatusDropdown } from "@/components/admin/order-status-dropdown";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_PER_PAGE } from "@/constants";

interface OrderItem {
  id: string;
  productName: string;
  productCategory: string;
  productMethod: string;
  productOption: string;
  productImage: string | null;
  quantity: number;
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
  shippingPostalCode: string;
  shippingPhone: string;
  notes: string | null;
  user: { name: string | null; email: string };
  items: OrderItem[];
  payment: { status: string; reference: string } | null;
}

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (paymentFilter) params.set("paymentStatus", paymentFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [page, perPage, statusFilter, paymentFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchOrders();
  }, [user, page, statusFilter, paymentFilter, fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch {}
  };

  if (authLoading || !user) return null;

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400",
    PROCESSING: "text-blue-400",
    SHIPPED: "text-purple-400",
    DELIVERED: "text-green-400",
    CANCELLED: "text-red-400",
  };

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            <option value="">All Order Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800 p-1">
            {[
              { v: "", l: "All" },
              { v: "paid", l: "Paid" },
              { v: "unpaid", l: "Unpaid" },
            ].map((f) => (
              <button
                key={f.v}
                onClick={() => {
                  setPaymentFilter(f.v);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                  paymentFilter === f.v
                    ? "bg-red-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-slate-800/50 border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr
                      className="cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/30"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    >
                      <td className="p-4 font-mono text-xs text-slate-300">
                        {order.id.slice(0, 8)}...
                        <span className="ml-1 text-slate-500">{expandedId === order.id ? "▲" : "▼"}</span>
                      </td>
                      <td className="p-4 text-white">{order.user.name || order.user.email}</td>
                      <td className="p-4 text-slate-300">
                        {order.items.reduce((s, i) => s + i.quantity, 0)}
                      </td>
                      <td className="p-4 text-white font-medium">{formatPrice(Number(order.total))}</td>
                      <td className="p-4">
                        <span className={order.payment?.status === "SUCCESS" ? "text-green-400" : "text-yellow-400"}>
                          {order.payment?.status || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("en-KE")}
                      </td>
                    <td className="p-4">
                      <span className={`font-medium ${statusColors[order.status] || "text-slate-400"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <OrderStatusDropdown
                        value={order.status}
                        onChange={(s) => updateStatus(order.id, s)}
                      />
                    </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr className="border-b border-slate-700/50 bg-slate-900/40">
                        <td colSpan={8} className="p-4">
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Items */}
                            <div>
                              <h4 className="mb-2 text-sm font-semibold text-white">Items</h4>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-2">
                                    {item.productImage && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={item.productImage} alt={item.productName} className="h-12 w-12 rounded object-cover" />
                                    )}
                                    <div className="text-sm">
                                      <p className="text-white">
                                        {item.productName}
                                      </p>
                                      <p className="text-slate-400">
                                        {item.productCategory} &middot; {item.productMethod} &middot; {item.productOption} &middot; Qty {item.quantity}
                                      </p>
                                      <p className="text-slate-300">{formatPrice(Number(item.subtotal))}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Delivery */}
                            <div>
                              <h4 className="mb-2 text-sm font-semibold text-white">Delivery</h4>
                              <div className="space-y-1 text-sm text-slate-300">
                                <p>{order.shippingStreet}</p>
                                <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                                <p>Phone: {order.shippingPhone}</p>
                                <p className="text-slate-500">Ref: {order.payment?.reference}</p>
                                {order.notes && (
                                  <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/50 p-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Artwork notes</p>
                                    <p className="mt-1 whitespace-pre-wrap text-xs text-slate-300">{order.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </Button>
            <span className="text-sm text-slate-400">{page} / {totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
            <PerPageSelector
              value={perPage}
              onChange={(v) => {
                setPerPage(v);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
