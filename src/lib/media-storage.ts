const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

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

export function validateMediaFile(file: File) {
  if (!ALLOWED_MEDIA_TYPES.has(file.type)) {
    return "Upload a JPG, PNG, WebP, AVIF, GIF or SVG image.";
  }
  if (file.size > MAX_MEDIA_BYTES) {
    return "Images must be 10MB or smaller.";
  }
  if (file.size === 0) {
    return "The selected image is empty.";
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

  const extension =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    file.type.split("/").pop() ||
    "jpg";
  const storageKey = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());
  const response = await fetch(
    `${config.url}/storage/v1/object/${config.bucket}/${storageKey}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.key}`,
        apikey: config.key,
        "Content-Type": file.type,
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
    mimeType: file.type,
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
