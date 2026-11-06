import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser, IProviderProfile } from '@sewanexa/shared-types';
import {
  mobileApiFetch,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from '../services/api';

interface MobileAuthContextType {
  user: IUser | null;
  providerProfile: IProviderProfile | null;
  isProvider: boolean;
  activeMode: 'customer' | 'provider';
  isLoading: boolean;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; devOtp?: string; message: string }>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  switchMode: (mode: 'customer' | 'provider') => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [providerProfile, setProviderProfile] = useState<IProviderProfile | null>(null);
  const [isProvider, setIsProvider] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'customer' | 'provider'>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = await getStoredToken();
    if (!token) {
      setUser(null);
      setProviderProfile(null);
      setIsProvider(false);
      setIsLoading(false);
      return;
    }

    try {
      const res = await mobileApiFetch('/auth/me');
      if (res.success) {
        setUser(res.user);
        setIsProvider(res.isProvider);
        setProviderProfile(res.providerProfile);
        if (res.isProvider && activeMode === 'provider') {
          setActiveMode('provider');
        } else {
          setActiveMode('customer');
        }
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err);
      await removeStoredToken();
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
    return await mobileApiFetch('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
      requiresAuth: false,
    });
  };

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const res = await mobileApiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, otp }),
      requiresAuth: false,
    });

    if (res.token) {
      await setStoredToken(res.token);
      setUser(res.user);
      setIsProvider(res.isProvider);
      setProviderProfile(res.providerProfile);
      setActiveMode(res.isProvider ? 'provider' : 'customer');
    }
  };

  const switchMode = (mode: 'customer' | 'provider') => {
    setActiveMode(mode);
  };

  const logout = async () => {
    await removeStoredToken();
    setUser(null);
    setProviderProfile(null);
    setIsProvider(false);
    setActiveMode('customer');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        isProvider,
        activeMode,
        isLoading,
        sendOtp,
        verifyOtp,
        switchMode,
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

