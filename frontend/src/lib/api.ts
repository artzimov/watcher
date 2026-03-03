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
