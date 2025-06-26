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
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    parking?: boolean;
    petsAllowed?: boolean;
  };
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