'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function EsewaFailurePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-md shadow-red-500/10">
          <XCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            Payment Incomplete
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            Payment Cancelled or Failed
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your eSewa transaction could not be processed. No funds have been deducted from your account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/services"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Try Again</span>
          </Link>
          <Link
            href="/bookings"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Go to My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
