export const BASE_URL = "https://api.discogs.com"
export const USER_AGENT = "watcher/0.0.1 +https://github.com/sozhran/watcher"

export function getCredentials() {
    const discogsUsername = process.env.DISCOGS_USERNAME
    const discogsToken = process.env.DISCOGS_TOKEN


    if (!discogsUsername || !discogsToken) {
        throw new Error("DISCOGS_USERNAME and DISCOGS_TOKEN must be set")
    }

    return [discogsUsername, discogsToken]
}

export const discogsParams = `per_page=100&sort=artist&sort_order=asc`

// URLS

// https://api.discogs.com/releases/381946
// https://api.discogs.com/marketplace/listings/3162132928
// https://api.discogs.com/users/sozhran/wants?page=1&per_page=5&sort=artist&sort_order=asc
// https://api.discogs.com/users/sozhran/collection/folders/0/releases?page=1&per_page=3&sort=artist&sort_order=asc