import { DiscogsListingResponse } from "../discogs/types";

export async function processListing(data: DiscogsListingResponse) {
    const listing = {
        listing_id: data.listing_id,
        release_id: data.release.id,
        seller_id: data.seller.id,
        status: data.status,
        media_condition: data.condition,
        sleeve_condition: data.sleeve_condition,
        location: data.ships_from,
        price: data.original_price.value,
        price_currency: data.original_price.curr_abbr,
        shipping_price: data.original_shipping_price.value,
        shipping_price_currency: data.original_shipping_price.curr_abbr,
        time_posted: data.posted,
        allow_offers: data.allow_offers,
        comments: data.comments,
    }

    return listing;
}
