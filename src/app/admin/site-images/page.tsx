"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminHeader } from "@/components/admin/admin-header";
import { MediaSourceEditor } from "@/components/admin/media-source-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  mediaDraftFrom,
  mediaDraftPayload,
  type MediaDraft,
  type MediaKindValue,
} from "@/lib/media-types";

interface SiteImage {
  key: string;
  label: string;
  group: string;
  defaultUrl: string;
  defaultAlt: string;
  mediaKind: MediaKindValue;
  url: string;
  embedUrl: string | null;
  altText: string;
  isOverride: boolean;
  updatedAt: string | null;
}

type MediaPayload = ReturnType<typeof mediaDraftPayload>;

function folderForGroup(group: string) {
  if (group === "Products") return "products";
  if (group === "Portfolio") return "portfolio";
  if (group === "Homepage") return "homepage";
  return "library";
}

function MediaSlot({
  image,
  onSave,
  onReset,
}: {
  image: SiteImage;
  onSave: (key: string, payload: MediaPayload) => Promise<boolean>;
  onReset: (key: string) => Promise<boolean>;
}) {
  const [draft, setDraft] = useState<MediaDraft>(() =>
    mediaDraftFrom({
      mediaKind: image.mediaKind,
      url: image.url,
      embedUrl: image.embedUrl,
      altText: image.altText,
    })
  );
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave(image.key, mediaDraftPayload(draft));
    setSaving(false);
  };

  const reset = async () => {
    setResetting(true);
    await onReset(image.key);
    setResetting(false);
  };

  return (
    <article className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">{image.label}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
            {image.group}
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            image.isOverride
              ? "bg-gold text-ink"
              : "bg-slate-900/80 text-slate-300"
          }`}
        >
          {image.isOverride ? "Updated" : "Default"}
        </span>
      </div>

      <MediaSourceEditor
        value={draft}
        onChange={setDraft}
        folder={folderForGroup(image.group)}
        previewClassName="aspect-[4/3]"
        compact
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <Button type="button" size="sm" variant="gold" loading={saving} onClick={save}>
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
            Reset to default
          </Button>
        )}
        <Link
          href="/admin/media"
          className="inline-flex h-8 items-center rounded-lg px-3 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          Library
        </Link>
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
      if (!response.ok) throw new Error("Could not load website media.");
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

  const saveImage = async (key: string, payload: MediaPayload) => {
    try {
      const response = await fetch("/api/admin/site-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, ...payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update the media.");
      setImages((current) =>
        current.map((image) => (image.key === key ? data.image : image))
      );
      toast("success", "Website media updated.");
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
      if (!response.ok) throw new Error(data.error || "Could not reset the media.");
      const original = images.find((image) => image.key === key);
      setImages((current) =>
        current.map((image) =>
          image.key === key
            ? {
                ...image,
                mediaKind: "IMAGE",
                url: image.defaultUrl,
                embedUrl: null,
                altText: image.defaultAlt,
                isOverride: false,
                updatedAt: null,
              }
            : image
        )
      );
      toast("success", `Reverted ${original?.label || "media"} to the default.`);
      return true;
    } catch (error) {
      toast("error", (error as Error).message);
      return false;
    }
  };

  if (authLoading || !user) return null;

  return (
    <>
      <AdminHeader title="Website Media" />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">
              Replace homepage artwork, product photography, portfolio media and
              the studio gallery with an image, a video, an embed or an upload.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Each slot uses one source at a time. Uploads are stored in the{" "}
              <Link href="/admin/media" className="text-gold-soft hover:text-gold-tint">
                Media Library
              </Link>
              .
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
            placeholder="Search media slots..."
            className="min-w-56 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-gold focus:outline-none"
          />
          <select
            value={group}
            onChange={(event) => setGroup(event.target.value)}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-gold focus:outline-none"
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
          <p className="mt-8 text-sm text-slate-400">Loading media slots...</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((image) => (
              <MediaSlot
                key={`${image.key}:${image.updatedAt ?? "default"}`}
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
