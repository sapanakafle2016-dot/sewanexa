import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-white tracking-tight">SEWANEXA</div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your Local Services, Connected. Bridging households and businesses across Nepal with verified, skilled professionals on demand.
          </p>
          <div className="text-xs text-slate-500">
            A venture of <strong className="text-slate-300">Sangalo Tech Pvt. Ltd.</strong>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-slate-200 tracking-wider mb-4">
            Popular Categories
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/services/plumbing" className="hover:text-white transition-colors">Plumbing & Sanitary</Link></li>
            <li><Link href="/services/electrical" className="hover:text-white transition-colors">Electrical Repairs</Link></li>
            <li><Link href="/services/vehicle" className="hover:text-white transition-colors">Car & Bike Mechanics</Link></li>
            <li><Link href="/services/house-painting" className="hover:text-white transition-colors">House Painting</Link></li>
            <li><Link href="/services/it-support" className="hover:text-white transition-colors">Computer & CCTV Repair</Link></li>
          </ul>
        </div>

        {/* Nepal Payment Options */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-slate-200 tracking-wider mb-4">
            Supported Payments
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Secure, instant digital and cash settlements for customers and service partners across Nepal.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-md">
              eSewa ePay
            </span>
            <span className="px-3 py-1 bg-purple-950 border border-purple-500/30 text-purple-400 font-bold text-xs rounded-md">
              Khalti v2
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md font-medium">
              Cash on Service
            </span>
          </div>
        </div>

        {/* Office & Contact Info */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-slate-200 tracking-wider mb-4">
            Contact & Office
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <span>Lokanthali, Bhaktapur, Bagmati Province, Nepal</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <a href="mailto:sangalotech@gmail.com" className="hover:text-white transition-colors">sangalotech@gmail.com</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Verified Professionals Guarantee</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          &copy; {new Date().getFullYear()} SEWANEXA by Sangalo Tech Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
          <Link href="/safety" className="hover:text-slate-400">Trust & Safety</Link>
        </div>
      </div>
    </footer>
  );
};
