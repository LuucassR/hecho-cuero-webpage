import { asc } from "drizzle-orm";
import { db } from "@/db";
import { instagramReels } from "@/db/schema";

export async function getInstagramReels() {
  return db.query.instagramReels.findMany({
    orderBy: [asc(instagramReels.position), asc(instagramReels.id)],
  });
}
