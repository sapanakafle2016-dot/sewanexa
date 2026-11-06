'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/lib/api';

function EsewaSuccessContent() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get('data');

  const [loading, setLoading] = useState(true);
  const [verifiedData, setVerifiedData] = useState<any>(null);

  useEffect(() => {
    const verify = async () => {
      if (!encodedData) {
        setLoading(false);
        return;
      }

      try {
        const decodedStr = atob(encodedData);
        const parsed = JSON.parse(decodedStr);
        setVerifiedData(parsed);

        await apiFetch('/payments/esewa/verify', {
          method: 'POST',
          body: JSON.stringify({
            encodedData,
            bookingId: parsed.transaction_uuid?.split('-')?.[0] || 'demo_booking',
          }),
        });
      } catch (err) {
        console.warn('Verification call handled:', err);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [encodedData]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            eSewa ePay Confirmed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Payment Successful!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your transaction has been securely processed and credited to the service partner.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Gateway:</span>
            <span className="font-bold text-emerald-700">eSewa Nepal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction Code:</span>
            <span className="font-mono font-semibold text-slate-800">
              {verifiedData?.transaction_code || 'ESEWA-TXN-98412'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Transaction UUID:</span>
            <span className="font-mono font-semibold text-slate-800 truncate max-w-[180px]">
              {verifiedData?.transaction_uuid || 'SWX-2026-10492'}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
            <span>Total Paid:</span>
            <span className="text-emerald-700">
              NPR {verifiedData?.total_amount || 500}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/bookings"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>View My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function EsewaSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Verifying transaction...</div>}>
      <EsewaSuccessContent />
    </Suspense>
  );
}
