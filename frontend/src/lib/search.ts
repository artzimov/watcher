// Shared filter/format utilities for the Wantlist and Collection table pages.
// filterWantlist/filterCollection do word-aware case-insensitive matching against title + artist:
// every space-separated word in the query must appear somewhere in the combined text.
// timeAgo is here to avoid duplicating it across both pages.

import type { WantlistItem, CollectionItem } from "../types"

export function timeAgo(s: string | null): string {
  if (!s) return "—"
  const ms = Date.now() - new Date(s).getTime()
  const days = Math.floor(ms / 86400000)
  if (days < 1) return "today"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function artistText(item: WantlistItem | CollectionItem): string {
  return item.release.artists?.map((a) => a.name).join(" ") ?? ""
}

function anyMatch(item: WantlistItem | CollectionItem, query: string): boolean {
  if (!query.trim()) return true
  const haystack = `${item.release.title} ${artistText(item)}`.toLowerCase()
  return query.trim().toLowerCase().split(/\s+/).every((word) => haystack.includes(word))
}

export function filterWantlist(items: WantlistItem[], query: string): WantlistItem[] {
  return items.filter((item) => anyMatch(item, query))
}

export function filterCollection(items: CollectionItem[], query: string): CollectionItem[] {
  return items.filter((item) => anyMatch(item, query))
}
