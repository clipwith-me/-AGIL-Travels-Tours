/**
 * Tour categories and transport services.
 *
 * IMPORTANT: only the categories/services CONFIRMED in the project spec are
 * listed here — six tour categories and four transport services. The full
 * tour catalogue (40+ tours with real names and prices) is NOT invented here;
 * it comes from the client's content export. Descriptions below are general
 * category descriptions, not specific tour claims or prices.
 */

export type TourCategory = {
  slug: string;
  name: string;
  description: string;
};

export const tourCategories: TourCategory[] = [
  {
    slug: "desert-safari",
    name: "Desert Safari",
    description:
      "Dune bashing, camel rides, and evening entertainment at desert camps.",
  },
  {
    slug: "landmarks",
    name: "Landmarks",
    description:
      "The Emirates' iconic sights — from towering viewpoints to cultural landmarks.",
  },
  {
    slug: "theme-parks",
    name: "Theme Parks",
    description:
      "World-class theme parks and attractions for families and thrill-seekers.",
  },
  {
    slug: "cruises",
    name: "Cruises",
    description: "Dinner cruises and scenic sailings along the coast and marinas.",
  },
  {
    slug: "adventure",
    name: "Adventure",
    description: "Active experiences for travellers who want more than sightseeing.",
  },
  {
    slug: "nature-wildlife",
    name: "Nature & Wildlife",
    description: "Parks, reserves, and wildlife encounters across the region.",
  },
];

export type TransportService = {
  slug: string;
  name: string;
  description: string;
};

export const transportServices: TransportService[] = [
  {
    slug: "airport-transfers",
    name: "Airport Transfers",
    description:
      "Reliable pickups and drop-offs between the airport and your hotel.",
  },
  {
    slug: "city-tours",
    name: "City Tours",
    description: "Guided transport for exploring the city at your own pace.",
  },
  {
    slug: "private-car-hire",
    name: "Private Car Hire",
    description: "A private vehicle and driver for the duration of your trip.",
  },
  {
    slug: "limousine-service",
    name: "Limousine Service",
    description: "Premium chauffeured travel for special occasions and VIP arrivals.",
  },
];
