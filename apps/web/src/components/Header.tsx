'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  User,
  Wrench,
  LogOut,
  Briefcase,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const { user, isProvider, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              SEWANEXA
            </div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
              Nepal's Services Hub
            </div>
          </div>
        </Link>

        {/* Current Location Pill (GPS Context) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 cursor-pointer transition-colors border border-slate-200">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Lokanthali, Bhaktapur</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
            GPS
          </span>
        </div>

        {/* Nav Links & CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/services"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline-block"
          >
            Services
          </Link>

          {!isProvider ? (
            <Link
              href="/provider/register"
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Become a Partner</span>
            </Link>
          ) : (
            <Link
              href="/provider/dashboard"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Provider Mode</span>
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {user.name || user.phoneNumber}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-400">+977 {user.phoneNumber}</p>
                  </div>
                  <Link
                    href="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span>My Bookings</span>
                  </Link>
                  {isProvider && (
                    <Link
                      href="/provider/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      <span>Provider Dashboard</span>
                    </Link>
                  )}
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / OTP</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
