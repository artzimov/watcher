// CLI script — paginates through the Discogs wantlist (sorted by rating desc) and imports only
// 5-star items, stopping as soon as a lower rating is hit. Run manually to refresh the wantlist.
import { db } from "../db"
import { wantlistItems } from "../db/schema"
import { upsertRelease } from "../db/upsert-release"
import { discogsGet, discogsUsername } from "../discogs/client"
import type { DiscogsWantlistResponse } from "../discogs/types"

async function syncWantlist() {
  let page = 1
  let imported = 0
  let done = false

  while (!done) {
    const data = await discogsGet<DiscogsWantlistResponse>(`/users/${discogsUsername}/wants`, {
      page,
      per_page: 100,
      sort: "rating",
      sort_order: "desc",
    })

    if (data.wants.length === 0) {
      break
    }

    for (const item of data.wants) {
      if (item.rating !== 5) {
        done = true
        break
      }

      const releaseId = await upsertRelease(item.basic_information)

      await db
        .insert(wantlistItems)
        .values({
          release_id: releaseId,
          rating: item.rating,
          notes: item.notes,
          date_added: new Date(item.date_added),
        })
        .onConflictDoUpdate({
          target: wantlistItems.release_id,
          set: { rating: item.rating, notes: item.notes, date_added: new Date(item.date_added) },
        })

      imported++
    }

    if (page >= data.pagination.pages) {
      break
    }

    page++
  }

  console.log(`synced ${imported} wantlist items with rating 5`)
}

syncWantlist().catch((error) => {
  console.error(error)
  process.exit(1)
})
