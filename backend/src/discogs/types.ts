// BASIC INTERFACES

export interface DiscogsPagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: { last: string; next: string };
}

export interface DiscogsArtist {
  anv: string;
  id: number;
  name: string;
  resource_url: string;
  role: string;
  tracks: string;
  join?: string;
}

export interface DiscogsFormat {
  name: string;
  qty: string;
  descriptions: string[];
  text?: string;
}

export interface DiscogsLabel {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
}

export interface DiscogsBasicInformation {
  id: number;
  master_id?: number;
  master_url: string | null;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  genres: string[];
  styles: string[];
  artists: DiscogsArtist[];
  formats: DiscogsFormat[];
  labels: DiscogsLabel[];
}


// USER WANTLIST

export interface DiscogsWantlistResponse {
  pagination: DiscogsPagination;
  wants: DiscogsWantlistItem[];
}

export interface DiscogsWantlistItem {
  id: number;
  resource_url: string;
  date_added: string;
  rating: number;
  basic_information: DiscogsBasicInformation;
}


// USER COLLECTION

export interface DiscogsCollectionResponse {
  pagination: DiscogsPagination;
  releases: DiscogsCollectionItem[];
}

export interface DiscogsCollectionItem {
  id: number;
  instance_id: number;
  date_added: string;
  rating: number;
  basic_information: DiscogsBasicInformation;
}


// SINGLE RELEASE

export interface DiscogsReleaseResponse {
  id: number;
  master_id: number;
  uri: string;
  title: string;
  artists: DiscogsArtist[];
  year: number;
  released: string;
  country: string;
  genres: string[];
  styles: string[];
  formats: DiscogsFormat[];
  labels: DiscogsLabel[];
  tracklist: { position: string, type_: string, title: string, duration?: string }[]
  identifiers: { type: string; value: string; description?: string }[];
  thumb: string;
  images: { type: "primary" | "secondary", uri: string, uri150: string, width: number, height: number }[];
  community: { have: number, want: number, rating: { count: number, average: number } };
  notes: string;
  date_added: Date;
  blocked_from_sale: boolean;
  is_offensive: boolean
}


// MARKETPLACE

export interface DiscogsSeller {
  id: number;
  username: string;
  avatar_url: string;
  stats: { rating: string, stars: number, total: number };
  payment: string;
  shipping: string;
}

export interface DiscogsListingResponse {
  listing_id: number;
  release: { id: number };
  seller: DiscogsSeller;
  status: string;
  condition: string;
  sleeve_condition: string;
  ships_from: string;
  original_price: { curr_abbr: string, value: number };
  original_shipping_price: { curr_abbr: string, value: number };
  posted: Date;
  allow_offers: boolean;
  comments: string;
}