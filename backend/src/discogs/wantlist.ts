import { BASE_URL, USER_AGENT, discogsParams, getCredentials } from "./config";
import { DiscogsWantlistResponse, DiscogsWantlistItem } from "./types";

export async function getDiscogsWantlist() {
    const [username, token] = getCredentials()
    const url = `${BASE_URL}/users/${username}/wants`
    const result: DiscogsWantlistItem[] = [];

    let i = 1

    while (true) {
        const response: Response = await fetch(`${url}?page=${i.toString()}&${discogsParams}&token=${token}`, {
            method: "GET",
            headers: {
                "User-Agent": USER_AGENT,
            },
        })

        if (!response.ok) { throw new Error(`Received error when trying to access Discogs: ${response.status}`) }

        const data = await response.json() as DiscogsWantlistResponse;

        if (!data.wants) {
            break
        }

        result.push(...data.wants)

        i++

        if (!data.pagination?.pages || i > data.pagination.pages) { break }
    }

    return result;
}
