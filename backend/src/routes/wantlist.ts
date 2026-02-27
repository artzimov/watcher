import { Hono } from "hono"
import { desc, eq } from "drizzle-orm"
import { db } from "../db"
import { releases, wantlistItems } from "../db/schema"

export const wantlistRoutes = new Hono()

wantlistRoutes.get("/", async (c) => {
  const rows = await db
    .select({
      id: wantlistItems.id,
      rating: wantlistItems.rating,
      notes: wantlistItems.notes,
      date_added: wantlistItems.date_added,
      subscribed: wantlistItems.subscribed,
      release: releases,
    })
    .from(wantlistItems)
    .innerJoin(releases, eq(wantlistItems.release_id, releases.id))
    .orderBy(desc(wantlistItems.date_added))

  return c.json(rows)
})
