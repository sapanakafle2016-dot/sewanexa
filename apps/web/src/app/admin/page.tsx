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
} from 'lucide-react';
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
    totalCommissionsEarnedNPR: 14250,
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
      if (pendingRes.success) {
        setPendingProviders(pendingRes.data);
      }
    } catch (err) {
      // Keep demo mock data if not logged in as admin yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Centralized Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            SEWANEXA Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervise user verifications, category commission settlements, and bookings across Nepal.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAdminData}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalCustomers}</div>
          <div className="text-[11px] text-slate-400">Verified mobile accounts</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Providers</span>
            <Briefcase className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.verifiedProviders}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {stats.pendingVerifications} awaiting verification
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalBookings}</div>
          <div className="text-[11px] text-slate-400">{stats.completedBookings} successfully completed</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Commission Revenue</span>
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            NPR {stats.totalCommissionsEarnedNPR}
          </div>
          <div className="text-[11px] text-slate-400">10% platform share collected</div>
        </div>
      </div>

      {/* Verification Queue Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Provider Identity Verification Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review Nepali citizenship and business registration documents before granting verified badge.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
            {pendingProviders.length} Pending
          </span>
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

                <div className="flex items-center gap-3">
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
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
                  >
                    Verify & Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
