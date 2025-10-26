export interface ProductType {
  id: number;
  brand: string;
  name: string;
  image: string;
  originalPrice?: string;
  currentPrice: string;
  newBestSeller?: boolean;
  newSeller?: boolean;
  inStock?: boolean;
  feature?: string[]; // ["Best Seller", "New Arrival"]
  category?: string;
  subcategory?: string;
}