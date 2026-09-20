import { pgTable, integer, smallint, serial, text, boolean, timestamp, json, unique, bigint } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  discogs_id: integer().notNull().unique(),
  master_id: integer(),
  title: text(),
  artist: text(),
  artist_id: text(),
  year: integer(),
  country: text(),
  genres: text(),
  styles: text(),
  formats: text(),
  label: text(),
  catalog_number: text(),
  tracklist: json(),
  identifiers: json(),
  thumb: text(),
  cover_image: text(),
  images: json(),
  have: integer(),
  want: integer(),
  notes: text(),
  date_added: timestamp(),
  subscribed: boolean().notNull().default(false),
  rating: smallint().notNull()
})

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  discogs_id: text().notNull(),
  name: text().notNull(),
  rating: text(),
  stars: integer(),
  total_ratings: integer(),
  wanted_items: integer(), // number of my wantlist items he's got; see if I can/need to get it
  shipping_info: text(),
  banned: boolean()
})

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  listing_id: text().notNull(),
  release_id: integer().notNull().references(() => releases.id),
  seller_id: integer().notNull().references(() => sellers.id),
  status: text(),
  condition: text(),
  sleeve_condition: text(),
  location: text(),
  price: integer(),
  shipping_price: integer(),
  currency: text(),
  posted: timestamp(),
  allow_offers: boolean(),
  comments: text()
})

export const releasesRelations = relations(releases, ({ many }) => ({
  listings: many(listings),
}))

export const sellersRelations = relations(sellers, ({ many }) => ({
  listings: many(listings),
}))

export const listingsRelations = relations(listings, ({ one }) => ({
  release: one(releases, { fields: [listings.release_id], references: [releases.id] }),
  seller: one(sellers, { fields: [listings.seller_id], references: [sellers.id] }),
}))

export type NewRelease = typeof releases.$inferInsert
export type NewSeller = typeof sellers.$inferInsert
export type NewListing = typeof listings.$inferInsert
