import { db } from "./index"
import { releases } from "./schema"
import type { DiscogsBasicInformation } from "../discogs/types"

export async function upsertRelease(info: DiscogsBasicInformation): Promise<number> {
  const values = {
    discogs_id: info.id,
    title: info.title,
    year: info.year,
    thumb: info.thumb,
    cover_image: info.cover_image,
    genres: info.genres ?? [],
    styles: info.styles ?? [],
    artists: info.artists ?? [],
    formats: info.formats ?? [],
    labels: info.labels ?? [],
  }

  const [row] = await db
    .insert(releases)
    .values(values)
    .onConflictDoUpdate({ target: releases.discogs_id, set: values })
    .returning({ id: releases.id })

  return row.id
}
