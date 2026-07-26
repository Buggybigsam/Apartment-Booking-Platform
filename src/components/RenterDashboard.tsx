'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CalendarCheck, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Mail, Ban, ChevronRight } from 'lucide-react';

export const RenterDashboard: React.FC = () => {
  const { bookings, currentUser, cancelBooking, setSelectedListing, listings, setIsEmailDrawerOpen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const myBookings = bookings.filter((b) => b.renterId === currentUser.id);

  const filteredBookings = myBookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Renter Booking Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Track request statuses, view confirmed stays, and inspect transactional email alerts.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEmailDrawerOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Mail className="w-4 h-4" />
          View Booking Emails
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'accepted', 'declined', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
              filterStatus === st
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {st} ({st === 'all' ? myBookings.length : myBookings.filter((b) => b.status === st).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-3">
          <Clock className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Bookings Found</h3>
          <p className="text-xs max-w-sm mx-auto">
            You haven't requested any stays matching this status filter yet. Explore our curated apartments to make a booking request!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => {
            const targetListing = listings.find((l) => l.id === b.listingId);

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4 flex flex-col justify-between"
              >
                {/* Header & Status */}
                <div className="flex items-start gap-4">
                  <img
                    src={b.listingPhoto}
                    alt={b.listingTitle}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400">ID: {b.id}</span>

                      {/* Status Badge */}
                      {b.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" /> Host Review Pending
                        </span>
                      )}
                      {b.status === 'accepted' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Stay Confirmed
                        </span>
                      )}
                      {b.status === 'declined' && (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Request Declined
                        </span>
                      )}
                      {b.status === 'cancelled' && (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Cancelled
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1 truncate">{b.listingTitle}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {b.listingCity}
                    </p>
                  </div>
                </div>

                {/* Stay Details Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">DATES</span>
                    <span className="font-semibold text-white font-mono">{b.startDate} → {b.endDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">TOTAL PRICE</span>
                    <span className="font-extrabold text-emerald-400 font-mono text-sm">${b.totalPrice.toLocaleString()} ({b.nightCount} nights)</span>
                  </div>
                </div>

                {b.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-300 italic">
                    "{b.notes}"
                  </div>
                )}

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => targetListing && setSelectedListing(targetListing)}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    View Listing Page <ChevronRight className="w-3 h-3" />
                  </button>

                  {(b.status === 'pending' || b.status === 'accepted') && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-colors"
                    >
                      Cancel Stay
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
