import { DiscogsSeller } from "../discogs/types";

export async function processSeller(data: DiscogsSeller) {
    const seller = {
        discogs_id: data.id,
        username: data.username,
        avatar_url: data.avatar_url,
        rating_value: data.stats.rating,
        rating_stars: data.stats.stars,
        total_ratings: data.stats.total,
        payment_info: data.payment,
        shipping_info: data.shipping
    }

    return seller;
}
