'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  MapPin,
  Star,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const SAMPLE_LOCAL_PROVIDERS: Record<string, any[]> = {
  'home-maintenance': [
    {
      _id: '1',
      name: 'Ramesh Sharma',
      businessName: 'Sharma Plumbing Works',
      bio: '10+ years experienced certified plumber serving Kathmandu Valley. 24/7 emergency pipe fitting and tank cleaning.',
      skills: ['Pipe Fitting', 'Sanitary Repair', 'Water Tank Cleaning', 'Drainage'],
      distanceInKm: 0.9,
      baseRate: 500,
      ratings: { average: 4.9, count: 38 },
      isOnline: true,
      address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400',
    },
    {
      _id: '4',
      name: 'Prakash Shrestha',
      businessName: 'Shrestha Electricals',
      bio: 'Licensed electrician with 8+ years experience in domestic wiring, MCB installation, and inverter setups.',
      skills: ['House Wiring', 'MCB Fitting', 'Inverter Setup', 'Lighting'],
      distanceInKm: 1.8,
      baseRate: 500,
      ratings: { average: 4.8, count: 45 },
      isOnline: true,
      address: { areaName: 'Koteshwor', city: 'Kathmandu' },
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
  ],
  'vehicle-services': [
    {
      _id: '2',
      name: 'Bikash Tamang',
      businessName: 'Tamang Auto Care & Roadside Assistance',
      bio: 'Certified Bike & Car mechanic with on-demand roadside breakdown assistance across Ring Road.',
      skills: ['Bike Repair', 'Car Servicing', 'Battery Replacement', 'Tyre Fitting'],
      distanceInKm: 1.4,
      baseRate: 400,
      ratings: { average: 4.8, count: 52 },
      isOnline: true,
      address: { areaName: 'Koteshwor', city: 'Kathmandu' },
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
  ],
};

function CategoryNearbyContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const initialSub = searchParams.get('sub') || '';

  const [radius, setRadius] = useState<number>(5);
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/providers/nearby?longitude=85.3582&latitude=27.6715&radiusKm=${radius}`,
          { requiresAuth: false }
        );
        if (res.success && res.data && res.data.length > 0) {
          setProviders(res.data);
        } else {
          setProviders(SAMPLE_LOCAL_PROVIDERS[slug] || SAMPLE_LOCAL_PROVIDERS['home-maintenance']);
        }
      } catch (err) {
        setProviders(SAMPLE_LOCAL_PROVIDERS[slug] || SAMPLE_LOCAL_PROVIDERS['home-maintenance']);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [slug, radius]);

  const categoryName = slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Local Services';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-blue-600">Services</Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{categoryName}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing verified, available professionals located in and around the Kathmandu Valley.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Search Center: Lokanthali, Bhaktapur</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Radius pills */}
        <div className="flex items-center gap-2 text-xs w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="font-semibold text-slate-500 shrink-0">Search Radius:</span>
          {[1, 2, 5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                radius === r
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{providers.length}</strong> active professionals
        </div>
      </div>

      {/* Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={
                    p.avatarUrl ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400'
                  }
                  alt={p.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{p.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  {p.businessName && (
                    <p className="text-xs font-semibold text-slate-500">{p.businessName}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.address?.areaName || 'Lokanthali'}, {p.address?.city || 'Bhaktapur'}</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                      {p.distanceInKm || 1.2} km
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {p.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {p.skills?.slice(0, 3).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{p.ratings?.average || 4.9}</span>
                  <span className="text-slate-400 font-normal">({p.ratings?.count || 30}+ jobs)</span>
                </div>
                <div>
                  <span className="text-slate-400">Visit Fee: </span>
                  <strong className="text-slate-900 font-extrabold text-sm">
                    NPR {p.baseRate || 500}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Link
                href={`/book/${p._id}`}
                className="w-full text-center py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CategoryNearbyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading nearby providers...</div>}>
      <CategoryNearbyContent />
    </Suspense>
  );
}
