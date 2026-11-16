'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Phone,
  Calendar,
  ArrowRight,
  Briefcase,
  Award,
  ThumbsUp,
  Share2,
  Bookmark,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const SAMPLE_FALLBACK_PROVIDERS: Record<string, any> = {
  '1': {
    _id: '1',
    name: 'Ramesh Sharma',
    businessName: 'Sharma Plumbing Works',
    bio: 'Certified Master Plumber with over 10 years of hands-on experience in residential and commercial plumbing throughout Kathmandu, Bhaktapur, and Lalitpur. Specialized in high-pressure water pipe installations, sanitary bathroom fittings, concealed drainage, solar water heaters, and water tank cleaning. Committed to clean, punctually delivered, and durable repairs.',
    skills: ['Pipe Fitting', 'Sanitary Repair', 'Water Tank Cleaning', 'Drainage Unclogging', 'Solar Heaters'],
    experienceYears: 10,
    distanceInKm: 0.9,
    baseRate: 500,
    ratings: { average: 4.9, count: 38 },
    isOnline: true,
    address: {
      city: 'Bhaktapur',
      areaName: 'Lokanthali',
      formattedAddress: 'Lokanthali Chowk, Madhyapur Thimi, Bhaktapur',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=500',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    ],
    reviews: [
      {
        id: 'r1',
        customerName: 'Aayush Shrestha',
        rating: 5,
        date: '2 days ago',
        comment: 'Ramesh Dai arrived at my house in Lokanthali within 25 minutes of booking! Fixed our leaking kitchen pipe joint quickly and cleanly. Very reasonable charges.',
      },
      {
        id: 'r2',
        customerName: 'Pooja Karki',
        rating: 5,
        date: '1 week ago',
        comment: 'Very professional and polite. Cleared our overhead water tank and replaced the float valve. Highly recommended for plumbing in Bhaktapur.',
      },
      {
        id: 'r3',
        customerName: 'Kiran Thapa',
        rating: 4.8,
        date: '2 weeks ago',
        comment: 'Great craftsmanship on our bathroom renovation fittings. Honest rates and showed up right on scheduled time.',
      },
    ],
  },
  '2': {
    _id: '2',
    name: 'Bikash Tamang',
    businessName: 'Tamang Auto Care & Roadside Assistance',
    bio: 'Certified Automobile & Bike technician with 8 years of specialized garage and on-road breakdown experience. Providing mobile bike servicing, engine oil changes, brake overhaul, battery jumps, and emergency puncture fixes across Kathmandu Ring Road.',
    skills: ['Bike Repair', 'Car Servicing', 'Battery Replacement', 'Tyre Fitting', 'Roadside Assistance'],
    experienceYears: 8,
    distanceInKm: 1.4,
    baseRate: 400,
    ratings: { average: 4.8, count: 52 },
    isOnline: true,
    address: {
      city: 'Kathmandu',
      areaName: 'Koteshwor',
      formattedAddress: 'Near Koteshwor Chowk, Kathmandu',
    },
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500',
    ],
    reviews: [
      {
        id: 'r3',
        customerName: 'Bipin Rai',
        rating: 5,
        date: '3 days ago',
        comment: 'My scooter broke down near Jadibuti and Bikash arrived with new spark plug and tools. Solved it on the spot!',
      },
    ],
  },
};

export default function ProviderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await apiFetch(`/providers/${id}`, { requiresAuth: false });
        if (res.success && res.data) {
          setProvider(res.data);
        } else {
          setProvider(SAMPLE_FALLBACK_PROVIDERS[id] || SAMPLE_FALLBACK_PROVIDERS['1']);
        }
      } catch (err) {
        setProvider(SAMPLE_FALLBACK_PROVIDERS[id] || SAMPLE_FALLBACK_PROVIDERS['1']);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading verified professional profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services" className="hover:text-blue-600">Services</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-bold">{provider.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Hero Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={
                    provider.avatarUrl ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
                  }
                  alt={provider.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg ring-1 ring-slate-200"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white" title="Online & Ready">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 block animate-ping" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {provider.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-black px-2.5 py-1 rounded-full border border-blue-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Partner
                  </span>
                </div>

                {provider.businessName && (
                  <p className="text-sm font-bold text-slate-600">{provider.businessName}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-medium">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{provider.address?.formattedAddress || 'Lokanthali, Bhaktapur'}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 font-black text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{provider.ratings?.average || 4.9}</span>
                    <span className="text-slate-400 font-normal">
                      ({provider.ratings?.count || 38} reviews)
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Ready for Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification & Credential Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 border border-blue-100">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">Citizenship ID</span>
                  <span className="text-[10px] text-blue-700 font-bold">100% Vetted</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <Briefcase className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">{provider.experienceYears || 10}+ Years</span>
                  <span className="text-[10px] text-slate-500">Field Experience</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <Clock className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">15-30 Min</span>
                  <span className="text-[10px] text-slate-500">Avg Arrival Time</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                <ThumbsUp className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">99% Liked</span>
                  <span className="text-[10px] text-slate-500">Repeat Customers</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-black text-slate-900">Professional Bio</h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {provider.bio}
            </p>
          </div>

          {/* Specializations & Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">Skills & Trade Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Photos */}
          {provider.portfolioPhotos && provider.portfolioPhotos.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">Recent Completed Works</h2>
                <span className="text-xs text-slate-400 font-bold">{provider.portfolioPhotos.length} photos</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {provider.portfolioPhotos.map((photo: string, index: number) => (
                  <div key={index} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-video">
                    <img
                      src={photo}
                      alt={`Work ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Verified Customer Reviews</h2>
                <p className="text-xs text-slate-500 mt-0.5">Reviews submitted after completed jobs</p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="font-black text-amber-900 text-sm">{provider.ratings?.average || 4.9}</span>
                <span className="text-amber-700 text-xs font-semibold">/ 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {(provider.reviews || []).map((rev: any) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900">{rev.customerName}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(Math.floor(rev.rating || 5))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking Action Card (Right 4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 space-y-6">
            <div>
              <div className="text-[11px] uppercase font-black tracking-widest text-slate-400">Standard Service Visit</div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                NPR {provider.baseRate || 500}
              </div>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Standard inspection, travel, and minor initial troubleshooting. Required replacement materials quoted on actuals.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Direct Booking Fee</span>
                <span className="font-black text-emerald-600 uppercase">FREE (0 NPR)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Coverage Distance</span>
                <span className="font-bold text-slate-800">Up to 10 km</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Gateways</span>
                <span className="font-bold text-slate-800">eSewa, Khalti, Cash</span>
              </div>
            </div>

            <Link
              href={`/book/${provider._id}`}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>SEWANEXA Trust Protection</span>
              </div>
              <p className="leading-relaxed">
                All providers hold verified citizenship credentials. In Cash bookings, you pay only after the job is completed to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
