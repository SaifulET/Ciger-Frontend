export interface Review {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  text: string;
  userId?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  _id?: string;
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
  category?: string;
  subCategory?: string;
  discount?: number;
  currentPrice?: string;
  available?: number;
}

export interface RelatedProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  currentPrice: string;
  originalPrice?: string;
  newBestSeller?: boolean;
  newSeller?: boolean;
}

export interface ApiProduct {
  _id: string;
  name: string;
  images: string[];
  title: string;
  price: number;
  discount: number;
  currentPrice: string;
  averageRating: number;
  available: number;
  isBest: boolean;
  isNew: boolean;
  isInStock: boolean;
  newBestSeller: boolean;
  newSeller: boolean;
  inStock: boolean;
  brand: string;
  category: string;
  subCategory: string;
  subcategory: string;
  feature: boolean;
  colors: string[];
  description: string;
}

export interface ApiReview {
  _id: string;
  userId: string;
  productId: string;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}