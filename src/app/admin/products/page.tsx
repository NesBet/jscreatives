"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { PerPageSelector } from "@/components/ui/per-page-selector";
import { formatPrice } from "@/lib/utils";
import { CLUBS, KIT_TYPES, PRODUCT_PER_PAGE } from "@/constants";

interface ProductVariant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  priceOverride: number | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  club: string;
  kitType: string;
  season: string;
  basePrice: number;
  active: boolean;
  featured: boolean;
  variants: ProductVariant[];
}

interface VariantForm {
  size: string;
  sku: string;
  stock: string;
  priceOverride: string;
}

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PRODUCT_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    slug: string;
    description: string;
    club: string;
    kitType: string;
    season: string;
    basePrice: number;
    active: boolean;
    featured: boolean;
    variants: VariantForm[];
  }>({
    name: "",
    slug: "",
    description: "",
    club: CLUBS[0] as string,
    kitType: "HOME",
    season: "",
    basePrice: 0,
    active: true,
    featured: false,
    variants: [{ size: "", sku: "", stock: "", priceOverride: "" }],
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [page, perPage, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") fetchProducts();
  }, [user, page, search, fetchProducts]);

  const handleCreate = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      club: CLUBS[0] as string,
      kitType: "HOME",
      season: "",
      basePrice: 0,
      active: true,
      featured: false,
      variants: [{ size: "", sku: "", stock: "", priceOverride: "" }],
    });
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: "",
      club: product.club,
      kitType: product.kitType,
      season: product.season,
      basePrice: Number(product.basePrice),
      active: product.active,
      featured: product.featured,
      variants:
        product.variants.length > 0
          ? product.variants.map((v) => ({
              size: v.size,
              sku: v.sku,
              stock: String(v.stock),
              priceOverride: v.priceOverride != null ? String(v.priceOverride) : "",
            }))
          : [{ size: "", sku: "", stock: "", priceOverride: "" }],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast("success", "Product deleted");
        fetchProducts();
      } else {
        toast("error", "Failed to delete product");
      }
    } catch {
      toast("error", "Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";
      const variants = form.variants
        .filter((v) => v.size.trim() && v.sku.trim())
        .map((v) => {
          const out: { size: string; sku: string; stock: number; priceOverride?: number } = {
            size: v.size.trim(),
            sku: v.sku.trim(),
            stock: Number(v.stock) || 0,
          };
          if (v.priceOverride.trim()) out.priceOverride = Number(v.priceOverride);
          return out;
        });
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          club: form.club,
          kitType: form.kitType,
          season: form.season,
          basePrice: Number(form.basePrice),
          active: form.active,
          featured: form.featured,
          variants,
        }),
      });
      if (res.ok) {
        toast("success", editingProduct ? "Product updated" : "Product created");
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        toast("error", data.error || "Failed");
      }
    } catch {
      toast("error", "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const updateVariant = (idx: number, field: keyof VariantForm, value: string) => {
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    }));
  };

  const addVariant = () => {
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { size: "", sku: "", stock: "", priceOverride: "" }],
    }));
  };

  const removeVariant = (idx: number) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Products" />
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
          <Button onClick={handleCreate}>Add Product</Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-slate-800/50 border border-slate-700/50">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Club</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Active</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
                  return (
                    <tr key={product.id} className="border-b border-slate-700/50">
                      <td className="p-4 text-white">{product.name}</td>
                      <td className="p-4 text-slate-300">{product.club}</td>
                      <td className="p-4 text-slate-300">{product.kitType}</td>
                      <td className="p-4 text-white font-medium">
                        {formatPrice(Number(product.basePrice))}
                      </td>
                      <td className="p-4">
                        <span className={totalStock < 5 ? "text-red-400" : "text-slate-300"}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={product.active ? "text-green-400" : "text-slate-500"}>
                          {product.active ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="mr-2 text-slate-400 hover:text-white text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination + per-page limiter */}
        {products.length > 0 && (
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">
                {editingProduct ? "Edit Product" : "Create Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    Club
                  </label>
                  <select
                    value={form.club}
                    onChange={(e) => setForm({ ...form, club: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {CLUBS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">
                    Kit Type
                  </label>
                  <select
                    value={form.kitType}
                    onChange={(e) => setForm({ ...form, kitType: e.target.value })}
                    className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {KIT_TYPES.map((kt) => (
                      <option key={kt} value={kt}>{kt}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Season"
                  value={form.season}
                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                  required
                  placeholder="2024/25"
                />
                <Input
                  label="Base Price (KES)"
                  type="number"
                  value={form.basePrice}
                  onChange={(e) =>
                    setForm({ ...form, basePrice: Number(e.target.value) })
                  }
                  required
                />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="rounded border-slate-600 bg-slate-800"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-slate-600 bg-slate-800"
                    />
                    Featured
                  </label>
                </div>
                <div className="border-t border-slate-700 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">
                      Variants (size, SKU &amp; stock)
                    </span>
                    <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
                      + Add variant
                    </Button>
                  </div>
                  {form.variants.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No variants — the product will have no stock.
                    </p>
                  )}
                  <div className="space-y-2">
                    {form.variants.map((v, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-700 bg-slate-800/40 p-2"
                      >
                        <div className="flex flex-col">
                          <label className="mb-1 text-[10px] text-slate-500">Size</label>
                          <input
                            value={v.size}
                            onChange={(e) => updateVariant(idx, "size", e.target.value)}
                            placeholder="M"
                            className="h-9 w-20 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-[10px] text-slate-500">SKU</label>
                          <input
                            value={v.sku}
                            onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                            placeholder="JS-M-001"
                            className="h-9 w-32 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-[10px] text-slate-500">Stock</label>
                          <input
                            type="number"
                            min={0}
                            value={v.stock}
                            onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                            placeholder="0"
                            className="h-9 w-20 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="mb-1 text-[10px] text-slate-500">Price override</label>
                          <input
                            type="number"
                            min={0}
                            value={v.priceOverride}
                            onChange={(e) => updateVariant(idx, "priceOverride", e.target.value)}
                            placeholder="optional"
                            className="h-9 w-28 rounded-lg border border-slate-600 bg-slate-800 px-2 text-sm text-white focus:border-red-500 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="mb-0.5 rounded-lg px-2 py-1.5 text-xs text-red-400 hover:bg-slate-700 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    {editingProduct ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
