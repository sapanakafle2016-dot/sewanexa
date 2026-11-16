'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HowItWorks from '@/components/HowItWorks';
import { FaqAccordion } from '@/components/FaqAccordion';
import { HeroRadarAccordion } from '@/components/HeroRadarAccordion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import {
  Wrench,
  Car,
  Bike,
  HardHat,
  Paintbrush,
  Fan,
  Truck,
  Package,
  Camera,
  Scissors,
  Droplets,
  Hammer,
  Heart,
  Cpu,
  MoreHorizontal,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  PhoneCall,
  Navigation,
  Smartphone,
  Shield,
  CreditCard,
  Compass,
  Lock,
  X,
  Loader2,
} from 'lucide-react';

const ICON_BY_KEY: Record<string, any> = {
  wrench: Wrench,
  car: Car,
  bike: Bike,
  'hard-hat': HardHat,
  paint: Paintbrush,
  paintbrush: Paintbrush,
  zap: Zap,
  fan: Fan,
  sparkles: Sparkles,
  hammer: Hammer,
  droplets: Droplets,
  truck: Truck,
  package: Package,
  camera: Camera,
  scissors: Scissors,
  heart: Heart,
  cpu: Cpu,
  shield: ShieldCheck,
  more: MoreHorizontal,
};

const CATEGORIES = [
  {
    name: 'Home Maintenance',
    slug: 'home-maintenance',
    icon: Wrench,
    badge: 'Popular',
    gradient: 'from-[#331e6a] via-[#5c38ab] to-[#7856c2]',
    lightBg: 'bg-[#f6f4fb] border-[#ded4f1] text-[#331e6a]',
    count: '10 services',
    startingPrice: 'रु ५०० बाट सुरु',
    description: 'Plumbing, Electricians, House Painting, AC, Water Tank & Carpentry',
    popularSub: ['Plumbing', 'Electrical', 'House Painting', 'AC Repair'],
  },
  {
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: Car,
    badge: '24/7 Roadside',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50/70 border-amber-200 text-amber-800',
    count: '8 services',
    startingPrice: 'रु ४०० बाट सुरु',
    description: 'Car & Bike Mechanics, Towing, Roadside Assistance & Tyre Repair',
    popularSub: ['Bike Mechanic', 'Car Repair', 'Tyre Puncture', 'Towing'],
  },
  {
    name: 'Construction & Labour',
    slug: 'construction-and-labour',
    icon: HardHat,
    badge: 'Contractors',
    gradient: 'from-rose-600 to-red-700',
    lightBg: 'bg-rose-50/70 border-rose-200 text-rose-800',
    count: '8 services',
    startingPrice: 'रु ८०० बाट सुरु',
    description: 'Masons, Tile & Marble, Welding, Aluminium, Glass & House Renovation',
    popularSub: ['Mason', 'Marble & Tile', 'Welding', 'Renovation'],
  },
  {
    name: 'Personal & Lifestyle',
    slug: 'personal-and-lifestyle',
    icon: Heart,
    badge: 'At Home',
    gradient: 'from-fuchsia-600 to-purple-600',
    lightBg: 'bg-purple-50/70 border-purple-200 text-purple-800',
    count: '7 services',
    startingPrice: 'रु ६०० बाट सुरु',
    description: 'Salon, Makeup, Photography, Event Decor, Home Tutors & Tailoring',
    popularSub: ['Beauty & Salon', 'Photography', 'Home Tutors', 'Tailoring'],
  },
  {
    name: 'Technical & IT',
    slug: 'professional-and-technical',
    icon: Cpu,
    badge: 'Certified',
    gradient: 'from-[#1e1b4b] to-[#331e6a]',
    lightBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-800',
    count: '8 services',
    startingPrice: 'रु ५०० बाट सुरु',
    description: 'Laptop & Mobile Repair, CCTV Installation, Networking & IT Support',
    popularSub: ['Laptop Repair', 'CCTV Setup', 'Mobile Repair', 'Networking'],
  },
  {
    name: 'Other On-Demand',
    slug: 'other-services',
    icon: MoreHorizontal,
    badge: 'Convenience',
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
    count: '7 services',
    startingPrice: 'रु ४०० बाट सुरु',
    description: 'Drivers, Movers & Packers, Laundry, Gardening, Pet Care & Office Helpers',
    popularSub: ['Movers & Packers', 'Drivers', 'House Cleaning', 'Gardening'],
  },
];

const CATEGORY_STYLE_MAP: Record<string, { gradient: string; lightBg: string; badge: string; icon: any }> = {
  'home-maintenance': {
    icon: Wrench,
    badge: 'Popular',
    gradient: 'from-[#331e6a] via-[#5c38ab] to-[#7856c2]',
    lightBg: 'bg-[#f6f4fb] border-[#ded4f1] text-[#331e6a]',
  },
  'vehicle-services': {
    icon: Car,
    badge: '24/7 Roadside',
    gradient: 'from-amber-500 to-orange-600',
    lightBg: 'bg-amber-50/70 border-amber-200 text-amber-800',
  },
  'construction-and-labour': {
    icon: HardHat,
    badge: 'Contractors',
    gradient: 'from-rose-600 to-red-700',
    lightBg: 'bg-rose-50/70 border-rose-200 text-rose-800',
  },
  'personal-and-lifestyle': {
    icon: Heart,
    badge: 'At Home',
    gradient: 'from-fuchsia-600 to-purple-600',
    lightBg: 'bg-purple-50/70 border-purple-200 text-purple-800',
  },
  'professional-and-technical': {
    icon: Cpu,
    badge: 'Certified',
    gradient: 'from-[#1e1b4b] to-[#331e6a]',
    lightBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-800',
  },
  'other-services': {
    icon: MoreHorizontal,
    badge: 'Convenience',
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-800',
  },
};

const POPULAR_SEARCH_CHIPS = [
  { label: 'Emergency Plumber', query: 'Plumber', icon: '⚡' },
  { label: 'Bike Breakdown', query: 'Bike Mechanic', icon: '🛵' },
  { label: 'Electrician', query: 'Electrician', icon: '💡' },
  { label: 'Deep House Cleaning', query: 'Cleaning', icon: '🧹' },
  { label: 'AC Service & Repair', query: 'AC', icon: '❄️' },
  { label: 'Movers & Packers', query: 'Movers', icon: '📦' },
];

const SAMPLE_HOMEPAGE_PROVIDERS = [
  {
    _id: 'pro_1',
    name: 'Ramesh Sharma',
    trade: 'Master Plumber & Pipe Specialist',
    skills: ['Plumbing', 'Pipe Fitting', 'Sanitary Repair', 'Water Tank Leak'],
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
    address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
    ratings: { average: 4.9, count: 48 },
    distanceInKm: 0.8,
    baseRate: 500,
    isOnline: true,
    categorySlug: 'home-maintenance',
  },
  {
    _id: 'pro_2',
    name: 'Bikash Tamang',
    trade: '24/7 Mobile Bike & Car Mechanic',
    skills: ['Bike Repair', 'Emergency Jumpstart', 'Tyre Puncture', 'Car Breakdown'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    address: { areaName: 'Koteshwor', city: 'Kathmandu' },
    ratings: { average: 4.8, count: 62 },
    distanceInKm: 1.4,
    baseRate: 400,
    isOnline: true,
    categorySlug: 'vehicle-services',
  },
  {
    _id: 'pro_3',
    name: 'Prakash Shrestha',
    trade: 'Certified Domestic Electrician',
    skills: ['House Wiring', 'Inverter Setup', 'MCB Box', 'Short Circuit Fix'],
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    address: { areaName: 'Thimi', city: 'Bhaktapur' },
    ratings: { average: 4.9, count: 35 },
    distanceInKm: 1.9,
    baseRate: 600,
    isOnline: true,
    categorySlug: 'home-maintenance',
  },
  {
    _id: 'pro_4',
    name: 'Sunita Gurung',
    trade: 'Professional Salon & Makeup Artist',
    skills: ['Facial', 'Hair Styling', 'Bridal Makeup', 'Waxing & Pedicure'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    address: { areaName: 'Kaushaltar', city: 'Bhaktapur' },
    ratings: { average: 5.0, count: 29 },
    distanceInKm: 1.1,
    baseRate: 700,
    isOnline: true,
    categorySlug: 'personal-and-lifestyle',
  },
  {
    _id: 'pro_5',
    name: 'Dinesh Maharjan',
    trade: 'Civil Contractor & Masonry Expert',
    skills: ['Tile & Marble Fitting', 'Wall Plaster', 'Waterproofing', 'Brick Work'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    address: { areaName: 'Balkumari', city: 'Lalitpur' },
    ratings: { average: 4.7, count: 41 },
    distanceInKm: 2.3,
    baseRate: 1000,
    isOnline: true,
    categorySlug: 'construction-and-labour',
  },
  {
    _id: 'pro_6',
    name: 'Amrit KC',
    trade: 'CCTV & Laptop Repair Technician',
    skills: ['CCTV Camera Setup', 'Laptop Formatting', 'WiFi Mesh', 'Screen Replace'],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    address: { areaName: 'Baneshwor', city: 'Kathmandu' },
    ratings: { average: 4.8, count: 26 },
    distanceInKm: 2.8,
    baseRate: 600,
    isOnline: true,
    categorySlug: 'professional-and-technical',
  },
];

export default function HomePage() {
  const { t, isNepali } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [categoriesList, setCategoriesList] = useState(CATEGORIES);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [userLocation, setUserLocation] = useState('Lokanthali, Bhaktapur');
  const [isLocating, setIsLocating] = useState(false);
  const [activeBookingTab, setActiveBookingTab] = useState<'instant' | 'schedule' | 'emergency'>('instant');

  // Search & Provider Reveal State (Mirroring Mobile Logic)
  const [hasSearched, setHasSearched] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [activeFilterLabel, setActiveFilterLabel] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalRedirect, setLoginModalRedirect] = useState('/services');

  // Dynamically fetch active categories from the backend API
  useEffect(() => {
    let isMounted = true;
    const fetchDynamicCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const res = await apiFetch('/categories', { requiresAuth: false });
        if (isMounted && res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((cat: any) => {
            const style = CATEGORY_STYLE_MAP[cat.slug] || {
              icon: Wrench,
              badge: cat.commissionPercentage ? `${cat.commissionPercentage}% Rate` : 'Verified',
              gradient: 'from-[#331e6a] via-[#5c38ab] to-[#7856c2]',
              lightBg: 'bg-[#f6f4fb] border-[#ded4f1] text-[#331e6a]',
            };

            const subList: any[] = Array.isArray(cat.subcategories) ? cat.subcategories : [];
            const subNames = subList.map((s: any) => (typeof s === 'string' ? s : s.name));
            
            // Find lowest basePrice if present
            let lowest = 500;
            if (subList.length > 0) {
              const prices = subList
                .map((s: any) => (typeof s === 'object' && s.suggestedBasePrice ? Number(s.suggestedBasePrice) : 0))
                .filter((p: number) => p > 0);
              if (prices.length > 0) lowest = Math.min(...prices);
            }

            return {
              name: cat.name,
              slug: cat.slug,
              icon: (cat.icon && ICON_BY_KEY[cat.icon]) || style.icon,
              badge: style.badge,
              gradient: style.gradient,
              lightBg: style.lightBg,
              count: `${subNames.length || 6} ${isNepali ? 'सेवाहरू' : 'services'}`,
              startingPrice: isNepali ? `रु ${lowest} बाट सुरु` : `From Rs ${lowest}`,
              description: cat.description || '',
              popularSub: subNames.slice(0, 4),
            };
          });
          setCategoriesList(mapped);
        }
      } catch (err) {
        // Silently preserve preloaded default CATEGORIES if offline or errored
        console.warn('API /categories fetch fallback:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    };

    fetchDynamicCategories();
    return () => {
      isMounted = false;
    };
  }, [isNepali]);

  const getCatTitle = (cat: any) => {
    if (!isNepali) return cat.name;
    switch (cat.slug) {
      case 'home-maintenance':
        return t('cat.home');
      case 'vehicle-services':
        return t('cat.auto');
      case 'construction-and-labour':
        return t('cat.construction');
      case 'personal-and-lifestyle':
        return t('cat.personal');
      case 'professional-and-technical':
        return t('cat.gadgets');
      case 'other-services':
        return t('cat.support');
      default:
        return cat.name;
    }
  };

  const getCatDesc = (cat: any) => {
    if (!isNepali) return cat.description;
    switch (cat.slug) {
      case 'home-maintenance':
        return t('cat.homeDesc');
      case 'vehicle-services':
        return t('cat.autoDesc');
      case 'construction-and-labour':
        return t('cat.constructionDesc');
      case 'personal-and-lifestyle':
        return t('cat.personalDesc');
      case 'professional-and-technical':
        return t('cat.gadgetsDesc');
      case 'other-services':
        return t('cat.supportDesc');
      default:
        return cat.description;
    }
  };

  const searchChips = isNepali
    ? [
        { label: 'प्लम्बिङ', query: 'Plumbing', icon: '🔧' },
        { label: 'बाइक मेकानिक', query: 'Bike', icon: '🏍️' },
        { label: 'विद्युत मर्मत', query: 'Electrical', icon: '⚡' },
        { label: 'एसी मर्मत', query: 'AC', icon: '❄️' },
        { label: 'डकर्मी', query: 'Mason', icon: '🧱' },
        { label: 'रङरोगन', query: 'Paint', icon: '🎨' },
        { label: 'घर सरसफाइ', query: 'Cleaning', icon: '✨' },
      ]
    : POPULAR_SEARCH_CHIPS;

  const detectLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setUserLocation(`${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`);
        },
        () => {
          setIsLocating(false);
          setUserLocation('Lokanthali, Bhaktapur');
        },
        { timeout: 7000 }
      );
    }
  };

  const fetchNearbyProviders = async (query?: string, radiusKm?: number) => {
    setLoadingProviders(true);
    const r = radiusKm !== undefined ? radiusKm : selectedRadius;
    const qLower = (query || '').toLowerCase().trim();
    try {
      const res = await apiFetch(
        `/providers/nearby?longitude=85.3582&latitude=27.6715&radiusKm=${r}${query ? `&searchQuery=${encodeURIComponent(query)}` : ''}`,
        { requiresAuth: false }
      );
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const matched = qLower
          ? res.data.filter((p: any) =>
              p.name?.toLowerCase().includes(qLower) ||
              p.trade?.toLowerCase().includes(qLower) ||
              p.businessName?.toLowerCase().includes(qLower) ||
              p.bio?.toLowerCase().includes(qLower) ||
              (Array.isArray(p.skills) && p.skills.some((s: string) => s.toLowerCase().includes(qLower)))
            )
          : res.data;
        setProviders(matched);
      } else {
        const filtered = SAMPLE_HOMEPAGE_PROVIDERS.filter((p) => {
          if (!qLower) return true;
          return (
            p.name.toLowerCase().includes(qLower) ||
            p.trade.toLowerCase().includes(qLower) ||
            p.categorySlug.toLowerCase().includes(qLower) ||
            p.skills.some((s) => s.toLowerCase().includes(qLower))
          );
        });
        setProviders(qLower ? filtered : SAMPLE_HOMEPAGE_PROVIDERS);
      }
    } catch (err) {
      if (qLower) {
        const filtered = SAMPLE_HOMEPAGE_PROVIDERS.filter((p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.trade.toLowerCase().includes(qLower) ||
          p.categorySlug.toLowerCase().includes(qLower) ||
          p.skills.some((s) => s.toLowerCase().includes(qLower))
        );
        setProviders(filtered);
      } else {
        setProviders(SAMPLE_HOMEPAGE_PROVIDERS);
      }
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleTriggerSearch = (term?: string, label?: string, redirectPath?: string) => {
    if (!user) {
      setLoginModalRedirect(redirectPath || (term ? `/services?q=${encodeURIComponent(term)}` : '/services'));
      setShowLoginModal(true);
      return;
    }

    setShowLoginModal(false);
    setHasSearched(true);
    const q = term !== undefined ? term : searchQuery;
    setActiveFilterLabel(label || (q ? `"${q}"` : isNepali ? 'सबै उपलब्ध सेवाहरू' : 'All Available Services'));
    fetchNearbyProviders(q, selectedRadius);

    setTimeout(() => {
      const el = document.getElementById('provider-nearby-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setActiveFilterLabel('');
    setSearchQuery('');
    setProviders([]);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-24 mesh-bg">
      {/* ─────────────────────────────────────────────────────────────
          1. Hero Section - Asymmetric Modern Split Layout
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* ── Left Column: Value Proposition & Dynamic Booking Widget (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Slogan Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f6f4fb] border border-[#ded4f1] text-[#331e6a] text-xs font-black shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
                <span>🇳🇵 एप एक, सेवा अनेक। • Any Service. Near You.</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
                {isNepali ? (
                  <>
                    नेपालको भरपर्दो अन-डिमान्ड सेवा बजार,{' '}
                    <span className="text-gradient block mt-1">घर-दैलोमै दक्ष प्राविधिक उपस्थित।</span>
                  </>
                ) : (
                  <>
                    {t('hero.titleLine1')}{' '}
                    <span className="text-gradient block mt-1">{t('hero.titleLine2')}</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                {isNepali
                  ? 'काठमाडौँ उपत्यका, लोकन्थली तथा नेपालभरका प्रमाणित प्लम्बर, मेकानिक, इलेक्ट्रिसियन र दक्ष कामदारहरू १५ मिनेटमै तपाईंको ढोकामा। ईसेवा र खल्तीबाट सुरक्षित भुक्तानी।'
                  : t('hero.subtitle')}
              </p>

              {/* ── Modern Booking & Search Card with Service Mode Tabs ── */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xl shadow-[#331e6a]/10 space-y-4">
                {/* Guest Login Indicator Ribbon */}
                {!user && (
                  <div className="flex items-center justify-between px-3 py-2 bg-amber-50/90 border border-amber-200/80 rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{isNepali ? 'सेवा प्रदायक खोजी र बुकिङका लागि लगइन गर्नुहोस्' : 'Sign in to unlock nearby provider search & booking'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="px-2.5 py-1 bg-[#331e6a] text-white font-extrabold text-[11px] rounded-xl hover:bg-[#25154f] transition-colors shrink-0"
                    >
                      {isNepali ? 'लगइन' : 'Login'}
                    </button>
                  </div>
                )}

                {/* Mode Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-[#f6f4fb] rounded-2xl border border-[#ded4f1]/60">
                  <button
                    type="button"
                    onClick={() => setActiveBookingTab('instant')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      activeBookingTab === 'instant'
                        ? 'bg-[#331e6a] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#331e6a]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>{isNepali ? '⚡ तत्काल सेवा (15m)' : 'Instant 15m'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBookingTab('schedule')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      activeBookingTab === 'schedule'
                        ? 'bg-[#331e6a] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#331e6a]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isNepali ? '📅 पूर्व-तालिका' : 'Schedule'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveBookingTab('emergency')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                      activeBookingTab === 'emergency'
                        ? 'bg-[#dc2626] text-white shadow-xs'
                        : 'text-slate-600 hover:text-red-600'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{isNepali ? '🚨 आकस्मिक २४/७' : '24/7 Roadside'}</span>
                  </button>
                </div>

                {/* Input Fields Row */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  {/* Service Query Input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleTriggerSearch(searchQuery);
                        }
                      }}
                      placeholder={
                        isNepali
                          ? 'कुन सेवा चाहिन्छ? (प्लम्बर, मेकानिक, एसी...)'
                          : 'What service do you need? (Plumber, Mechanic...)'
                      }
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#331e6a] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Location Picker */}
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="flex items-center justify-center gap-2 px-3.5 py-3 bg-[#f6f4fb] hover:bg-[#ede8f7] border border-[#ded4f1] rounded-2xl text-xs font-bold text-[#331e6a] transition-all shrink-0"
                    title="Detect GPS Location"
                  >
                    <MapPin className={`w-3.5 h-3.5 text-[#331e6a] ${isLocating ? 'animate-bounce' : ''}`} />
                    <span className="max-w-[130px] truncate">
                      {isLocating ? t('nav.locating') : userLocation}
                    </span>
                  </button>

                  {/* Submit Search CTA */}
                  <button
                    type="button"
                    onClick={() => handleTriggerSearch(searchQuery)}
                    className="px-5 py-3 bg-[#331e6a] hover:bg-[#25154f] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2 shrink-0 border border-[#48298a]"
                  >
                    {!user && <Lock className="w-3.5 h-3.5 text-[#f59e0b]" />}
                    <span>{isNepali ? 'सेवा खोज्नुहोस्' : 'Find Pros'}</span>
                    <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                  </button>
                </div>

                {/* Radius Filter Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
                    <SlidersHorizontal className="w-3 h-3 text-[#331e6a]" />
                    <span>{isNepali ? 'दूरी दायरा (Radius)' : 'Radius'}:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 5, 10, 20].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSelectedRadius(r);
                          if (hasSearched && user) fetchNearbyProviders(searchQuery, r);
                        }}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                          selectedRadius === r
                            ? 'bg-[#331e6a] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {r} {t('hero.km')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Service Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-bold">
                    {isNepali ? 'लोकप्रिय:' : 'Quick:'}
                  </span>
                  {searchChips.slice(0, 6).map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => {
                        setSearchQuery(chip.query);
                        handleTriggerSearch(chip.query, chip.label);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-[#f6f4fb] text-slate-700 hover:text-[#331e6a] text-[11px] font-semibold border border-slate-200/80 hover:border-[#331e6a]/30 transition-all"
                    >
                      <span>{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Key Trust Badges Strip ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
                  <span className="font-bold text-[11px]">१००% नागरिकता प्रमाणित</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-[#f59e0b] shrink-0" />
                  <span className="font-bold text-[11px]">१५ मिनेटमा आगमन</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CreditCard className="w-4 h-4 text-[#331e6a] shrink-0" />
                  <span className="font-bold text-[11px]">eSewa & Khalti एस्क्रो</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                  <span className="font-bold text-[11px]">४.९ ★ (१,२००+ काम)</span>
                </div>
              </div>
            </div>

            {/* ── Right Column: Interactive Live Neighborhood Radar & List Accordion (5 Cols) ── */}
            <div className="lg:col-span-5 relative">
              <HeroRadarAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          1.5. Dedicated Provider Near By Section (Revealed on Search & Logged-In)
      ───────────────────────────────────────────────────────────── */}
      {hasSearched && user && (
        <section
          id="provider-nearby-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 scroll-mt-24"
        >
          <div className="bg-gradient-to-br from-white to-[#fbf9fe] rounded-3xl p-6 sm:p-8 border-2 border-[#ede8f7] shadow-xl shadow-[#331e6a]/5 space-y-6">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ede8f7] flex items-center justify-center text-[#331e6a] shadow-inner">
                  <MapPin className="w-5 h-5 text-[#331e6a]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {isNepali ? 'नजिकैका सेवा प्रदायकहरू' : 'Provider Near By'}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#331e6a] text-white text-xs font-black">
                      {providers.length} {isNepali ? 'भेटिए' : 'Found'}
                    </span>
                  </div>
                  {activeFilterLabel && (
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {isNepali ? 'खोजी परिणाम:' : 'Showing results for:'}{' '}
                      <strong className="text-[#331e6a] font-black">{activeFilterLabel}</strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Distance Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                  {[1, 2, 5, 10, 20].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRadius(r);
                        fetchNearbyProviders(searchQuery, r);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedRadius === r
                          ? 'bg-[#331e6a] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>{isNepali ? 'बन्द गर्नुहोस्' : 'Clear'}</span>
                </button>
              </div>
            </div>

            {/* Providers Grid */}
            {loadingProviders ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[#331e6a] mb-2" />
                <p className="text-sm font-semibold">{isNepali ? 'प्रदायकहरू खोज्दै...' : 'Finding verified providers...'}</p>
              </div>
            ) : providers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {providers.map((p) => (
                  <div
                    key={p._id || p.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-[#331e6a]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={p.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-black text-slate-900 text-sm truncate">{p.name}</h3>
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                          </div>
                          <p className="text-xs font-bold text-[#331e6a] truncate">{p.trade || p.skills?.[0]}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            📍 {p.address?.areaName || 'Lokanthali'}, {p.address?.city || 'Valley'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-bold border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          {p.ratings?.average || 4.9} ({p.ratings?.count || 24})
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-semibold text-[11px]">
                          {p.distanceInKm || 1.1} km away
                        </span>
                      </div>

                      {p.bio && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {p.bio}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {isNepali ? 'सुरुवाती शुल्क' : 'Starting From'}
                        </span>
                        <span className="text-base font-black text-slate-900">
                          रु. {p.baseRate || 500}
                        </span>
                      </div>

                      <Link
                        href={`/book/${p._id || p.id}?trade=${encodeURIComponent(p.trade || p.skills?.[0] || 'service')}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#331e6a] hover:bg-[#24154b] text-white text-xs font-black shadow-md shadow-[#331e6a]/20 hover:scale-[1.02] transition-all"
                      >
                        <span>{isNepali ? 'अहिले बुक गर्नुहोस्' : 'Book Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 text-center border border-dashed border-slate-200">
                <div className="w-14 h-14 rounded-full bg-[#ede8f7] text-[#331e6a] flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {isNepali ? 'कुनै प्रदायक फेला परेन' : 'No Providers Found'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                  {isNepali
                    ? `"${activeFilterLabel}" सँग मिल्ने कुनै प्रदायक हाल ${selectedRadius} किमी दायरामा उपलब्ध छैन। कृपया दूरी बढाउनुहोस् वा अन्य सेवा खोज्नुहोस्।`
                    : `No verified professionals found matching "${activeFilterLabel}" within ${selectedRadius} km. Try increasing the search radius or resetting search.`}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedRadius(20);
                      fetchNearbyProviders(searchQuery, 20);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#331e6a] text-white text-xs font-bold hover:bg-[#24154b] transition-all shadow-sm"
                  >
                    {isNepali ? 'दूरी २० किमी बनाउनुहोस्' : 'Search 20 km Radius'}
                  </button>
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    {isNepali ? 'खोजी रिसेट गर्नुहोस्' : 'Reset Search'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Category Bento-Grid (Modern Visual Directory)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#331e6a] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>{t('category.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t('category.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('category.subtitle')}
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#331e6a] hover:text-[#25154f] bg-[#f6f4fb] hover:bg-[#ede8f7] border border-[#ded4f1] px-4 py-2 rounded-xl transition-all self-start md:self-auto shadow-xs"
          >
            <span>{t('category.viewAll')}</span>
            <ChevronRight className="w-4 h-4 text-[#f59e0b]" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat, idx) => {
            const Icon = cat.icon;
            const isFeatured = idx === 0;

            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className={`group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#331e6a]/40 card-hover flex flex-col justify-between shadow-xs ${
                  isFeatured ? 'md:col-span-2 lg:col-span-1 bg-gradient-to-b from-white to-[#f6f4fb]/50' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-lg shadow-[#331e6a]/15 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${cat.lightBg}`}>
                        {cat.count}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-400 mt-1">
                        {cat.startingPrice}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-[#331e6a] transition-colors">
                    {getCatTitle(cat)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {getCatDesc(cat)}
                  </p>

                  {/* Popular Sub-services Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {cat.popularSub.map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg group-hover:bg-[#f6f4fb] group-hover:text-[#331e6a] transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#331e6a]">
                  <span>{t('category.browsePros')}</span>
                  <ArrowRight className="w-4 h-4 text-[#f59e0b] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      

      {/* ─────────────────────────────────────────────────────────────
          4. 4 Pillars of Trust & Safety
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#331e6a] bg-[#f6f4fb] px-3 py-1 rounded-full border border-[#ded4f1]">
            {isNepali ? 'किन Sewanexa?' : 'Why Sewanexa?'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isNepali
              ? 'तपाईंको घर, परिवार र सवारीको भरपर्दो सुरक्षा'
              : 'Trusted Protection for Your Home, Family & Vehicle'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isNepali
              ? 'हाम्रो प्लेटफर्ममा दर्ता हुने प्रत्येक प्राविधिक कडा मापदण्डबाट प्रमाणित हुन्छन्।'
              : 'Every professional registered on our platform is thoroughly vetted against rigorous standards.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {isNepali ? '१००% नागरिकता प्रमाणित' : '100% ID & Background Vetted'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isNepali
                ? 'प्रत्येक पेशाकर्मीको सरकारी नेपाली नागरिकता, पुलिस रेकर्ड र व्यवसाय दर्ता रुजु गरिएको हुन्छ।'
                : 'Every professional’s government citizenship, police record, and business registration are physically verified.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black border border-amber-200">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {isNepali ? '१५ मिनेट द्रुत आगमन' : '15-Minute Rapid Arrival'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isNepali
                ? 'तपाईंकै स्थानीय वडा वा टोल नजिकैका सक्रिय प्राविधिक तत्काल बाइकबाट तपाईंको ढोकामा आइपुग्छन्।'
                : 'Active nearby technicians in your local ward or neighborhood dispatch promptly to your doorstep.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f6f4fb] text-[#331e6a] flex items-center justify-center font-black border border-[#ded4f1]">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {isNepali ? 'सुरक्षित एस्क्रो भुक्तानी' : 'Secure Escrow Payments'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isNepali
                ? 'ईसेवा र खल्तीबाट गरिएको भुक्तानी काम पूर्ण सम्पन्न र ग्राहकले अनुमोदन गरेपछि मात्र फुकुवा हुन्छ।'
                : 'Funds paid via eSewa or Khalti are securely held and only released after your physical inspection.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black border border-blue-200">
              <Star className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {isNepali ? 'पारदर्शी दर, मोलतोल शून्य' : 'Standard Rates, Zero Haggling'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isNepali
                ? 'काम सुरु हुनुभन्दा अगावै निश्चित दररेट तय हुन्छ। कुनै लुकेको वा अतिरिक्त शुल्क लाग्दैन।'
                : 'Clear, upfront pricing agreed upon before work begins. No hidden costs or surprise fees.'}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. Animated Interactive How It Works Section
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </div>

      
      {/* ─────────────────────────────────────────────────────────────
          7. Interactive FAQ & Service Rules Accordion
      ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqAccordion />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          8. Provider Partner Recruitment Banner
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#331e6a] via-[#48298a] to-[#25154f] rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-[#331e6a]/30 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#5c38ab]/30">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
              <span>{t('partner.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('partner.title')}
            </h2>
            <p className="text-[#ded4f1] text-sm leading-relaxed">
              {t('partner.desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/provider/register"
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-white text-[#331e6a] hover:bg-[#f6f4fb] font-black text-sm rounded-2xl shadow-lg transition-all"
            >
              {t('partner.registerBtn')}
            </Link>
            <Link
              href="/provider/how-it-works"
              className="w-full sm:w-auto text-center px-6 py-3.5 bg-[#48298a]/80 hover:bg-[#48298a] text-white font-bold text-sm rounded-2xl border border-white/20 transition-all"
            >
              {t('partner.howItWorksBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Login Required Modal for Guests ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-4">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-[#ede8f7] text-[#331e6a] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-[#331e6a]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {isNepali ? 'लगइन आवश्यक छ' : 'Login Required'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                {isNepali
                  ? 'नजिकैका सेवा प्रदायकहरू हेर्न र तुरुन्त सेवा बुक गर्न कृपया आफ्नो मोबाइल नम्बरबाट लगइन गर्नुहोस्।'
                  : 'Please sign in with your mobile number to search nearby verified providers and book on-demand services.'}
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <Link
                href={`/login?redirect=${encodeURIComponent(loginModalRedirect)}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#331e6a] to-[#24154b] hover:from-[#24154b] hover:to-[#1b0f38] text-white font-black text-sm shadow-lg shadow-[#331e6a]/25 transition-all hover:scale-[1.01]"
              >
                <span>{isNepali ? 'लगइन / दर्ता गर्नुहोस्' : 'Login / Register with OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                {isNepali ? 'अहिले होइन (Cancel)' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
