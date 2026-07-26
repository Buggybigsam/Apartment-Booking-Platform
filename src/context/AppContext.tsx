'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Listing, Booking, EmailNotification, SearchFilters } from '../types';
import { INITIAL_USERS, INITIAL_LISTINGS, INITIAL_BOOKINGS, INITIAL_EMAILS } from '../lib/seedData';

interface AppContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  listings: Listing[];
  bookings: Booking[];
  emails: EmailNotification[];
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  selectedListing: Listing | null;
  setSelectedListing: (listing: Listing | null) => void;
  
  // Actions
  createListing: (listingData: Omit<Listing, 'id' | 'hostId' | 'hostName' | 'hostEmail' | 'hostAvatar' | 'status' | 'createdAt' | 'blockedDates'>) => void;
  approveListing: (id: string) => void;
  rejectListing: (id: string) => void;
  toggleDeactivateListing: (id: string) => void;
  
  requestBooking: (listingId: string, startDate: string, endDate: string, notes?: string) => { success: boolean; message?: string };
  acceptBooking: (bookingId: string) => void;
  declineBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  
  toggleHostBlockedDate: (listingId: string, dateStr: string) => void;
  markEmailRead: (emailId: string) => void;
  
  // Active UI Tabs
  activeTab: 'explore' | 'renter_bookings' | 'host_dashboard' | 'admin_panel';
  setActiveTab: (tab: 'explore' | 'renter_bookings' | 'host_dashboard' | 'admin_panel') => void;
  
  // Email Drawer state
  isEmailDrawerOpen: boolean;
  setIsEmailDrawerOpen: (open: boolean) => void;
}

const defaultFilters: SearchFilters = {
  location: '',
  minPrice: 0,
  maxPrice: 1000,
  bedrooms: 'any',
  bathrooms: 'any',
  startDate: '',
  endDate: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Renter default
  const [listings, setListings] = useState<Listing[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldstay_listings');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LISTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldstay_bookings');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BOOKINGS;
  });

  const [emails, setEmails] = useState<EmailNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldstay_emails');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_EMAILS;
  });

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'renter_bookings' | 'host_dashboard' | 'admin_panel'>('explore');
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('fieldstay_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('fieldstay_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('fieldstay_emails', JSON.stringify(emails));
  }, [emails]);

  const setRole = (role: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      if (role === 'host') setActiveTab('host_dashboard');
      else if (role === 'admin') setActiveTab('admin_panel');
      else if (role === 'renter' && (activeTab === 'host_dashboard' || activeTab === 'admin_panel')) {
        setActiveTab('explore');
      }
    }
  };

  const resetFilters = () => setFilters(defaultFilters);

  // Listing management
  const createListing = (listingData: Omit<Listing, 'id' | 'hostId' | 'hostName' | 'hostEmail' | 'hostAvatar' | 'status' | 'createdAt' | 'blockedDates'>) => {
    const newId = `apt_${Date.now()}`;
    const newListing: Listing = {
      ...listingData,
      id: newId,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostEmail: currentUser.email,
      hostAvatar: currentUser.avatar,
      status: 'pending', // FR-10 Requires admin approval
      createdAt: new Date().toISOString(),
      blockedDates: [],
    };

    setListings((prev) => [newListing, ...prev]);

    // Send email notification to Admin
    const adminEmail: EmailNotification = {
      id: `em_${Date.now()}`,
      recipientEmail: 'admin@fieldstay.com',
      recipientRole: 'admin',
      subject: `🚨 Pending Listing Approval Required: "${newListing.title}"`,
      body: `Host ${currentUser.name} submitted a new listing in ${newListing.city} ($${newListing.pricePerNight}/night). Review in Admin Panel before publishing.`,
      timestamp: new Date().toISOString(),
      type: 'booking_request',
      read: false,
    };

    setEmails((prev) => [adminEmail, ...prev]);
  };

  const approveListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    const target = listings.find((l) => l.id === id);
    if (target) {
      const email: EmailNotification = {
        id: `em_${Date.now()}`,
        recipientEmail: target.hostEmail,
        recipientRole: 'host',
        subject: `✅ Your listing "${target.title}" is now LIVE!`,
        body: `Congratulations ${target.hostName}! Your apartment listing in ${target.city} has been verified and approved by Fieldstay Admin. Renters can now discover and request bookings!`,
        timestamp: new Date().toISOString(),
        type: 'listing_approved',
        read: false,
      };
      setEmails((prev) => [email, ...prev]);
    }
  };

  const rejectListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    const target = listings.find((l) => l.id === id);
    if (target) {
      const email: EmailNotification = {
        id: `em_${Date.now()}`,
        recipientEmail: target.hostEmail,
        recipientRole: 'host',
        subject: `❌ Update on your listing "${target.title}"`,
        body: `Hi ${target.hostName}, your listing requires additional verification or high-res photos before going live. Please update your details and resubmit.`,
        timestamp: new Date().toISOString(),
        type: 'listing_rejected',
        read: false,
      };
      setEmails((prev) => [email, ...prev]);
    }
  };

  const toggleDeactivateListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'deactivated' ? 'approved' : 'deactivated' }
          : item
      )
    );
  };

  // Date utilities for overlap check
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates: string[] = [];
    const curr = new Date(startStr);
    const end = new Date(endStr);
    while (curr < end) {
      dates.push(curr.toISOString().split('T')[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Booking Flow & Overlap Prevention (FR-5, FR-9)
  const requestBooking = (listingId: string, startDate: string, endDate: string, notes?: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, message: 'Listing not found.' };

    if (!startDate || !endDate) {
      return { success: false, message: 'Please select both start and end dates.' };
    }

    const requestedDates = getDatesInRange(startDate, endDate);
    if (requestedDates.length === 0) {
      return { success: false, message: 'End date must be after start date.' };
    }

    // FR-9: Check if any requested dates overlap with host blocked dates or accepted bookings
    const isBlocked = requestedDates.some((date) => listing.blockedDates.includes(date));
    if (isBlocked) {
      return { success: false, message: 'Selected dates overlap with an existing booking or unavailable period.' };
    }

    const existingAccepted = bookings.filter(
      (b) => b.listingId === listingId && b.status === 'accepted'
    );

    for (const b of existingAccepted) {
      const bookedDates = getDatesInRange(b.startDate, b.endDate);
      const hasOverlap = requestedDates.some((d) => bookedDates.includes(d));
      if (hasOverlap) {
        return { success: false, message: 'Dates are already confirmed for another guest stay.' };
      }
    }

    const nightCount = requestedDates.length;
    const totalPrice = nightCount * listing.pricePerNight;

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      listingId,
      listingTitle: listing.title,
      listingCity: listing.city,
      listingPhoto: listing.photos[0],
      renterId: currentUser.id,
      renterName: currentUser.name,
      renterEmail: currentUser.email,
      hostId: listing.hostId,
      hostEmail: listing.hostEmail,
      startDate,
      endDate,
      nightCount,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // FR-6: Notify host by email
    const hostEmailNotice: EmailNotification = {
      id: `em_${Date.now()}`,
      recipientEmail: listing.hostEmail,
      recipientRole: 'host',
      subject: `🔔 New Booking Request from ${currentUser.name}`,
      body: `Hi ${listing.hostName}, ${currentUser.name} requested dates ${startDate} to ${endDate} (${nightCount} nights, Total $${totalPrice.toLocaleString()}) for "${listing.title}". Please log in to accept or decline.`,
      timestamp: new Date().toISOString(),
      type: 'booking_request',
      read: false,
    };

    setEmails((prev) => [hostEmailNotice, ...prev]);

    return { success: true, message: 'Booking request sent successfully!' };
  };

  // Host Action: Accept Booking (FR-7, FR-8, FR-9)
  const acceptBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Set status to accepted
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'accepted' } : b))
    );

    // FR-9: Structurally block dates on the listing so future queries reject overlaps
    const requestedDates = getDatesInRange(booking.startDate, booking.endDate);
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === booking.listingId) {
          const updatedBlocked = Array.from(new Set([...l.blockedDates, ...requestedDates]));
          return { ...l, blockedDates: updatedBlocked };
        }
        return l;
      })
    );

    // FR-8: Automated email notification to renter
    const renterEmailNotice: EmailNotification = {
      id: `em_${Date.now()}`,
      recipientEmail: booking.renterEmail,
      recipientRole: 'renter',
      subject: `🎉 Booking Confirmed for ${booking.listingTitle}!`,
      body: `Great news ${booking.renterName}! Host accepted your stay request for ${booking.startDate} to ${booking.endDate} (${booking.nightCount} nights, Total: $${booking.totalPrice.toLocaleString()}). See your booking history for details.`,
      timestamp: new Date().toISOString(),
      type: 'booking_accepted',
      read: false,
    };

    setEmails((prev) => [renterEmailNotice, ...prev]);
  };

  // Host Action: Decline Booking (FR-7, FR-8)
  const declineBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'declined' } : b))
    );

    // FR-8: Email notification to renter
    const renterEmailNotice: EmailNotification = {
      id: `em_${Date.now()}`,
      recipientEmail: booking.renterEmail,
      recipientRole: 'renter',
      subject: `Update on your stay request for ${booking.listingTitle}`,
      body: `Hi ${booking.renterName}, unfortunately the host was unable to accommodate your request for ${booking.startDate} to ${booking.endDate}. We invite you to explore alternative available listings on Fieldstay.`,
      timestamp: new Date().toISOString(),
      type: 'booking_declined',
      read: false,
    };

    setEmails((prev) => [renterEmailNotice, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Remove blocked dates if it was previously accepted
    if (booking.status === 'accepted') {
      const datesToRemove = getDatesInRange(booking.startDate, booking.endDate);
      setListings((prev) =>
        prev.map((l) => {
          if (l.id === booking.listingId) {
            return {
              ...l,
              blockedDates: l.blockedDates.filter((d) => !datesToRemove.includes(d)),
            };
          }
          return l;
        })
      );
    }
  };

  const toggleHostBlockedDate = (listingId: string, dateStr: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const exists = l.blockedDates.includes(dateStr);
          const updated = exists
            ? l.blockedDates.filter((d) => d !== dateStr)
            : [...l.blockedDates, dateStr];
          return { ...l, blockedDates: updated };
        }
        return l;
      })
    );
  };

  const markEmailRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setRole,
        listings,
        bookings,
        emails,
        filters,
        setFilters,
        resetFilters,
        selectedListing,
        setSelectedListing,
        createListing,
        approveListing,
        rejectListing,
        toggleDeactivateListing,
        requestBooking,
        acceptBooking,
        declineBooking,
        cancelBooking,
        toggleHostBlockedDate,
        markEmailRead,
        activeTab,
        setActiveTab,
        isEmailDrawerOpen,
        setIsEmailDrawerOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
