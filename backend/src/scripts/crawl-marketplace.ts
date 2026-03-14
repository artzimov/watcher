import { eq } from "drizzle-orm"
import { db } from "../db"
import { releases, wantlistItems } from "../db/schema"
import { withAuthedPage } from "../marketplace/browser"
import { parseListings } from "../marketplace/parse-listings"

async function fetchListingsForRelease(discogsId: number) {
  return withAuthedPage(async (page) => {
    await page.goto(`https://www.discogs.com/sell/list?release_id=${discogsId}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })
    await page.waitForTimeout(3000)
    const html = await page.content()
    return parseListings(html)
  })
}

async function crawlMarketplace() {
  const subscribed = await db
    .select({ discogsId: releases.discogs_id, title: releases.title })
    .from(wantlistItems)
    .innerJoin(releases, eq(wantlistItems.release_id, releases.id))
    .where(eq(wantlistItems.subscribed, true))

  console.log(`crawling marketplace for ${subscribed.length} subscribed releases`)

  for (const release of subscribed) {
    const listings = await fetchListingsForRelease(release.discogsId)
    console.log(`${release.title}: ${listings.length} listings`)
  }
}

crawlMarketplace().catch((error) => {
  console.error(error)
  process.exit(1)
})
