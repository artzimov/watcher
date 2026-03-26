// CLI script — for every subscribed wantlist release, scrapes its Discogs marketplace listing
// page via an authenticated headless browser and syncs the parsed listings to the database.
// Run manually or on a schedule; intended as the polling alternative to the email-ingest Apps Script.
import { eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { releases, wantlistItems } from "../db/schema.js"
import { saveListingsForRelease } from "../db/upsert-listing.js"
import { withAuthedPage } from "../marketplace/browser.js"
import { parseListings } from "../marketplace/parse-listings.js"

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
    .select({ id: releases.id, discogsId: releases.discogs_id, title: releases.title })
    .from(wantlistItems)
    .innerJoin(releases, eq(wantlistItems.release_id, releases.id))
    .where(eq(wantlistItems.subscribed, true))

  console.log(`crawling marketplace for ${subscribed.length} subscribed releases`)

  for (const release of subscribed) {
    const listings = await fetchListingsForRelease(release.discogsId)
    await saveListingsForRelease(release.id, listings)
    console.log(`${release.title}: ${listings.length} listings saved`)
  }
}

crawlMarketplace().catch((error) => {
  console.error(error)
  process.exit(1)
})
