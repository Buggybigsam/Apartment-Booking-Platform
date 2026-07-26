'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, DollarSign, Bed, Bath, RotateCcw, SlidersHorizontal } from 'lucide-react';

export const SearchFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters } = useApp();

  const activeFiltersCount =
    (filters.location ? 1 : 0) +
    (filters.maxPrice < 1000 ? 1 : 0) +
    (filters.bedrooms !== 'any' ? 1 : 0) +
    (filters.bathrooms !== 'any' ? 1 : 0);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold text-white tracking-wide">Filter Apartments</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              {activeFiltersCount} Active
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter 1: Location Search */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Location / City
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. New York, Paris, Tokyo..."
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        {/* Filter 2: Max Price Range */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Max Price / Night
            </label>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              ${filters.maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="20"
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>$100</span>
            <span>$500</span>
            <span>$1,000</span>
          </div>
        </div>

        {/* Filter 3: Bedrooms */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-indigo-400" />
            Bedrooms
          </label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['any', 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setFilters((prev) => ({ ...prev, bedrooms: val as any }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filters.bedrooms === val
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {val === 'any' ? 'Any' : `${val}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter 4: Bathrooms */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-amber-400" />
            Bathrooms
          </label>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['any', 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => setFilters((prev) => ({ ...prev, bathrooms: val as any }))}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filters.bathrooms === val
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {val === 'any' ? 'Any' : `${val}+`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
