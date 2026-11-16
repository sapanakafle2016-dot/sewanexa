import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Local development IP of this Mac on Wi-Fi (for physical device Expo testing)
export const DEV_MACHINE_IP = '192.168.18.121';

// Auto-determine default base URL per platform
export const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5001/api';
  }
  if (Platform.OS === 'android') {
    // 10.0.2.2 is Android emulator's loopback to host PC
    return 'http://10.0.2.2:5001/api';
  }
  // iOS simulator or default
  return 'http://localhost:5001/api';
};

export const API_BASE_URL = getApiBaseUrl();

const TOKEN_KEY = 'sewanexa_auth_token';

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to read auth token from AsyncStorage:', err);
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (err) {
    console.warn('Failed to save auth token to AsyncStorage:', err);
  }
};

export const removeStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to remove auth token from AsyncStorage:', err);
  }
};

interface MobileFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function mobileApiFetch<T = any>(
  endpoint: string,
  options: MobileFetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...rest } = options;

  const authHeaders: Record<string, string> = {};
  if (requiresAuth) {
    const token = await getStoredToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const makeRequest = async (baseUrl: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        },
        ...rest,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  let res: Response;
  try {
    res = await makeRequest(API_BASE_URL);
  } catch (initialErr) {
    // If standard host failed and we have a local Wi-Fi IP fallback (e.g. physical phone), try Wi-Fi IP
    if (DEV_MACHINE_IP && !API_BASE_URL.includes(DEV_MACHINE_IP)) {
      try {
        res = await makeRequest(`http://${DEV_MACHINE_IP}:5001/api`);
      } catch {
        throw new Error(
          `Could not connect to API server at ${API_BASE_URL} or http://${DEV_MACHINE_IP}:5001/api. Ensure apps/api is running on your computer.`
        );
      }
    } else {
      throw new Error(
        `Could not connect to API server at ${API_BASE_URL}. Ensure apps/api is running.`
      );
    }
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server returned non-JSON response (HTTP status ${res.status}).`);
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with HTTP status ${res.status}`);
  }

  return data;
}
