// CLI script — paginates through the user's full Discogs collection (folder 0 = "All") and
// upserts each release plus its collection_items row (instance_id is the dedup key). Run manually.
import { db } from "../db"
import { collectionItems } from "../db/schema"
import { upsertRelease } from "../db/upsert-release"
import { discogsGet, discogsUsername } from "../discogs/client"
import type { DiscogsCollectionResponse } from "../discogs/types"

async function syncCollection() {
  let page = 1
  let imported = 0

  while (true) {
    const data = await discogsGet<DiscogsCollectionResponse>(
      `/users/${discogsUsername}/collection/folders/0/releases`,
      { page, per_page: 100 },
    )

    if (data.releases.length === 0) {
      break
    }

    for (const item of data.releases) {
      const releaseId = await upsertRelease(item.basic_information)

      await db
        .insert(collectionItems)
        .values({
          release_id: releaseId,
          instance_id: item.instance_id,
          folder_id: item.folder_id,
          rating: item.rating,
          notes: item.notes,
          date_added: new Date(item.date_added),
        })
        .onConflictDoUpdate({
          target: collectionItems.instance_id,
          set: { rating: item.rating, notes: item.notes, date_added: new Date(item.date_added) },
        })

      imported++
    }

    if (page >= data.pagination.pages) {
      break
    }

    page++
  }

  console.log(`synced ${imported} collection items`)
}

syncCollection().catch((error) => {
  console.error(error)
  process.exit(1)
})
