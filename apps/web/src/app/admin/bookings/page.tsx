'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { AdminNav } from '@/components/admin/AdminNav';
import {
  Calendar, Search, Filter, ChevronDown, Eye,
  CheckCircle2, Clock, XCircle, Truck, Wrench, Star,
  RefreshCcw, AlertCircle,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  requested:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  accepted:   'bg-blue-50 text-blue-700 border-blue-200',
  en_route:   'bg-purple-50 text-purple-700 border-purple-200',
  in_progress:'bg-orange-50 text-orange-700 border-orange-200',
  completed:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
  rejected:   'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_ICON: Record<string, JSX.Element> = {
  requested:   <Clock size={12} />,
  accepted:    <CheckCircle2 size={12} />,
  en_route:    <Truck size={12} />,
  in_progress: <Wrench size={12} />,
  completed:   <Star size={12} />,
  cancelled:   <XCircle size={12} />,
  rejected:    <XCircle size={12} />,
};

const PAYMENT_BADGE: Record<string, string> = {
  esewa:  'bg-green-100 text-green-700',
  khalti: 'bg-purple-100 text-purple-700',
  cash:   'bg-slate-100 text-slate-600',
};

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const LIMIT = 20;

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/'); return;
    }
    fetchBookings();
  }, [user, page, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { paymentMethod: paymentFilter }),
      });
      const res = await apiFetch(`/admin/bookings?${params}`);
      if (res.success) {
        setBookings(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.total || res.data?.length || 0);
      } else {
        setError(res.message || 'Failed to load bookings.');
      }
    } catch {
      // Demo fallback
      setBookings([
        {
          _id: 'bk1',
          bookingCode: 'SWX-2026-10492',
          customerId: { name: 'Sajan Kafle', phoneNumber: '9841234567' },
          providerId: { name: 'Ramesh Sharma', phoneNumber: '9800000001' },
          subCategoryId: { name: 'Plumbing Services' },
          status: 'completed',
          address: { areaName: 'Lokanthali', city: 'Bhaktapur' },
          payment: { method: 'esewa', totalAmount: 650, platformCommission: 65, providerAmount: 585, status: 'paid' },
          scheduledTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'bk2',
          bookingCode: 'SWX-2026-10491',
          customerId: { name: 'Priya Thapa', phoneNumber: '9812345678' },
          providerId: { name: 'Bikash Tamang', phoneNumber: '9800000002' },
          subCategoryId: { name: 'Car Mechanic' },
          status: 'in_progress',
          address: { areaName: 'Koteshwor', city: 'Kathmandu' },
          payment: { method: 'khalti', totalAmount: 800, platformCommission: 80, providerAmount: 720, status: 'paid' },
          scheduledTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          _id: 'bk3',
          bookingCode: 'SWX-2026-10490',
          customerId: { name: 'Manish Gurung', phoneNumber: '9823456789' },
          providerId: null,
          subCategoryId: { name: 'Electrician' },
          status: 'requested',
          address: { areaName: 'Patan', city: 'Lalitpur' },
          payment: { method: 'cash', totalAmount: 500, platformCommission: 50, providerAmount: 450, status: 'pending' },
          scheduledTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setTotalCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingCode?.toLowerCase().includes(q) ||
      b.customerId?.name?.toLowerCase().includes(q) ||
      b.providerId?.name?.toLowerCase().includes(q) ||
      b.subCategoryId?.name?.toLowerCase().includes(q)
    );
  });

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">All Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">{totalCount} total bookings on SEWANEXA</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setPage(1); fetchBookings(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              <RefreshCcw size={14} />
              Refresh
            </button>
            <a
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition"
            >
              ← Dashboard
            </a>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search booking code, customer, provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="accepted">Accepted</option>
              <option value="en_route">En Route</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
              className="border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="cash">Cash</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm">Loading bookings...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Calendar size={40} strokeWidth={1.5} />
              <p className="text-sm">No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Booking Code', 'Customer', 'Provider', 'Service', 'Status', 'Payment', 'Amount (NPR)', 'Commission', 'Date'].map((h) => (
                      <th key={h} className="text-left text-xs font-black text-slate-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600 whitespace-nowrap">
                        {b.bookingCode}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">{b.customerId?.name || '—'}</p>
                        <p className="text-xs text-slate-400">+977 {b.customerId?.phoneNumber}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {b.providerId ? (
                          <>
                            <p className="font-semibold text-slate-900">{b.providerId.name}</p>
                            <p className="text-xs text-slate-400">+977 {b.providerId.phoneNumber}</p>
                          </>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        {b.subCategoryId?.name || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[b.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {STATUS_ICON[b.status]}
                          {b.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${PAYMENT_BADGE[b.payment?.method] || 'bg-slate-100 text-slate-600'}`}
                        >
                          {b.payment?.method || 'N/A'}
                        </span>
                        {b.payment?.status === 'paid' && (
                          <span className="ml-1 text-green-600 text-xs">✓</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-slate-900">
                        NPR {b.payment?.totalAmount?.toLocaleString() || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-orange-600 font-semibold text-xs">
                        NPR {b.payment?.platformCommission?.toLocaleString() || '—'}
                        {b.payment?.platformCommission && (
                          <span className="text-slate-400 ml-1">(10%)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">
                        {b.createdAt ? fmtDate(b.createdAt) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Commission Summary */}
        {!loading && filtered.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              {
                label: 'Total Revenue (Displayed)',
                value: `NPR ${filtered.reduce((s, b) => s + (b.payment?.totalAmount || 0), 0).toLocaleString()}`,
                color: 'bg-blue-50 text-blue-700',
              },
              {
                label: 'Platform Commission (10%)',
                value: `NPR ${filtered.reduce((s, b) => s + (b.payment?.platformCommission || 0), 0).toLocaleString()}`,
                color: 'bg-orange-50 text-orange-700',
              },
              {
                label: 'Provider Payout (90%)',
                value: `NPR ${filtered.reduce((s, b) => s + (b.payment?.providerAmount || 0), 0).toLocaleString()}`,
                color: 'bg-green-50 text-green-700',
              },
            ].map((card) => (
              <div key={card.label} className={`${card.color} rounded-2xl p-4 border border-current/10`}>
                <p className="text-xs font-semibold opacity-70">{card.label}</p>
                <p className="text-xl font-black mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
    </div>
  );
}

