'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Upload,
  ArrowRight,
  RefreshCw,
  Building,
  MapPin,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const MAIN_CATEGORIES = [
  { id: '6639c0000000000000000001', name: 'Home Maintenance Services' },
  { id: '6639c0000000000000000002', name: 'Vehicle Services' },
  { id: '6639c0000000000000000003', name: 'Construction & Labour' },
  { id: '6639c0000000000000000004', name: 'Personal & Lifestyle' },
  { id: '6639c0000000000000000005', name: 'Technical & IT Support' },
  { id: '6639c0000000000000000006', name: 'Other On-Demand' },
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState(MAIN_CATEGORIES[0].id);
  const [skills, setSkills] = useState('Plumbing, Leak Repair, Pipe Fitting');
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseRate, setBaseRate] = useState(500);
  const [address, setAddress] = useState('Lokanthali, Bhaktapur');
  const [city, setCity] = useState('Bhaktapur');
  const [areaName, setAreaName] = useState('Lokanthali');

  const [docType, setDocType] = useState<'citizenship' | 'driving_license' | 'national_id' | 'business_pan'>('citizenship');
  const [docNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (bio.length < 10) {
      setError('Please provide at least 10 characters describing your skills.');
      return;
    }

    if (!docNumber) {
      setError('Identity document number is required.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean);

      await apiFetch('/providers/register', {
        method: 'POST',
        body: JSON.stringify({
          businessName: businessName || undefined,
          bio,
          categories: [category],
          subCategories: ['6639c0000000000000000002'],
          skills: skillsList,
          experienceYears: Number(experienceYears),
          location: {
            type: 'Point',
            coordinates: [85.3582, 27.6715],
          },
          address: {
            city,
            areaName,
            formattedAddress: address,
          },
          serviceRadiusKm: 10,
          pricingModel: 'fixed',
          baseRate: Number(baseRate),
          documents: {
            identityDocType: docType,
            identityNumber: docNumber,
            citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
          },
        }),
      });

      await refreshUser();
      router.push('/provider/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
          Partner Registration
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Join the SEWANEXA Service Partner Network
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Get direct job requests from customers in your neighborhood, set your own working hours, and grow your income with Nepal's premier local services platform.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Trade & Professional Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Business / Workshop Name (Optional)
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="E.g. Sharma Plumbing Works"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Trade Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                {MAIN_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Specific Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="E.g. Pipe Fitting, Water Tank Cleaning, Leak Repair"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Years of Work Experience
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Base Visit Fee (NPR)
              </label>
              <input
                type="number"
                min={100}
                step={50}
                value={baseRate}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Professional Description & Experience
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell customers about your craftsmanship, tools, and service reliability..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. Primary Service Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City / Municipality
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="E.g. Bhaktapur, Kathmandu, Lalitpur"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Neighborhood / Tole
              </label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="E.g. Lokanthali, Koteshwor, Baneshwor"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Lokanthali Chowk, Madhyapur Thimi"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Nepali Identity Document Verification
          </h2>
          <p className="text-xs text-slate-500">
            SEWANEXA verifies all service professionals to build trusted relationships with households in Nepal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="citizenship">Nepali Citizenship (नागरिकता)</option>
                <option value="driving_license">Driving License</option>
                <option value="national_id">National Identity Card (राष्ट्रिय परिचयपत्र)</option>
                <option value="business_pan">Business PAN / Registration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Identity Document Number
              </label>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="27-01-70-12345"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors">
            <Upload className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">
              Upload Document Photo (Front & Back)
            </span>
            <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or PDF up to 10MB</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Submit Partner Application</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

