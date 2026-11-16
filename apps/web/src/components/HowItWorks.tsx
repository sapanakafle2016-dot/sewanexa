'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Briefcase,
  Smartphone,
  Star,
  Compass,
  DollarSign,
  PhoneCall,
} from 'lucide-react';

interface Step {
  step: number;
  title: string;
  tagline: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
  preview: {
    title: string;
    subtitle: string;
    badgeText: string;
    accentColor: string;
    visualType: 'radar' | 'match' | 'dispatch' | 'payment';
  };
}

const CUSTOMER_STEPS: Step[] = [
  {
    step: 1,
    title: 'Choose Service & Proximity',
    tagline: 'GPS-Powered Neighborhood Discovery',
    desc: 'Select from 45+ trades (plumbing, motorbike mechanic, electrician, masonry, painting). Choose your location or let GPS find workers within 1 to 15 km of your doorstep.',
    icon: Compass,
    color: 'from-blue-600 to-cyan-500',
    badge: 'Step 1: Discover',
    preview: {
      title: 'Nearby Search: Lokanthali, Bhaktapur',
      subtitle: 'Radar scanning active verified providers within 5 km',
      badgeText: '14 Active Pros Nearby',
      accentColor: '#2563EB',
      visualType: 'radar',
    },
  },
  {
    step: 2,
    title: 'Vetted Match & Transparent NPR Rates',
    tagline: 'Nepal Citizenship & Skills Verified',
    desc: 'Browse certified technicians with transparent, regulated standard rates in NPR. No bargaining, hidden surprise fees, or unauthorized middlemen.',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-500',
    badge: 'Step 2: Compare',
    preview: {
      title: 'Ramesh Sharma (Verified Pro)',
      subtitle: 'Master Plumber • 4.9 Rating (142 reviews) • 1.2 km away',
      badgeText: 'Citizenship Verified ✓',
      accentColor: '#059669',
      visualType: 'match',
    },
  },
  {
    step: 3,
    title: 'Rapid Doorstep Proximity Dispatch',
    tagline: '15-Minute Average Arrival in Urban Nepal',
    desc: 'Your request is dispatched instantly to the nearest available technician. Track their real-time arrival and call directly through the platform.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    badge: 'Step 3: Dispatch',
    preview: {
      title: 'Technician En Route 🛵',
      subtitle: 'ETA: 12 Minutes • Live route via Araniko Highway',
      badgeText: 'Dispatched ⚡',
      accentColor: '#D97706',
      visualType: 'dispatch',
    },
  },
  {
    step: 4,
    title: 'Escrow Guarantee via eSewa & Khalti',
    tagline: 'Safe, Cashless, Satisfaction Guarantee',
    desc: 'Release payment through eSewa, Khalti, or Cash on Delivery only after the job is completed to your 100% satisfaction. Leave ratings to help the community.',
    icon: CreditCard,
    color: 'from-purple-600 to-pink-500',
    badge: 'Step 4: Secure',
    preview: {
      title: 'Safe Escrow Payment Complete',
      subtitle: 'NPR 650 settled via eSewa • Platform guarantee active',
      badgeText: '100% Escrow Protected',
      accentColor: '#7C3AED',
      visualType: 'payment',
    },
  },
];

const PROVIDER_STEPS: Step[] = [
  {
    step: 1,
    title: 'Register Your Trade with Citizenship',
    tagline: 'Join Nepal’s Trusted Service Network',
    desc: 'Upload your Nepali Citizenship card, business or trade credentials, and list your specialized skills (e.g. Masonry, Inverter, AC, Carpentry).',
    icon: Users,
    color: 'from-blue-600 to-indigo-600',
    badge: 'Partner Step 1',
    preview: {
      title: 'Verification In Progress',
      subtitle: 'Nepali Citizenship verification via Sangalo Tech Team',
      badgeText: 'Fast Approval (24h)',
      accentColor: '#2563EB',
      visualType: 'match',
    },
  },
  {
    step: 2,
    title: 'Receive Direct Local Job Requests',
    tagline: 'Zero Brokerage Middlemen',
    desc: 'Turn on “Available for Jobs” in the app. Get pinged whenever customers in your immediate municipal ward need your trade skills.',
    icon: Smartphone,
    color: 'from-emerald-600 to-teal-500',
    badge: 'Partner Step 2',
    preview: {
      title: 'New Service Request Alert 🔔',
      subtitle: 'House Leakage Repair • Lokanthali Ward 2 • 900m away',
      badgeText: 'Est. Earning: NPR 800',
      accentColor: '#059669',
      visualType: 'dispatch',
    },
  },
  {
    step: 3,
    title: 'Perform Service & Keep 90% of Earnings',
    tagline: 'Lowest Platform Commission in Nepal',
    desc: 'Deliver high-quality workmanship. You keep 90% of your earnings; SEWANEXA deducts only a small 10% platform facilitation commission.',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-500',
    badge: 'Partner Step 3',
    preview: {
      title: 'Daily Wallet Settled',
      subtitle: '3 Bookings Completed Today • NPR 2,700 Net Earnings',
      badgeText: '10% Fair Commission',
      accentColor: '#D97706',
      visualType: 'payment',
    },
  },
  {
    step: 4,
    title: 'Instant Cashout to eSewa, Khalti, or Bank',
    tagline: 'Daily Payouts Directly to Your Pocket',
    desc: 'Withdraw your accumulated balance any day directly into your eSewa ID, Khalti wallet, or local Nepali commercial bank account.',
    icon: CheckCircle2,
    color: 'from-rose-600 to-red-600',
    badge: 'Partner Step 4',
    preview: {
      title: 'Withdrawal Processed',
      subtitle: 'NPR 5,000 sent to eSewa 98XXXXXXXX • Zero transfer fee',
      badgeText: 'Instant Transfer 🇳🇵',
      accentColor: '#DC2626',
      visualType: 'payment',
    },
  },
];

const CUSTOMER_STEPS_NE: Step[] = [
  {
    step: 1,
    title: 'सेवा र नजिकको दूरी छनोट गर्नुहोस्',
    tagline: 'जीपीएस आधारित स्थानीय खोज प्रणाली',
    desc: '४५+ स्थानीय सेवाहरू (प्लम्बर, बाइक मेकानिक, इलेक्ट्रिसियन, मिस्त्री आदि) मध्येबाट छनोट गर्नुहोस्। १ देखि १५ कि.मि. दूरीभित्रका दक्ष व्यक्ति तुरुन्त फेला पार्नुहोस्।',
    icon: Compass,
    color: 'from-blue-600 to-cyan-500',
    badge: 'चरण १: खोज्नुहोस्',
    preview: {
      title: 'नजिकै खोजी: लोकन्थली, भक्तपुर',
      subtitle: '५ कि.मि. भित्रका सक्रिय प्रमाणित प्राविधिकहरूको रडार स्क्यान',
      badgeText: '१४ जना दक्ष कामदार उपलब्ध',
      accentColor: '#2563EB',
      visualType: 'radar',
    },
  },
  {
    step: 2,
    title: 'प्रमाणित प्रोफाइल र पारदर्शी NPR दररेट',
    tagline: 'नेपाली नागरिकता तथा सीप परीक्षण गरिएको',
    desc: 'कुनै मोलतोल वा विचौलिया बिना पारदर्शी र निश्चित नेपाली रुपैयाँ (NPR) दररेटमा अनुभवी प्राविधिक छान्नुहोस्।',
    icon: ShieldCheck,
    color: 'from-emerald-600 to-teal-500',
    badge: 'चरण २: छनोट',
    preview: {
      title: 'रमेश शर्मा (प्रमाणित प्राविधिक)',
      subtitle: 'प्लम्बिङ विज्ञ • ४.९ रेटिङ (१४२ समीक्षा) • १.२ कि.मि. टाढा',
      badgeText: 'नागरिकता प्रमाणित ✓',
      accentColor: '#059669',
      visualType: 'match',
    },
  },
  {
    step: 3,
    title: '१५ मिनेटमै ढोकामा सेवा प्रस्थान',
    tagline: 'काठमाडौँ उपत्यका तथा सहरहरूमा द्रुत आगमन',
    desc: 'तपाईंको अनुरोध नजिकैको प्राविधिककहाँ तुरुन्त पुग्छ। वास्तविक समयमा आगमन ट्र्याक गर्नुहोस् र सिधै कुराकानी गर्नुहोस्।',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    badge: 'चरण ३: सेवा प्रस्थान',
    preview: {
      title: 'प्राविधिक बाटोमा हुनुहुन्छ 🛵',
      subtitle: 'आगमन समय: १२ मिनेट • अरनिको राजमार्ग हुँदै',
      badgeText: 'प्रस्थान भइसक्यो ⚡',
      accentColor: '#D97706',
      visualType: 'dispatch',
    },
  },
  {
    step: 4,
    title: 'ईसेवा तथा खल्तीबाट सुरक्षित भुक्तानी',
    tagline: 'काम सम्पन्न भएपछि मात्र भुक्तानी ग्यारेन्टी',
    desc: 'काममा पूर्ण सन्तुष्टि भएपछि मात्र ईसेवा, खल्ती वा नगदबाट सुरक्षित भुक्तानी गर्नुहोस्। १००% प्लेटफर्म सुरक्षा।',
    icon: CreditCard,
    color: 'from-purple-600 to-pink-500',
    badge: 'चरण ४: सुरक्षित भुक्तानी',
    preview: {
      title: 'सुरक्षित एस्क्रो भुक्तानी सम्पन्न',
      subtitle: 'रु. ६५० ईसेवाबाट भुक्तानी • १००% ग्यारेन्टी सक्रिय',
      badgeText: 'एस्क्रो सुरक्षित ✓',
      accentColor: '#7C3AED',
      visualType: 'payment',
    },
  },
];

const PROVIDER_STEPS_NE: Step[] = [
  {
    step: 1,
    title: 'नागरिकता र सीप विवरणसहित दर्ता हुनुहोस्',
    tagline: 'नेपालको सबैभन्दा ठूलो सेवा नेटवर्कमा जोडिनुहोस्',
    desc: 'नेपाली नागरिकता र आफ्नो सीप (प्लम्बिङ, मेकानिक, वाइरिङ) दर्ता गरी २४ घण्टामै स्वीकृत हुनुहोस्।',
    icon: Users,
    color: 'from-blue-600 to-indigo-600',
    badge: 'पार्टनर चरण १',
    preview: {
      title: 'कागजात प्रमाणीकरण हुँदै',
      subtitle: 'साङ्गालो टेक टोलीद्वारा नागरिकता जाँच',
      badgeText: 'छिटो स्वीकृति (२४ घण्टा)',
      accentColor: '#2563EB',
      visualType: 'match',
    },
  },
  {
    step: 2,
    title: 'आफ्नै टोलमा सिधै कामको अनुरोध पाउनुहोस्',
    tagline: 'कुनै विचौलिया बिना प्रत्यक्ष ग्राहक',
    desc: 'एपमा "उपलब्ध" बटन अन गर्नुहोस् र आफ्नो क्षेत्रका ग्राहकहरूबाट सिधै बुकिङ पाउनुहोस्।',
    icon: Smartphone,
    color: 'from-emerald-600 to-teal-500',
    badge: 'पार्टनर चरण २',
    preview: {
      title: 'नयाँ सेवा अनुरोध आयो 🔔',
      subtitle: 'घरको पाइप मर्मत • लोकन्थली वडा २ • ९०० मिटर',
      badgeText: 'अनुमानित कमाइ: रु. ८००',
      accentColor: '#059669',
      visualType: 'dispatch',
    },
  },
  {
    step: 3,
    title: 'काम गर्नुहोस् र ९०% आम्दानी आफैं राख्नुहोस्',
    tagline: 'नेपालमै सबैभन्दा न्यून १०% कमिसन',
    desc: 'मेहनत तपाईंको, आम्दानी पनि तपाईंको। प्लेटफर्मले मात्र १०% सहजीकरण शुल्क लिन्छ।',
    icon: DollarSign,
    color: 'from-amber-500 to-orange-500',
    badge: 'पार्टनर चरण ३',
    preview: {
      title: 'दैनिक वालेट हिसाब सम्पन्न',
      subtitle: 'आज ३ वटा काम सम्पन्न • खुद आम्दानी: रु. २,७००',
      badgeText: '१०% मात्र कमिसन',
      accentColor: '#D97706',
      visualType: 'payment',
    },
  },
  {
    step: 4,
    title: 'ईसेवा, खल्ती वा बैंक खातामा तुरुन्त भुक्तानी',
    tagline: 'दैनिक आम्दानी सिधै तपाईंको खल्तीमा',
    desc: 'कुनै पनि दिन आफ्नो कमाइ सिधै ईसेवा, खल्ती वा नेपाली बैंक खातामा तुरुन्त ट्रान्सफर गर्नुहोस्।',
    icon: CheckCircle2,
    color: 'from-rose-600 to-red-600',
    badge: 'पार्टनर चरण ४',
    preview: {
      title: 'रकम भुक्तानी सम्पन्न',
      subtitle: 'रु. ५,००० ईसेवा ९८XXXXXXXX मा पठाइयो • शुल्क शून्य',
      badgeText: 'तुरुन्त ट्रान्सफर 🇳🇵',
      accentColor: '#DC2626',
      visualType: 'payment',
    },
  },
];

export default function HowItWorks() {
  const { isNepali } = useLanguage();
  const [activeTab, setActiveTab] = useState<'customer' | 'provider'>('customer');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = isNepali
    ? activeTab === 'customer'
      ? CUSTOMER_STEPS_NE
      : PROVIDER_STEPS_NE
    : activeTab === 'customer'
    ? CUSTOMER_STEPS
    : PROVIDER_STEPS;
  const currentStep = steps[activeStepIndex] || steps[0];

  // Auto rotate steps every 5 seconds if not interacted
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden rounded-3xl my-12 border border-slate-800 shadow-2xl">
      {/* Background Decorative Neon Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{isNepali ? '🇳🇵 नेपालको स्मार्ट अन-डिमान्ड सेवा प्रणाली' : 'Smart Nepal Services Platform'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {isNepali ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                  SEWANEXA
                </span>{' '}
                ले कसरी काम गर्छ?
              </>
            ) : (
              <>
                How{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                  SEWANEXA
                </span>{' '}
                Works
              </>
            )}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isNepali
              ? 'राजमार्गमा इमर्जेन्सी बाइक मर्मतदेखि घरको प्लम्बिङ र वाइरिङसम्म — ४ सरल चरणमा प्रमाणित सेवा आफ्नो ढोकमै पाउनुहोस्।'
              : 'From emergency bike repairs on the highway to skilled home plumbers in your ward — experience seamless, verified doorstep dispatch in 4 simple steps.'}
          </p>

          {/* Perspective Switcher Pills */}
          <div className="pt-2 flex items-center justify-center">
            <div className="p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 inline-flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customer');
                  setActiveStepIndex(0);
                  setIsAutoPlaying(false);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeTab === 'customer'
                    ? 'bg-[#331e6a] text-white shadow-lg shadow-[#331e6a]/40 border border-[#48298a]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{isNepali ? 'ग्राहकहरूको लागि' : 'For Customers & Homes'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('provider');
                  setActiveStepIndex(0);
                  setIsAutoPlaying(false);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                  activeTab === 'provider'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{isNepali ? 'सेवा प्रदायकहरूको लागि (दैनिक कमाइ)' : 'For Service Pros (Earn Daily)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((st, idx) => {
              const IconComp = st.icon;
              const isActive = idx === activeStepIndex;
              return (
                <div
                  key={st.step}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`cursor-pointer p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-slate-800/90 border-blue-500/50 shadow-xl shadow-blue-500/10'
                      : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  {/* Step Progress Line on active */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-red-500" />
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 transition-transform ${
                        isActive
                          ? `bg-gradient-to-br ${st.color} text-white scale-110 shadow-md`
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          {st.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          0{st.step} / 04
                        </span>
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-black transition-colors ${
                          isActive ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {st.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Animated Mock Device / Stage */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
              {/* Device Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-400 ml-2 font-mono">
                    SEWANEXA Live Engine
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time</span>
                </div>
              </div>

              {/* Dynamic Animated Canvas for currentStep */}
              <div className="relative min-h-[300px] flex items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
                {/* Visual 1: Radar Proximity Pulse */}
                {currentStep.preview.visualType === 'radar' && (
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    {/* Concentric Radar Rings */}
                    <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-radar" />
                    <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-radar-delayed" />
                    <div className="w-40 h-40 rounded-full border border-blue-500/20 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-blue-500/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-glow">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Orbiting Worker Pins */}
                    <div className="absolute top-4 left-6 bg-slate-800/90 border border-emerald-500/50 px-2 py-1 rounded-xl text-[10px] font-bold text-emerald-300 flex items-center gap-1 shadow-md animate-float">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Plumber (600m)</span>
                    </div>
                    <div className="absolute bottom-6 right-6 bg-slate-800/90 border border-amber-500/50 px-2 py-1 rounded-xl text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Mechanic (1.1 km)</span>
                    </div>
                  </div>
                )}

                {/* Visual 2: Verified Match Card */}
                {currentStep.preview.visualType === 'match' && (
                  <div className="w-full space-y-4 animate-float">
                    <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg">
                          R
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">Ramesh Sharma</span>
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-xs text-slate-400">Citizenship Verified Pro</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                          <div className="text-amber-400 font-black flex items-center justify-center gap-0.5">
                            <span>4.9</span>
                            <Star className="w-3 h-3 fill-amber-400" />
                          </div>
                          <div className="text-slate-400">Rating</div>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                          <div className="text-white font-black">142+</div>
                          <div className="text-slate-400">Completed</div>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50">
                          <div className="text-emerald-400 font-black">NPR 500</div>
                          <div className="text-slate-400">Base Rate</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-emerald-400 font-bold">✓ Government Vetted</span>
                        <span className="text-slate-400">Arrives in ~12 mins</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 3: Rapid Dispatch Route */}
                {currentStep.preview.visualType === 'dispatch' && (
                  <div className="w-full space-y-4">
                    <div className="relative h-44 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
                      {/* Animated SVG Path for Technician */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 150">
                        <path
                          d="M 40 110 Q 150 20 260 50"
                          fill="none"
                          stroke="#E52E2E"
                          strokeWidth="3"
                          className="animate-route"
                        />
                      </svg>

                      {/* Origin and Destination Pills */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold text-white flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span>Dispatch (Lokanthali)</span>
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                          ETA: 12 Mins
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-xs pt-4 border-t border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                            🛵
                          </div>
                          <div>
                            <div className="text-white font-bold">Technician Moving</div>
                            <div className="text-slate-400 text-[10px]">Speed: 30 km/h on bike</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 border border-slate-700"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 4: Payment Escrow */}
                {currentStep.preview.visualType === 'payment' && (
                  <div className="w-full space-y-3 animate-float">
                    <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Digital Escrow Receipt
                        </span>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          Paid & Protected ✓
                        </span>
                      </div>

                      <div className="space-y-1.5 border-y border-slate-700/60 py-3 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Service Charge (Plumbing)</span>
                          <span className="font-mono text-white">NPR 500</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Material Spare Parts</span>
                          <span className="font-mono text-white">NPR 150</span>
                        </div>
                        <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-slate-700/40">
                          <span>Total Paid</span>
                          <span className="text-emerald-400 font-mono">NPR 650</span>
                        </div>
                      </div>

                      {/* Payment Partners */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-semibold">Gateway:</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 font-black rounded-md">
                            eSewa
                          </span>
                          <span className="px-2 py-0.5 bg-purple-950 text-purple-400 border border-purple-800 font-black rounded-md">
                            Khalti
                          </span>
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 font-bold rounded-md">
                            COD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Caption */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">
                    {currentStep.preview.title}
                  </span>
                  <span className="text-[10px] font-bold text-blue-400">
                    {currentStep.preview.badgeText}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{currentStep.preview.subtitle}</p>
              </div>

              {/* Action Link */}
              <div className="pt-1">
                <Link
                  href={activeTab === 'customer' ? '/services' : '/auth/register?role=provider'}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <span>
                    {isNepali
                      ? activeTab === 'customer'
                        ? 'सबै ४५+ सेवाहरू हेर्नुहोस्'
                        : 'सेवा पार्टनरको रूपमा दर्ता हुनुहोस्'
                      : activeTab === 'customer'
                      ? 'Explore 45+ Services Nearby'
                      : 'Register as Service Partner'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

