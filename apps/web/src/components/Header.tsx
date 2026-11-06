import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, User, Wrench, Menu } from 'lucide-react';

export const Header = () => {
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
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">GPS</span>
        </div>

        {/* Nav Links & CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/services"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline-block"
          >
            Services
          </Link>
          <Link
            href="/provider/register"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Become a Partner</span>
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Login / OTP</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
