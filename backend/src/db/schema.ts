import { pgTable, integer, smallint, serial, text, boolean, timestamp, json, unique, bigint } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  discogs_id: integer().notNull().unique(),
  title: text().notNull(),
  year: integer(),
  thumb: text(),
  cover_image: text(),
  genres: json(),
  styles: json(),
  artists: json(),
  formats: json(),
  labels: json(),
})

export const wantlistItems = pgTable("wantlist_items", {
  id: serial("id").primaryKey(),
  release_id: integer().notNull().references(() => releases.id),
  rating: smallint().notNull(),
  notes: text(),
  date_added: timestamp(),
  subscribed: boolean().notNull().default(false),
}, (table) => [unique().on(table.release_id)])

export const collectionItems = pgTable("collection_items", {
  id: serial("id").primaryKey(),
  release_id: integer().notNull().references(() => releases.id),
  instance_id: bigint({ mode: "number" }).notNull().unique(),
  folder_id: integer(),
  rating: smallint(),
  notes: text(),
  date_added: timestamp(),
})

export const sellers = pgTable("sellers", {
  id: serial("id").primaryKey(),
  discogs_id: text().notNull().unique(),
  name: text().notNull(),
  rating: text(),
  stars: integer(),
  total_ratings: integer(),
  shipping_info: text(),
})

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  listing_id: text().notNull().unique(),
  release_id: integer().notNull().references(() => releases.id),
  seller_id: integer().notNull().references(() => sellers.id),
  condition: text(),
  sleeve_condition: text(),
  price: integer(),
  currency: text(),
  shipping_price: integer(),
  location: text(),
  posted: timestamp(),
  allow_offers: boolean(),
  comments: text(),
})

export const releasesRelations = relations(releases, ({ many }) => ({
  wantlistItems: many(wantlistItems),
  collectionItems: many(collectionItems),
  listings: many(listings),
}))

export const wantlistItemsRelations = relations(wantlistItems, ({ one }) => ({
  release: one(releases, { fields: [wantlistItems.release_id], references: [releases.id] }),
}))

export const collectionItemsRelations = relations(collectionItems, ({ one }) => ({
  release: one(releases, { fields: [collectionItems.release_id], references: [releases.id] }),
}))

export const sellersRelations = relations(sellers, ({ many }) => ({
  listings: many(listings),
}))

export const listingsRelations = relations(listings, ({ one }) => ({
  release: one(releases, { fields: [listings.release_id], references: [releases.id] }),
  seller: one(sellers, { fields: [listings.seller_id], references: [sellers.id] }),
}))

export type NewRelease = typeof releases.$inferInsert
export type NewWantlistItem = typeof wantlistItems.$inferInsert
export type NewCollectionItem = typeof collectionItems.$inferInsert
export type NewSeller = typeof sellers.$inferInsert
export type NewListing = typeof listings.$inferInsert
