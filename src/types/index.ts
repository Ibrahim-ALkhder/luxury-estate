export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PropertyData {
  id: string;
  ownerId?: string;
  title: { en: string; ar: string };
  location: { en: string; ar: string };
  description?: { en: string; ar: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  image: string;
  status: 'available' | 'sold' | 'underConstruction';
  features: { en: string[]; ar: string[] };
  hasAdvanced?: boolean;
  floor?: number;
  occupancy?: number;
  measurements?: string[];
  soundInsulation?: string;
  daylightFactor?: string;
  ceilingHeight?: string;
  floorPlanImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  propertyId?: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type LeadSource = 'website' | 'referral' | 'social_media' | 'phone_inquiry' | 'walk_in' | 'email';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'converted' | 'lost';

export interface LeadNote {
  id: string;
  leadId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Favorite {
  userId: string;
  propertyId: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyId: string;
  propertyTitle: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}
