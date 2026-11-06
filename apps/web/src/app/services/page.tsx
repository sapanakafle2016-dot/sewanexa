'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Car,
  HardHat,
  Heart,
  Cpu,
  MoreHorizontal,
  Search,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

const CATEGORIES_DATA = [
  {
    name: 'Home Maintenance Services',
    slug: 'home-maintenance',
    icon: Wrench,
    color: 'from-blue-600 to-cyan-600',
    description: 'Essential repairs, plumbing, electrical installations, painting, and deep cleaning for your home.',
    subcategories: [
      { name: 'Plumbing Services', basePrice: 'NPR 500' },
      { name: 'Electrical Services', basePrice: 'NPR 500' },
      { name: 'House Painting', basePrice: 'NPR 2,000' },
      { name: 'Carpentry & Furniture Repair', basePrice: 'NPR 800' },
      { name: 'AC Installation & Repair', basePrice: 'NPR 1,200' },
      { name: 'Water Tank Cleaning', basePrice: 'NPR 1,500' },
      { name: 'Solar Installation & Maintenance', basePrice: 'NPR 1,500' },
      { name: 'Home Appliance Repair', basePrice: 'NPR 700' },
      { name: 'House Deep Cleaning', basePrice: 'NPR 1,000' },
      { name: 'Pest Control', basePrice: 'NPR 1,800' },
    ],
  },
  {
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: Car,
    color: 'from-amber-500 to-orange-600',
    description: 'On-demand roadside assistance, mobile mechanics, towing, tyre and battery replacements.',
    subcategories: [
      { name: 'Car Mechanic', basePrice: 'NPR 800' },
      { name: 'Bike Mechanic', basePrice: 'NPR 400' },
      { name: 'Vehicle Electrical Repair', basePrice: 'NPR 600' },
      { name: 'Car Washing & Detailing', basePrice: 'NPR 1,000' },
      { name: 'Tyre Repair & Replacement', basePrice: 'NPR 300' },
      { name: 'Battery Replacement', basePrice: 'NPR 500' },
      { name: 'Roadside Assistance', basePrice: 'NPR 1,000' },
      { name: 'Vehicle Towing', basePrice: 'NPR 2,500' },
    ],
  },
  {
    name: 'Construction and Labour Services',
    slug: 'construction-and-labour',
    icon: HardHat,
    color: 'from-rose-600 to-red-600',
    description: 'Vetted masons, tilers, welders, renovation contractors, and general labour support.',
    subcategories: [
      { name: 'Mason (डकर्मी)', basePrice: 'NPR 1,200' },
      { name: 'Construction Workers', basePrice: 'NPR 1,000' },
      { name: 'Tile & Marble Workers', basePrice: 'NPR 1,500' },
      { name: 'Welding Services', basePrice: 'NPR 800' },
      { name: 'Aluminium & Glass Workers', basePrice: 'NPR 1,000' },
      { name: 'House Renovation', basePrice: 'NPR 5,000' },
      { name: 'Interior Work', basePrice: 'NPR 3,000' },
      { name: 'General Labour', basePrice: 'NPR 800' },
    ],
  },
  {
    name: 'Personal and Lifestyle Services',
    slug: 'personal-and-lifestyle',
    icon: Heart,
    color: 'from-purple-600 to-pink-600',
    description: 'Bridal makeup, salon at home, event photographers, home tutors, and personal trainers.',
    subcategories: [
      { name: 'Beauty & Makeup Services', basePrice: 'NPR 1,500' },
      { name: 'Salon Services at Home', basePrice: 'NPR 600' },
      { name: 'Photography & Videography', basePrice: 'NPR 3,500' },
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
    color: 'from-indigo-600 to-blue-700',
    description: 'Certified IT technicians, laptop & mobile repairs, CCTV security systems, and digital support.',
    subcategories: [
      { name: 'Computer Repair', basePrice: 'NPR 700' },
      { name: 'Laptop Repair', basePrice: 'NPR 800' },
      { name: 'Mobile Repair', basePrice: 'NPR 500' },
      { name: 'CCTV Installation', basePrice: 'NPR 1,500' },
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
    color: 'from-emerald-600 to-teal-700',
    description: 'Professional drivers, delivery errands, movers & packers, gardening, and pet care.',
    subcategories: [
      { name: 'Drivers', basePrice: 'NPR 1,200' },
      { name: 'Delivery Assistance', basePrice: 'NPR 400' },
      { name: 'Movers & Packers', basePrice: 'NPR 4,500' },
      { name: 'Gardening & Landscaping', basePrice: 'NPR 800' },
      { name: 'Laundry & Ironing', basePrice: 'NPR 500' },
      { name: 'Pet Care & Sitting', basePrice: 'NPR 800' },
      { name: 'Office Maintenance', basePrice: 'NPR 2,000' },
    ],
  },
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES_DATA.filter((cat) => {
    const matchesCategory =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSub = cat.subcategories.some((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCategory || matchesSub;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Title & Search Bar */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          All Service Categories in Nepal
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Browse through our full catalog of 45+ specialized trades and hire verified local professionals near you.
        </p>

        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by trade, e.g., Plumber, AC Repair, Electrician, CCTV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-12">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.slug}
              id={category.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${category.color} flex items-center justify-center text-white shadow-md shadow-slate-200 shrink-0`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {category.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${category.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors shrink-0"
                >
                  <span>Explore Providers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Subcategories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub.name}
                    href={`/services/${category.slug}?sub=${encodeURIComponent(sub.name)}`}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {sub.name}
                      </div>
                      <div className="text-xs text-slate-400">Verified nearby experts</div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">From</span>
                      <span className="font-bold text-slate-900">{sub.basePrice}</span>
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
