import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  BellRing,
  Wrench,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Partner Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How SEWANEXA Works for Service Partners
        </h1>
        <p className="text-sm text-slate-600">
          Grow your daily income and receive trusted customer service requests in 4 straightforward steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-base">Register Profile</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fill in your trade category, skills, working area, and submit your Nepali citizenship ID for quick verification.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-base">Go Online</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Turn your availability radar switch ON. You will immediately start receiving job requests from customers within 5-10 km.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-base">Deliver Service</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Accept the job, coordinate arrival, update your status to 'En Route', and complete the service with quality workmanship.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-extrabold">
            4
          </div>
          <h3 className="font-bold text-slate-900 text-base">Collect & Keep</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Collect payment directly in cash, eSewa, or Khalti. The standard 10% platform commission is automatically logged in your digital ledger.
          </p>
        </div>
      </div>

      <div className="text-center pt-6">
        <Link
          href="/provider/register"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all"
        >
          <span>Register as a Service Partner Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

