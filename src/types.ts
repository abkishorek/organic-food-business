export type CategoryId = 'spices' | 'oils' | 'beverages' | 'honey-nuts';

/** 'available' = can be ordered (if a price is also set). */
export type Availability = 'available' | 'out-of-stock' | 'to-be-confirmed';

export interface PackSize {
  /** Short unique id within the product, e.g. '250g' */
  id: string;
  /** What the customer sees, e.g. '250 g' */
  label: string;
  /** Price in rupees. Leave null until the owner confirms it. */
  price: number | null;
  /** Set false to hide one pack size without deleting it. */
  available?: boolean;
}

export interface ProductDetails {
  ingredients?: string;
  shelfLife?: string;
  storage?: string;
  allergens?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  /** Optional Kannada name. Have a Kannada speaker proofread it. */
  kannadaName?: string;
  category: CategoryId;
  description: string;
  /** Path to the real photograph, e.g. '/images/products/cashew.jpg'. null = placeholder. */
  image: string | null;
  imageAlt?: string;
  /** 'cover' fills the frame (may crop edges). 'contain' shows the whole photo. */
  imageFit?: 'cover' | 'contain';
  /** Focal point when cropping, e.g. 'center', 'top', '50% 30%' */
  imagePosition?: string;
  /** Use this for a product sold in one size only. null until confirmed. */
  price: number | null;
  /** Use this when a product comes in several sizes. Each pack has its own price. */
  packSizes: PackSize[];
  availability: Availability;
  /** Shows on the home page "From the range" section. */
  featured?: boolean;
  /** Optional extras. Only fill in what is true and confirmed. */
  details?: ProductDetails;
}

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export interface OrderOption {
  packId: string;
  /** '' for single-size products */
  label: string;
  price: number;
}
