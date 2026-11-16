'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Wrench,
  ShieldCheck,
  Users,
  CalendarCheck,
  CircleDollarSign,
  ArrowLeft,
  LogOut,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const AdminNav: React.FC<{ pendingCount?: number }> = ({ pendingCount }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Services & Categories', href: '/admin/services', icon: Wrench },
    {
      name: 'Providers & KYC',
      href: '/admin/providers',
      icon: ShieldCheck,
      badge: pendingCount && pendingCount > 0 ? pendingCount : undefined,
    },
    { name: 'Users & Customers', href: '/admin/users', icon: Users },
    { name: 'Bookings & Jobs', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Financials & Escrow', href: '/admin/payouts', icon: CircleDollarSign },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#331e6a] text-white shadow-sm shadow-[#331e6a]/25'
                      : 'text-slate-600 hover:text-[#331e6a] hover:bg-[#f6f4fb]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#f59e0b] text-[#331e6a]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#331e6a] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>

            <span className="h-4 w-px bg-slate-200" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Log out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-red-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

