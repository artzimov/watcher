// HTTP client wrapping the backend REST API.
// VITE_API_URL overrides the localhost:8787 default for staging/production builds.
import type { CollectionItem, WantlistItem } from "../types"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787/api"

export async function fetchWantlist(): Promise<WantlistItem[]> {
  const response = await fetch(`${API_URL}/wantlist`)
  return response.json()
}

export async function fetchCollection(): Promise<CollectionItem[]> {
  const response = await fetch(`${API_URL}/collection`)
  return response.json()
}

export async function toggleSubscribe(id: number, subscribed: boolean): Promise<void> {
  await fetch(`${API_URL}/wantlist/${id}/subscribe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscribed }),
  })
}
