"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Code2, Film, ImageIcon, Link2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { parseEmbedInput } from "@/lib/media-embed";
import {
  mediaKindFromMimeType,
  type MediaDraft,
  type MediaSourceValue,
} from "@/lib/media-types";
import { cn } from "@/lib/utils";

const sourceTabs: Array<{
  value: MediaSourceValue;
  label: string;
  icon: typeof Link2;
}> = [
  { value: "URL", label: "URL", icon: Link2 },
  { value: "EMBED", label: "Embed", icon: Code2 },
  { value: "UPLOAD", label: "Upload", icon: Upload },
];

interface MediaSourceEditorProps {
  value: MediaDraft;
  onChange: (value: MediaDraft) => void;
  folder?: string;
  previewClassName?: string;
  compact?: boolean;
  imageOnly?: boolean;
}

export function MediaSourceEditor({
  value,
  onChange,
  folder = "library",
  previewClassName,
  compact = false,
  imageOnly = false,
}: MediaSourceEditorProps) {
  const { toast } = useToast();
  const id = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const mediaKind = imageOnly ? "IMAGE" : value.mediaKind;
  const tabs = imageOnly
    ? sourceTabs.filter((tab) => tab.value !== "EMBED")
    : sourceTabs;

  const embedResult = useMemo(
    () =>
      value.source === "EMBED" && value.embed.trim()
        ? parseEmbedInput(value.embed)
        : null,
    [value.embed, value.source]
  );

  const update = (patch: Partial<MediaDraft>) => {
    onChange({ ...value, ...patch });
  };

  const upload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);
      body.set("altText", value.altText);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      update({
        source: "UPLOAD",
        url: data.asset.url,
        embed: "",
        mediaKind: mediaKindFromMimeType(data.asset.mimeType),
      });
      toast(
        "success",
        `${data.asset.mimeType?.startsWith("video/") ? "Video" : "Image"} uploaded.`
      );
    } catch (error) {
      toast("error", (error as Error).message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const preview =
    value.source === "EMBED" ? (
      embedResult?.url ? (
        <iframe
          src={embedResult.url}
          title={value.altText || "Embed preview"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 px-4 text-center">
          <Code2 className="h-6 w-6 text-slate-500" />
          <span className="text-[11px] text-slate-400">
            {embedResult?.error || "Paste an embed code or video link to preview it."}
          </span>
        </div>
      )
    ) : value.url ? (
      mediaKind === "VIDEO" ? (
        <video
          src={value.url}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.url}
          alt={value.altText || "Media preview"}
          className="h-full w-full object-cover"
        />
      )
    ) : (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-900 text-slate-500">
        {mediaKind === "VIDEO" ? (
          <Film className="h-7 w-7" />
        ) : (
          <ImageIcon className="h-7 w-7" />
        )}
        <span className="text-[11px]">No {mediaKind.toLowerCase()} selected</span>
      </div>
    );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/40">
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden bg-slate-900",
          previewClassName
        )}
      >
        {preview}
        <span className="absolute left-2 top-2 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-200 backdrop-blur-sm">
          {value.source === "EMBED" ? "Embed" : mediaKind.toLowerCase()}
        </span>
      </div>

      <div className={cn("space-y-3", compact ? "p-3" : "p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {!imageOnly && (
            <div
              className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-0.5"
              role="group"
              aria-label={`Media type ${id}`}
            >
              {(["IMAGE", "VIDEO"] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => update({ mediaKind: kind })}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                    value.mediaKind === kind
                      ? "bg-gold text-ink"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {kind === "VIDEO" ? (
                    <Film className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  {kind === "VIDEO" ? "Video" : "Image"}
                </button>
              ))}
            </div>
          )}

          <div
            className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-0.5"
            role="tablist"
            aria-label={`Media source ${id}`}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={value.source === tab.value}
                  onClick={() => update({ source: tab.value })}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors",
                    value.source === tab.value
                      ? "bg-slate-700 text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {value.source === "URL" && (
          <div>
            <label
              htmlFor={`${id}-url`}
              className="mb-1.5 block text-xs font-medium text-slate-300"
            >
              Media URL
            </label>
            <Input
              id={`${id}-url`}
              value={value.url}
              onChange={(event) => update({ url: event.target.value })}
              placeholder={
                mediaKind === "VIDEO"
                  ? "https://...mp4 or /videos/file.mp4"
                  : "https://...webp, .jpg or /images/file.webp"
              }
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Use a direct public {mediaKind === "VIDEO" ? "video" : "image"} file URL.
            </p>
          </div>
        )}

        {value.source === "EMBED" && (
          <div>
            <label
              htmlFor={`${id}-embed`}
              className="mb-1.5 block text-xs font-medium text-slate-300"
            >
              Embed code or URL
            </label>
            <Textarea
              id={`${id}-embed`}
              rows={3}
              value={value.embed}
              onChange={(event) => update({ embed: event.target.value })}
              placeholder='Paste <iframe src="https://www.youtube.com/embed/..."></iframe> or a YouTube/Vimeo URL'
            />
            {embedResult?.error && (
              <p className="mt-1 text-[10px] text-red-400">{embedResult.error}</p>
            )}
            {embedResult?.url && (
              <p className="mt-1 truncate text-[10px] text-gold-soft">
                Embed ready: {embedResult.url}
              </p>
            )}
          </div>
        )}

        {value.source === "UPLOAD" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Upload from your machine
            </label>
            <input
              ref={fileInput}
              type="file"
              accept={
                imageOnly
                  ? "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
                  : "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml,video/mp4,video/webm,video/ogg,video/quicktime"
              }
              disabled={uploading}
              onChange={(event) => void upload(event.target.files?.[0] ?? null)}
              className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-1.5 file:text-xs file:text-white disabled:opacity-60"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              {imageOnly
                ? "Images up to 10MB. Uploads are added to the Media Library."
                : `Images up to 10MB. Videos up to 100MB. Uploaded ${mediaKind === "VIDEO" ? "videos" : "images"} are added to the Media Library.`}
            </p>
            {uploading && (
              <p className="mt-2 inline-flex items-center gap-2 text-[11px] text-gold-soft">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </p>
            )}
            {value.url && !uploading && (
              <p className="mt-2 truncate text-[10px] text-slate-400">
                Current file: {value.url}
              </p>
            )}
          </div>
        )}

        <Input
          label={mediaKind === "VIDEO" ? "Video description" : "Alt text"}
          value={value.altText}
          onChange={(event) => update({ altText: event.target.value })}
          placeholder="Describe what the media shows"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] text-slate-500">
            Only the selected source is saved.
          </p>
          {value.source === "UPLOAD" && value.url && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => update({ url: "", embed: "" })}
            >
              Clear file
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
