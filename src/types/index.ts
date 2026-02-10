export type Locale = 'th' | 'en' | 'ko';

export interface LocalizedText {
  th: string;
  en: string;
  ko: string;
}

export type ServiceCategory = 'CUT' | 'COLOR' | 'PERM' | 'TREATMENT' | 'SPECIAL';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: LocalizedText;
  description: LocalizedText;
  prices: {
    junior?: number;
    stylist1?: number;
    stylist2?: number;
    stylist3?: number;
  };
  priceRange?: { s: number; m: number; l: number };
  duration: string;
  image?: string;
  popular?: boolean;
}


export interface GalleryItem {
  id: string;
  category: ServiceCategory;
  beforeImage?: string;
  afterImage: string;
  description?: LocalizedText;
  stylistId?: string;
}

export interface Review {
  id: string;
  name: LocalizedText;
  rating: number;
  text: LocalizedText;
  service?: string;
  date: string;
}

export interface Branch {
  id: 'asoke' | 'saimai';
  name: LocalizedText;
  address: LocalizedText;
  phone: string;
  lineId: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  nearestTransport: LocalizedText;
  hours: string;
  images: string[];
}

export interface Promotion {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  validUntil?: string;
  badge?: 'HOT' | 'NEW' | 'LIMITED';
}
