export interface Release {
  id: number
  discogs_id: number
  title: string
  year: number | null
  thumb: string | null
  cover_image: string | null
  genres: string[] | null
  styles: string[] | null
  artists: { id: number; name: string }[] | null
  formats: { name: string; qty: string }[] | null
  labels: { id: number; name: string }[] | null
}

export interface WantlistItem {
  id: number
  rating: number
  notes: string | null
  date_added: string | null
  subscribed: boolean
  release: Release
}

export interface CollectionItem {
  id: number
  rating: number | null
  notes: string | null
  date_added: string | null
  release: Release
}
