import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'property';
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
}

const defaultSEO = {
  siteName: 'RentSure',
  title: 'RentSure - Find Your Perfect Rental Property',
  description: 'Discover amazing rental properties for students and professionals. Browse apartments, houses, and more with verified listings from trusted landlords.',
  keywords: ['rental properties', 'apartments', 'student housing', 'property rentals', 'real estate'],
  image: '/images/og-default.jpg',
  url: 'https://rentsure.com',
  locale: 'en_US',
  type: 'website' as const
};

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  locale = defaultSEO.locale,
  siteName = defaultSEO.siteName
}: SEOProps = {}): Metadata {
  const seoTitle = title ? `${title} | ${siteName}` : defaultSEO.title;
  const seoDescription = description || defaultSEO.description;
  const seoImage = image || defaultSEO.image;
  const seoUrl = url || defaultSEO.url;
  const seoKeywords = [...defaultSEO.keywords, ...keywords];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    
    // Basic meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      locale,
      url: seoUrl,
      title: seoTitle,
      description: seoDescription,
      siteName,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
      creator: '@rentsure',
      site: '@rentsure',
    },

    // Additional meta tags
    alternates: {
      canonical: seoUrl,
    },
    
    // App-specific
    applicationName: siteName,
    category: 'Real Estate',
  };
}

export function generatePropertySEO({
  title,
  description,
  price,
  location,
  bedrooms,
  bathrooms,
  images = [],
  propertyType,
  availableDate,
  propertyId
}: {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  images?: string[];
  propertyType: string;
  availableDate: string;
  propertyId: string;
}): Metadata {
  const seoTitle = `${title} - $${price.toLocaleString()}/mo in ${location}`;
  const seoDescription = `${description.substring(0, 150)}... ${bedrooms} bed, ${bathrooms} bath ${propertyType} available ${availableDate}. Contact us today!`;
  const keywords = [
    'rental property',
    location.toLowerCase(),
    `${bedrooms} bedroom`,
    propertyType.toLowerCase(),
    'apartment rental',
    'house rental',
    'student housing'
  ];

  return generateSEOMetadata({
    title: seoTitle,
    description: seoDescription,
    keywords,
    image: images[0],
    url: `${defaultSEO.url}/listings/${propertyId}`,
    type: 'article',
    publishedTime: new Date().toISOString(),
  });
}

export function generateListingSEO({
  query,
  location,
  priceRange,
  propertyType,
  page = 1
}: {
  query?: string;
  location?: string;
  priceRange?: { min?: number; max?: number };
  propertyType?: string;
  page?: number;
}): Metadata {
  let title = 'Browse Rental Properties';
  let description = 'Find your perfect rental property from our extensive collection of verified listings.';

  if (query) {
    title = `${query} - Rental Properties`;
    description = `Search results for "${query}". Find the perfect rental property that matches your needs.`;
  } else if (location) {
    title = `Rental Properties in ${location}`;
    description = `Discover amazing rental properties in ${location}. Browse apartments, houses, and more.`;
  } else if (propertyType) {
    title = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Rentals`;
    description = `Find the perfect ${propertyType} for rent. Browse our verified listings and contact landlords directly.`;
  }

  if (priceRange?.min && priceRange?.max) {
    title += ` ($${priceRange.min}-$${priceRange.max})`;
  }

  if (page > 1) {
    title += ` - Page ${page}`;
  }

  const keywords = [
    'rental properties',
    'property search',
    'apartment listings',
    ...(location ? [location.toLowerCase()] : []),
    ...(propertyType ? [propertyType.toLowerCase()] : []),
    ...(query ? [query.toLowerCase()] : [])
  ];

  return generateSEOMetadata({
    title,
    description,
    keywords,
    url: `${defaultSEO.url}/listings${page > 1 ? `?page=${page}` : ''}`,
  });
}

// Structured Data (JSON-LD) generators
export function generatePropertyStructuredData({
  property,
  landlord
}: {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage?: number;
    images: string[];
    amenities?: string[];
    availableDate: string;
  };
  landlord: {
    name: string;
    phone: string;
    email: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${defaultSEO.url}/listings/${property.id}`,
    name: property.title,
    description: property.description,
    url: `${defaultSEO.url}/listings/${property.id}`,
    image: property.images,
    
    // Property details
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.squareFootage ? {
      '@type': 'QuantitativeValue',
      value: property.squareFootage,
      unitCode: 'SQF'
    } : undefined,
    
    // Address
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.location,
      addressCountry: 'US'
    },
    
    // Rental details
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: property.availableDate,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: property.price,
        priceCurrency: 'USD',
        unitText: 'MONTH'
      }
    },
    
    // Landlord/Agent
    agent: {
      '@type': 'RealEstateAgent',
      name: landlord.name,
      telephone: landlord.phone,
      email: landlord.email
    },
    
    // Amenities
    amenityFeature: property.amenities?.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    })),
    
    // Dates
    datePosted: new Date().toISOString(),
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
} 