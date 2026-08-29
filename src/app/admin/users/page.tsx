"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { useToast } from "@/components/ui/toast";
import { PRODUCT_PER_PAGE } from "@/constants";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        filter,
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchUsers();
  }, [user, page, filter, fetchUsers]);

  const updateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast("success", "Role updated");
        fetchUsers();
      }
    } catch {
      // ignore
    }
  };

  const toggleActive = async (u: UserData) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !u.active }),
      });
      if (res.ok) {
        toast("success", u.active ? "Account deactivated" : "Account activated");
        fetchUsers();
      } else {
        toast("error", "Failed to update account");
      }
    } catch {
      toast("error", "Failed to update account");
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Users" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors duration-200 ${
                filter === f
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl bg-slate-800/50 border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <Fragment key={u.id}>
                    <tr className="border-b border-slate-700/50">
                      <td className="p-4 text-white">{u.name || "N/A"}</td>
                      <td className="p-4 text-slate-300">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={
                            u.role === "ADMIN" ? "text-red-400" : "text-slate-300"
                          }
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.active
                              ? "bg-green-600/15 text-green-400"
                              : "bg-red-600/15 text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              u.active ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          {u.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString("en-NG")}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.id !== user.id && (
                            <>
                              <select
                                value={u.role}
                                onChange={(e) => updateRole(u.id, e.target.value)}
                                className="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-white focus:border-red-500 focus:outline-none"
                              >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              <Button
                                size="sm"
                                variant={u.active ? "ghost" : "secondary"}
                                onClick={() => toggleActive(u)}
                              >
                                {u.active ? "Deactivate" : "Activate"}
                              </Button>
                            </>
                          )}
                          {u.id === user.id && (
                            <span className="text-xs text-slate-500">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-slate-400">
              {page} / {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
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
