import { and, eq, notInArray } from "drizzle-orm"
import { db } from "./index"
import { listings, sellers } from "./schema"
import type { ParsedListing } from "../marketplace/parse-listings"

async function upsertSeller(listing: ParsedListing): Promise<number> {
  const [row] = await db
    .insert(sellers)
    .values({
      discogs_id: listing.sellerDiscogsId,
      name: listing.sellerName,
      rating: listing.sellerRating,
    })
    .onConflictDoUpdate({
      target: sellers.discogs_id,
      set: { name: listing.sellerName, rating: listing.sellerRating },
    })
    .returning({ id: sellers.id })

  return row.id
}

export async function upsertListing(releaseId: number, listing: ParsedListing) {
  const sellerId = await upsertSeller(listing)

  await db
    .insert(listings)
    .values({
      listing_id: listing.listingId,
      release_id: releaseId,
      seller_id: sellerId,
      condition: listing.condition,
      sleeve_condition: listing.sleeveCondition,
      price: listing.price,
      currency: listing.currency,
      shipping_price: listing.shippingPrice,
      location: listing.location,
      comments: listing.comments,
    })
    .onConflictDoUpdate({
      target: listings.listing_id,
      set: {
        seller_id: sellerId,
        condition: listing.condition,
        sleeve_condition: listing.sleeveCondition,
        price: listing.price,
        currency: listing.currency,
        shipping_price: listing.shippingPrice,
        location: listing.location,
        comments: listing.comments,
      },
    })
}

export async function saveListingsForRelease(releaseId: number, parsed: ParsedListing[]) {
  const seenListingIds: string[] = []

  for (const listing of parsed) {
    await upsertListing(releaseId, listing)
    seenListingIds.push(listing.listingId)
  }

  if (seenListingIds.length > 0) {
    await db
      .delete(listings)
      .where(and(eq(listings.release_id, releaseId), notInArray(listings.listing_id, seenListingIds)))
  } else {
    await db.delete(listings).where(eq(listings.release_id, releaseId))
  }
}
