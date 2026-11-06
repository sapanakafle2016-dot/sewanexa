import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">SEWANEXA • Sangalo Tech Pvt. Ltd.</p>
      </div>

      <div className="prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            We collect mobile phone numbers for OTP verification, location coordinates (via device GPS) strictly to match you with nearby service providers, and identity documents (citizenship or business PAN) provided by service partners for trust verification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. How We Use Location Data</h2>
          <p>
            Location data is utilized exclusively to calculate travel distances between customers and providers (using MongoDB 2dsphere spherical queries) and display estimated arrival times.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
          <p>
            All user credentials, verification records, and transaction histories are stored with encryption. We do not sell or monetize personal data to third-party advertising brokers.
          </p>
        </section>
      </div>
    </div>
  );
}
