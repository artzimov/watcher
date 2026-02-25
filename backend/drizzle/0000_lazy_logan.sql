CREATE TABLE "collection_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_id" integer NOT NULL,
	"instance_id" integer NOT NULL,
	"folder_id" integer,
	"rating" smallint,
	"notes" text,
	"date_added" timestamp,
	CONSTRAINT "collection_items_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"release_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"condition" text,
	"sleeve_condition" text,
	"price" integer,
	"currency" text,
	"shipping_price" integer,
	"location" text,
	"posted" timestamp,
	"allow_offers" boolean,
	"comments" text,
	CONSTRAINT "listings_listing_id_unique" UNIQUE("listing_id")
);
--> statement-breakpoint
CREATE TABLE "releases" (
	"id" serial PRIMARY KEY NOT NULL,
	"discogs_id" integer NOT NULL,
	"title" text NOT NULL,
	"year" integer,
	"thumb" text,
	"cover_image" text,
	"genres" json,
	"styles" json,
	"artists" json,
	"formats" json,
	"labels" json,
	CONSTRAINT "releases_discogs_id_unique" UNIQUE("discogs_id")
);
--> statement-breakpoint
CREATE TABLE "sellers" (
	"id" serial PRIMARY KEY NOT NULL,
	"discogs_id" text NOT NULL,
	"name" text NOT NULL,
	"rating" text,
	"stars" integer,
	"total_ratings" integer,
	"shipping_info" text,
	CONSTRAINT "sellers_discogs_id_unique" UNIQUE("discogs_id")
);
--> statement-breakpoint
CREATE TABLE "wantlist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_id" integer NOT NULL,
	"rating" smallint NOT NULL,
	"notes" text,
	"date_added" timestamp,
	"subscribed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "wantlist_items_release_id_unique" UNIQUE("release_id")
);
--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."releases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."releases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_id_sellers_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."sellers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wantlist_items" ADD CONSTRAINT "wantlist_items_release_id_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."releases"("id") ON DELETE no action ON UPDATE no action;