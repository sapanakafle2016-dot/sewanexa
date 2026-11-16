'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
      } else if (user.role !== 'admin' && user.role !== 'superadmin') {
        router.replace('/?unauthorized=admin');
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-[#331e6a]" />
        <p className="text-sm font-semibold text-slate-600">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">Admin Authorization Required</h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">
          You must be logged in with administrator privileges to view or manage SewaNexa admin portals.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => router.replace(`/login?redirect=${encodeURIComponent(pathname || '/admin')}`)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#331e6a] text-white rounded-xl text-xs font-black hover:bg-[#25154f] transition-all shadow-md shadow-[#331e6a]/20"
          >
            Sign In as Admin
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

