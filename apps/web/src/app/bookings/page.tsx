'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Star,
  Layers,
  ArrowRight,
  Shield,
  CreditCard,
  X,
  RefreshCw,
  Navigation,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import LiveTrackingModal from '@/components/LiveTrackingModal';

export default function CustomerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  // Live Location Tracking modal state
  const [trackingBooking, setTrackingBooking] = useState<any>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/bookings/my?role=customer');
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      // Fallback sample bookings for instant demo
      setBookings([
        {
          _id: 'b1',
          bookingCode: 'SWX-2026-10492',
          subCategoryId: { name: 'Plumbing Services' },
          categoryId: { name: 'Home Maintenance' },
          status: 'accepted',
          scheduledTime: new Date().toISOString(),
          address: {
            areaName: 'Lokanthali',
            city: 'Bhaktapur',
            formattedAddress: 'Lokanthali Chowk, Madhyapur Thimi',
          },
          payment: { method: 'cash', totalAmount: 500, status: 'pending' },
          description: 'Bathroom pipe joint is leaking water onto floor. Need immediate repair and tap check.',
          providerId: {
            name: 'Ramesh Sharma',
            phoneNumber: '9841000000',
            businessName: 'Sharma Plumbing Works',
          },
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'b2',
          bookingCode: 'SWX-2026-09821',
          subCategoryId: { name: 'Bike Mechanic' },
          categoryId: { name: 'Vehicle Services' },
          status: 'completed',
          scheduledTime: new Date(Date.now() - 86400000).toISOString(),
          address: {
            areaName: 'Koteshwor',
            city: 'Kathmandu',
            formattedAddress: 'Near Koteshwor Mahadevsthan',
          },
          payment: { method: 'esewa', totalAmount: 400, status: 'completed' },
          description: 'Carburetor cleaning and spark plug check.',
          providerId: {
            name: 'Bikash Tamang',
            phoneNumber: '9800000000',
            businessName: 'Tamang Auto Care',
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenReview = (booking: any) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setComment('');
    setReviewSuccess(null);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    setSubmittingReview(true);

    try {
      await apiFetch('/bookings/review', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: selectedBookingForReview._id,
          rating,
          comment,
        }),
      });

      setReviewSuccess('Thank you for rating your service partner!');
      setTimeout(() => {
        setReviewModalOpen(false);
        fetchBookings();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return { label: 'Requested', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'accepted':
        return { label: 'Accepted by Partner', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'en_route':
        return { label: 'Partner En Route', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'in_progress':
        return { label: 'Work In Progress', bg: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 'completed':
        return { label: 'Service Completed', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'cancelled':
        return { label: 'Cancelled', bg: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return b.status !== 'completed' && b.status !== 'cancelled';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active service appointments, provider progress, and payment receipts.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#331e6a] hover:bg-[#25154f] text-white text-xs font-bold shadow-md shadow-[#331e6a]/25 transition-all shrink-0"
        >
          <span>Book New Service</span>
          <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {(['all', 'active', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab
                ? 'bg-[#331e6a] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Bookings' : tab === 'active' ? 'Active Jobs' : 'Completed History'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any bookings in this section. Explore nearby plumbers, electricians, mechanics and more.
            </p>
            <Link
              href="/services"
              className="inline-block mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              Browse Local Services &rarr;
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-extrabold text-[#331e6a] tracking-wider">
                      {booking.bookingCode}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {booking.subCategoryId?.name || 'Local Service'}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} inline-flex items-center gap-1.5`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current opacity-70"></span>
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 block">Service Location:</span>
                    <p className="text-slate-900 font-medium flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{booking.address?.formattedAddress || 'Lokanthali, Bhaktapur'}</span>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 block">Assigned Professional:</span>
                    <p className="text-slate-900 font-bold">
                      {booking.providerId?.name || 'Assigned Local Specialist'}
                    </p>
                    {booking.providerId?.phoneNumber && (
                      <p className="text-slate-500 font-mono">+977 {booking.providerId.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 block">Payment & Total:</span>
                    <p className="text-slate-900 font-extrabold text-sm">
                      NPR {booking.payment?.totalAmount}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                      {booking.payment?.method || 'CASH'} • {booking.payment?.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-900 font-semibold">Problem Description: </strong>
                  {booking.description}
                </div>

                {/* ── Live Location Tracking Banner when Accepted or En Route ── */}
                {(booking.status === 'accepted' ||
                  booking.status === 'en_route' ||
                  booking.status === 'in_progress') && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <div>
                        <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          <span>प्रदायकले काम स्वीकार गर्यो (Partner Accepted)</span>
                          <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            प्रत्यक्ष ट्र्याकिङ उपलब्ध
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800/80 mt-0.5 font-medium">
                          ग्राहकको ठेगाना र प्रदायकको प्रत्यक्ष GPS लोकेसन नक्सामा हेर्नुहोस्।
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTrackingBooking(booking)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all shrink-0"
                    >
                      <Navigation className="w-4 h-4 animate-pulse" />
                      <span>🗺️ प्रत्यक्ष ट्र्याक गर्नुहोस् (Track Location)</span>
                    </button>
                  </div>
                )}

                {booking.status === 'completed' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleOpenReview(booking)}
                      className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>Rate & Review Service</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Rate Service Quality</h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Customer Feedback / Experience
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share how the professional did on your job (punctuality, clean work, fair pricing)..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3 bg-[#331e6a] hover:bg-[#25154f] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Live Location Tracking Modal */}
      {trackingBooking && (
        <LiveTrackingModal
          booking={trackingBooking}
          onClose={() => setTrackingBooking(null)}
          onStatusUpdate={(newStatus) => {
            setBookings((prev) =>
              prev.map((b) => (b._id === trackingBooking._id ? { ...b, status: newStatus } : b))
            );
          }}
        />
      )}
    </div>
  );
}

