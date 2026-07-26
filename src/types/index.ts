export type UserRole = 'renter' | 'host' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'deactivated';

export interface Listing {
  id: string;
  hostId: string;
  hostName: string;
  hostEmail: string;
  hostAvatar?: string;
  title: string;
  description: string;
  city: string;
  neighborhood: string;
  address: string;
  pricePerNight: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  photos: string[];
  status: ListingStatus;
  createdAt: string;
  amenities: string[];
  blockedDates: string[]; // YYYY-MM-DD format
}

export type BookingStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCity: string;
  listingPhoto: string;
  renterId: string;
  renterName: string;
  renterEmail: string;
  hostId: string;
  hostEmail: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  nightCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientRole: UserRole;
  subject: string;
  body: string;
  timestamp: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_declined' | 'listing_approved' | 'listing_rejected';
  read: boolean;
}

export interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | 'any';
  bathrooms: number | 'any';
  startDate: string;
  endDate: string;
}
