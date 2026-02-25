export interface DiscogsArtist {
  id: number
  name: string
  anv?: string
}

export interface DiscogsFormat {
  name: string
  qty: string
  descriptions?: string[]
}

export interface DiscogsLabel {
  id: number
  name: string
  catno?: string
}

export interface DiscogsBasicInformation {
  id: number
  title: string
  year: number
  thumb: string
  cover_image: string
  genres?: string[]
  styles?: string[]
  artists?: DiscogsArtist[]
  formats?: DiscogsFormat[]
  labels?: DiscogsLabel[]
}

export interface DiscogsPagination {
  page: number
  pages: number
  per_page: number
  items: number
}

export interface DiscogsWantlistItem {
  id: number
  rating: number
  notes?: string
  date_added: string
  basic_information: DiscogsBasicInformation
}

export interface DiscogsWantlistResponse {
  pagination: DiscogsPagination
  wants: DiscogsWantlistItem[]
}

export interface DiscogsCollectionItem {
  id: number
  instance_id: number
  folder_id: number
  rating: number
  notes?: string
  date_added: string
  basic_information: DiscogsBasicInformation
}

export interface DiscogsCollectionResponse {
  pagination: DiscogsPagination
  releases: DiscogsCollectionItem[]
}
