export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pricePerNight: number;
  maxGuests: number;
  photos: string[];
  amenities: string[];
  specimenNo: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  guestName: string;
  hostId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  stripeSessionId?: string;
  createdAt: string;
}