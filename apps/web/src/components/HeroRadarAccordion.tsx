'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Navigation,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface RadarProvider {
  id: string;
  category: string;
  categoryNe: string;
  name: string;
  nameNe: string;
  trade: string;
  tradeNe: string;
  icon: string;
  distance: string;
  distanceNe: string;
  time: string;
  timeNe: string;
  baseRate: string;
  baseRateNe: string;
  rating: number;
  reviews: number;
  area: string;
  areaNe: string;
  specialties: string;
  specialtiesNe: string;
  badgeNe: string;
  badgeEn: string;
  badgeColor: string;
  mapCoords: { top: string; left: string };
}

const RADAR_PROVIDERS: RadarProvider[] = [
  {
    id: 'pro-1',
    category: 'Plumber',
    categoryNe: 'प्लम्बिङ',
    name: 'Ramesh Sharma',
    nameNe: 'रमेश शर्मा',
    trade: 'Master Plumber',
    tradeNe: 'मास्टर प्लम्बर',
    icon: '🔧',
    distance: '0.4 km',
    distanceNe: '०.४ कि.मि.',
    time: '5 mins',
    timeNe: '५ मिनेटमा',
    baseRate: 'From NPR 500',
    baseRateNe: 'रु ५०० बाट सुरु',
    rating: 4.9,
    reviews: 38,
    area: 'Lokanthali Chowk, Madhyapur Thimi',
    areaNe: 'लोकन्थली चोक, मध्यपुर थिमी-१',
    specialties: 'Pipe leakage, sanitary fitting, overhead water tank repair',
    specialtiesNe: 'पाइप लिकेज, धारा जडान, ओभरहेड पानी ट्याङ्की मर्मत',
    badgeNe: 'नागरिकता प्रमाणित',
    badgeEn: 'ID Verified',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    mapCoords: { top: '34%', left: '28%' },
  },
  {
    id: 'pro-2',
    category: 'Bike Mechanic',
    categoryNe: 'बाइक मेकानिक',
    name: 'Bikash Tamang',
    nameNe: 'विकास तामाङ',
    trade: 'Mobile 24/7 Mechanic',
    tradeNe: '२४/७ मोबाइल मेकानिक',
    icon: '🏍️',
    distance: '0.9 km',
    distanceNe: '०.९ कि.मि.',
    time: '8 mins',
    timeNe: '८ मिनेटमा',
    baseRate: 'From NPR 400',
    baseRateNe: 'रु ४०० बाट सुरु',
    rating: 4.8,
    reviews: 52,
    area: 'Koteshwor Chowk, Ring Road',
    areaNe: 'कोटेश्वर चोक, चक्रपथ',
    specialties: 'On-spot puncture repair, battery jump, engine breakdown & towing',
    specialtiesNe: 'अन-स्पट टायर पन्चर, ब्याट्री जम्प, इन्जिन सर्भिस, टोइङ',
    badgeNe: '२४/७ अन-कल',
    badgeEn: '24/7 On-Call',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    mapCoords: { top: '22%', left: '72%' },
  },
  {
    id: 'pro-3',
    category: 'Electrician',
    categoryNe: 'विद्युत मर्मत',
    name: 'Suman Karki',
    nameNe: 'सुमन कार्की',
    trade: 'Certified Electrician',
    tradeNe: 'दक्ष इलेक्ट्रिसियन',
    icon: '⚡',
    distance: '1.2 km',
    distanceNe: '१.२ कि.मि.',
    time: '10 mins',
    timeNe: '१० मिनेटमा',
    baseRate: 'From NPR 500',
    baseRateNe: 'रु ५०० बाट सुरु',
    rating: 4.9,
    reviews: 29,
    area: 'New Baneshwor, Kathmandu',
    areaNe: 'नयाँ बानेश्वर, काठमाडौँ',
    specialties: 'Short circuits, MCB replacement, geyser & inverter repairs',
    specialtiesNe: 'सर्ट सर्किट, एमसीबी चेन्ज, गिजर & इनभर्टर मर्मत',
    badgeNe: 'सर्ट सर्किट विशेषज्ञ',
    badgeEn: 'Circuit Expert',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    mapCoords: { top: '56%', left: '22%' },
  },
  {
    id: 'pro-4',
    category: 'Deep Cleaning',
    categoryNe: 'डीप क्लिनिङ',
    name: 'Sunita Maharjan',
    nameNe: 'सुनिता महर्जन',
    trade: 'Sanitation Lead',
    tradeNe: 'सरसफाइ विशेषज्ञ',
    icon: '🧹',
    distance: '1.8 km',
    distanceNe: '१.८ कि.मि.',
    time: '15 mins',
    timeNe: '१५ मिनेटमा',
    baseRate: 'From NPR 1,000',
    baseRateNe: 'रु १,००० बाट सुरु',
    rating: 5.0,
    reviews: 44,
    area: 'Patan Durbar Area, Lalitpur',
    areaNe: 'पाटन दरबार क्षेत्र, ललितपुर',
    specialties: 'Water tank deep clean, sofa & carpet shampoo, kitchen grease clean',
    specialtiesNe: 'पानी ट्याङ्की क्लिनिङ, सोफा & कार्पेट स्याम्पू, भान्छा डीप क्लिन',
    badgeNe: 'आधुनिक मेसिन सहित',
    badgeEn: 'Modern Equipment',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    mapCoords: { top: '54%', left: '76%' },
  },
];

const LOCATIONS = [
  { id: 'lokanthali', nameNe: 'लोकन्थली (हेडक्वार्टर)', nameEn: 'Lokanthali (HQ)', coords: '27.671°N, 85.358°E' },
  { id: 'koteshwor', nameNe: 'कोटेश्वर & बानेश्वर', nameEn: 'Koteshwor & Baneshwor', coords: '27.682°N, 85.345°E' },
  { id: 'patan', nameNe: 'पाटन & कुपण्डोल', nameEn: 'Patan & Kupondole', coords: '27.678°N, 85.319°E' },
  { id: 'thimi', nameNe: 'मध्यपुर थिमी & दरबार', nameEn: 'Thimi & Durbar', coords: '27.675°N, 85.378°E' },
];

export const HeroRadarAccordion = () => {
  const { isNepali } = useLanguage();
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [activeProId, setActiveProId] = useState<string>('pro-1');

  const activePro = RADAR_PROVIDERS.find((p) => p.id === activeProId) || RADAR_PROVIDERS[0];

  return (
    <div className="relative bg-gradient-to-br from-[#1b0f38] via-[#331e6a] to-[#201042] rounded-3xl p-5 sm:p-6 text-white shadow-2xl shadow-[#331e6a]/30 border border-[#5c38ab]/35 overflow-hidden space-y-4">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* ── 1. LOCATION SELECTED ON TOP BAR ── */}
      <div className="relative z-10 space-y-2.5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-[#f59e0b] shadow-sm">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-300">
                  {isNepali ? 'लाइभ सेवा रडार (Active Radar)' : 'Live Service Radar (Active)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isNepali ? 'काठमाडौँ उपत्यका • ५ कि.मि. प्रत्यक्ष कभरेज' : 'Kathmandu Valley • 5 km Real-Time Dispatch'}
              </p>
            </div>
          </div>

          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono font-bold shrink-0">
            {selectedLocation.coords}
          </span>
        </div>

        {/* Location Selector Quick Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
            {isNepali ? 'स्थान:' : 'Location:'}
          </span>
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLocation.id === loc.id
                  ? 'bg-white text-[#331e6a] shadow-md scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
              }`}
            >
              {isNepali ? loc.nameNe : loc.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. FULL IMMERSIVE RADAR MAP (STARTS DIRECTLY FROM MAP) ── */}
      <div className="relative z-10 h-[360px] sm:h-[390px] rounded-2xl overflow-hidden border border-white/20 bg-[#160d2d] shadow-2xl">
        {/* Map Canvas Background Elements */}
        <div className="absolute inset-0 bg-[#140b2a]">
          {/* Green Parks */}
          <div className="absolute top-4 left-4 w-32 h-24 bg-emerald-950/50 border border-emerald-500/20 rounded-2xl" />
          <div className="absolute bottom-16 right-6 w-36 h-24 bg-emerald-950/50 border border-emerald-500/20 rounded-2xl" />

          {/* River Stream */}
          <div className="absolute top-0 bottom-0 left-[46%] w-6 bg-sky-950/40 border-x border-sky-500/20 rotate-12 pointer-events-none" />

          {/* Highways & Roads */}
          <div className="absolute top-0 bottom-0 left-[52%] w-4 bg-white/10 -rotate-12 border-x border-white/10" />
          <div className="absolute top-[48%] left-0 right-0 h-4 bg-white/10 border-y border-white/10" />
          <div className="absolute -top-10 -bottom-10 left-[24%] w-2.5 bg-white/8 rotate-45" />
          <div className="absolute -top-10 -bottom-10 right-[28%] w-2.5 bg-white/8 -rotate-45" />

          {/* Center Radar Pulsing Ring over Selected Location */}
          <div className="absolute top-[48%] left-[52%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 rounded-full border border-[#f59e0b]/20 animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute w-36 h-36 rounded-full border border-emerald-400/25 animate-pulse" />
            <div className="absolute w-20 h-20 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/40 animate-pulse" />
            <div className="absolute w-10 h-10 rounded-full bg-[#331e6a] border-2 border-[#f59e0b] shadow-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#f59e0b]" />
            </div>
          </div>

          {/* Map Top Floating Active Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs z-30">
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#f59e0b]" />
              {isNepali ? selectedLocation.nameNe : selectedLocation.nameEn}
            </span>
            <span className="text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isNepali ? '४ प्राविधिक सक्रिय' : '4 Pros Live in Radius'}
            </span>
          </div>

          {/* 4 Interactive Live Provider Pins on the Map */}
          {RADAR_PROVIDERS.map((p) => {
            const isSelected = activeProId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProId(p.id)}
                style={{ top: p.mapCoords.top, left: p.mapCoords.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-2xl shadow-xl transition-all duration-300 z-20 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#f59e0b] text-slate-950 scale-115 ring-4 ring-[#f59e0b]/40 z-30'
                    : 'bg-slate-900/90 hover:bg-slate-900 text-white border border-white/20 scale-100 hover:scale-105'
                }`}
              >
                <span className="text-sm leading-none">{p.icon}</span>
                <span className="text-[10px] font-black hidden sm:inline whitespace-nowrap">
                  {isNepali ? p.tradeNe.split(' ')[0] : p.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </button>
            );
          })}

          {/* ── SELECTED PROVIDER FLOATING DETAIL CARD (OVERLAYED ON MAP) ── */}
          <div className="absolute bottom-3 left-3 right-3 bg-slate-950/92 backdrop-blur-xl rounded-2xl p-3.5 border border-white/20 shadow-2xl z-30 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#331e6a] border border-[#f59e0b]/50 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md">
                  {activePro.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-white truncate">
                      {isNepali ? activePro.nameNe : activePro.name}
                    </h4>
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border shrink-0 ${activePro.badgeColor}`}>
                      {isNepali ? activePro.badgeNe : activePro.badgeEn}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">
                    {isNepali ? activePro.tradeNe : activePro.trade} • {isNepali ? activePro.areaNe : activePro.area}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-black text-[#f59e0b] block">
                  {isNepali ? activePro.baseRateNe : activePro.baseRate}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold">
                  ⚡ {isNepali ? activePro.timeNe : activePro.time} {isNepali ? 'आगमन' : 'Arrival'}
                </span>
              </div>
            </div>

            {/* Quick Stats & Book Now Action */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {activePro.rating} ({activePro.reviews})
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-semibold text-slate-200">
                  📍 {isNepali ? activePro.distanceNe : activePro.distance}
                </span>
              </div>

              {user ? (
                <Link
                  href={`/book/${activePro.id}?category=${encodeURIComponent(activePro.category)}`}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-amber-500 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg transition-all hover:scale-[1.02]"
                >
                  <span>{isNepali ? 'तुरुन्त बुक गर्नुहोस्' : 'Book Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/book/${activePro.id}?category=${encodeURIComponent(activePro.category)}`)}`}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs shadow-md transition-all hover:scale-[1.02] border border-white/30"
                >
                  <Lock className="w-3 h-3 text-[#f59e0b]" />
                  <span>{isNepali ? 'लगइन गरी बुक' : 'Login to Book'}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. BOTTOM FOOTER BAR ── */}
      <div className="pt-1 flex items-center justify-between gap-2 text-xs relative z-10">
        <a
          href="tel:015901234"
          className="flex items-center gap-1.5 text-slate-200 hover:text-[#f59e0b] transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span className="font-bold">{isNepali ? 'हटलाइन: ०१-५९०१२३४' : 'Hotline: 01-5901234'}</span>
        </a>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold">
          <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10">Google Play</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-white/10 border border-white/10">App Store</span>
        </div>
      </div>
    </div>
  );
};
