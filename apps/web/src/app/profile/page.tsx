'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { User, Mail, Phone, Camera, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
      });

      if (res.success) {
        await refreshUser();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Avatar Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
              {initials}
            </div>
            <button
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center hover:bg-slate-200 transition"
              title="Upload photo (coming soon)"
            >
              <Camera size={14} className="text-slate-500" />
            </button>
          </div>
          <h2 className="text-xl font-black text-slate-900">{user.name || 'Your Name'}</h2>
          <p className="text-slate-500 text-sm mt-1">+977 {user.phoneNumber}</p>
          <div className="mt-3 flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle2 size={12} />
            Phone Verified
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h3 className="text-lg font-black text-slate-900 mb-6">Edit Profile</h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} />
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                />
              </div>
            </div>

            {/* Phone — read-only */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mobile Number <span className="text-slate-400 font-normal">(cannot change)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={`+977 ${user.phoneNumber}`}
                  readOnly
                  className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-400 bg-slate-100 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Phone number is your login identifier and cannot be changed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mt-6">
          <h3 className="text-sm font-black text-slate-700 mb-4">Account Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Role', value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) },
              { label: 'Account Status', value: user.status === 'active' ? 'Active ✓' : user.status },
              { label: 'Platform', value: 'SEWANEXA Nepal' },
              { label: 'Support', value: 'sangalotech@gmail.com' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

