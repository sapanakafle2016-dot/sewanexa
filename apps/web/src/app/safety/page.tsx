import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, PhoneCall } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Trust & Safety Guidelines</h1>
        <p className="text-xs text-slate-500">Protecting customers and skilled workers across Nepal</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>Citizenship Verification: </strong> All active service professionals on SEWANEXA submit their official government identity document (Nepali Citizenship or National ID) and trade credentials before receiving verified badge status.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Safety Tips for Households</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check the professional’s profile and customer reviews on the platform prior to booking.</li>
            <li>Agree on spare parts procurement and pricing upfront before service initiation.</li>
            <li>Use in-app status tracking to monitor when your provider is en route.</li>
            <li>Report any misconduct or quality issues immediately to SEWANEXA support.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Need Immediate Help?</h2>
          <p>
            Sangalo Tech Support Desk: <strong className="text-slate-900">sangalotech@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

