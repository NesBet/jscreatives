export type MediaKindValue = "IMAGE" | "VIDEO";
export type MediaSourceValue = "URL" | "EMBED" | "UPLOAD";

export interface MediaValue {
  mediaKind: MediaKindValue;
  url?: string | null;
  embedUrl?: string | null;
  altText?: string | null;
}

export interface MediaDraft {
  mediaKind: MediaKindValue;
  source: MediaSourceValue;
  url: string;
  embed: string;
  altText: string;
}

export function mediaDraftFrom(media: MediaValue): MediaDraft {
  return {
    mediaKind: media.mediaKind === "VIDEO" ? "VIDEO" : "IMAGE",
    source: media.embedUrl ? "EMBED" : "URL",
    url: media.url ?? "",
    embed: media.embedUrl ?? "",
    altText: media.altText ?? "",
  };
}

export function mediaDraftPayload(draft: MediaDraft) {
  const useEmbed = draft.source === "EMBED";
  return {
    mediaKind: draft.mediaKind,
    url: useEmbed ? "" : draft.url.trim(),
    embed: useEmbed ? draft.embed.trim() : "",
    altText: draft.altText.trim(),
  };
}

const VIDEO_EXTENSIONS = /\.(mp4|m4v|webm|ogv|ogg|mov|m3u8)(?:[?#]|$)/i;

export function isVideoUrl(url: string | null | undefined) {
  return Boolean(url && VIDEO_EXTENSIONS.test(url));
}

export function mediaKindFromMimeType(
  mimeType: string | null | undefined
): MediaKindValue {
  return mimeType?.startsWith("video/") ? "VIDEO" : "IMAGE";
}

export function isDirectMediaUrl(url: string) {
  return url.startsWith("/") || /^https?:\/\//i.test(url);
}
