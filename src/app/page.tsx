'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { HeroMotionGraphics } from '../components/HeroMotionGraphics';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { ListingCard } from '../components/ListingCard';
import { ListingDetailModal } from '../components/ListingDetailModal';
import { RenterDashboard } from '../components/RenterDashboard';
import { HostDashboard } from '../components/HostDashboard';
import { AdminPanel } from '../components/AdminPanel';
import { Building2, Frown, Sparkles } from 'lucide-react';

export default function Home() {
  const { listings, filters, activeTab, selectedListing, setSelectedListing } = useApp();

  // Filter listings for 'explore' view
  const publicListings = listings.filter((l) => l.status === 'approved');

  const filteredListings = publicListings.filter((item) => {
    // Location check
    if (
      filters.location &&
      !item.city.toLowerCase().includes(filters.location.toLowerCase()) &&
      !item.neighborhood.toLowerCase().includes(filters.location.toLowerCase()) &&
      !item.title.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    // Max Price check
    if (item.pricePerNight > filters.maxPrice) {
      return false;
    }
    // Bedrooms check
    if (filters.bedrooms !== 'any' && item.bedrooms < Number(filters.bedrooms)) {
      return false;
    }
    // Bathrooms check
    if (filters.bathrooms !== 'any' && item.bathrooms < Number(filters.bathrooms)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Explore View (Landing Page with Motion Graphics) */}
      {activeTab === 'explore' && (
        <>
          {/* Landing Page Motion Graphics Hero */}
          <HeroMotionGraphics />

          {/* Interactive Search & Multi-Filter Bar */}
          <SearchFilterBar />

          {/* Listings Catalog Header */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Featured Rental Apartments
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredListings.length} verified apartments with live availability calendars
              </p>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
              Live Real-Time Catalog
            </span>
          </div>

          {/* Listing Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3 my-6">
              <Frown className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Apartments Match Your Criteria</h3>
              <p className="text-xs max-w-sm mx-auto">
                Try widening your price range or clearing location filters to discover available stays.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </>
      )}

      {/* 2. Renter Bookings View */}
      {activeTab === 'renter_bookings' && <RenterDashboard />}

      {/* 3. Host Portal View */}
      {activeTab === 'host_dashboard' && <HostDashboard />}

      {/* 4. Admin Panel View */}
      {activeTab === 'admin_panel' && <AdminPanel />}

      {/* Listing Detail & Booking Request Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </div>
  );
}
