// Thin authenticated fetch wrapper around the official Discogs REST API.
// Requires DISCOGS_TOKEN and DISCOGS_USERNAME in the environment.
import "dotenv/config"

const BASE_URL = "https://api.discogs.com"
const USER_AGENT = "watcher/0.0.1 +https://github.com/sozhran/watcher"

const token = process.env.DISCOGS_TOKEN
const username = process.env.DISCOGS_USERNAME

if (!token || !username) {
  throw new Error("DISCOGS_TOKEN and DISCOGS_USERNAME must be set")
}

export const discogsUsername = username

export async function discogsGet<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Authorization": `Discogs token=${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Discogs API error ${response.status} for ${url.pathname}`)
  }

  return response.json() as Promise<T>
}
