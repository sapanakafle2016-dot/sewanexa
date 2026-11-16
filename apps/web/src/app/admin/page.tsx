'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Briefcase,
  Layers,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  RefreshCw,
  Search,
  Wrench,
  CalendarCheck,
  CircleDollarSign,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function AdminPortalPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState<any>({
    totalCustomers: 124,
    totalProviders: 48,
    pendingVerifications: 3,
    verifiedProviders: 45,
    totalBookings: 289,
    completedBookings: 260,
    totalCommissionsEarnedNPR: 18450,
  });

  const [pendingProviders, setPendingProviders] = useState<any[]>([
    {
      _id: 'prov_pending_1',
      userId: { name: 'Kiran Thapa', phoneNumber: '9860123456' },
      businessName: 'Thapa Tile & Marble Works',
      categories: [{ name: 'Construction and Labour Services' }],
      documents: {
        identityDocType: 'citizenship',
        identityNumber: '27-01-72-98765',
        citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
      },
      address: { areaName: 'Ghattekulo', city: 'Kathmandu' },
      experienceYears: 6,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await apiFetch('/admin/dashboard-stats');
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const pendingRes = await apiFetch('/admin/pending-providers');
      if (pendingRes.success && pendingRes.data) {
        setPendingProviders(pendingRes.data);
      }
    } catch (err) {
      // Keep demo mock data if not logged in as admin yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      fetchAdminData();
    }
  }, [user]);

  const handleReviewProvider = async (providerId: string, action: 'approve' | 'reject') => {
    try {
      await apiFetch(`/admin/providers/${providerId}/review`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      });
      alert(`Provider verification has been ${action === 'approve' ? 'approved' : 'rejected'}.`);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav pendingCount={pendingProviders.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <span>Centralized Platform Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              SEWANEXA Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Supervise user verifications, dynamic trade categories, jobs, and escrow settlements across Nepal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchAdminData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Overarching Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider">Total Customers</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalCustomers}</div>
            <div className="text-[11px] text-slate-400">Verified mobile users</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider">Active Providers</span>
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.verifiedProviders}</div>
            <div className="text-[11px] text-amber-600 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{stats.pendingVerifications} awaiting KYC review</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider">Total Bookings</span>
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalBookings}</div>
            <div className="text-[11px] text-slate-400">{stats.completedBookings} jobs completed</div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider">Commission (10%)</span>
              <CircleDollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">
              रु. {stats.totalCommissionsEarnedNPR?.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">10% platform share</div>
          </div>
        </div>

        {/* Quick Management Portals (Dashboard Launchpad) */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Administrative Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Services Card */}
            <Link
              href="/admin/services"
              className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                  Services & Categories
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Add new trades dynamically, configure NPR base fees, activate/deactivate subcategories in real time.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Manage 45+ Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Providers Card */}
            <Link
              href="/admin/providers"
              className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-400 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-emerald-600 transition-colors">
                  Providers & KYC Verifications
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Inspect citizenship front/back photos, verify trade skills, suspend accounts, and manage provider status.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Review {stats.pendingVerifications} Pending KYC</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Users Card */}
            <Link
              href="/admin/users"
              className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-400 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-purple-600 transition-colors">
                  Users & Customers
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Supervise user profiles, view booking counts, assign admin roles, and lock/unlock suspicious accounts.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                <span>Manage User Base</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Bookings Card */}
            <Link
              href="/admin/bookings"
              className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-400 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                  Bookings & Jobs
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Inspect active jobs across Kathmandu Valley, en route dispatches, cancellations, and customer reviews.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>View {stats.totalBookings} Bookings</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Financials & Payouts Card */}
            <Link
              href="/admin/payouts"
              className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-400 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                  Financials & Escrow Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Track eSewa/Khalti escrow locks, audit 10% platform cuts, and settle earnings directly to provider wallets.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Open Financials Ledger</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Verification Queue Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Urgent Provider KYC Verification Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect citizenship certificate details and verify trades before dispatching jobs.
              </p>
            </div>
            <Link
              href="/admin/providers?status=pending"
              className="px-3.5 py-1.5 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-full border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <span>{pendingProviders.length} Pending Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingProviders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No service provider applications pending verification. All caught up!
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProviders.map((prov) => (
                <div
                  key={prov._id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {prov.userId?.name || 'Applicant'}
                      </span>
                      {prov.businessName && (
                        <span className="text-slate-500 font-semibold">({prov.businessName})</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600">
                      <span>Phone: +977 {prov.userId?.phoneNumber}</span>
                      <span>•</span>
                      <span>Trade: {prov.categories?.[0]?.name || 'Trade'}</span>
                      <span>•</span>
                      <span>Location: {prov.address?.areaName}, {prov.address?.city}</span>
                    </div>
                    <div className="font-mono text-slate-500">
                      Doc Type: <strong>{prov.documents?.identityDocType}</strong> | Number: <strong>{prov.documents?.identityNumber}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/admin/providers"
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-colors"
                    >
                      Inspect Documents
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleReviewProvider(prov._id, 'reject')}
                      className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReviewProvider(prov._id, 'approve')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
                    >
                      Verify & Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
