import { BASE_URL, USER_AGENT, getCredentials } from "./config";
import { DiscogsReleaseResponse } from "./types";

export async function getDiscogsRelease(id: number) {
    const [_, token] = getCredentials()
    const url = `${BASE_URL}/releases/${id.toString()}`

    const response: Response = await fetch(`${url}?token=${token}`, {
        method: "GET",
        headers: {
            "User-Agent": USER_AGENT,
        },
    })

    if (!response.ok) { throw new Error(`Discogs API error: status ${response.status} (getDiscogsRelease)`) }

    const result = await response.json() as DiscogsReleaseResponse;

    if (!result) { throw new Error("Discogs API error: Received incorrect release") }

    return result;
}
