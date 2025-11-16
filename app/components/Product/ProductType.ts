export interface ProductType {
  id: string;
  brand: string;
  name: string;
  image: string;
  originalPrice?: string; // Add ? to make it optional
  currentPrice: string;
  newBestSeller: boolean;
  newSeller: boolean;
  inStock?: boolean;
  feature?: string[];
  category?: string;
  subcategory?: string;
}