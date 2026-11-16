'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  MapPin,
  ShieldCheck,
  Phone,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Lock,
  Headphones,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer = () => {
  const { isNepali } = useLanguage();

  return (
    <footer className="relative bg-[#170e30] text-slate-300 overflow-hidden border-t border-[#331e6a]/60">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#331e6a]/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP BANNER: App Download & Emergency Hotline */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#24154b] via-[#331e6a] to-[#24154b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* App Promotion Pitch */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isNepali ? 'मोबाइल एप उपलब्ध' : 'Mobile Apps Live'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {isNepali ? 'एप एक, सेवा अनेक।' : 'One App. Infinite Services.'}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
                {isNepali
                  ? 'डाउनलोड गर्नुहोस् SEWANEXA एप — घरमै बसेर १ कल वा १ ट्यापमा प्रमाणित सेवा प्रदायक बोलाउनुहोस् र लाइभ लोकेसन ट्र्याक गर्नुहोस्।'
                  : 'Download SEWANEXA App — Book certified technicians at your doorstep in 1 tap, track live GPS arrivals, and pay securely via eSewa or Khalti.'}
              </p>

              {/* Store Download Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#download-android"
                  className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-black border border-white/20 hover:border-emerald-400/60 shadow-lg shadow-black/40 transition-all hover:scale-[1.02]"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">GET IT ON</div>
                    <div className="text-xs font-black text-white tracking-wide">Google Play</div>
                  </div>
                </a>

                <a
                  href="#download-ios"
                  className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-black border border-white/20 hover:border-sky-400/60 shadow-lg shadow-black/40 transition-all hover:scale-[1.02]"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.74 1.04-1.77.92-2.8-.9.04-2 .6-2.65 1.36-.57.65-1.06 1.71-.93 2.71 1.01.08 2.05-.53 2.66-1.27z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">DOWNLOAD ON THE</div>
                    <div className="text-xs font-black text-white tracking-wide">Apple App Store</div>
                  </div>
                </a>

                <div className="flex items-center gap-2 pl-2 text-xs font-medium text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isNepali ? '४.९ ★ (५०,०००+ डाउनलोड)' : '4.9 ★ (50K+ Downloads)'}</span>
                </div>
              </div>
            </div>

            {/* 24/7 Rapid Helpdesk & Hotline */}
            <div className="lg:col-span-5">
              <div className="bg-slate-950/70 border border-white/15 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#f59e0b]/20 rounded-full blur-xl" />
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-bold">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {isNepali ? '२४/७ ग्राहक सेवा हटलाइन' : '24/7 Rapid Support Hotline'}
                      </div>
                      <div className="text-sm font-bold text-white">
                        {isNepali ? 'आकस्मिक मर्मत सहयोग' : 'Emergency Assistance'}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:015901234"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#331e6a]/40 border border-white/10 hover:border-[#f59e0b]/50 transition-all group"
                  >
                    <Phone className="w-4 h-4 text-[#f59e0b] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[11px] text-slate-400">{isNepali ? 'उपत्यका हटलाइन' : 'Valley Hotline'}</div>
                      <div className="text-sm font-black text-white">०१-५९०१२३४</div>
                    </div>
                  </a>

                  <a
                    href="tel:9800000000"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#331e6a]/40 border border-white/10 hover:border-[#f59e0b]/50 transition-all group"
                  >
                    <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-[11px] text-slate-400">{isNepali ? 'टोल-फ्री मोबाइल' : 'Toll-Free Mobile'}</div>
                      <div className="text-sm font-black text-white">९८००-००००००</div>
                    </div>
                  </a>
                </div>

                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{isNepali ? 'औसत प्रतिक्रिया समय: २ मिनेट' : 'Avg Response: 2 mins'}</span>
                  <span className="text-[#f59e0b] font-medium">WhatsApp / Viber Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER DIRECTORY (5 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Verified Company Identity (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-block bg-white p-3 rounded-2xl shadow-xl shadow-[#331e6a]/40 border border-white/20 hover:scale-[1.02] transition-transform"
            >
              <Image
                src="/logo.png"
                alt="Sewanexa - Any Service. Near You."
                width={190}
                height={60}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {isNepali
                ? 'नेपालको पहिलो भरपर्दो अन-डिमान्ड सेवा प्लेटफर्म। दक्ष प्राविधिक, तत्काल जीपीएस ट्र्याकिङ, पारदर्शी मूल्य र १००% सुरक्षित डिजिटल भुक्तानी।'
                : 'Nepal\'s premier on-demand service marketplace connecting verified plumbers, mechanics, electricians, and technicians directly with households & businesses.'}
            </p>

            {/* Corporate Registration Box */}
            <div className="p-4 rounded-xl bg-[#201344] border border-[#331e6a] space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-slate-400">{isNepali ? 'सञ्चालक संस्था' : 'Operating Entity'}:</span>
                <strong className="text-white font-bold">Sangalo Tech Pvt. Ltd.</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{isNepali ? 'कम्पनी दर्ता नं.' : 'Company Reg'}:</span>
                <span className="text-slate-200 font-mono font-medium">310892/079/080</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>{isNepali ? 'स्थायी लेखा नं. (PAN)' : 'PAN No'}:</span>
                <span className="text-slate-200 font-mono font-medium">610394821</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#f59e0b] mt-0.5 shrink-0" />
                <span>
                  {isNepali
                    ? 'लोकन्थली चोक, मध्यपुर थिमी-१, भक्तपुर, नेपाल'
                    : 'Lokanthali Chowk, Madhyapur Thimi-1, Bhaktapur, Nepal'}
                </span>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{isNepali ? '१००% नागरिकता र पुलिस रिपोर्ट प्रमाणित' : '100% Background & ID Verified Technicians'}</span>
            </div>
          </div>

          {/* Column 2: लोकप्रिय सेवाहरू / Popular Services (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#f59e0b] rounded-full" />
              {isNepali ? 'लोकप्रिय सेवाहरू' : 'Top Services'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li>
                <Link href="/services/home-maintenance" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'प्लम्बिङ तथा सेनेटरी' : 'Plumbing & Sanitary'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services/home-maintenance" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'विद्युत मर्मत तथा वाइरिङ' : 'Electrical Repair'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services/vehicle-services" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'मोबाइल बाइक/कार मेकानिक' : 'Bike/Car Mechanic'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services/home-maintenance" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'घर तथा अफिस सरसफाइ' : 'Deep Cleaning'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services/professional-and-technical" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'सीसीटीभी तथा नेटवर्किङ' : 'CCTV & IT Setup'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services/other-services" className="hover:text-[#f59e0b] transition-colors flex items-center justify-between group">
                  <span>{isNepali ? 'घर सार्ने तथा सामान ढुवानी' : 'Movers & Packers'}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#f59e0b]" />
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#f59e0b] hover:underline font-bold pt-1 inline-block">
                  {isNepali ? 'सबै ५०+ सेवाहरू हेर्नुहोस् →' : 'View All 50+ Services →'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: सेवा प्रदायकहरू / For Partners (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-emerald-400 rounded-full" />
              {isNepali ? 'सेवा प्रदायकहरू' : 'For Partners'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li>
                <Link
                  href="/partner/register"
                  className="text-white bg-[#331e6a] hover:bg-[#3d247d] border border-white/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-bold transition-all shadow-sm text-sm"
                >
                  <span>{isNepali ? 'साझेदार बन्नुहोस्' : 'Become a Partner'}</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-[#f59e0b] text-slate-950">
                    JOIN
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-white transition-colors">
                  {isNepali ? 'साझेदार पोर्टल लगइन' : 'Provider Portal Login'}
                </Link>
              </li>
              <li>
                <Link href="/partner/benefits" className="hover:text-white transition-colors">
                  {isNepali ? '१०% पारदर्शी कमिसन' : 'Transparent 10% Cut'}
                </Link>
              </li>
              <li>
                <Link href="/partner/payouts" className="hover:text-white transition-colors">
                  {isNepali ? 'दैनिक ईसेवा/खल्ती भुक्तानी' : 'Instant Daily Payouts'}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  {isNepali ? 'सुरक्षा तथा बीमा नियम' : 'Safety & Insurance'}
                </Link>
              </li>
              <li>
                <Link href="/partner/training" className="hover:text-white transition-colors">
                  {isNepali ? 'निःशुल्क व्यावसायिक तालिम' : 'Free Skills Training'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: कम्पनी र सहयोग / Company & Support (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-sky-400 rounded-full" />
              {isNepali ? 'कम्पनी र कानुनी' : 'Company & Legal'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-300 font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {isNepali ? 'हाम्रो बारेमा (About Us)' : 'About Sewanexa'}
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white transition-colors">
                  {isNepali ? 'सुरक्षा र भरोसा नीति' : 'Trust & Safety Policy'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  {isNepali ? 'पारदर्शी मूल्य दर सूची' : 'Fair Standard Pricing'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {isNepali ? 'सर्त तथा नियमहरू' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {isNepali ? 'गोपनीयता नीति' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {isNepali ? 'सम्पर्क र गुनासो' : 'Support & Grievances'}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:sangalotech@gmail.com"
                  className="hover:text-[#f59e0b] transition-colors flex items-center gap-1.5 text-slate-400 pt-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>sangalotech@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: प्रमाणित भुक्तानी प्रणाली / Payment Ecosystem (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-purple-400 rounded-full" />
              {isNepali ? 'सुरक्षित भुक्तानी' : 'Payment Ecosystem'}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60bb46] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">eSewa ePay v2</div>
                  <div className="text-[9px] text-slate-400">HMAC-SHA256 Encrypted</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5d2e8e] shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">Khalti v2 (Pidx)</div>
                  <div className="text-[9px] text-slate-400">Instant Wallet Verification</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">Fonepay QR / Banking</div>
                  <div className="text-[9px] text-slate-400">Direct Bank Settlement</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                <div>
                  <div className="text-[11px] font-bold text-white">{isNepali ? 'नगद भुक्तानी (COD)' : 'Cash on Delivery'}</div>
                  <div className="text-[9px] text-slate-400">{isNepali ? 'काम सम्पन्न भएपछि मात्र' : 'Pay After Inspection'}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[10px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>२५६-बिट एसएसएल सुरक्षित कारोबार</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL & OPERATIONAL BAR */}
      <div className="border-t border-slate-800/90 bg-[#120a27] text-xs text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright & Entity */}
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <span>
              &copy; {new Date().getFullYear()} <strong>SEWANEXA</strong> – Brand of{' '}
              <a
                href="https://www.sangalotech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#f59e0b] underline font-semibold transition-colors"
              >
                Sangalo Tech Pvt. Ltd.
              </a>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span>{isNepali ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}</span>
          </div>

          {/* Live System Operational Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isNepali ? 'सबै प्रणालीहरू सक्रिय (Operational)' : 'All Systems Operational'}</span>
          </div>

          {/* Provenance Badge */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>in Lokanthali, Bhaktapur, Nepal 🇳🇵</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
