export type AccessType = "subscription" | "free" | "rent" | "buy";
export type ContentType = "movie" | "tv";

export interface ContentResult {
  tmdb_id: number;
  content_type: ContentType;
  title: string;
  original_title: string;
  year: number | null;
  synopsis: string | null;
  poster_url: string | null;
  // Film
  duration_min: number | null;
  // Série
  number_of_seasons: number | null;
  number_of_episodes: number | null;
}

// Alias
export type FilmResult = ContentResult;

export type PhysicalFormat = "DVD" | "Blu-ray" | "4K UHD";

export interface PhysicalOffer {
  title: string;
  retailer: string;
  format: PhysicalFormat;
  edition: string | null;
  price_eur: number | null;
  url: string | null;
  image_url: string | null;
  in_stock: boolean;
}

export interface PhysicalData {
  has_physical: boolean;
  title: string;
  original_title: string;
  year: number | null;
  offers: PhysicalOffer[];
}

export interface StreamingOffer {
  platform: string;
  platform_logo: string | null;
  access_type: AccessType;
  price_eur: number | null;
  currency: string | null;
  qualities: string[];
  french_audio: boolean | null;
  french_subtitles: boolean | null;
  access_label: string;
}
