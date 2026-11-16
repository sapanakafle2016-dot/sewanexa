'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  RefreshCw,
  Phone,
  MapPin,
  Briefcase,
  Star,
  ExternalLink,
  Ban,
  Unlock,
  X,
  CreditCard,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const MOCK_PROVIDERS = [
  {
    _id: 'prov_1',
    userId: {
      _id: 'u_1',
      name: 'Ramesh Sharma',
      phoneNumber: '9841234567',
      email: 'ramesh.sharma@gmail.com',
      status: 'active',
    },
    businessName: 'Sharma Plumbing & Pipe Works',
    experienceYears: 10,
    categories: [{ name: 'Home Maintenance & Repair' }],
    skills: ['Pipe Fitting', 'Sanitary', 'Water Tank Leak', 'Drainage'],
    documents: {
      verificationStatus: 'verified',
      identityDocType: 'citizenship',
      identityNumber: '27-01-72-12345',
      citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      citizenshipBack: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      verifiedAt: '2026-02-15T10:00:00.000Z',
    },
    address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
    isOnline: true,
    ratings: { average: 4.9, count: 38 },
    wallet: { currentBalance: 4200, escrowBalance: 500 },
  },
  {
    _id: 'prov_2',
    userId: {
      _id: 'u_2',
      name: 'Kiran Thapa',
      phoneNumber: '9860123456',
      email: 'kiran.thapa@gmail.com',
      status: 'active',
    },
    businessName: 'Thapa Tile & Marble Works',
    experienceYears: 6,
    categories: [{ name: 'Construction & Labour' }],
    skills: ['Tile Fitting', 'Marble Polishing', 'Grouting'],
    documents: {
      verificationStatus: 'pending',
      identityDocType: 'citizenship',
      identityNumber: '27-01-72-98765',
      citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      citizenshipBack: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    },
    address: { areaName: 'Ghattekulo', city: 'Kathmandu' },
    isOnline: false,
    ratings: { average: 0, count: 0 },
    wallet: { currentBalance: 0, escrowBalance: 0 },
  },
  {
    _id: 'prov_3',
    userId: {
      _id: 'u_3',
      name: 'Bikash Tamang',
      phoneNumber: '9801234567',
      email: 'bikash.tamang@gmail.com',
      status: 'active',
    },
    businessName: 'Tamang Mobile Auto Workshop',
    experienceYears: 8,
    categories: [{ name: 'Vehicle & Roadside Assistance' }],
    skills: ['Bike Servicing', 'Battery Jumpstart', 'Car Wiring', 'Puncture'],
    documents: {
      verificationStatus: 'verified',
      identityDocType: 'citizenship',
      identityNumber: '28-02-74-45678',
      citizenshipFront: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      verifiedAt: '2026-03-01T12:00:00.000Z',
    },
    address: { areaName: 'Koteshwor', city: 'Kathmandu' },
    isOnline: true,
    ratings: { average: 4.8, count: 52 },
    wallet: { currentBalance: 6800, escrowBalance: 1200 },
  },
];

export default function AdminProvidersPage() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<any[]>(MOCK_PROVIDERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        ...(search ? { search } : {}),
      });
      const res = await apiFetch(`/admin/providers?${params}`);
      if (res.success && res.data) {
        setProviders(res.data);
      }
    } catch (err) {
      // Fallback to local filtering for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProviders();
  };

  const filteredProviders = providers.filter((p) => {
    const matchesStatus =
      statusFilter === 'all' || p.documents?.verificationStatus === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.userId?.name?.toLowerCase().includes(q) ||
      p.userId?.phoneNumber?.includes(q) ||
      p.businessName?.toLowerCase().includes(q) ||
      p.documents?.identityNumber?.includes(q) ||
      p.skills?.some((s: string) => s.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = providers.filter((p) => p.documents?.verificationStatus === 'pending').length;

  const handleReviewVerification = async (providerId: string, action: 'approve' | 'reject') => {
    let rejectionReason = '';
    if (action === 'reject') {
      const promptRes = window.prompt('Please enter the reason for rejecting verification:');
      if (promptRes === null) return;
      rejectionReason = promptRes || 'Documents did not meet Nepal citizenship verification standards.';
    }

    setActionLoading(true);
    try {
      await apiFetch(`/admin/providers/${providerId}/review`, {
        method: 'POST',
        body: JSON.stringify({ action, rejectionReason }),
      });

      // Update local state
      setProviders((prev) =>
        prev.map((p) =>
          p._id === providerId
            ? {
                ...p,
                documents: {
                  ...p.documents,
                  verificationStatus: action === 'approve' ? 'verified' : 'rejected',
                  rejectionReason: action === 'reject' ? rejectionReason : undefined,
                  verifiedAt: action === 'approve' ? new Date().toISOString() : undefined,
                },
              }
            : p
        )
      );

      if (selectedProvider && selectedProvider._id === providerId) {
        setSelectedProvider((prev: any) => ({
          ...prev,
          documents: {
            ...prev.documents,
            verificationStatus: action === 'approve' ? 'verified' : 'rejected',
          },
        }));
      }

      alert(`Provider verification marked as ${action === 'approve' ? 'Approved' : 'Rejected'}.`);
      setInspectModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSuspend = async (provider: any) => {
    const newStatus = provider.userId?.status === 'suspended' ? 'active' : 'suspended';
    const confirm = window.confirm(
      `Are you sure you want to ${newStatus === 'suspended' ? 'SUSPEND' : 'ACTIVATE'} this provider?`
    );
    if (!confirm) return;

    try {
      await apiFetch(`/admin/providers/${provider._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ userStatus: newStatus }),
      });

      setProviders((prev) =>
        prev.map((p) =>
          p._id === provider._id
            ? { ...p, userId: { ...p.userId, status: newStatus } }
            : p
        )
      );
      alert(`Provider is now ${newStatus}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav pendingCount={pendingCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>National ID & Trade Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Service Providers & KYC Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify Nepali citizenship, approve trade credentials, and manage provider status across Nepal.
            </p>
          </div>

          <button
            onClick={fetchProviders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Providers</span>
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Providers ({providers.length})
              </button>

              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Pending KYC ({pendingCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  statusFilter === 'verified'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified ({providers.filter((p) => p.documents?.verificationStatus === 'verified').length})</span>
              </button>

              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Rejected</span>
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, trade, ID..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </form>
          </div>
        </div>

        {/* Providers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Provider / Business</th>
                  <th className="py-3.5 px-4">Category & Skills</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">KYC Status</th>
                  <th className="py-3.5 px-4">Wallet (NPR)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No service providers found matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((prov) => {
                    const status = prov.documents?.verificationStatus || 'pending';
                    const isSuspended = prov.userId?.status === 'suspended';

                    return (
                      <tr key={prov._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
                              {prov.userId?.name?.[0] || 'P'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-sm">{prov.userId?.name}</span>
                                {status === 'verified' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-semibold">{prov.businessName || 'Independent Pro'}</p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>{prov.userId?.phoneNumber}</span>
                                <span>•</span>
                                <span>{prov.experienceYears || 1} yrs exp</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-bold text-slate-800 text-xs">
                            {prov.categories?.[0]?.name || 'Trade Services'}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prov.skills?.slice(0, 3).map((s: string) => (
                              <span
                                key={s}
                                className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium"
                              >
                                {s}
                              </span>
                            ))}
                            {prov.skills?.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{prov.skills.length - 3}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {prov.address?.areaName || 'Lokanthali'}, {prov.address?.city || 'Bhaktapur'}
                            </span>
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              prov.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {prov.isOnline ? '● Online & Ready' : '○ Offline'}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {status === 'verified' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified KYC</span>
                            </span>
                          )}
                          {status === 'pending' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Needs Review</span>
                            </span>
                          )}
                          {status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-extrabold text-slate-900 text-sm">
                            रु. {prov.wallet?.currentBalance?.toLocaleString() || 0}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Escrow: रु. {prov.wallet?.escrowBalance?.toLocaleString() || 0}
                          </p>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProvider(prov);
                                setInspectModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                              title="Inspect Citizenship and Trade Documents"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Review KYC</span>
                            </button>

                            <button
                              onClick={() => handleToggleSuspend(prov)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                isSuspended
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                              title={isSuspended ? 'Unsuspend Account' : 'Suspend Account'}
                            >
                              {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* KYC Inspection & Review Modal */}
      {inspectModalOpen && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Nepal Government KYC Review
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedProvider.userId?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProvider.businessName} • {selectedProvider.userId?.phoneNumber}
                </p>
              </div>

              <button
                onClick={() => setInspectModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Identity & Trade Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-semibold">Document Type:</span>
                <span className="font-extrabold text-slate-800 uppercase">
                  {selectedProvider.documents?.identityDocType?.replace('_', ' ') || 'Citizenship'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Certificate / ID No:</span>
                <span className="font-extrabold text-blue-700">
                  {selectedProvider.documents?.identityNumber || '27-01-72-98765'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Experience:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedProvider.experienceYears || 5} Years in Trade
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Location:</span>
                <span className="font-extrabold text-slate-800">
                  {selectedProvider.address?.areaName}, {selectedProvider.address?.city}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Current KYC Status:</span>
                <span className="font-extrabold text-slate-800 capitalize">
                  {selectedProvider.documents?.verificationStatus || 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Wallet Balance:</span>
                <span className="font-extrabold text-emerald-700">
                  रु. {selectedProvider.wallet?.currentBalance || 0}
                </span>
              </div>
            </div>

            {/* Document Images Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Submitted Identity Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100">
                  <div className="p-2 text-[10px] font-bold text-slate-600 bg-white border-b border-slate-200 flex justify-between items-center">
                    <span>Citizenship Front Side (नागरिकता अगाडि)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <img
                    src={selectedProvider.documents?.citizenshipFront || 'https://images.unsplash.com/photo-1544717305-2782549b5136'}
                    alt="Citizenship Front"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100">
                  <div className="p-2 text-[10px] font-bold text-slate-600 bg-white border-b border-slate-200 flex justify-between items-center">
                    <span>Citizenship Back Side (नागरिकता पछाडि)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                  <img
                    src={selectedProvider.documents?.citizenshipBack || 'https://images.unsplash.com/photo-1544717305-2782549b5136'}
                    alt="Citizenship Back"
                    className="w-full h-44 object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setInspectModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleReviewVerification(selectedProvider._id, 'reject')}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-200"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleReviewVerification(selectedProvider._id, 'approve')}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify KYC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

