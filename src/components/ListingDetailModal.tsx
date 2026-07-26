'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Bed, Bath, Users, ShieldCheck, Calendar, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { AvailabilityCalendar } from './AvailabilityCalendar';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const { requestBooking, currentUser, setIsEmailDrawerOpen } = useApp();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [bookingFeedback, setBookingFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? diff : 0;
  };

  const nightCount = calculateNights();
  const totalPrice = nightCount * listing.pricePerNight;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestBooking(listing.id, startDate, endDate, notes);
    setBookingFeedback(res);

    if (res.success) {
      setTimeout(() => {
        setIsEmailDrawerOpen(true);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Photo Gallery Lightbox */}
        <div className="relative h-80 sm:h-96 w-full bg-slate-950 rounded-t-3xl overflow-hidden">
          <img
            src={listing.photos[activePhotoIdx]}
            alt={listing.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent p-6 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Apartment
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 text-xs font-medium">
                  {listing.city}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{listing.title}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {listing.address}
              </p>
            </div>

            {/* Thumbnail Selectors */}
            {listing.photos.length > 1 && (
              <div className="flex gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
                {listing.photos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === activePhotoIdx ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Description & Specs & Host Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Host Details Pill */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <img
                src={listing.hostAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={listing.hostName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Property Host</p>
                <h4 className="text-sm font-bold text-white">{listing.hostName}</h4>
                <p className="text-[11px] text-emerald-400 font-mono">{listing.hostEmail}</p>
              </div>
            </div>

            {/* Specifications Bar */}
            <div className="grid grid-cols-3 gap-3 text-center p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div>
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-indigo-400" /> Bedrooms
                </p>
                <p className="text-sm font-bold text-white mt-0.5">{listing.bedrooms}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-amber-400" /> Bathrooms
                </p>
                <p className="text-sm font-bold text-white mt-0.5">{listing.bathrooms}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> Max Guests
                </p>
                <p className="text-sm font-bold text-white mt-0.5">{listing.maxGuests}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">About this apartment</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">Included Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {listing.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Availability Calendar & Request Booking Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-2xl font-extrabold text-white">${listing.pricePerNight}</span>
                  <span className="text-xs text-slate-400"> / night</span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  Real-time Availability
                </span>
              </div>

              {/* Interactive Calendar */}
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Select Check-in & Check-out Dates:
                </label>
                <AvailabilityCalendar
                  blockedDates={listing.blockedDates}
                  selectedStartDate={startDate}
                  selectedEndDate={endDate}
                  onSelectDateRange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                />
              </div>

              {/* Booking Request Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">CHECK-IN</span>
                    <span className="font-semibold text-white font-mono">{startDate || 'Select date'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">CHECK-OUT</span>
                    <span className="font-semibold text-white font-mono">{endDate || 'Select date'}</span>
                  </div>
                </div>

                {/* Optional Renter Notes */}
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Message / Notes for Host (Optional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Estimated arrival time, special requests..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Price Breakdown */}
                {nightCount > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>${listing.pricePerNight} × {nightCount} nights</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Service & Platform Fee</span>
                      <span className="text-emerald-400 font-semibold">$0 (MVP)</span>
                    </div>
                    <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 text-sm">
                      <span>Total</span>
                      <span className="text-emerald-400 font-mono">${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Feedback Banner */}
                {bookingFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                      bookingFeedback.success
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-red-500/20 border-red-500/50 text-red-300'
                    }`}
                  >
                    {bookingFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                    <span>{bookingFeedback.message}</span>
                  </div>
                )}

                {/* Submit Request Button */}
                <button
                  type="submit"
                  disabled={!startDate || !endDate || nightCount <= 0}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Submit Booking Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
