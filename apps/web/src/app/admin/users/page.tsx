'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  Shield,
  ShoppingBag,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const MOCK_USERS = [
  {
    _id: 'u_c1',
    name: 'Sajan Kafle',
    phoneNumber: '9841122334',
    email: 'sajan.sangalo@gmail.com',
    role: 'customer',
    status: 'active',
    isPhoneVerified: true,
    bookingsCount: 8,
    createdAt: '2026-01-10T08:30:00.000Z',
  },
  {
    _id: 'u_p1',
    name: 'Ramesh Sharma',
    phoneNumber: '9841234567',
    email: 'ramesh.sharma@gmail.com',
    role: 'provider',
    status: 'active',
    isPhoneVerified: true,
    bookingsCount: 38,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    _id: 'u_c2',
    name: 'Aayush Shrestha',
    phoneNumber: '9861556677',
    email: 'aayush.shrestha@gmail.com',
    role: 'customer',
    status: 'active',
    isPhoneVerified: true,
    bookingsCount: 3,
    createdAt: '2026-02-01T14:20:00.000Z',
  },
  {
    _id: 'u_c3',
    name: 'Pooja Bhattarai',
    phoneNumber: '9801889900',
    email: 'pooja.b@gmail.com',
    role: 'customer',
    status: 'suspended',
    isPhoneVerified: true,
    bookingsCount: 1,
    createdAt: '2026-02-20T09:15:00.000Z',
  },
  {
    _id: 'u_a1',
    name: 'Sangalo Administrator',
    phoneNumber: '9800000001',
    email: 'admin@sangalotech.com',
    role: 'admin',
    status: 'active',
    isPhoneVerified: true,
    bookingsCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(roleFilter !== 'all' ? { role: roleFilter } : {}),
        ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        ...(search ? { search } : {}),
      });
      const res = await apiFetch(`/admin/users?${params}`);
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      // Local fallback for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      u.name?.toLowerCase().includes(q) ||
      u.phoneNumber?.includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = async (userObj: any) => {
    const newStatus = userObj.status === 'suspended' ? 'active' : 'suspended';
    const confirm = window.confirm(
      `Are you sure you want to mark ${userObj.name} as ${newStatus.toUpperCase()}?`
    );
    if (!confirm) return;

    try {
      await apiFetch(`/admin/users/${userObj._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userObj._id ? { ...u, status: newStatus } : u))
      );
      alert(`User is now ${newStatus}.`);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    const confirm = window.confirm(`Change user role to ${newRole}?`);
    if (!confirm) return;

    try {
      await apiFetch(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      alert(`User role updated to ${newRole}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              <span>Accounts & Permissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              User & Customer Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Supervise all customer profiles, service provider accounts, and administrative roles.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Users</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {['all', 'customer', 'provider', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3.5 py-2 rounded-xl transition-all capitalize ${
                    roleFilter === role
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {role === 'all' ? 'All Roles' : `${role}s`}
                </button>
              ))}

              <button
                onClick={() => setStatusFilter(statusFilter === 'suspended' ? 'all' : 'suspended')}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  statusFilter === 'suspended'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                Suspended Only
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, or email..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Total Bookings</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSuspended = u.status === 'suspended';
                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                              <span className="text-[10px] text-slate-400">ID: {u._id.slice(-6)}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.phoneNumber}</span>
                            {u.isPhoneVerified && (
                              <span title="Verified OTP">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          {u.email && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{u.email}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u._id, e.target.value)}
                            className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border focus:outline-none capitalize ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.role === 'provider'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="customer">Customer</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.bookingsCount || 0} jobs</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isSuspended
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>Suspended</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-slate-500 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString('ne-NP', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors ${
                              isSuspended
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            {isSuspended ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Unsuspend</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3.5 h-3.5" />
                                <span>Suspend</span>
                              </>
                            )}
                          </button>
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
    </div>
  );
}
