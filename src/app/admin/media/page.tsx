"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

interface MediaAsset {
  id: string;
  url: string;
  storageKey: string | null;
  altText: string | null;
  caption: string | null;
  mimeType: string | null;
  size: number | null;
  folder: string;
  createdAt: string;
}

const folders = ["library", "homepage", "products", "portfolio", "case-studies"];

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [folder, setFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadFolder, setUploadFolder] = useState("library");
  const [urlForm, setUrlForm] = useState({ url: "", altText: "", folder: "library" });
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [editForm, setEditForm] = useState({ altText: "", caption: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchAssets = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), perPage: "24" });
    if (folder !== "all") params.set("folder", folder);
    if (query) params.set("search", query);

    try {
      const response = await fetch(`/api/admin/media?${params}`);
      if (!response.ok) throw new Error("Could not load the media library.");
      const data = await response.json();
      setAssets(data.assets);
      setConfigured(data.configured);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, folder, query, toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") void fetchAssets();
  }, [user, fetchAssets]);

  const uploadFile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast("error", "Choose an image first.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", uploadFolder);
      body.set("altText", uploadAlt);
      body.set("caption", uploadCaption);
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      toast("success", "Image uploaded.");
      setFile(null);
      setUploadAlt("");
      setUploadCaption("");
      if (fileInput.current) fileInput.current.value = "";
      setPage(1);
      await fetchAssets();
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const addByUrl = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddingUrl(true);
    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not add the image.");
      toast("success", "Image added to the library.");
      setUrlForm({ url: "", altText: "", folder: "library" });
      setPage(1);
      await fetchAssets();
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setAddingUrl(false);
    }
  };

  const saveAsset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/media/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Could not update the image.");
      toast("success", "Image details updated.");
      setEditing(null);
      await fetchAssets();
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAsset = async (asset: MediaAsset) => {
    if (!confirm("Delete this image from the library? This cannot be undone.")) return;
    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete the image.");
      toast("success", "Image deleted.");
      await fetchAssets();
    } catch (error) {
      toast("error", (error as Error).message);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast("success", "Image URL copied.");
    } catch {
      toast("error", "Could not copy the URL.");
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="p-6">
        <div className="grid gap-5 xl:grid-cols-2">
          <form
            onSubmit={uploadFile}
            className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5"
          >
            <h2 className="text-sm font-semibold text-white">Upload an image</h2>
            <p className="mt-1 text-xs text-slate-400">
              JPG, PNG, WebP, AVIF, GIF or SVG. Maximum 10MB.
            </p>
            {!configured && (
              <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">
                Supabase Storage is not configured yet. Add SUPABASE_URL and a
                server-side secret key (SUPABASE_SERVICE_ROLE_KEY or
                SUPABASE_SECRET_KEY), then restart the server. The publishable key
                alone cannot upload. You can still add an image by URL.
              </p>
            )}
            <div className="mt-4 space-y-3">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs file:text-white"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-400">
                  Folder
                  <select
                    value={uploadFolder}
                    onChange={(event) => setUploadFolder(event.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {folders.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Alt text"
                  value={uploadAlt}
                  onChange={(event) => setUploadAlt(event.target.value)}
                  placeholder="Describe the image"
                />
              </div>
              <Textarea
                label="Caption"
                rows={2}
                value={uploadCaption}
                onChange={(event) => setUploadCaption(event.target.value)}
                placeholder="Optional caption for the image"
              />
            </div>
            <Button type="submit" loading={uploading} disabled={!configured} className="mt-4">
              Upload image
            </Button>
          </form>

          <form
            onSubmit={addByUrl}
            className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5"
          >
            <h2 className="text-sm font-semibold text-white">Add an image by URL</h2>
            <p className="mt-1 text-xs text-slate-400">
              Use a Supabase, Cloudinary, Unsplash or other configured image host.
            </p>
            <div className="mt-4 space-y-3">
              <Input
                label="Image URL"
                type="url"
                required
                value={urlForm.url}
                onChange={(event) => setUrlForm({ ...urlForm, url: event.target.value })}
                placeholder="https://..."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-slate-400">
                  Folder
                  <select
                    value={urlForm.folder}
                    onChange={(event) => setUrlForm({ ...urlForm, folder: event.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
                  >
                    {folders.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <Input
                  label="Alt text"
                  value={urlForm.altText}
                  onChange={(event) => setUrlForm({ ...urlForm, altText: event.target.value })}
                  placeholder="Describe the image"
                />
              </div>
            </div>
            <Button type="submit" variant="secondary" loading={addingUrl} className="mt-4">
              Add image
            </Button>
          </form>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search images..."
            className="min-w-56 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
          <select
            value={folder}
            onChange={(event) => {
              setPage(1);
              setFolder(event.target.value);
            }}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            <option value="all">All folders</option>
            {folders.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setQuery(search.trim());
            }}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-slate-400">Loading media...</p>
        ) : assets.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-10 text-center text-sm text-slate-400">
            No images yet. Upload your first image above.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => (
              <article
                key={asset.id}
                className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60"
              >
                <div className="relative aspect-[4/3] bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.altText || ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-xs text-slate-300">
                    {asset.altText || asset.url.split("/").pop()}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {asset.folder} {asset.size ? `· ${formatBytes(asset.size)}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyUrl(asset.url)}
                      className="rounded-md bg-slate-700 px-2 py-1 text-[11px] text-white hover:bg-slate-600"
                    >
                      Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(asset);
                        setEditForm({
                          altText: asset.altText || "",
                          caption: asset.caption || "",
                        });
                      }}
                      className="rounded-md bg-slate-700 px-2 py-1 text-[11px] text-white hover:bg-slate-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAsset(asset)}
                      className="rounded-md bg-red-600/20 px-2 py-1 text-[11px] text-red-300 hover:bg-red-600/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-lg bg-slate-800 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-lg bg-slate-800 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={saveAsset}
            className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Edit image details</h2>
            <div className="mt-4 space-y-3">
              <Input
                label="Alt text"
                value={editForm.altText}
                onChange={(event) => setEditForm({ ...editForm, altText: event.target.value })}
              />
              <Textarea
                label="Caption"
                rows={3}
                value={editForm.caption}
                onChange={(event) => setEditForm({ ...editForm, caption: event.target.value })}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>Save changes</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
