import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  Car,
  HardHat,
  Heart,
  Cpu,
  MoreHorizontal,
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Home Maintenance',
    slug: 'home-maintenance',
    icon: Wrench,
    color: 'from-blue-500 to-cyan-500',
    count: '10 services',
    description: 'Plumbing, Electrician, House Painting, AC & Carpentry',
  },
  {
    name: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: Car,
    color: 'from-amber-500 to-orange-500',
    count: '8 services',
    description: 'Car & Bike Mechanics, Towing, Roadside Assistance & Tyre',
  },
  {
    name: 'Construction & Labour',
    slug: 'construction-and-labour',
    icon: HardHat,
    color: 'from-rose-500 to-red-500',
    count: '8 services',
    description: 'Masons, Tiling, Welding, Aluminium & Renovation',
  },
  {
    name: 'Personal & Lifestyle',
    slug: 'personal-and-lifestyle',
    icon: Heart,
    color: 'from-pink-500 to-purple-500',
    count: '7 services',
    description: 'Salon, Makeup, Photography, Event Decor & Tutors',
  },
  {
    name: 'Technical & IT',
    slug: 'professional-and-technical',
    icon: Cpu,
    color: 'from-indigo-500 to-blue-600',
    count: '8 services',
    description: 'Laptop & Mobile Repair, CCTV, Networking & IT Support',
  },
  {
    name: 'Other On-Demand',
    slug: 'other-services',
    icon: MoreHorizontal,
    color: 'from-emerald-500 to-teal-500',
    count: '7 services',
    description: 'Drivers, Movers & Packers, Laundry, Gardening & Pets',
  },
];

const SAMPLE_PROVIDERS = [
  {
    id: '1',
    name: 'Ramesh Sharma',
    service: 'Master Plumber & Sanitary Expert',
    location: 'Lokanthali, Bhaktapur',
    distance: '0.9 km',
    rating: 4.9,
    reviews: 38,
    rate: 'NPR 500',
    isOnline: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Bikash Tamang',
    service: 'Automobile & Bike Mechanic',
    location: 'Koteshwor, Kathmandu',
    distance: '1.4 km',
    rating: 4.8,
    reviews: 52,
    rate: 'NPR 400',
    isOnline: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Sunita Maharjan',
    service: 'Professional House & Office Deep Cleaning',
    location: 'Patan, Lalitpur',
    distance: '2.8 km',
    rating: 5.0,
    reviews: 29,
    rate: 'NPR 1,000',
    isOnline: true,
    verified: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pt-16 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold tracking-wide border border-blue-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nepal's Premier Local Services Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Your Local Services, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Connected.</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with verified plumbers, electricians, mechanics, painters, and skilled technicians nearby within 1 to 10 km. Fast booking, real-time tracking, and trusted reviews.
          </p>

          {/* Location & Service Search Bar */}
          <div className="max-w-3xl mx-auto mt-8 bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Location input with GPS button */}
              <div className="md:col-span-5 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Lokanthali, Bhaktapur"
                  className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                  defaultValue="Lokanthali, Bhaktapur"
                />
                <button
                  type="button"
                  title="Use current GPS"
                  className="text-[11px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md hover:bg-blue-200"
                >
                  GPS
                </button>
              </div>

              {/* Service Category or Keyword */}
              <div className="md:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="E.g. Plumber, Electrician, AC..."
                  className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Search Radius & Action */}
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Filter Radius Pills */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 px-2">
              <span className="font-medium text-slate-400">Search Radius:</span>
              {['1 km', '2 km', '5 km', '10 km', 'All Valley'].map((radius, idx) => (
                <button
                  key={radius}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                    idx === 2
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Local Service Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select from over 45+ specialized trade and on-demand services across Nepal.
            </p>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/services/${cat.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400/80 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md shadow-slate-200 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Browse Experts</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Nearby Active Service Providers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Verified Professionals Near You
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Ranked by proximity and customer ratings in the Kathmandu Valley.
            </p>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Center: <strong>Lokanthali, Bhaktapur</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-base">{provider.name}</h4>
                      {provider.verified && (
                        <span title="Verified Professional">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{provider.service}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.location}</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {provider.distance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{provider.rating}</span>
                    <span className="text-slate-400 font-normal">({provider.reviews} jobs)</span>
                  </div>
                  <div className="text-slate-700">
                    Base: <strong className="text-slate-900 font-bold">{provider.rate}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/providers/${provider.id}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href={`/book/${provider.id}`}
                  className="flex-1 text-center py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nepal Payment Gateways Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
                Seamless Payment Ecosystem
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Pay Securely with Nepal's Leading Payment Gateways
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Whether you prefer instant digital transfers with eSewa or Khalti, or cash after satisfactory service completion, SEWANEXA ensures transparent receipts and automated platform commission settlements.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-bold tracking-wide">eSewa ePay v2</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-xs font-bold tracking-wide">Khalti v2 (API & SDK)</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-xs font-bold tracking-wide">Cash on Delivery</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4 text-xs">
              <div className="font-semibold text-slate-200 uppercase tracking-wider">
                Fair & Transparent Model
              </div>
              <ul className="space-y-2.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>No hidden booking charges for customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>10% transparent platform commission on completed jobs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Automated digital ledger & dispute reconciliation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Recruitment CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl shadow-blue-600/10">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Are You a Skilled Professional or Business in Nepal?
          </h3>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed">
            Register your profile on SEWANEXA, verify your citizenship or business documents, set your working hours, and receive nearby job alerts on your phone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/provider/register"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all"
            >
              Register as Service Partner
            </Link>
            <Link
              href="/provider/how-it-works"
              className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
            >
              How It Works for Providers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
