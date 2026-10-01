import { z } from "zod";

// Accepts the URL variants Instagram's share button produces
// (/reel/, /reels/, /p/, optional username segment, ?igsh=... tracking)
// and normalizes them to https://www.instagram.com/reel/<code>/ so the same
// reel can't be added twice under different spellings.
const REEL_URL = /^https?:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(?:reels?|p)\/([\w-]+)\/?(?:[?#].*)?$/i;

export const reelUrlSchema = z
  .string()
  .trim()
  .regex(REEL_URL, "Pegá el link de un reel de Instagram (instagram.com/reel/...)")
  .transform((url) => `https://www.instagram.com/reel/${url.match(REEL_URL)![1]}/`);
