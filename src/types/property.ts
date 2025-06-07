export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  verified: boolean;
  landlord: {
    name: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  petsAllowed?: boolean;
  city?: string;
  state?: string;
} 