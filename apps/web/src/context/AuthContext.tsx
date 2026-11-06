'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser, IProviderProfile } from '@sewanexa/shared-types';
import { apiFetch, getAuthToken, setAuthToken, clearAuthToken } from '@/lib/api';

interface AuthContextType {
  user: IUser | null;
  providerProfile: IProviderProfile | null;
  isProvider: boolean;
  isLoading: boolean;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; devOtp?: string; message: string }>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [providerProfile, setProviderProfile] = useState<IProviderProfile | null>(null);
  const [isProvider, setIsProvider] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setProviderProfile(null);
      setIsProvider(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/auth/me');
      if (res.success) {
        setUser(res.user);
        setIsProvider(res.isProvider);
        setProviderProfile(res.providerProfile);
      }
    } catch (err) {
      console.warn('Failed to fetch user session:', err);
      clearAuthToken();
      setUser(null);
      setProviderProfile(null);
      setIsProvider(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    const res = await apiFetch('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
      requiresAuth: false,
    });
    return res;
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
      requiresAuth: false,
    });

    if (res.token) {
      setAuthToken(res.token);
      setUser(res.user);
      setIsProvider(res.isProvider);
      setProviderProfile(res.providerProfile);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setProviderProfile(null);
    setIsProvider(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        isProvider,
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

