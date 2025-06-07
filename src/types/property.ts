export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
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
    parking: boolean;
    petsAllowed: boolean;
  };
  images: string[];
  status: 'available' | 'rented' | 'maintenance';
  landlordId: string;
  createdAt: string;
  updatedAt: string;
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