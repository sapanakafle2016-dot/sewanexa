'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  User,
  LogOut,
  Briefcase,
  Layers,
  ChevronDown,
  Menu,
  X,
  Compass,
  Globe,
  Phone,
  Sparkles,
  Zap,
  Wrench,
  Car,
  HardHat,
  Cpu,
  Heart,
  MoreHorizontal,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const QUICK_SERVICES = [
  { name: 'प्लम्बिङ (Plumber)', href: '/services/home-maintenance', icon: Wrench, tag: 'Hot' },
  { name: 'बाइक मेकानिक (Bike Mechanic)', href: '/services/vehicle-services', icon: Car, tag: '24/7' },
  { name: 'विद्युत मर्मत (Electrician)', href: '/services/home-maintenance', icon: Zap, tag: 'Fast' },
  { name: 'घर सफाइ (Deep Cleaning)', href: '/services/home-maintenance', icon: Sparkles },
  { name: 'डकर्मी (Masonry)', href: '/services/construction-and-labour', icon: HardHat },
  { name: 'सीसीटीभी & आईटी (CCTV / IT)', href: '/services/professional-and-technical', icon: Cpu },
];

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isProvider, logout } = useAuth();
  const { language, setLanguage, t, isNepali } = useLanguage();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState('Lokanthali, Bhaktapur');
  const [locating, setLocating] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const detectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          setUserLocation(`${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`);
        },
        () => {
          setLocating(false);
          setUserLocation('Lokanthali, Bhaktapur');
        },
        { timeout: 8000 }
      );
    }
  };

  return (
    <>
      {/* ── Top Announcement / Trust Ribbon ── */}
      <div className="bg-[#1e113f] text-[#ded4f1] text-xs sm:text-sm font-semibold py-2 px-4 border-b border-[#331e6a]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping shrink-0" />
            <span className="truncate">
              {isNepali
                ? '🇳🇵 काठमाडौँ उपत्यका र नेपालभर १५ मिनेटमै प्रमाणित प्राविधिक ढोकामा • ईसेवा र खल्ती एस्क्रो सुरक्षित'
                : '🇳🇵 15-Minute Guaranteed Pro Arrival across Kathmandu Valley • eSewa & Khalti Escrow Protected'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-300">
            <a
              href="tel:015901234"
              className="flex items-center gap-1.5 hover:text-[#f59e0b] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#f59e0b]" />
              <span>{isNepali ? '२४/७ हेल्पलाइन: ०१-५९०१२३४' : '24/7 Helpline: 01-5901234'}</span>
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/safety" className="hover:text-white transition-colors">
              {isNepali ? 'सुरक्षा ग्यारेन्टी' : 'Safety Guarantee'}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header ── */}
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl transition-all duration-200 border-b ${
          scrolled ? 'border-slate-200 shadow-md shadow-[#331e6a]/5' : 'border-slate-200/80 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* ── Left: Brand Official Logo ── */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Image
                src="/logo.png"
                alt="Sewanexa - Any Service. Near You."
                width={160}
                height={50}
                priority
                className="h-10 sm:h-11 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </Link>

            {/* GPS Proximity Location Pill */}
            <button
              type="button"
              onClick={detectLocation}
              title="Click to detect your current GPS location in Nepal"
              className="hidden xl:flex items-center gap-2 bg-[#f6f4fb] hover:bg-[#ede8f7] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#331e6a] transition-all border border-[#ded4f1] shadow-xs group"
            >
              <MapPin
                className={`w-3.5 h-3.5 text-[#331e6a] group-hover:scale-110 transition-transform ${
                  locating ? 'animate-bounce' : ''
                }`}
              />
              <span className="max-w-[140px] truncate">{locating ? t('nav.locating') : userLocation}</span>
              <span className="text-[10px] bg-[#331e6a] text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                <Compass className="w-2.5 h-2.5" /> GPS
              </span>
            </button>
          </div>

          {/* ── Center / Desktop Navigation Links ── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/services"
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#331e6a] hover:bg-[#f6f4fb] transition-all"
              >
                <span>{t('nav.allServices')}</span>
                <span className="text-[10px] bg-[#ede8f7] text-[#331e6a] font-black px-1.5 py-0.5 rounded-md">
                  ४५+
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              {/* Mega-menu preview */}
              {servicesDropdownOpen && (
                <div className="absolute left-0 mt-1 w-80 bg-white rounded-3xl p-4 border border-slate-200 shadow-2xl shadow-[#331e6a]/15 z-50 animate-scale-in">
                  <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-2 mb-2">
                    {isNepali ? 'लोकप्रिय सेवाहरू' : 'Popular On-Demand Services'}
                  </div>
                  <div className="space-y-1">
                    {QUICK_SERVICES.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.name}
                          href={s.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f6f4fb] group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#f6f4fb] group-hover:bg-[#331e6a] text-[#331e6a] group-hover:text-white flex items-center justify-center transition-colors">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#331e6a] transition-colors">
                              {s.name}
                            </span>
                          </div>
                          {s.tag && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#fef3c7] text-[#d97706]">
                              {s.tag}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <Link
                      href="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="text-xs font-black text-[#331e6a] hover:underline flex items-center justify-between px-2"
                    >
                      <span>{isNepali ? 'सबै ४५+ सेवाहरू हेर्नुहोस्' : 'Explore All 45+ Services'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/safety"
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#331e6a] hover:bg-[#f6f4fb] transition-all"
            >
              {isNepali ? 'सुरक्षा र भरोसा' : 'Safety & Trust'}
            </Link>

            {user && (
              <Link
                href="/bookings"
                className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-[#331e6a] hover:bg-[#f6f4fb] transition-all flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-[#331e6a]" />
                <span>{t('nav.myBookings')}</span>
              </Link>
            )}
          </nav>

          {/* ── Right: Partner CTA, Language Switcher & User Button ── */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Become a Partner CTA */}
            {!isProvider ? (
              <Link
                href="/provider/register"
                className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#ded4f1] hover:border-[#331e6a] bg-white hover:bg-[#f6f4fb] text-[#331e6a] text-xs font-bold transition-all shadow-xs group"
              >
                <div className="w-5 h-5 rounded-full bg-[#fef3c7] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d97706]" />
                </div>
                <span>{isNepali ? 'पार्टनर बन्नुहोस्' : 'Become a Partner'}</span>
              </Link>
            ) : (
              <Link
                href="/provider/dashboard"
                className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#331e6a] hover:bg-[#25154f] text-white text-xs font-bold shadow-xs transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Provider Hub</span>
              </Link>
            )}

            {/* Language Segmented Pill Switcher */}
            <div className="flex items-center bg-[#f6f4fb] p-0.5 rounded-xl border border-[#ded4f1]">
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  isNepali ? 'bg-[#331e6a] text-white shadow-xs' : 'text-slate-600 hover:text-[#331e6a]'
                }`}
                title="नेपाली भाषा"
              >
                नेपाली
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  !isNepali ? 'bg-[#331e6a] text-white shadow-xs' : 'text-slate-600 hover:text-[#331e6a]'
                }`}
                title="English Language"
              >
                EN
              </button>
            </div>

            {/* Auth / Account Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-xs font-bold pl-1.5 pr-2.5 py-1.5 rounded-2xl bg-[#f6f4fb] hover:bg-[#ede8f7] text-[#331e6a] transition-all border border-[#ded4f1]"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#331e6a] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline-block text-slate-800">
                    {user.name || user.phoneNumber || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-[#331e6a]/15 py-2 z-50 text-xs animate-scale-in">
                    <div className="px-4 py-3 border-b border-slate-100 bg-[#f6f4fb]/70">
                      <p className="font-extrabold text-[#331e6a] truncate">{user.name || 'User'}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                        {user.phoneNumber ? `+977 ${user.phoneNumber}` : user.email || 'Verified Account'}
                      </p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#f6f4fb] hover:text-[#331e6a] transition-colors font-semibold"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#f6f4fb] hover:text-[#331e6a] transition-colors font-semibold"
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        <span>My Bookings</span>
                      </Link>
                      {isProvider && (
                        <Link
                          href="/provider/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[#331e6a] hover:bg-[#ede8f7] transition-colors font-bold"
                        >
                          <Briefcase className="w-4 h-4 text-[#f59e0b]" />
                          <span>Provider Control Hub</span>
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'superadmin') && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[#331e6a] hover:bg-[#ede8f7] transition-colors font-bold"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#331e6a]" />
                          <span>Admin Console</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          if (pathname?.startsWith('/admin') || pathname?.startsWith('/provider')) {
                            router.replace('/login');
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-[#331e6a] hover:bg-[#25154f] text-white text-xs font-black shadow-md shadow-[#331e6a]/25 border border-[#48298a] transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>{isNepali ? 'लगइन' : 'Login'}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-[#f6f4fb] lg:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-5 space-y-4 shadow-xl animate-scale-in">
            {/* GPS Location in Mobile Menu */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                onClick={detectLocation}
                className="flex items-center gap-2 text-xs font-bold text-[#331e6a]"
              >
                <MapPin className="w-4 h-4 text-[#331e6a]" />
                <span className="truncate">{locating ? t('nav.locating') : userLocation}</span>
              </button>
              <span className="text-[10px] bg-[#331e6a] text-white px-2 py-0.5 rounded-full font-bold">
                GPS
              </span>
            </div>

            {/* Navigation links */}
            <div className="space-y-1">
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#f6f4fb] hover:text-[#331e6a]"
              >
                {t('nav.allServices')} (४५+)
              </Link>
              <Link
                href="/safety"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#f6f4fb] hover:text-[#331e6a]"
              >
                {isNepali ? 'सुरक्षा र भरोसा' : 'Safety & Trust'}
              </Link>
              {user && (
                <>
                  <Link
                    href="/bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#f6f4fb] hover:text-[#331e6a]"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-[#f6f4fb] hover:text-[#331e6a]"
                  >
                    My Profile
                  </Link>
                </>
              )}
            </div>

            {/* Partner CTA in Mobile Menu */}
            <div className="pt-2 border-t border-slate-100">
              {!isProvider ? (
                <Link
                  href="/provider/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#f6f4fb] border border-[#ded4f1] text-[#331e6a] text-xs font-extrabold"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                    <span>सेवा प्रदायक बन्नुहोस् (Earn Daily)</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href="/provider/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#331e6a] text-white text-xs font-extrabold"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#f59e0b]" />
                    <span>Provider Control Hub</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Emergency Hotline */}
            <div className="pt-2">
              <a
                href="tel:015901234"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                <Phone className="w-3.5 h-3.5 text-[#331e6a]" />
                <span>
                  {isNepali
                    ? 'हेल्पलाइन: ०१-५९०१२३४ (२४/७)'
                    : '24/7 Helpline: 01-5901234'}
                </span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
