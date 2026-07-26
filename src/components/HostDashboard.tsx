'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Building2, PlusCircle, CheckCircle2, XCircle, Clock, Calendar, DollarSign, Eye, EyeOff, ShieldAlert, Sparkles, MapPin, Bed, Bath } from 'lucide-react';
import { AvailabilityCalendar } from './AvailabilityCalendar';

export const HostDashboard: React.FC = () => {
  const {
    listings,
    bookings,
    currentUser,
    createListing,
    acceptBooking,
    declineBooking,
    toggleDeactivateListing,
    toggleHostBlockedDate,
    setIsEmailDrawerOpen,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedListingForCalendar, setSelectedListingForCalendar] = useState<string | null>(null);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCity, setNewCity] = useState('New York');
  const [newNeighborhood, setNewNeighborhood] = useState('SoHo');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState(300);
  const [newBedrooms, setNewBedrooms] = useState(2);
  const [newBathrooms, setNewBathrooms] = useState(2);
  const [newMaxGuests, setNewMaxGuests] = useState(4);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Sample photo presets for quick creation
  const samplePhotos = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  ];

  const hostListings = listings.filter((l) => l.hostId === currentUser.id);
  const incomingRequests = bookings.filter((b) => b.hostEmail === currentUser.email);

  const pendingRequests = incomingRequests.filter((b) => b.status === 'pending');
  const acceptedStays = incomingRequests.filter((b) => b.status === 'accepted');

  const totalEarned = acceptedStays.reduce((acc, b) => acc + b.totalPrice, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const photosToUse = newPhotoUrl
      ? [newPhotoUrl, samplePhotos[0]]
      : [samplePhotos[Math.floor(Math.random() * samplePhotos.length)], samplePhotos[1]];

    createListing({
      title: newTitle || 'Luxury Architectural Penthouse',
      description: newDescription || 'Spacious designer apartment with natural lighting, premium finishes, and city views.',
      city: newCity,
      neighborhood: newNeighborhood,
      address: newAddress || '100 Main Street',
      pricePerNight: Number(newPrice),
      bedrooms: Number(newBedrooms),
      bathrooms: Number(newBathrooms),
      maxGuests: Number(newMaxGuests),
      photos: photosToUse,
      amenities: ['High-speed Wi-Fi', 'Washer & Dryer', 'Chef Kitchen', 'AC'],
    });

    setIsCreateModalOpen(false);
    alert('Listing created! Sent to Admin for verification (FR-10). Check your Email Inbox!');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Host Property Manager</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <span className="text-white font-semibold">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          List New Property
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-2xl font-extrabold text-white mt-1">{hostListings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Requests
          </p>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{pendingRequests.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Stays
          </p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{acceptedStays.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Est. Confirmed Value
          </p>
          <p className="text-2xl font-extrabold text-white mt-1 font-mono">${totalEarned.toLocaleString()}</p>
        </div>
      </div>

      {/* Section 1: Incoming Booking Requests (FR-6, FR-7) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Incoming Renter Requests ({pendingRequests.length} Pending)
          </h2>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            No pending booking requests right now. New renter requests will appear here with instant email notifications!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.listingPhoto}
                    alt={b.listingTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.listingTitle}</h4>
                    <p className="text-xs text-emerald-400 font-medium">
                      Guest: <span className="text-white font-semibold">{b.renterName}</span> ({b.renterEmail})
                    </p>
                    <p className="text-xs text-slate-300 font-mono mt-1">
                      Dates: <span className="text-amber-300 font-bold">{b.startDate} → {b.endDate}</span> ({b.nightCount} nights · Total ${b.totalPrice.toLocaleString()})
                    </p>
                    {b.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-1">"{b.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Host Action Buttons (FR-7) */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => acceptBooking(b.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept Request
                  </button>

                  <button
                    onClick={() => declineBooking(b.id)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Manage Properties & Availability Calendars (FR-2, FR-3) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          My Listed Apartments & Date Availability Control
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hostListings.map((l) => (
            <div
              key={l.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={l.photos[0]}
                    alt={l.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{l.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {l.city} · ${l.pricePerNight}/night
                    </p>
                  </div>
                </div>

                {/* Status pill */}
                {l.status === 'approved' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    Active & Live
                  </span>
                )}
                {l.status === 'pending' && (
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold animate-pulse">
                    Admin Approval Pending
                  </span>
                )}
                {l.status === 'deactivated' && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                    Deactivated
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-around text-xs text-slate-300">
                <span>{l.bedrooms} Beds</span>
                <span>{l.bathrooms} Baths</span>
                <span>Max {l.maxGuests} Guests</span>
                <span className="text-emerald-400 font-bold">{l.blockedDates.length} Blocked Days</span>
              </div>

              {/* Actions & Calendar Manager */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSelectedListingForCalendar(
                        selectedListingForCalendar === l.id ? null : l.id
                      )
                    }
                    className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedListingForCalendar === l.id ? 'Hide Calendar' : 'Manage Availability'}
                  </button>

                  <button
                    onClick={() => toggleDeactivateListing(l.id)}
                    className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    {l.status === 'deactivated' ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-400" /> Activate
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" /> Deactivate
                      </>
                    )}
                  </button>
                </div>

                {/* Inline Availability Calendar Editor */}
                {selectedListingForCalendar === l.id && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-indigo-500/30 animate-in fade-in">
                    <p className="text-xs font-bold text-white mb-2">
                      Host Date Block Editor (Click dates to block for maintenance/personal use):
                    </p>
                    <AvailabilityCalendar
                      blockedDates={l.blockedDates}
                      isHostView={true}
                      onToggleHostBlock={(dateStr) => toggleHostBlockedDate(l.id, dateStr)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Listing Modal Wizard */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Create New Rental Listing</h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Glass Loft Soho"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="New York">New York</option>
                      <option value="Paris">Paris</option>
                      <option value="Tokyo">Tokyo</option>
                      <option value="Miami">Miami</option>
                      <option value="London">London</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Neighborhood</label>
                    <input
                      type="text"
                      placeholder="e.g. Tribeca, Soho, Le Marais"
                      value={newNeighborhood}
                      onChange={(e) => setNewNeighborhood(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 142 Mercer St, NY 10012"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Price/Night</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Beds</label>
                    <input
                      type="number"
                      value={newBedrooms}
                      onChange={(e) => setNewBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Baths</label>
                    <input
                      type="number"
                      value={newBathrooms}
                      onChange={(e) => setNewBathrooms(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Guests</label>
                    <input
                      type="number"
                      value={newMaxGuests}
                      onChange={(e) => setNewMaxGuests(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe unique features, views, terrace..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Photo Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Leave blank to automatically assign high-resolution architectural interior photos.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    Submit for Admin Approval
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
