'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Car,
  Bike,
  HardHat,
  Paintbrush,
  Zap,
  Fan,
  Heart,
  Cpu,
  Truck,
  Package,
  Home,
  Camera,
  Scissors,
  Droplets,
  Hammer,
  MoreHorizontal,
  Search,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const ICON_MAP: Record<string, any> = {
  wrench: Wrench,
  car: Car,
  bike: Bike,
  'hard-hat': HardHat,
  paint: Paintbrush,
  paintbrush: Paintbrush,
  zap: Zap,
  fan: Fan,
  truck: Truck,
  package: Package,
  home: Home,
  camera: Camera,
  scissors: Scissors,
  droplets: Droplets,
  hammer: Hammer,
  sparkles: Sparkles,
  heart: Heart,
  cpu: Cpu,
  shield: ShieldCheck,
  more: MoreHorizontal,
  default: Layers,
};

const CATEGORIES_DATA = [
  {
    name: 'Home Maintenance Services',
    slug: 'home-maintenance',
    icon: Wrench,
    badge: 'High Demand',
    color: 'from-blue-600 to-cyan-600',
    description: 'Essential repairs, plumbing, electrical installations, painting, and deep cleaning for your home.',
    subcategories: [
      { name: 'Plumbing Services', basePrice: 'NPR 500', popular: true },
      { name: 'Electrical Services', basePrice: 'NPR 500', popular: true },
      { name: 'House Painting', basePrice: 'NPR 2,000' },
      { name: 'Carpentry & Furniture Repair', basePrice: 'NPR 800' },
      { name: 'AC Installation & Repair', basePrice: 'NPR 1,200', popular: true },
      { name: 'Water Tank Cleaning', basePrice: 'NPR 1,500' },
      { name: 'Solar Installation & Maintenance', basePrice: 'NPR 1,500' },
      { name: 'Home Appliance Repair', basePrice: 'NPR 700' },
      { name: 'House Deep Cleaning', basePrice: 'NPR 1,000', popular: true },
      { name: 'Pest Control', basePrice: 'NPR 1,800' },
    ],
  },
  {
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: Car,
    badge: '24/7 Roadside',
    color: 'from-amber-500 to-orange-600',
    description: 'On-demand roadside assistance, mobile mechanics, towing, tyre and battery replacements.',
    subcategories: [
      { name: 'Car Mechanic', basePrice: 'NPR 800', popular: true },
      { name: 'Bike Mechanic', basePrice: 'NPR 400', popular: true },
      { name: 'Vehicle Electrical Repair', basePrice: 'NPR 600' },
      { name: 'Car Washing & Detailing', basePrice: 'NPR 1,000' },
      { name: 'Tyre Repair & Replacement', basePrice: 'NPR 300', popular: true },
      { name: 'Battery Replacement', basePrice: 'NPR 500' },
      { name: 'Roadside Assistance', basePrice: 'NPR 1,000', popular: true },
      { name: 'Vehicle Towing', basePrice: 'NPR 2,500' },
    ],
  },
  {
    name: 'Construction and Labour Services',
    slug: 'construction-and-labour',
    icon: HardHat,
    badge: 'Contractors',
    color: 'from-rose-600 to-red-600',
    description: 'Vetted masons, tilers, welders, renovation contractors, and general labour support.',
    subcategories: [
      { name: 'Mason (डकर्मी)', basePrice: 'NPR 1,200', popular: true },
      { name: 'Construction Workers', basePrice: 'NPR 1,000' },
      { name: 'Tile & Marble Workers', basePrice: 'NPR 1,500' },
      { name: 'Welding Services', basePrice: 'NPR 800' },
      { name: 'Aluminium & Glass Workers', basePrice: 'NPR 1,000' },
      { name: 'House Renovation', basePrice: 'NPR 5,000', popular: true },
      { name: 'Interior Work', basePrice: 'NPR 3,000' },
      { name: 'General Labour', basePrice: 'NPR 800' },
    ],
  },
  {
    name: 'Personal and Lifestyle Services',
    slug: 'personal-and-lifestyle',
    icon: Heart,
    badge: 'At Home',
    color: 'from-purple-600 to-pink-600',
    description: 'Bridal makeup, salon at home, event photographers, home tutors, and personal trainers.',
    subcategories: [
      { name: 'Beauty & Makeup Services', basePrice: 'NPR 1,500', popular: true },
      { name: 'Salon Services at Home', basePrice: 'NPR 600' },
      { name: 'Photography & Videography', basePrice: 'NPR 3,500', popular: true },
      { name: 'Event Decoration', basePrice: 'NPR 4,000' },
      { name: 'Home Tutors', basePrice: 'NPR 2,500' },
      { name: 'Fitness Trainers', basePrice: 'NPR 2,000' },
      { name: 'Tailoring & Alterations', basePrice: 'NPR 500' },
    ],
  },
  {
    name: 'Professional and Technical Services',
    slug: 'professional-and-technical',
    icon: Cpu,
    badge: 'Tech Certified',
    color: 'from-indigo-600 to-blue-700',
    description: 'Certified IT technicians, laptop & mobile repairs, CCTV security systems, and digital support.',
    subcategories: [
      { name: 'Computer Repair', basePrice: 'NPR 700' },
      { name: 'Laptop Repair', basePrice: 'NPR 800', popular: true },
      { name: 'Mobile Repair', basePrice: 'NPR 500', popular: true },
      { name: 'CCTV Installation', basePrice: 'NPR 1,500', popular: true },
      { name: 'Networking & Wi-Fi Setup', basePrice: 'NPR 1,000' },
      { name: 'IT Support', basePrice: 'NPR 1,000' },
      { name: 'Website Development', basePrice: 'NPR 10,000' },
      { name: 'Digital Marketing', basePrice: 'NPR 5,000' },
    ],
  },
  {
    name: 'Other On-Demand Services',
    slug: 'other-services',
    icon: MoreHorizontal,
    badge: 'Convenience',
    color: 'from-emerald-600 to-teal-700',
    description: 'Professional drivers, delivery errands, movers & packers, gardening, and pet care.',
    subcategories: [
      { name: 'Drivers', basePrice: 'NPR 1,200', popular: true },
      { name: 'Delivery Assistance', basePrice: 'NPR 400' },
      { name: 'Movers & Packers', basePrice: 'NPR 4,500', popular: true },
      { name: 'Gardening & Landscaping', basePrice: 'NPR 800' },
      { name: 'Laundry & Ironing', basePrice: 'NPR 500' },
      { name: 'Pet Care & Sitting', basePrice: 'NPR 800' },
      { name: 'Office Maintenance', basePrice: 'NPR 2,000' },
    ],
  },
];

export default function ServicesPage() {
  const [categoriesList, setCategoriesList] = useState<any[]>(CATEGORIES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  useEffect(() => {
    const loadDynamicCategories = async () => {
      try {
        const res = await apiFetch('/categories');
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((cat: any) => {
            const IconComponent = ICON_MAP[cat.icon] || ICON_MAP.default;
            return {
              name: cat.name,
              slug: cat.slug,
              icon: IconComponent,
              badge: cat.commissionPercentage ? `${cat.commissionPercentage}% Platform Rate` : 'Verified',
              color: 'from-blue-600 to-indigo-600',
              description: cat.description || 'Verified local services across Nepal.',
              subcategories: (cat.subcategories || []).map((sub: any) => ({
                name: sub.name,
                basePrice: `NPR ${sub.suggestedBasePrice || 500}`,
                popular: sub.order === 0,
              })),
            };
          });
          setCategoriesList(mapped);
        }
      } catch (err) {
        // Fall back gracefully to CATEGORIES_DATA
      }
    };
    loadDynamicCategories();
  }, []);

  const filteredCategories = categoriesList.filter((cat) => {
    if (activeCategoryFilter !== 'all' && cat.slug !== activeCategoryFilter) {
      return false;
    }
    const matchesCategory =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSub = cat.subcategories.some((sub: any) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCategory || matchesSub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black tracking-wide border border-blue-200 shadow-sm">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Complete Catalog of Nepal Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Find Any Local Service in Nepal
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Browse through our full directory of 45+ specialized categories with standardized base prices, verified IDs, and direct provider booking.
        </p>

        {/* Live Search Input */}
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by trade, e.g. Plumber, AC Repair, Bike Mechanic, CCTV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg shadow-slate-900/5 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Jump Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeCategoryFilter === 'all'
                ? 'bg-[#331e6a] text-white shadow-md shadow-[#331e6a]/25'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#f6f4fb]'
            }`}
          >
            All Categories (45+)
          </button>
          {CATEGORIES_DATA.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCategoryFilter(c.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategoryFilter === c.slug
                  ? 'bg-[#331e6a] text-white shadow-md shadow-[#331e6a]/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#f6f4fb]'
              }`}
            >
              {c.name.replace(' Services', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Category Blocks */}
      <div className="space-y-10">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.slug}
              id={category.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 transition-all hover:shadow-md"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${category.color} flex items-center justify-center text-white shadow-lg shadow-slate-900/10 shrink-0`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                        {category.name}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hidden sm:inline-block">
                        {category.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${category.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black transition-all shrink-0 self-start sm:self-auto group"
                >
                  <span>Find Nearby Pros</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.subcategories.map((sub: any) => (
                  <Link
                    key={sub.name}
                    href={`/services/${category.slug}?sub=${encodeURIComponent(sub.name)}`}
                    className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-[#331e6a]/40 hover:shadow-lg hover:shadow-[#331e6a]/10 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-black text-slate-900 group-hover:text-[#331e6a] transition-colors">
                          {sub.name}
                        </span>
                        {sub.popular && (
                          <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded shrink-0">
                            Hot
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Verified local technicians</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] font-semibold">Starting Base</span>
                      <span className="font-black text-slate-900 group-hover:text-[#331e6a] transition-colors">
                        {sub.basePrice}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
