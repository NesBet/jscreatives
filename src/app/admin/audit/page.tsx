"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { PRODUCT_PER_PAGE } from "@/constants";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string | null; email: string } | null;
}

export default function AdminAuditPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/audit?page=${page}&perPage=${perPage}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchLogs();
  }, [user, page, fetchLogs]);

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Audit Logs" />
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl bg-slate-800/50 border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Entity</th>
                <th className="p-4 font-medium">Entity ID</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No audit logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700/50">
                    <td className="p-4">
                      <span className="rounded-full bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{log.entity}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {log.entityId ? `${log.entityId.slice(0, 8)}...` : "N/A"}
                    </td>
                    <td className="p-4 text-slate-300">
                      {log.user ? log.user.name || log.user.email : "System"}
                    </td>
                    <td className="p-4 text-xs text-slate-400 max-w-[200px] truncate">
                      {log.details ? JSON.stringify(log.details) : "N/A"}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleDateString("en-KE")}
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
