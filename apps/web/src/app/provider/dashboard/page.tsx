'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Wallet,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  RefreshCw,
  Power,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

export default function ProviderDashboardPage() {
  const { user, providerProfile, refreshUser } = useAuth();

  const [isOnline, setIsOnline] = useState(providerProfile?.isOnline ?? true);
  const [walletBalance, setWalletBalance] = useState(providerProfile?.wallet?.currentBalance || 0);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProviderJobs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/bookings/my?role=provider');
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      // Demo jobs for preview
      setJobs([
        {
          _id: 'job1',
          bookingCode: 'SWX-2026-10492',
          customerId: { name: 'Sajan Kafle', phoneNumber: '9841234567' },
          subCategoryId: { name: 'Plumbing Services' },
          status: 'requested',
          address: {
            areaName: 'Lokanthali',
            city: 'Bhaktapur',
            formattedAddress: 'Lokanthali Chowk near Bhatbhateni',
          },
          description: 'Bathroom washbasin pipe joint leaking heavily. Need washer change and valve tightening.',
          payment: { totalAmount: 500, method: 'cash' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderJobs();
  }, []);

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      await apiFetch('/providers/toggle-online', {
        method: 'PUT',
        body: JSON.stringify({ isOnline: nextState }),
      });
      await refreshUser();
    } catch (err) {
      console.warn('Failed to update online state:', err);
    }
  };

  const handleUpdateStatus = async (jobId: string, status: string) => {
    setUpdatingId(jobId);
    try {
      await apiFetch(`/bookings/${jobId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await fetchProviderJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to update job status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Partner Control Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Service Partner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your service availability, real-time incoming jobs, and platform commission ledger.
          </p>
        </div>

        {/* Online / Offline Switch */}
        <button
          type="button"
          onClick={handleToggleOnline}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2.5 shadow-sm transition-all ${
            isOnline
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'Online (Receiving Jobs)' : 'Offline (Paused)'}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Wallet Balance</span>
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            NPR {walletBalance}
          </div>
          <div className="text-[11px] text-slate-400">Available earnings & commission credit</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Commission</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Standard</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">10%</div>
          <div className="text-[11px] text-slate-400">Automatically settled on completed jobs</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Service Rating</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ★ {providerProfile?.ratings?.average || 4.9}
          </div>
          <div className="text-[11px] text-slate-400">Based on verified customer reviews</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Verification Status</span>
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-lg font-extrabold text-emerald-600 uppercase">
            {providerProfile?.documents?.verificationStatus || 'Verified'}
          </div>
          <div className="text-[11px] text-slate-400">Citizenship & documents approved</div>
        </div>
      </div>

      {/* Incoming & Active Jobs Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Job Requests & Active Work</h2>
          <button
            type="button"
            onClick={fetchProviderJobs}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Jobs</span>
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Pending Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You're currently marked as {isOnline ? 'Online' : 'Offline'}. Incoming booking requests within your radius will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-blue-700">{job.bookingCode}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {job.subCategoryId?.name || 'Local Service'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Customer Total</span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      NPR {job.payment?.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400">Service Location:</span>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.address?.formattedAddress || 'Lokanthali, Bhaktapur'}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400">Customer Contact:</span>
                    <p className="text-slate-800 font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{job.customerId?.name || 'Customer'} (+977 {job.customerId?.phoneNumber || '98XXXXXXXX'})</span>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-900">Task Details: </strong>
                  {job.description}
                </div>

                {/* Status progression buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                  {job.status === 'requested' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job._id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(job._id, 'accepted')}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                      >
                        Accept Service Request
                      </button>
                    </>
                  )}

                  {job.status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(job._id, 'en_route')}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Start Journey (En Route)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {job.status === 'en_route' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(job._id, 'in_progress')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>Arrived at Customer (Start Work)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {job.status === 'in_progress' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(job._id, 'completed')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Job & Collect Fee</span>
                    </button>
                  )}

                  {job.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      ✓ Job Finished & Payment Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
