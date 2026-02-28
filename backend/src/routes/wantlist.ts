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

wantlistRoutes.patch("/:id/subscribe", async (c) => {
  const id = Number(c.req.param("id"))
  const { subscribed } = await c.req.json<{ subscribed: boolean }>()

  const [row] = await db
    .update(wantlistItems)
    .set({ subscribed })
    .where(eq(wantlistItems.id, id))
    .returning()

  if (!row) {
    return c.json({ error: "not found" }, 404)
  }

  return c.json(row)
})
