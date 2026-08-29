"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_PER_PAGE } from "@/constants";

interface Payment {
  id: string;
  reference: string;
  status: string;
  amount: number;
  currency: string;
  channel: string | null;
  paidAt: string | null;
  createdAt: string;
  order: {
    id: string;
    total: number;
    status: string;
    user: { name: string | null; email: string };
  };
}

export default function AdminPaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/payments?page=${page}&perPage=${perPage}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchPayments();
  }, [user, page, fetchPayments]);

  if (authLoading || !user) return null;

  const statusColors: Record<string, string> = {
    SUCCESS: "text-green-400",
    PENDING: "text-yellow-400",
    FAILED: "text-red-400",
    REFUNDED: "text-purple-400",
  };

  return (
    <>
      <AdminHeader title="Payments" />
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl bg-slate-800/50 border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Reference</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Channel</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-700/50">
                    <td className="p-4 font-mono text-xs text-slate-300">{p.reference}</td>
                    <td className="p-4 text-white">
                      {p.order.user.name || p.order.user.email}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {formatPrice(Number(p.amount))} {p.currency}
                    </td>
                    <td className="p-4">
                      <span className={`font-medium ${statusColors[p.status] || "text-slate-400"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{p.channel || "N/A"}</td>
                    <td className="p-4 text-slate-400">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString("en-NG")
                        : new Date(p.createdAt).toLocaleDateString("en-NG")}
                    </td>
                  </tr>
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
