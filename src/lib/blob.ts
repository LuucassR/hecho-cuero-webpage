import { del, get, put } from "@vercel/blob";
import { BLOB_ACCESS, BLOB_SERVE_PREFIX, INCOMING_FOLDER } from "./blob-access";
import { toOptimizedWebp } from "./image-processing";

// The Blob store is private: browsers can't load its URLs, so files are
// served through /api/blob/file/<pathname>, which reads them with the
// BLOB_READ_WRITE_TOKEN. The database stores that local path, so it renders
// like any image in /public.
export { BLOB_ACCESS, BLOB_SERVE_PREFIX, INCOMING_FOLDER } from "./blob-access";

function isPrivateBlobUrl(url: URL) {
  return url.protocol === "https:" && url.hostname.endsWith(".private.blob.vercel-storage.com");
}

// Turns a URL returned by put()/upload() into the local path to store.
// Returns null for anything that isn't a file in a private Blob store.
export function toServedPath(blobUrl: string): string | null {
  try {
    const url = new URL(blobUrl);
    if (!isPrivateBlobUrl(url)) return null;
    return BLOB_SERVE_PREFIX + url.pathname.slice(1);
  } catch {
    return null;
  }
}

function toPathname(servedPath: string) {
  return decodeURIComponent(servedPath.slice(BLOB_SERVE_PREFIX.length));
}

// Converts an image to an optimized WebP and stores it under `folder`.
// `name` is only a readable hint; a random suffix keeps pathnames unique.
// Returns the local path to store in the database.
export async function storeOptimizedImage(
  folder: string,
  name: string,
  input: ArrayBuffer | Buffer,
): Promise<string> {
  const webp = await toOptimizedWebp(input);
  const base = name.replace(/\.[^.]*$/, "").replace(/[^\w-]+/g, "-").slice(0, 60) || "image";
  const blob = await put(`${folder}/${base}.webp`, webp, {
    access: BLOB_ACCESS,
    addRandomSuffix: true,
    contentType: "image/webp",
  });
  return toServedPath(blob.url)!;
}

// Takes an original the browser uploaded to INCOMING_FOLDER, replaces it with
// an optimized WebP under `folder`, and returns the path to store. Throws if
// the URL isn't an upload from this store.
export async function optimizeUploadedImage(blobUrl: string, folder: string): Promise<string> {
  const served = toServedPath(blobUrl);
  const pathname = served && toPathname(served);
  if (!pathname?.startsWith(`${INCOMING_FOLDER}/`)) throw new Error("URL de imagen inválida");

  const original = await get(pathname, { access: BLOB_ACCESS, useCache: false });
  if (!original || original.statusCode !== 200) throw new Error("No encontramos la imagen subida");
  const bytes = await new Response(original.stream).arrayBuffer();

  try {
    return await storeOptimizedImage(folder, pathname.split("/").pop()!, bytes);
  } finally {
    await del(pathname).catch(() => undefined);
  }
}

// Deletes the Blob file behind a stored path. Ignores paths that aren't Blob
// files (e.g. images in /public) and failures, which would only leave an orphan.
export async function deleteStoredFile(path: string | null | undefined) {
  if (!path?.startsWith(BLOB_SERVE_PREFIX)) return;
  await del(toPathname(path)).catch(() => undefined);
}
