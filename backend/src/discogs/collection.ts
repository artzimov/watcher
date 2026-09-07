import { BASE_URL, USER_AGENT, discogsParams, getCredentials } from "./config";
import { DiscogsCollectionResponse, DiscogsCollectionItem } from "./types";

export async function getDiscogsCollection() {
    const [username, token] = getCredentials()
    const url = `${BASE_URL}/users/${username}/collection/folders/0/releases`
    const result: DiscogsCollectionItem[] = [];

    let i = 1

    while (true) {
        const response: Response = await fetch(`${url}?page=${i.toString()}&${discogsParams}&token=${token}`, {
            method: "GET",
            headers: {
                "User-Agent": USER_AGENT,
            },
        })

        if (!response.ok) { throw new Error(`Received error when trying to access Discogs: ${response.status}`) }

        const data = await response.json() as DiscogsCollectionResponse;

        if (!data.releases) {
            break
        }

        result.push(...data.releases)

        i++

        if (!data.pagination?.pages || i > data.pagination.pages) { break }
    }

    return result;
}
