'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Lock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function BookProviderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const providerId = params?.providerId as string;

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/book/${providerId}`)}`);
    }
  }, [user, isLoading, router, providerId]);

  const [address, setAddress] = useState('Lokanthali, Bhaktapur, Bagmati Province');
  const [scheduledTime, setScheduledTime] = useState('Today (Within 2 Hours)');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'esewa' | 'khalti'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseRate = 500; // NPR

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (description.length < 10) {
      setError('Please provide at least 10 characters describing the issue or required service.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Create booking
      const res = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          providerId,
          bookingType: 'direct',
          categoryId: '6639c0000000000000000001',
          subCategoryId: '6639c0000000000000000002',
          jobLocation: {
            type: 'Point',
            coordinates: [85.3582, 27.6715],
          },
          address: {
            city: 'Bhaktapur',
            areaName: 'Lokanthali',
            formattedAddress: address,
          },
          scheduledTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          description,
          paymentMethod,
          estimatedAmount: baseRate,
        }),
      });

      const booking = res.booking;

      // Handle digital payments
      if (paymentMethod === 'esewa') {
        const esewaRes = await apiFetch('/payments/esewa/initiate', {
          method: 'POST',
          body: JSON.stringify({
            bookingId: booking._id,
            amount: baseRate,
          }),
        });

        // Submit hidden form to eSewa gateway
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = esewaRes.gatewayUrl;

        Object.entries(esewaRes.paymentParams).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      } else if (paymentMethod === 'khalti') {
        const khaltiRes = await apiFetch('/payments/khalti/initiate', {
          method: 'POST',
          body: JSON.stringify({
            bookingId: booking._id,
            amount: baseRate,
          }),
        });

        if (khaltiRes.paymentUrl) {
          window.location.href = khaltiRes.paymentUrl;
          return;
        }
      }

      // Cash flow
      router.push('/bookings?success=true');
    } catch (err: any) {
      setError(err.message || 'Failed to place booking.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-[#ede8f7] text-[#331e6a] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Login Required to Book Service</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Redirecting to authentication portal so you can confirm and track your booking...
        </p>
        <Loader2 className="w-6 h-6 animate-spin text-[#331e6a]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Direct Hire
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Schedule Service Booking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify your location and issue description. The service professional will confirm within minutes.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Service Location & Landmark
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No, Ward No, Tole, City"
                className="w-full bg-transparent text-sm text-slate-800 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Preferred Timing
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="E.g. Today at 3 PM or Tomorrow Morning"
                className="w-full bg-transparent text-sm text-slate-800 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          {/* Problem description */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Describe the Issue or Service Details
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. The bathroom mixer tap is leaking and pipe valve is loose. Please bring replacement washers and sealant."
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 text-sm text-slate-800 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Choose Payment Method
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-900">Cash on Service</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="accent-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay directly to provider in cash after service completion.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'esewa'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-emerald-800">eSewa ePay v2</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'esewa'}
                    onChange={() => setPaymentMethod('esewa')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant digital payment with eSewa account or mobile banking.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'khalti'
                    ? 'border-purple-600 bg-purple-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-purple-800">Khalti v2</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'khalti'}
                    onChange={() => setPaymentMethod('khalti')}
                    className="accent-purple-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Digital payment via Khalti wallet, ConnectIPS or eBanking.
                </p>
              </label>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Standard Visit & Inspection Fee</span>
              <span className="font-semibold text-slate-800">NPR {baseRate}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Platform Booking Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Estimated Payable</span>
              <span className="text-blue-700">NPR {baseRate}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              * Any spare parts or hardware required will be charged on actual receipt.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Confirm Service Booking</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
