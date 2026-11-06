import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For local testing:
// Android Emulator uses 10.0.2.2 to access host machine localhost
// iOS Simulator uses localhost
const LOCALHOST_IP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${LOCALHOST_IP}:5000/api`;

const TOKEN_KEY = 'sewanexa_auth_token';

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('Failed to save auth token:', err);
  }
};

export const removeStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to remove auth token:', err);
  }
};

interface MobileFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function mobileApiFetch<T = any>(endpoint: string, options: MobileFetchOptions = {}): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;

  const authHeaders: Record<string, string> = {};
  if (requiresAuth) {
    const token = await getStoredToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    ...rest,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

