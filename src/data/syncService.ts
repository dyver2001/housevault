export interface VaultSyncState {
  vaultCode: string | null;
  isConnected: boolean;
  lastSynced: string | null;
  lastUpdatedBy?: string;
  version: number;
}

const STORAGE_KEY_VAULT_CODE = 'housevault_cloud_sync_code';

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
    const res = await fetch('/api/sync/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initialData, customCode, updatedBy })
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
  vaultCode: string
): Promise<{ success: boolean; vaultCode?: string; vault?: any; error?: string }> {
  try {
    const res = await fetch('/api/sync/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vaultCode })
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
    const res = await fetch(`/api/sync/${encodeURIComponent(vaultCode)}/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, updatedBy })
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
