import { BASE_URL, USER_AGENT, getCredentials } from "./config";
import { DiscogsListingResponse } from "./types";

export async function getDiscogsListing(id: number) {
    const [_, token] = getCredentials()
    const url = `${BASE_URL}/marketplace/listings/${id.toString()}`

    const response: Response = await fetch(`${url}?token=${token}`, {
        method: "GET",
        headers: {
            "User-Agent": USER_AGENT,
        },
    })

    if (!response.ok) { throw new Error(`Discogs API error: status ${response.status} (getDiscogsListing)`) }

    const result = await response.json() as DiscogsListingResponse;

    if (!result) { throw new Error("Discogs API error: Received incorrect listing") }

    return result;
}
