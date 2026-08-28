import { DeviceInfo, getMyDeviceProfile } from './syncService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'husband' | 'wife';
  vaultCode?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  vault?: any;
  error?: string;
}

const STORAGE_KEY_TOKEN = 'housevault_auth_token';
const STORAGE_KEY_USER = 'housevault_auth_user';

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY_USER);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string | null, user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
}

export async function loginAccount(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const device = getMyDeviceProfile(email.includes('haytham') ? 'Haytham' : 'Cati');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, device })
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.token && data.user) {
      setStoredAuth(data.token, data.user);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare de conexiune la server' };
  }
}

export async function registerAccount(
  email: string,
  password: string,
  name: string,
  role: 'husband' | 'wife' = 'husband',
  vaultCode?: string
): Promise<AuthResponse> {
  try {
    const device = getMyDeviceProfile(name);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role, vaultCode, device })
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.token && data.user) {
      setStoredAuth(data.token, data.user);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare de conexiune la server' };
  }
}

export async function checkAuthMe(): Promise<AuthResponse> {
  const token = getStoredAuthToken();
  if (!token) return { success: false, error: 'No token' };

  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data: AuthResponse = await res.json();
    if (data.success && data.user) {
      setStoredAuth(token, data.user);
    } else {
      setStoredAuth(null, null);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function linkVaultAccount(vaultCode: string): Promise<{ success: boolean; vault?: any; error?: string }> {
  const token = getStoredAuthToken();
  if (!token) return { success: false, error: 'Neautorizat' };

  try {
    const device = getMyDeviceProfile();
    const res = await fetch('/api/auth/link-vault', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ vaultCode, device })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export function logoutAccount() {
  setStoredAuth(null, null);
}
