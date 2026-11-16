const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
]);
const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  ogv: "video/ogg",
  mov: "video/quicktime",
};
const MIME_ALIASES: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
  "image/svg": "image/svg+xml",
  "video/x-m4v": "video/mp4",
};

const ALLOWED_FOLDERS = new Set([
  "library",
  "homepage",
  "products",
  "portfolio",
  "case-studies",
]);

export interface StoredMedia {
  url: string;
  storageKey: string;
  mimeType: string;
  size: number;
}

function storageConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";

  if (!url || !key) return null;
  return { url, key, bucket };
}

export function isMediaStorageConfigured() {
  return Boolean(storageConfig());
}

function fileExtension(file: File) {
  return (
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || ""
  );
}

function resolveMimeType(file: File) {
  const declared = file.type.toLowerCase();
  const normalized = MIME_ALIASES[declared] || declared;
  if (
    ALLOWED_IMAGE_TYPES.has(normalized) ||
    ALLOWED_VIDEO_TYPES.has(normalized)
  ) {
    return normalized;
  }
  return MIME_BY_EXTENSION[fileExtension(file)] || normalized;
}

export function validateMediaFile(file: File) {
  const mimeType = resolveMimeType(file);
  const isImage = ALLOWED_IMAGE_TYPES.has(mimeType);
  const isVideo = ALLOWED_VIDEO_TYPES.has(mimeType);

  if (!isImage && !isVideo) {
    return "Upload a JPG, PNG, WebP, AVIF, GIF, SVG, MP4, WebM, OGG or MOV file.";
  }
  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return "Images must be 10MB or smaller.";
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return "Videos must be 100MB or smaller.";
  }
  if (file.size === 0) {
    return "The selected file is empty.";
  }
  return null;
}

export function normalizeMediaFolder(folder: string | null | undefined) {
  return folder && ALLOWED_FOLDERS.has(folder) ? folder : "library";
}

export async function uploadMediaFile(
  file: File,
  folder: string
): Promise<StoredMedia> {
  const config = storageConfig();
  if (!config) {
    throw new Error(
      "Media storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)."
    );
  }

  const mimeType = resolveMimeType(file) || "application/octet-stream";
  const extension =
    fileExtension(file) || mimeType.split("/").pop() || "jpg";
  const storageKey = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());
  const response = await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${storageKey}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.key}`,
        apikey: config.key,
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "x-upsert": "true",
      },
      body,
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Storage upload failed with HTTP ${response.status}. ${detail}`.trim()
    );
  }

  return {
    url: `${config.url}/storage/v1/object/public/${config.bucket}/${storageKey}`,
    storageKey,
    mimeType,
    size: file.size,
  };
}

export async function deleteMediaFile(storageKey: string) {
  const config = storageConfig();
  if (!config) return;

  await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${storageKey}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.key}`,
        apikey: config.key,
      },
    }
  );
}
