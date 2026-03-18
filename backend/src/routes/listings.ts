import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { db } from "../db"
import { releases } from "../db/schema"
import { upsertListing } from "../db/upsert-listing"
import type { ParsedListing } from "../marketplace/parse-listings"

export const listingsRoutes = new Hono()

interface IngestPayload extends ParsedListing {
  releaseDiscogsId: number
}

listingsRoutes.post("/ingest", async (c) => {
  const secret = process.env.INGEST_SECRET
  const auth = c.req.header("Authorization")

  if (!secret || auth !== `Bearer ${secret}`) {
    return c.json({ error: "unauthorized" }, 401)
  }

  const payload = await c.req.json<IngestPayload>()

  const [release] = await db
    .select({ id: releases.id })
    .from(releases)
    .where(eq(releases.discogs_id, payload.releaseDiscogsId))

  if (!release) {
    return c.json({ error: "unknown release" }, 404)
  }

  await upsertListing(release.id, payload)

  return c.json({ ok: true })
})
