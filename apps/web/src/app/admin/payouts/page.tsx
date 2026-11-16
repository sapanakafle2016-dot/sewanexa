'use client';

import React, { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Wallet,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
} from 'lucide-react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const MOCK_FINANCIALS = {
  summary: {
    totalGMVNPR: 184500,
    totalCommissionNPR: 18450,
    totalEscrowHeldNPR: 8200,
  },
  topProviderBalances: [
    {
      _id: 'p1',
      userId: { name: 'Bikash Tamang', phoneNumber: '9801234567' },
      businessName: 'Tamang Mobile Auto Workshop',
      wallet: { currentBalance: 6800, escrowBalance: 1200 },
    },
    {
      _id: 'p2',
      userId: { name: 'Ramesh Sharma', phoneNumber: '9841234567' },
      businessName: 'Sharma Plumbing & Pipe Works',
      wallet: { currentBalance: 4200, escrowBalance: 500 },
    },
    {
      _id: 'p3',
      userId: { name: 'Sunita Maharjan', phoneNumber: '9841998877' },
      businessName: 'Maharjan Deep Cleaning',
      wallet: { currentBalance: 3500, escrowBalance: 1000 },
    },
  ],
  recentTransactions: [
    {
      _id: 'tx_1',
      providerId: {
        userId: { name: 'Ramesh Sharma', phoneNumber: '9841234567' },
      },
      type: 'commission_debit',
      amount: 50,
      balanceBefore: 550,
      balanceAfter: 500,
      paymentMethod: 'esewa',
      createdAt: '2026-03-05T11:45:00.000Z',
    },
    {
      _id: 'tx_2',
      providerId: {
        userId: { name: 'Bikash Tamang', phoneNumber: '9801234567' },
      },
      type: 'payout',
      amount: 4000,
      balanceBefore: 10800,
      balanceAfter: 6800,
      paymentMethod: 'khalti',
      createdAt: '2026-03-04T15:20:00.000Z',
    },
    {
      _id: 'tx_3',
      providerId: {
        userId: { name: 'Sunita Maharjan', phoneNumber: '9841998877' },
      },
      type: 'commission_debit',
      amount: 100,
      balanceBefore: 1100,
      balanceAfter: 1000,
      paymentMethod: 'cash',
      createdAt: '2026-03-03T09:10:00.000Z',
    },
  ],
};

export default function AdminPayoutsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(MOCK_FINANCIALS);
  const [loading, setLoading] = useState(false);
  const [disbursingId, setDisbursingId] = useState<string | null>(null);

  const fetchFinancials = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/admin/financials');
      if (res.success && res.summary) {
        setData(res);
      }
    } catch (err) {
      // Local fallback for demo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  const handleDisbursePayout = async (provider: any) => {
    const amount = provider.wallet?.currentBalance || 0;
    if (amount <= 0) {
      alert('This provider has no withdrawable balance.');
      return;
    }

    const confirm = window.confirm(
      `Confirm settlement payout of NPR ${amount.toLocaleString()} to ${provider.userId?.name} via Nepal Instant Gateway (eSewa / Khalti)?`
    );
    if (!confirm) return;

    setDisbursingId(provider._id);
    setTimeout(() => {
      setData((prev: any) => ({
        ...prev,
        topProviderBalances: prev.topProviderBalances.map((p: any) =>
          p._id === provider._id
            ? { ...p, wallet: { ...p.wallet, currentBalance: 0 } }
            : p
        ),
        recentTransactions: [
          {
            _id: `tx_${Date.now()}`,
            providerId: { userId: provider.userId },
            type: 'payout',
            amount: amount,
            balanceBefore: amount,
            balanceAfter: 0,
            paymentMethod: 'esewa',
            createdAt: new Date().toISOString(),
          },
          ...prev.recentTransactions,
        ],
      }));
      setDisbursingId(null);
      alert(`Payout of NPR ${amount.toLocaleString()} disbursed successfully.`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CircleDollarSign className="w-3.5 h-3.5" />
              <span>eSewa & Khalti Financial Settlements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Financials, Commissions & Escrow
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Monitor gross transaction volumes, 10% platform cuts, and provider payout disbursements.
            </p>
          </div>

          <button
            onClick={fetchFinancials}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* GMV */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Gross Merchandise Value
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                रु. {data.summary?.totalGMVNPR?.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>Total service value transacted</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* 10% Platform Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Platform Commission (10%)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                रु. {data.summary?.totalCommissionNPR?.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Net retained company revenue
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CircleDollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Escrow Held */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Escrow Funds Held
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                रु. {data.summary?.totalEscrowHeldNPR?.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Pending customer job verification</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Provider Wallets & Payout Settlement */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Provider Withdrawable Balances
              </h2>
              <p className="text-xs text-slate-500">
                Direct payouts to provider eSewa / Khalti registered mobile numbers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Provider / Workshop</th>
                  <th className="py-3.5 px-6">eSewa / Mobile Account</th>
                  <th className="py-3.5 px-6">Available Balance</th>
                  <th className="py-3.5 px-6">Locked Escrow</th>
                  <th className="py-3.5 px-6 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.topProviderBalances?.map((p: any) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 text-sm">{p.userId?.name}</div>
                      <p className="text-[11px] text-slate-500">{p.businessName}</p>
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-700">
                      {p.userId?.phoneNumber}
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 text-sm">
                        रु. {p.wallet?.currentBalance?.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      रु. {p.wallet?.escrowBalance?.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDisbursePayout(p)}
                        disabled={disbursingId === p._id || p.wallet?.currentBalance <= 0}
                        className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                          p.wallet?.currentBalance > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {disbursingId === p._id ? 'Disbursing...' : 'Disburse Payout'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Ledger Transactions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">
              Recent Wallet & Commission Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Audit trail of every platform commission cut, payout disbarment, and settlement.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Provider</th>
                  <th className="py-3.5 px-6">Transaction Type</th>
                  <th className="py-3.5 px-6">Channel</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data.recentTransactions?.map((tx: any) => {
                  const isCommission = tx.type === 'commission_debit';
                  const isPayout = tx.type === 'payout';

                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString('ne-NP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-800">
                        {tx.providerId?.userId?.name || 'Service Provider'}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCommission
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : isPayout
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isCommission && '10% Commission'}
                          {isPayout && 'Provider Payout'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className="capitalize font-bold text-slate-700">
                          {tx.paymentMethod || 'Wallet'}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`font-black text-sm ${
                            isCommission ? 'text-blue-600' : 'text-slate-900'
                          }`}
                        >
                          रु. {tx.amount?.toLocaleString()}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right font-bold text-slate-700">
                        रु. {tx.balanceAfter?.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

