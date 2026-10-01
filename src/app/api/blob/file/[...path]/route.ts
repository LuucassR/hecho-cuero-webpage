import { get } from "@vercel/blob";
import { BLOB_ACCESS } from "@/lib/blob";

// Serves images from the private Blob store (see src/lib/blob.ts). Pathnames
// carry a random suffix and are never overwritten, so responses are cached
// for a year by the browser and Vercel's CDN.
export async function GET(request: Request, ctx: RouteContext<"/api/blob/file/[...path]">) {
  const { path } = await ctx.params;
  const result = await get(path.join("/"), {
    access: BLOB_ACCESS,
    ifNoneMatch: request.headers.get("if-none-match") ?? undefined,
  }).catch(() => null);

  if (!result) return new Response("Not found", { status: 404 });
  const etag = result.blob.etag;
  if (result.statusCode === 304) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }
  // The store only holds images; refuse anything else rather than proxy it.
  if (!result.blob.contentType.startsWith("image/")) {
    await result.stream.cancel();
    return new Response("Not found", { status: 404 });
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Content-Length": String(result.blob.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
    },
  });
}
