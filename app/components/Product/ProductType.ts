export interface ProductType {
  id: string|number;
  brand: string;
  name: string;
  image: string;
  originalPrice?: number; // Add ? to make it optional
  currentPrice: number;
  newBestSeller: boolean;
  newSeller: boolean;
  inStock?: boolean;
  feature?: string[];
  category?: string;
  subcategory?: string;
  available?:number;
  price?:number;
}