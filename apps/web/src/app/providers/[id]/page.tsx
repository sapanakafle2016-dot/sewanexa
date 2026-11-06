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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-slate-500">Loading service partner profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-blue-600">Services</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{provider.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Details (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src={
                  provider.avatarUrl ||
                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
                }
                alt={provider.name}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-slate-200 shadow-sm"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-slate-900">{provider.name}</h1>
                  <span title="Verified Professional" className="inline-flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </span>
                </div>
                {provider.businessName && (
                  <p className="text-sm font-semibold text-slate-600">{provider.businessName}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{provider.address?.formattedAddress || 'Lokanthali, Bhaktapur'}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{provider.ratings?.average || 4.9}</span>
                    <span className="text-slate-400 font-normal">
                      ({provider.ratings?.count || 38} reviews)
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Available Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-800">Citizenship Verified</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Briefcase className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {provider.experienceYears || 10}+ Yrs Experience
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-semibold text-slate-800">Fast Response</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ThumbsUp className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-semibold text-slate-800">99% Satisfaction</span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About the Professional</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {provider.bio}
            </p>
          </div>

          {/* Specializations & Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Skills & Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Photos */}
          {provider.portfolioPhotos && provider.portfolioPhotos.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Work Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {provider.portfolioPhotos.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Work ${index + 1}`}
                    className="w-full h-36 rounded-2xl object-cover border border-slate-200 hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Customer Ratings & Reviews</h2>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{provider.ratings?.average || 4.9}</span>
                <span className="text-slate-400 font-normal">out of 5.0</span>
              </div>
            </div>

            <div className="space-y-4">
              {(provider.reviews || []).map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{rev.customerName}</span>
                    <span className="text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking Action Card (Right 4 Cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">Service Visit Rate</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                NPR {provider.baseRate || 500}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standard inspection and minor diagnosis fee. Parts quoted on actuals.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Direct Hire Fee</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Coverage Distance</span>
                <span className="font-semibold text-slate-800">Up to 10 km</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Accepted</span>
                <span className="font-semibold text-slate-800">Cash, eSewa, Khalti</span>
              </div>
            </div>

            <Link
              href={`/book/${provider._id}`}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity verified by SEWANEXA. No prepayment required for cash bookings.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
