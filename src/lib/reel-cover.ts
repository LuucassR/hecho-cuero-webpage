import { storeOptimizedImage } from "@/lib/blob";

// Instagram only serves og:image to link-preview crawlers, so we identify as
// one. Best effort: Instagram may block or rate-limit server IPs, in which
// case the admin uploads the cover by hand.
const CRAWLER_UA = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";
const MAX_BYTES = 5 * 1024 * 1024;

function isInstagramCdn(url: URL) {
  return (
    url.protocol === "https:" &&
    (url.hostname.endsWith(".cdninstagram.com") || url.hostname.endsWith(".fbcdn.net"))
  );
}

// Downloads the reel's cover from Instagram and re-hosts it in Vercel Blob as WebP.
// Returns the path to store, or null if anything along the way fails.
export async function fetchReelCover(reelUrl: string): Promise<string | null> {
  const fail = (reason: string) => {
    console.warn(`fetchReelCover failed for ${reelUrl}: ${reason}`);
    return null;
  };
  try {
    const page = await fetch(reelUrl, {
      headers: { "User-Agent": CRAWLER_UA },
      signal: AbortSignal.timeout(8000),
    });
    if (!page.ok) return fail(`Instagram responded ${page.status}`);

    const match = (await page.text()).match(/<meta property="og:image" content="([^"]+)"/);
    if (!match) return fail("no og:image on the page (Instagram may be blocking this server)");
    const imageUrl = new URL(match[1].replaceAll("&amp;", "&"));
    if (!isInstagramCdn(imageUrl)) return fail(`unexpected image host ${imageUrl.hostname}`);

    const image = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) });
    const contentType = image.headers.get("content-type") ?? "";
    if (!image.ok || !contentType.startsWith("image/")) {
      return fail(`image download responded ${image.status} ${contentType}`);
    }
    const bytes = await image.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) return fail(`image too large (${bytes.byteLength} bytes)`);

    const code = new URL(reelUrl).pathname.split("/").filter(Boolean).pop();
    return await storeOptimizedImage("reels", code ?? "reel", bytes);
  } catch (error) {
    return fail(String(error));
  }
}

