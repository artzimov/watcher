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
  title: string;
  artists: DiscogsArtist[];
  artists_sort: string;
  year: number;
  released: string;
  genres: string[];
  styles: string[];
  tracklist: { position: string, type_: string, title: string, duration?: string }[]
  resource_url: string;
  uri: string;
  labels: DiscogsLabel[];
  formats: DiscogsFormat[];
  community: { have: number, want: number, rating: { count: number, average: number } };
  country: string;
  notes: string;
  identifiers: { type: string; value: string; description?: string }[];
  images: { type: "primary" | "secondary", uri: string, uri150: string, width: number, height: number }[];
  num_for_sale: number;
  thumb: string;
  blocked_from_sale: boolean;
  is_offensive: boolean
}


// MARKETPLACE

export interface DiscogsSeller {
  id: number;
  username: string;
  avatar_url: string;
  stats: { rating: string, stars: number, total: number };
  min_order_total: number;
  html_url: string;
  uid: number;
  url: string;
  payment: string;
  shipping: string;
  resource_url: string;
}

export interface DiscogsListingResponse {
  id: number;
  resource_url: string;
  uri: string;
  status: string;
  condition: string;
  sleeve_condition: string;
  comments: string;
  ships_from: string;
  price: { value: number, currency: string };
  original_price: { curr_abbr: string, curr_id: number, formatted: string, value: number };
  shipping_price: object;
  original_shipping_price: object;
  seller_id: DiscogsSeller;
  release: { id: number };
  posted: Date;
  allow_offers: boolean;
  shipping_is_blocked: boolean
}