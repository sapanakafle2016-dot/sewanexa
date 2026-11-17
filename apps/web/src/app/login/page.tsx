'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  UserCheck,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const { loginWithPassword, signupWithPassword, sendOtp, verifyOtp } = useAuth();

  // Mode: 'login' | 'signup' | 'phone_otp'
  const [mode, setMode] = useState<'login' | 'signup' | 'phone_otp'>('login');

  // Form states for Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [optionalPhone, setOptionalPhone] = useState('');

  // Form states for Phone OTP
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Helper redirect
  const handleRedirect = (userRole?: string) => {
    if (returnTo) {
      router.push(returnTo);
    } else if (userRole === 'admin' || userRole === 'superadmin') {
      router.push('/admin');
    } else if (userRole === 'provider') {
      router.push('/provider/dashboard');
    } else {
      router.push('/');
    }
  };

  // Submit Login with Email & Password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await loginWithPassword(email.trim(), password);
      handleRedirect();
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Signup with Email & Password
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await signupWithPassword({
        name: name.trim(),
        email: email.trim(),
        password,
        phoneNumber: optionalPhone.trim() || undefined,
        role,
      });
      setSuccessMsg('Account created successfully!');
      handleRedirect(role);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Phone OTP
  const handleSendOtp = async (e?: React.FormEvent, customPhone?: string) => {
    if (e) e.preventDefault();
    const phoneToUse = customPhone || otpPhone;
    if (phoneToUse.length < 10) return;

    setError(null);
    setLoading(true);

    try {
      const res = await sendOtp(phoneToUse);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setOtpPhone(phoneToUse);
      setPhoneStep('otp');
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
      await verifyOtp(otpPhone, otpToUse);
      handleRedirect();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Fast Login for Demo
  const handleQuickDemoLogin = async (phone: string, targetRole: 'admin' | 'provider' | 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(phone);
      const otpCode = res.devOtp || '123456';
      await verifyOtp(phone, otpCode);
      if (targetRole === 'admin') router.push('/admin');
      else if (targetRole === 'provider') router.push('/provider/dashboard');
      else router.push('/');
    } catch {
      setMode('phone_otp');
      setOtpPhone(phone);
      setPhoneStep('otp');
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
          <div className="inline-block p-2 bg-[#f6f4fb] rounded-2xl border border-[#ded4f1] mb-1">
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
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'phone_otp' && (phoneStep === 'phone' ? 'Login via Phone OTP' : 'Verify SMS Code')}
          </h1>

          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Log in using your registered email and password.'}
            {mode === 'signup' && 'Sign up to hire local service experts or register as a service provider.'}
            {mode === 'phone_otp' &&
              (phoneStep === 'phone'
                ? 'Enter your Nepali mobile number to receive a verification OTP.'
                : `Enter the 6-digit verification code sent to +977 ${otpPhone}`)}
          </p>
        </div>

        {/* Tab Switcher: Email Login vs Sign Up */}
        {mode !== 'phone_otp' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#331e6a] shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#331e6a] shadow-sm font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        {/* MODE 1: Email & Password Login */}
        {mode === 'login' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-3 gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
              </div>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-3 gap-2.5">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3.5 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Log In to Sewanexa</span>
                  <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 2: Email & Password Signup */}
        {mode === 'signup' && (
          <form onSubmit={handleEmailSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-2.5 gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="e.g. Sajan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-2.5 gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-2.5 gap-2.5">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (Optional)
              </label>
              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-[#331e6a] focus-within:bg-white transition-all overflow-hidden px-3.5 py-2.5 gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-500">🇳🇵 +977</span>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  value={optionalPhone}
                  onChange={(e) => setOptionalPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full text-xs text-slate-900 bg-transparent focus:outline-none font-semibold placeholder:font-normal placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                I am signing up as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'customer'
                      ? 'border-[#331e6a] bg-[#331e6a]/5 text-[#331e6a]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('provider')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    role === 'provider'
                      ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-amber-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#f59e0b]" />
                  <span>Service Provider</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || password.length < 6}
              className="w-full py-3.5 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* MODE 3: Phone OTP Login */}
        {mode === 'phone_otp' && (
          <div className="space-y-4">
            {devOtpHint && phoneStep === 'otp' && (
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

            {phoneStep === 'phone' ? (
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
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3.5 py-3 text-sm text-slate-900 bg-transparent focus:outline-none font-bold tracking-wide placeholder:font-normal placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpPhone.length < 10}
                  className="w-full py-3.5 bg-[#331e6a] hover:bg-[#25154f] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#331e6a]/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send SMS OTP</span>
                      <ArrowRight className="w-4 h-4 text-[#f59e0b]" />
                    </>
                  )}
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
                    onClick={() => setPhoneStep('phone')}
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

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-900 font-bold py-1"
            >
              ← Back to Email & Password Login
            </button>
          </div>
        )}

        {/* Alternative Phone OTP Option when in Email/Password mode */}
        {mode !== 'phone_otp' && (
          <div className="pt-1">
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400">
                  Alternative Option
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setMode('phone_otp');
                setError(null);
                setSuccessMsg(null);
              }}
              className="w-full py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#331e6a]" />
              <span>Continue with Nepali Phone Number (SMS OTP)</span>
            </button>
          </div>
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
                  <ShieldCheck className="w-3.5 h-3.5" />
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
