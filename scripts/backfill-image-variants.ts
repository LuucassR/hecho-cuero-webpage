// One-off: creates the width variants (see src/lib/image-variants.ts) for
// every WebP in the store that lacks them: images uploaded before
// storeOptimizedImage started storing variants, and any added by hand (the
// category images). Safe to re-run; originals with all variants are skipped.
//
//   pnpm tsx --env-file=.env.local scripts/backfill-image-variants.ts [--dry-run]
import { get, list } from "@vercel/blob";
import { BLOB_ACCESS, INCOMING_FOLDER, storeImageVariants } from "../src/lib/blob";
import { VARIANT_WIDTHS, isVariantPath, variantPath } from "../src/lib/image-variants";

const dryRun = process.argv.includes("--dry-run");

async function listPathnames() {
  const pathnames = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ cursor });
    for (const blob of page.blobs) pathnames.add(blob.pathname);
    cursor = page.cursor;
  } while (cursor);
  return pathnames;
}

async function main() {
  const pathnames = await listPathnames();
  const pending = [...pathnames].filter(
    (p) =>
      p.endsWith(".webp") &&
      !p.startsWith(`${INCOMING_FOLDER}/`) &&
      !isVariantPath(p) &&
      VARIANT_WIDTHS.some((w) => !pathnames.has(variantPath(p, w))),
  );
  console.log(`${pending.length} of ${pathnames.size} files need variants`);
  if (dryRun) {
    for (const pathname of pending) console.log(`  ${pathname}`);
    return;
  }

  let failed = 0;
  for (const pathname of pending) {
    try {
      const original = await get(pathname, { access: BLOB_ACCESS, useCache: false });
      if (!original || original.statusCode !== 200) throw new Error("not found");
      const webp = Buffer.from(await new Response(original.stream).arrayBuffer());
      await storeImageVariants(pathname, webp);
      console.log(`  ok  ${pathname}`);
    } catch (error) {
      failed++;
      console.error(`  ERR ${pathname}: ${error}`);
    }
  }
  console.log(`Done: ${pending.length - failed} ok, ${failed} failed.`);
  if (failed) process.exitCode = 1;
}

main();
