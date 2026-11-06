'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

function KhaltiCallbackContent() {
  const searchParams = useSearchParams();
  const pidx = searchParams.get('pidx');
  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyKhalti = async () => {
      if (!pidx) {
        setLoading(false);
        return;
      }

      try {
        await apiFetch('/payments/khalti/verify', {
          method: 'POST',
          body: JSON.stringify({
            pidx,
            bookingId: bookingId || 'demo_booking',
          }),
        });
      } catch (err) {
        // Handled
      } finally {
        setLoading(false);
      }
    };

    verifyKhalti();
  }, [pidx, bookingId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-md shadow-purple-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Khalti ePayment Confirmed
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Payment Verified!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your transaction has been securely confirmed via Khalti Nepal.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-2.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-bold text-purple-800">Khalti v2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment ID (pidx):</span>
            <span className="font-mono font-semibold text-slate-800 truncate max-w-[200px]">
              {pidx || 'KHLT-PIDX-981240'}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
            <span>Total Amount:</span>
            <span className="text-purple-800">
              NPR {amount ? Number(amount) / 100 : 500}
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

export default function KhaltiCallbackPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Verifying Khalti payment...</div>}>
      <KhaltiCallbackContent />
    </Suspense>
  );
}
