export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'ios' | 'android' | 'desktop';
  ownerName: string;
  lastSeen?: string;
}

export interface VaultSyncState {
  vaultCode: string | null;
  isConnected: boolean;
  lastSynced: string | null;
  lastUpdatedBy?: string;
  lastUpdatedDevice?: DeviceInfo;
  devices?: DeviceInfo[];
  version: number;
}

const STORAGE_KEY_VAULT_CODE = 'housevault_cloud_sync_code';
const STORAGE_KEY_DEVICE_ID = 'housevault_device_id';
const STORAGE_KEY_DEVICE_NAME = 'housevault_device_name';
const STORAGE_KEY_DEVICE_OWNER = 'housevault_device_owner';

export function getMyDeviceId(): string {
  if (typeof window === 'undefined') return 'DEV-SERVER';
  let id = localStorage.getItem(STORAGE_KEY_DEVICE_ID);
  if (!id) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id = `DEV-${rand}`;
    localStorage.setItem(STORAGE_KEY_DEVICE_ID, id);
  }
  return id;
}

export function detectDeviceType(): 'ios' | 'android' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export function getMyDeviceProfile(defaultOwner: string = 'Cati'): DeviceInfo {
  const deviceId = getMyDeviceId();
  const deviceType = detectDeviceType();
  const storedOwner = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_DEVICE_OWNER) : null;
  const ownerName = storedOwner || defaultOwner;

  const defaultName = deviceType === 'ios'
    ? `📱 iPhone ${ownerName}`
    : deviceType === 'android'
    ? `📱 Android ${ownerName}`
    : `💻 Desktop ${ownerName}`;

  const storedName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_DEVICE_NAME) : null;
  const deviceName = storedName || defaultName;

  return {
    deviceId,
    deviceName,
    deviceType,
    ownerName
  };
}

export function setMyDeviceProfile(name: string, owner: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_DEVICE_NAME, name);
  localStorage.setItem(STORAGE_KEY_DEVICE_OWNER, owner);
}

export function getStoredVaultCode(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_VAULT_CODE);
}

export function setStoredVaultCode(code: string | null) {
  if (typeof window === 'undefined') return;
  if (code) {
    localStorage.setItem(STORAGE_KEY_VAULT_CODE, code);
  } else {
    localStorage.removeItem(STORAGE_KEY_VAULT_CODE);
  }
}

export async function createCloudVault(
  initialData: any,
  customCode?: string,
  updatedBy?: string
): Promise<{ success: boolean; vaultCode?: string; vault?: any; error?: string }> {
  try {
    const device = getMyDeviceProfile(updatedBy?.includes('Haytham') ? 'Haytham' : 'Cati');
    const res = await fetch('/api/sync/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initialData, customCode, updatedBy: device.deviceName, device })
    });
    const json = await res.json();
    if (json.success && json.vaultCode) {
      setStoredVaultCode(json.vaultCode);
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare de conexiune la serverul Cloud' };
  }
}

export async function joinCloudVault(
  vaultCode: string,
  ownerName: string = 'Cati'
): Promise<{ success: boolean; vaultCode?: string; vault?: any; error?: string }> {
  try {
    const device = getMyDeviceProfile(ownerName);
    const res = await fetch('/api/sync/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vaultCode, device })
    });
    const json = await res.json();
    if (json.success && json.vaultCode) {
      setStoredVaultCode(json.vaultCode);
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Eroare de conexiune la serverul Cloud' };
  }
}

export async function pushCloudVault(
  vaultCode: string,
  data: any,
  updatedBy?: string
): Promise<{ success: boolean; vault?: any; error?: string }> {
  try {
    const device = getMyDeviceProfile(updatedBy?.includes('Haytham') ? 'Haytham' : 'Cati');
    const res = await fetch(`/api/sync/${encodeURIComponent(vaultCode)}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, updatedBy: device.deviceName, device })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchCloudVault(
  vaultCode: string
): Promise<{ success: boolean; vault?: any; error?: string }> {
  try {
    const res = await fetch(`/api/sync/${encodeURIComponent(vaultCode)}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export function subscribeToLiveVault(
  vaultCode: string,
  onUpdate: (vault: any) => void
): () => void {
  if (typeof window === 'undefined' || !window.EventSource) {
    return () => {};
  }

  let eventSource: EventSource | null = null;
  let isClosed = false;

  const connect = () => {
    if (isClosed) return;
    try {
      eventSource = new EventSource(`/api/sync/${encodeURIComponent(vaultCode)}/live`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.data) {
            onUpdate(payload);
          }
        } catch (e) {
          console.error('[CloudSync] Error parsing SSE payload:', e);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        // Auto-reconnect after 3 seconds
        if (!isClosed) {
          setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      console.warn('[CloudSync] SSE connection error:', err);
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };
}
