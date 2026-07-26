'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, User, ShieldCheck, Mail, Sparkles, Home, CalendarCheck, PlusCircle, LayoutDashboard, ChevronDown } from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    setRole,
    activeTab,
    setActiveTab,
    bookings,
    listings,
    emails,
    setIsEmailDrawerOpen,
  } = useApp();

  const unreadEmailsCount = emails.filter((e) => !e.read).length;

  const pendingBookingsCount = bookings.filter(
    (b) => b.hostEmail === currentUser.email && b.status === 'pending'
  ).length;

  const pendingAdminListingsCount = listings.filter((l) => l.status === 'pending').length;

  const renterBookingsCount = bookings.filter((b) => b.renterId === currentUser.id).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  Fieldstay
                </span>
                <span className="block text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
                  Apartment Booking MVP
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'explore'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                Explore Apartments
              </button>

              <button
                onClick={() => setActiveTab('renter_bookings')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                  activeTab === 'renter_bookings'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                My Bookings
                {renterBookingsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-slate-900 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
                    {renterBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('host_dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                  activeTab === 'host_dashboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Host Portal
                {pendingBookingsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-950 font-bold rounded-full animate-bounce">
                    {pendingBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('admin_panel')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                  activeTab === 'admin_panel'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Admin Panel
                {pendingAdminListingsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-indigo-600 text-white font-bold rounded-full">
                    {pendingAdminListingsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Right: Quick Role Switcher + Email Drawer Button */}
          <div className="flex items-center gap-3">
            {/* Email Inbox Button */}
            <button
              onClick={() => setIsEmailDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-800/70 border border-slate-700/70 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="View Simulated Email Notifications"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Emails</span>
              {unreadEmailsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                  {unreadEmailsCount}
                </span>
              )}
            </button>

            {/* User Role Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-white leading-none">{currentUser.name}</p>
                  <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider">
                    Role: {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Role Options Popup */}
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role:
                </p>
                <div className="space-y-1">
                  {(['renter', 'host', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentUser.role === r
                          ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="capitalize font-semibold">{r} View</span>
                      {r === 'renter' && <User className="w-3.5 h-3.5 text-emerald-400" />}
                      {r === 'host' && <Building2 className="w-3.5 h-3.5 text-indigo-400" />}
                      {r === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
