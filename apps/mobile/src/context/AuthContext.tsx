import React, { createContext, useContext, useEffect, useState } from 'react';
import type { IUser, IProviderProfile } from '@sewanexa/shared-types';
import {
  mobileApiFetch,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from '../services/api';

export interface MobileAuthContextType {
  user: IUser | null;
  providerProfile: IProviderProfile | null;
  isProvider: boolean;
  activeMode: 'customer' | 'provider';
  isLoading: boolean;
  sendOtp: (phoneNumber: string) => Promise<{ success: boolean; devOtp?: string; message: string }>;
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>;
  loginWithGoogle: (payload: { email?: string; name?: string; avatarUrl?: string; googleId?: string; idToken?: string }) => Promise<void>;
  switchMode: (mode: 'customer' | 'provider') => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<MobileAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [providerProfile, setProviderProfile] = useState<IProviderProfile | null>(null);
  const [isProvider, setIsProvider] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'customer' | 'provider'>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async (): Promise<void> => {
    try {
      let token: string | null = null;
      try {
        token = await getStoredToken();
      } catch (storageErr) {
        console.warn('Storage read error:', storageErr);
      }

      if (!token) {
        setUser(null);
        setProviderProfile(null);
        setIsProvider(false);
        setIsLoading(false);
        return;
      }

      const res = await mobileApiFetch('/auth/me');
      if (res && res.success && res.user) {
        setUser(res.user);
        setIsProvider(Boolean(res.isProvider));
        setProviderProfile(res.providerProfile || null);
        if (res.isProvider && activeMode === 'provider') {
          setActiveMode('provider');
        } else {
          setActiveMode('customer');
        }
      } else {
        try {
          await removeStoredToken();
        } catch {}
        setUser(null);
        setProviderProfile(null);
        setIsProvider(false);
      }
    } catch (err) {
      // Graceful offline/guest fallback - never throw unhandled promise rejection
      console.warn('User session check skipped (offline / guest mode):', err);
      try {
        await removeStoredToken();
      } catch {}
      setUser(null);
      setProviderProfile(null);
      setIsProvider(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.warn('initAuth caught:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
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

    if (res && res.token) {
      try {
        await setStoredToken(res.token);
      } catch {}
      setUser(res.user || null);
      setIsProvider(Boolean(res.isProvider));
      setProviderProfile(res.providerProfile || null);
      setActiveMode(res.isProvider ? 'provider' : 'customer');
    }
  };

  const loginWithGoogle = async (payload: { email?: string; name?: string; avatarUrl?: string; googleId?: string; idToken?: string }) => {
    const res = await mobileApiFetch('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
      requiresAuth: false,
    });

    if (res && res.token) {
      try {
        await setStoredToken(res.token);
      } catch {}
      setUser(res.user || null);
      setIsProvider(Boolean(res.isProvider));
      setProviderProfile(res.providerProfile || null);
      setActiveMode(res.isProvider ? 'provider' : 'customer');
    }
  };

  const switchMode = (mode: 'customer' | 'provider') => {
    setActiveMode(mode);
  };

  const logout = async () => {
    try {
      await removeStoredToken();
    } catch {
      // Ignore storage clear errors on logout
    }
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
        loginWithGoogle,
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

export default AuthContext;
