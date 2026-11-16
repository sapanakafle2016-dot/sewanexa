import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: November 2026 | SEWANEXA (Sangalo Tech Pvt. Ltd.)</p>
      </div>

      <div className="prose prose-slate text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SEWANEXA web platform or mobile applications, you agree to comply with and be bound by these Terms of Service. SEWANEXA operates as a technology marketplace platform connecting independent service providers with customers in Nepal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Service Booking & Pricing</h2>
          <p>
            Service charges quoted on the platform include base inspection visit rates. Additional spare parts or specialized supplies are billed transparently on actual receipts mutually agreed upon between the customer and provider.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Platform Commission Model</h2>
          <p>
            A 10% platform commission is settled transparently on eligible completed service bookings between SEWANEXA and registered service providers, supporting background verification, customer support, and technology infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Payments</h2>
          <p>
            Supported payment options include cash payments directly to the provider upon completion, eSewa ePay v2, and Khalti digital payment gateway.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Contact Information</h2>
          <p>
            Sangalo Tech Pvt. Ltd., Lokanthali, Bhaktapur, Nepal.<br />
            Email: <a href="mailto:sangalotech@gmail.com" className="text-blue-600 font-medium">sangalotech@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

