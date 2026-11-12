"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface SiteImage {
  key: string;
  label: string;
  group: string;
  defaultUrl: string;
  defaultAlt: string;
  url: string;
  altText: string;
  isOverride: boolean;
  updatedAt: string | null;
}

function ImageSlot({
  image,
  onSave,
  onReset,
}: {
  image: SiteImage;
  onSave: (key: string, url: string, altText: string) => Promise<boolean>;
  onReset: (key: string) => Promise<boolean>;
}) {
  const [url, setUrl] = useState(image.url);
  const [altText, setAltText] = useState(image.altText);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(image.url);
    setAltText(image.altText);
  }, [image.url, image.altText]);

  const save = async () => {
    setSaving(true);
    await onSave(image.key, url.trim(), altText.trim());
    setSaving(false);
  };

  const reset = async () => {
    setResetting(true);
    const resetDone = await onReset(image.key);
    if (resetDone) {
      setUrl(image.defaultUrl);
      setAltText(image.defaultAlt);
    }
    setResetting(false);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60">
      <div className="relative aspect-[4/3] bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url || image.defaultUrl}
          alt={altText || image.defaultAlt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span
          className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            image.isOverride
              ? "bg-emerald-500/90 text-slate-950"
              : "bg-slate-900/80 text-slate-300"
          }`}
        >
          {image.isOverride ? "Updated" : "Default"}
        </span>
      </div>
      <div className="space-y-2.5 p-3">
        <div>
          <p className="text-xs font-semibold text-white">{image.label}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
            {image.group}
          </p>
        </div>
        <Input
          aria-label={`Image URL for ${image.label}`}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Image URL"
        />
        <Input
          aria-label={`Alt text for ${image.label}`}
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Alt text"
        />
        <div className="flex flex-wrap gap-1.5">
          <Button type="button" size="sm" loading={saving} onClick={save}>
            Save
          </Button>
          {image.isOverride && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              loading={resetting}
              onClick={reset}
            >
              Reset
            </Button>
          )}
          <Link
            href="/admin/media"
            className="inline-flex h-8 items-center rounded-lg px-3 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Library
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AdminSiteImagesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, authLoading, router]);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/site-images");
      if (!response.ok) throw new Error("Could not load website images.");
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "ADMIN") void fetchImages();
  }, [user, fetchImages]);

  const groups = useMemo(
    () => ["All", ...Array.from(new Set(images.map((image) => image.group)))],
    [images]
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return images.filter((image) => {
      if (group !== "All" && image.group !== group) return false;
      if (!needle) return true;
      return `${image.label} ${image.group} ${image.key}`
        .toLowerCase()
        .includes(needle);
    });
  }, [images, group, search]);

  const saveImage = async (key: string, url: string, altText: string) => {
    try {
      const response = await fetch("/api/admin/site-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, url, altText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update the image.");
      setImages((current) =>
        current.map((image) =>
          image.key === key
            ? { ...image, url, altText, isOverride: true, updatedAt: new Date().toISOString() }
            : image
        )
      );
      toast("success", "Website image updated.");
      return true;
    } catch (error) {
      toast("error", (error as Error).message);
      return false;
    }
  };

  const resetImage = async (key: string) => {
    try {
      const response = await fetch(
        `/api/admin/site-images?key=${encodeURIComponent(key)}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not reset the image.");
      const original = images.find((image) => image.key === key);
      setImages((current) =>
        current.map((image) =>
          image.key === key
            ? {
                ...image,
                url: image.defaultUrl,
                altText: image.defaultAlt,
                isOverride: false,
                updatedAt: null,
              }
            : image
        )
      );
      toast("success", `Reverted ${original?.label || "image"} to the default.`);
      return true;
    } catch (error) {
      toast("error", (error as Error).message);
      return false;
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Website Images" />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">
              Replace the homepage collage, product photography, portfolio images
              and studio gallery without changing code.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Upload new files in the{" "}
              <Link href="/admin/media" className="text-red-400 hover:text-red-300">
                Media Library
              </Link>{" "}
              then paste their URLs here.
            </p>
          </div>
          <Link
            href="/admin/media"
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Open Media Library
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search image slots..."
            className="min-w-56 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
          >
            {groups.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <span className="text-xs text-slate-500">
            {filtered.filter((image) => image.isOverride).length} updated ·{" "}
            {filtered.length} slots
          </span>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-slate-400">Loading image slots...</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((image) => (
              <ImageSlot
                key={image.key}
                image={image}
                onSave={saveImage}
                onReset={resetImage}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
