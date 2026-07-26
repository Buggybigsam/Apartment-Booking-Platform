'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Users, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { setSelectedListing } = useApp();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev + 1) % listing.photos.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      onClick={() => setSelectedListing(listing)}
      className="group bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/90 overflow-hidden shadow-xl hover:border-slate-700 transition-all cursor-pointer flex flex-col"
    >
      {/* Image Gallery Header */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        <img
          src={listing.photos[activePhotoIdx] || listing.photos[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-emerald-400 text-xs font-semibold flex items-center gap-1 shadow-md">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {listing.city} · {listing.neighborhood}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified
          </span>
        </div>

        {/* Photo Slider Controls */}
        {listing.photos.length > 1 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <div className="flex gap-1">
              {listing.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activePhotoIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextPhoto}
              className="px-2.5 py-1 rounded-lg bg-slate-950/70 hover:bg-slate-900 border border-slate-700 text-[10px] text-slate-300 font-mono transition-colors"
            >
              Next Photo →
            </button>
          </div>
        )}
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Specifications Icons */}
        <div className="flex items-center gap-4 py-2 border-y border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-indigo-400" />
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-amber-400" />
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Up to {listing.maxGuests} guests</span>
          </div>
        </div>

        {/* Footer: Price & Action CTA */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xl font-extrabold text-white">${listing.pricePerNight}</span>
            <span className="text-xs text-slate-400 font-normal"> / night</span>
          </div>

          <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 group-hover:scale-105">
            View Details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
