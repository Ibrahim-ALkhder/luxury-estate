export interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image: string;
  features: string[];
}

export const allProperties: PropertyData[] = [
  {
    id: '1',
    title: 'Luxury Villa with Sea View',
    location: 'Palm Jumeirah, Dubai',
    price: 4500000,
    bedrooms: 5,
    bathrooms: 6,
    area: 750,
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
    features: ['Private Pool', 'Gym', 'Smart Home', 'Sea View', '3 Parking Spaces'],
  },
  {
    id: '2',
    title: 'Sky Penthouse',
    location: 'Downtown Dubai',
    price: 3200000,
    bedrooms: 3,
    bathrooms: 3,
    area: 420,
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
    features: ['360° City View', 'Private Elevator', 'Rooftop Terrace', 'Concierge'],
  },
  // ... باقي العقارات كما سبق
];