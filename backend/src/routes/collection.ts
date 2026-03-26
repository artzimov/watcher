// GET /api/collection — lists owned records joined with their release info, newest first.
import { Hono } from "hono"
import { desc, eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { collectionItems, releases } from "../db/schema.js"

export const collectionRoutes = new Hono()

collectionRoutes.get("/", async (c) => {
  const rows = await db
    .select({
      id: collectionItems.id,
      rating: collectionItems.rating,
      notes: collectionItems.notes,
      date_added: collectionItems.date_added,
      release: releases,
    })
    .from(collectionItems)
    .innerJoin(releases, eq(collectionItems.release_id, releases.id))
    .orderBy(desc(collectionItems.date_added))

  return c.json(rows)
})
