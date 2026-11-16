import { parseEmbedInput } from "./media-embed";
import {
  isDirectMediaUrl,
  type MediaKindValue,
} from "./media-types";

export interface MediaInputPayload {
  mediaKind?: string;
  url?: string;
  embed?: string;
  altText?: string;
  sortOrder?: number;
}

export interface PreparedMedia {
  mediaKind: MediaKindValue;
  url: string | null;
  embedUrl: string | null;
  altText: string | null;
  sortOrder: number;
}

type PreparedMediaResult =
  | { data: PreparedMedia; error?: never }
  | { data?: never; error: string };

export function prepareMediaInput(
  input: MediaInputPayload,
  index = 0
): PreparedMediaResult {
  const mediaKind: MediaKindValue =
    input.mediaKind === "VIDEO" ? "VIDEO" : "IMAGE";
  const url = input.url?.trim() || "";
  const embed = input.embed?.trim() || "";

  if (Boolean(url) === Boolean(embed)) {
    return {
      error:
        "Choose exactly one media source: a direct URL or an embed. Clear the other option before saving.",
    };
  }

  if (url && !isDirectMediaUrl(url)) {
    return {
      error:
        "Enter a valid media URL starting with https://, http:// or / for a file in this project.",
    };
  }

  if (embed) {
    const parsed = parseEmbedInput(embed);
    if (parsed.error) return { error: parsed.error };
    if (!parsed.url) return { error: "That embed URL could not be read." };
    return {
      data: {
        mediaKind,
        url: null,
        embedUrl: parsed.url,
        altText: input.altText?.trim() || null,
        sortOrder: input.sortOrder ?? index,
      },
    };
  }

  return {
    data: {
      mediaKind,
      url,
      embedUrl: null,
      altText: input.altText?.trim() || null,
      sortOrder: input.sortOrder ?? index,
    },
  };
}
