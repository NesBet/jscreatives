const ALLOWED_EMBED_HOSTS = [
  "youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
  "vimeo.com",
  "instagram.com",
  "tiktok.com",
  "facebook.com",
  "fb.watch",
  "streamable.com",
  "loom.com",
  "wistia.com",
  "wistia.net",
  "dailymotion.com",
  "dai.ly",
  "bunny.net",
  "mediadelivery.net",
  "cloudflarestream.com",
  "mux.com",
  "descript.com",
];

type EmbedResult = { url: string; error?: never } | { url?: never; error: string };

function isAllowedHost(hostname: string) {
  const host = hostname.toLowerCase();
  return ALLOWED_EMBED_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

function extractSrc(input: string) {
  const quoted = input.match(
    /<(?:iframe|video|source)\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/i
  );
  if (quoted?.[2]) return quoted[2];

  const unquoted = input.match(
    /<(?:iframe|video|source)\b[^>]*\bsrc\s*=\s*([^\s>]+)/i
  );
  if (unquoted?.[1]) return unquoted[1].replace(/^["']|["']$/g, "");

  if (input.trimStart().startsWith("<")) return null;
  return input;
}

function youtubeEmbed(url: URL) {
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  let id = "";

  if (host === "youtu.be" || host.endsWith(".youtu.be")) {
    id = parts[0] || "";
  } else if (parts[0] === "watch") {
    id = url.searchParams.get("v") || "";
  } else if (["embed", "shorts", "live", "v"].includes(parts[0] || "")) {
    id = parts[1] || "";
  }

  if (id) {
    const start = url.searchParams.get("start") || url.searchParams.get("t");
    const seconds = start?.replace(/s$/, "");
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}${
      seconds && /^\d+$/.test(seconds) ? `?start=${seconds}` : ""
    }`;
  }

  const playlist = url.searchParams.get("list");
  if (playlist) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(
      playlist
    )}`;
  }

  return null;
}

function vimeoEmbed(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  const videoIndex = parts[0] === "video" ? 1 : 0;
  const id = parts[videoIndex];
  if (!id || !/^\d+$/.test(id)) return null;
  const hash = parts[videoIndex + 1] || url.searchParams.get("h");
  return `https://player.vimeo.com/video/${id}${hash ? `?h=${encodeURIComponent(hash)}` : ""}`;
}

function instagramEmbed(url: URL) {
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] !== "p" && parts[0] !== "reel" && parts[0] !== "tv") return null;
  if (parts[2] !== "embed") parts.push("embed");
  return `https://www.instagram.com/${parts.join("/")}/`;
}

function tiktokEmbed(url: URL) {
  const match = url.pathname.match(/\/video\/(\d+)/);
  if (match?.[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  if (url.pathname.includes("/embed/")) return url.toString();
  return null;
}

export function parseEmbedInput(input: string): EmbedResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { error: "Paste an embed code or embed URL." };
  }

  const rawSrc = extractSrc(trimmed)?.replace(/&amp;/g, "&").trim();
  if (!rawSrc) {
    return {
      error: "Paste an iframe embed code, or a YouTube, Vimeo, Instagram, TikTok or Facebook video URL.",
    };
  }

  let url: URL;
  try {
    url = new URL(rawSrc);
  } catch {
    return {
      error: "That embed is not a valid URL. Paste a full https:// embed URL or iframe code.",
    };
  }

  if (url.protocol !== "https:") {
    return { error: "Embed URLs must start with https://." };
  }
  if (url.username || url.password) {
    return { error: "Embed URLs cannot contain credentials." };
  }
  if (!isAllowedHost(url.hostname)) {
    return {
      error:
        "Use an allowed video embed from YouTube, Vimeo, Instagram, TikTok, Facebook, Loom, Wistia, Streamable, Dailymotion, Bunny Stream, Cloudflare Stream or Mux.",
    };
  }

  const host = url.hostname.toLowerCase();
  if (host === "youtu.be" || host.endsWith(".youtu.be") || host.includes("youtube")) {
    const youtube = youtubeEmbed(url);
    if (youtube) return { url: youtube };
  }

  if (host === "vimeo.com" || host.endsWith(".vimeo.com")) {
    const vimeo = vimeoEmbed(url);
    if (vimeo) return { url: vimeo };
  }

  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    const instagram = instagramEmbed(url);
    if (instagram) return { url: instagram };
  }

  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    const tiktok = tiktokEmbed(url);
    if (tiktok) return { url: tiktok };
  }

  url.hash = "";
  return { url: url.toString() };
}

export function getEmbedHostLabel(url: string | null | undefined) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
