export interface Review {
  id: number;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
}

export interface Product {
  id: number;
  brand: string;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  images: string[];
  colors: string[];
  description: string;
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<number, number>;
}

export interface RelatedProduct {
  id: number;
  brand: string;
  name: string;
  image: string;
  currentPrice: string;
  originalPrice?: string;
  newBestSeller?: boolean;
  newSeller?: boolean;
}
