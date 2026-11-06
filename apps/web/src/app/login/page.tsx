'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Phone, Shield, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(phoneNumber);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(phoneNumber, otp);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {step === 'phone' ? 'Login with Mobile' : 'Verify Phone Number'}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'phone'
              ? 'Enter your Nepali mobile number to receive a secure 6-digit OTP.'
              : `We sent a 6-digit verification code to +977 ${phoneNumber}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {devOtpHint && step === 'otp' && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Dev Mode OTP:</strong> {devOtpHint} (auto-generated)
            </span>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nepali Mobile Number
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden">
                <span className="px-3.5 py-3 text-sm font-bold text-slate-500 border-r border-slate-200 bg-slate-100/50">
                  🇳🇵 +977
                </span>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm text-slate-900 bg-transparent focus:outline-none font-medium tracking-wide"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Supports Ncell, Nepal Telecom (NTC), and Smart Cell.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center text-xl font-bold tracking-widest text-slate-900 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Log In'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-blue-600 transition-colors"
              >
                Change Number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          By continuing, you agree to SEWANEXA's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}

