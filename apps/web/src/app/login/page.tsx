'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Phone,
  Shield,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Lock,
  UserCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const { sendOtp, verifyOtp, loginWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [showGmailModal, setShowGmailModal] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services (GIS) button if client ID is set
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (typeof window !== 'undefined' && (window as any).google && clientId && googleBtnRef.current) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setGoogleLoading(true);
              try {
                await loginWithGoogle({ idToken: response.credential });
                if (returnTo) {
                  router.push(returnTo);
                } else {
                  router.push('/');
                }
              } catch (e: any) {
                setError(e.message || 'Google verification failed.');
              } finally {
                setGoogleLoading(false);
              }
            }
          },
        });
        (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 380,
          text: 'continue_with',
          shape: 'pill',
        });
      } catch (gisErr) {
        console.warn('Google Identity initialization notice:', gisErr);
      }
    }
  }, [returnTo, loginWithGoogle, router]);

  const handleGoogleSignIn = async (emailToUse?: string, nameToUse?: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      const targetEmail = (emailToUse || customGmail).toLowerCase().trim();
      if (!targetEmail || !targetEmail.includes('@')) {
        throw new Error('Please enter a valid Gmail address');
      }
      const targetName = nameToUse || targetEmail.split('@')[0];
      await loginWithGoogle({
        email: targetEmail,
        name: targetName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}`,
      });

      setShowGmailModal(false);
      if (returnTo) {
        router.push(returnTo);
      } else if (targetEmail.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Google / Gmail authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const handleSendOtp = async (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    const phoneToUse = customPhone || phoneNumber;
    if (phoneToUse.length < 10) return;

    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(phoneToUse);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setPhoneNumber(phoneToUse);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check your phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent, customOtp?: string) => {
    if (e) e.preventDefault();
    const otpToUse = customOtp || otp;
    setError(null);
    setLoading(true);

    try {
      await verifyOtp(phoneNumber, otpToUse);

      // Intelligent Role-based Redirection
      if (returnTo) {
        router.push(returnTo);
      } else if (
        phoneNumber === '9800000000' ||
        phoneNumber === '9800000001' ||
        phoneNumber === '9800000002'
      ) {
        router.push('/admin');
      } else if (phoneNumber === '9841000000' || phoneNumber === '9841234567') {
        router.push('/provider/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Fast Login for Admin, Provider, or Customer
  const handleQuickDemoLogin = async (phone: string, targetRole: 'admin' | 'provider' | 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(phone);
      const otpCode = res.devOtp || '123456';
      setPhoneNumber(phone);
      setOtp(otpCode);
      await verifyOtp(phone, otpCode);

      if (targetRole === 'admin') {
        router.push('/admin');
      } else if (targetRole === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      // Fallback
      setPhoneNumber(phone);
      setStep('otp');
      setOtp('123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 mesh-bg">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl shadow-slate-900/10 space-y-6 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-block p-2 bg-[#f6f4fb] rounded-2xl border border-[#ded4f1] mb-2">
            <Image
              src="/logo.png"
              alt="Sewanexa Logo"
              width={160}
              height={50}
              priority
              className="h-9 w-auto mx-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-[#331e6a] tracking-tight">
            {step === 'phone' ? 'Login or Sign Up' : 'Verify SMS Code'}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'phone'
              ? 'Continue with your Nepali phone number (OTP) or Google / Gmail account.'
              : `Enter the 6-digit verification code sent to +977 ${phoneNumber}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {devOtpHint && step === 'otp' && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Dev OTP:</strong> {devOtpHint}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setOtp(devOtpHint);
                handleVerifyOtp(undefined, devOtpHint);
              }}
              className="text-[11px] font-black underline hover:text-blue-900"
            >
              Auto Fill & Log In
            </button>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={(e) => handleSendOtp(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nepali Mobile Number
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-blue-500 focus-within:bg-white transition-all overflow-hidden">
                <span className="px-3.5 py-3 text-xs font-extrabold text-slate-500 border-r border-slate-200 bg-slate-100/50">
                  🇳🇵 +977
                </span>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3.5 py-3 text-sm text-slate-900 bg-transparent focus:outline-none font-bold tracking-wide placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Supports all Nepal operators (Ncell, NTC, Smart Cell).
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10}
              className="w-full py-3.5 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                </>
              )}
            </button>

            {/* Social Google / Gmail Login Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400">
                  वा Gmail मार्फत लगइन (Or with Gmail)
                </span>
              </div>
            </div>

            {/* Google Identity Services Auto Rendered Button (if Client ID present) */}
            <div ref={googleBtnRef} className="w-full flex justify-center empty:hidden" />

            {/* Continue with Google / Gmail Button */}
            <button
              type="button"
              disabled={googleLoading}
              onClick={() => setShowGmailModal(true)}
              className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleLoading ? 'Signing in...' : 'Continue with Google / Gmail'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => handleVerifyOtp(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-4 py-3.5 text-center text-2xl font-black tracking-widest text-slate-900 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#331e6a] focus:outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Log In'}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-blue-600 font-bold transition-colors"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp()}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* ── 1-Click Fast Role Login Shortcuts ── */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              1-Click Fast Login (Role Demo)
            </span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs font-bold">
            {/* Admin Fast Login */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemoLogin('9800000000', 'admin')}
              className="w-full p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-900 flex items-center justify-between transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-black text-xs">Admin Control Portal</span>
                  <span className="block text-[10px] text-purple-600 font-medium">9800000000 • Superadmin</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </button>

            {/* Provider Fast Login */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemoLogin('9841000000', 'provider')}
              className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 flex items-center justify-between transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-black text-xs">Service Provider Partner</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">9841000000 • Ramesh Plumber</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>

            {/* Customer Fast Login */}
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemoLogin('9841122334', 'customer')}
              className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block font-black text-xs">Customer / Client</span>
                  <span className="block text-[10px] text-slate-500 font-medium">9841122334 • Sajan Client</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400">
          Sangalo Tech Pvt. Ltd., Lokanthali, Bhaktapur, Nepal.
        </div>
      </div>

      {/* ── Interactive Gmail / Google Dialog Modal ── */}
      {showGmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-sm font-black text-slate-900">Sign in with Google</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGmailModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Enter your Google / Gmail account to sign in or create an account dynamically:
            </p>

            {/* Dynamic Gmail Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customGmail) handleGoogleSignIn(customGmail);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Gmail / Google Email
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition-all overflow-hidden px-3 py-2.5">
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    autoFocus
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={googleLoading || !customGmail || !customGmail.includes('@')}
                className="w-full py-3 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {googleLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue with this Gmail</span>
                    <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
