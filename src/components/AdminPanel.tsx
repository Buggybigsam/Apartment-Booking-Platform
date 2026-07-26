'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Building2, Users, CalendarCheck, MapPin, Eye } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { listings, bookings, approveListing, rejectListing, setSelectedListing } = useApp();

  const pendingListings = listings.filter((l) => l.status === 'pending');
  const approvedListings = listings.filter((l) => l.status === 'approved');
  const rejectedListings = listings.filter((l) => l.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Platform Administrator Control Center</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify and moderate new host property listings before public display (FR-10).
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold font-mono">
          Admin Authorization Active
        </span>
      </div>

      {/* Global Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-2xl font-extrabold text-white mt-1">{listings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
          <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Pending Verification
          </p>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{pendingListings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved Live
          </p>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{approvedListings.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5" /> Total Booking Cycles
          </p>
          <p className="text-2xl font-extrabold text-white mt-1">{bookings.length}</p>
        </div>
      </div>

      {/* Pending Listings Moderation Queue (FR-10) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-indigo-400" />
            Pending Listings Queue (FR-10 Approval Required)
          </h2>
        </div>

        {pendingListings.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            All listing requests have been moderated! Queue is clear.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingListings.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-slate-900/90 border border-indigo-500/40 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={l.photos[0]}
                    alt={l.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      Awaiting Verification
                    </span>
                    <h3 className="text-sm font-bold text-white">{l.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {l.city} ({l.address})
                    </p>
                    <p className="text-xs text-emerald-400 font-semibold font-mono">
                      ${l.pricePerNight} / night · {l.bedrooms} Beds · Host: {l.hostName}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  "{l.description}"
                </p>

                {/* Moderation Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedListing(l)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview Listing
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => approveListing(l.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Listing
                    </button>
                    <button
                      onClick={() => rejectListing(l.id)}
                      className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Live Approved Listings List */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Active Published Listings ({approvedListings.length})
        </h2>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Location</th>
                <th className="p-4">Host</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {approvedListings.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img src={l.photos[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                    <span className="truncate max-w-xs">{l.title}</span>
                  </td>
                  <td className="p-4">{l.city}</td>
                  <td className="p-4 text-emerald-400">{l.hostName}</td>
                  <td className="p-4 font-mono font-bold">${l.pricePerNight}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                      Live
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedListing(l)}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 hover:border-emerald-400 text-xs text-white"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
